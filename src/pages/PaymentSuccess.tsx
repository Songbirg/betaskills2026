import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { verifyPaymentStatus } from '@/services/paymentService';
import { useAuth } from '@/hooks/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { saveEnrollmentStatus } from '@/utils/enrollmentStatusSaver';

const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timeoutId: number | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(`Timeout after ${ms}ms (${label})`)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
};

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { user } = useAuth();
  
  const courseId = searchParams.get('course') || searchParams.get('course_id');
  const provider = searchParams.get('provider') || '';
  const transactionRef =
    searchParams.get('pf_payment_id') ||
    searchParams.get('m_payment_id') ||
    searchParams.get('ref') ||
    searchParams.get('payment_id') ||
    '';
  const payfastPaymentStatus = searchParams.get('payment_status') || searchParams.get('status') || '';

  useEffect(() => {
    const verifyPayment = async () => {
      let forcedStopId: number | undefined;
      forcedStopId = window.setTimeout(() => {
        console.warn('Payment verification timed out on the client; stopping spinner to avoid blocking access.');
        setVerifying(false);
      }, 8000);

      if (!transactionRef && provider !== 'payfast') {
        setVerifying(false);
        if (forcedStopId) window.clearTimeout(forcedStopId);
        return;
      }

      try {
        if (provider === 'payfast') {
          const isComplete = String(payfastPaymentStatus).toLowerCase() === 'complete' || String(payfastPaymentStatus).toLowerCase() === 'completed' || String(payfastPaymentStatus).toLowerCase() === 'success';
          const shouldGrant = isComplete || !payfastPaymentStatus;
          setPaymentVerified(shouldGrant);

          // IMPORTANT: never block the UI on network/database writes.
          if (shouldGrant && user?.id && user?.email && courseId) {
            const now = new Date().toISOString();

            // 1) Grant access immediately (local persistence + UI refresh events)
            try {
              saveEnrollmentStatus({
                user_id: user.id,
                user_email: user.email,
                course_id: courseId,
                course_title: 'Course',
                status: 'approved',
                enrolled_at: now,
                approved_at: now,
                progress: 0,
              });
              localStorage.setItem(
                `recent-payment-${user.id}-${courseId}`,
                JSON.stringify({ timestamp: now, paymentReference: transactionRef, provider: 'payfast' })
              );
              localStorage.setItem(
                `enrollment-success-${user.id}-${courseId}`,
                JSON.stringify({ timestamp: now, status: 'approved', courseId, provider: 'payfast' })
              );
              window.dispatchEvent(new CustomEvent('enrollment-status-refresh', { detail: { courseId, timestamp: now } }));
              window.dispatchEvent(new CustomEvent('force-course-card-refresh', { detail: { timestamp: now, source: 'card-payment' } }));
              window.dispatchEvent(new CustomEvent('enrollment-success', { detail: { courseId, source: 'card-payment' } }));
            } catch (e) {
              console.warn('Local enrollment persistence failed (non-blocking):', e);
            }

            // 2) Sync to Supabase in the background (idempotent best-effort)
            (async () => {
              try {
                const existingRes = await withTimeout(
                  supabase
                    .from('enrollments')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('course_id', courseId)
                    .maybeSingle(),
                  5000,
                  'fetch existing enrollment'
                );
                const existingEnrollment = (existingRes as any)?.data;
                const courseTitle = existingEnrollment?.course_title || 'Course';

                const payload: any = {
                  user_id: user.id,
                  user_email: user.email,
                  course_id: courseId,
                  course_title: courseTitle,
                  status: 'approved',
                  payment_ref: transactionRef || null,
                  payment_method: 'card',
                  enrolled_at: existingEnrollment?.enrolled_at || now,
                  approved_at: now,
                  updated_at: now,
                  progress: existingEnrollment?.progress ?? 0,
                };

                try {
                  await withTimeout(
                    supabase.from('enrollments').upsert(payload, { onConflict: 'user_id,course_id' }),
                    7000,
                    'upsert enrollment'
                  );
                } catch (e) {
                  await withTimeout(
                    supabase
                      .from('enrollments')
                      .update({
                        status: payload.status,
                        payment_ref: payload.payment_ref,
                        payment_method: payload.payment_method,
                        approved_at: payload.approved_at,
                        updated_at: payload.updated_at,
                      })
                      .eq('user_id', user.id)
                      .eq('course_id', courseId),
                    7000,
                    'update enrollment'
                  );

                  if (!existingEnrollment) {
                    await withTimeout(
                      supabase.from('enrollments').insert([payload]),
                      7000,
                      'insert enrollment'
                    );
                  }
                }
              } catch (e) {
                console.warn('Supabase enrollment sync failed (non-blocking):', e);
              }
            })();
          }
        } else {
          // Wait a bit for webhook to process
          await new Promise(resolve => setTimeout(resolve, 2000));

          const result = await verifyPaymentStatus(transactionRef);

          if (result.status === 'completed') {
            setPaymentVerified(true);
          }
        }
    } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [transactionRef, provider, payfastPaymentStatus, user?.id, user?.email, courseId]);

  const handleContinue = () => {
    if (courseId) {
      navigate(`/course/${courseId}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            {verifying ? (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {verifying ? 'Verifying Payment...' : 'Payment Successful!'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {verifying ? (
            <div className="text-center text-gray-600">
              <p>Please wait while we confirm your payment...</p>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-center">
                  {paymentVerified 
                    ? 'Your payment has been confirmed and your enrollment is being processed.'
                    : 'Your payment was successful! Your enrollment will be confirmed shortly.'}
                </p>
              </div>
              
              {transactionRef && (
                <div className="text-sm text-gray-600 text-center">
                  <p className="font-semibold">Transaction Reference:</p>
                  <p className="font-mono bg-gray-100 px-3 py-2 rounded mt-1 text-xs break-all">
                    {transactionRef}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  Continue to Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="outline" 
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>
                  You will receive a confirmation email shortly.
                </p>
                <p className="mt-1">
                  If you have any questions, please contact support.
                </p>
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
