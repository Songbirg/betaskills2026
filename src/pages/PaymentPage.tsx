import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Loader2, Building2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/AuthContext';
import { useCoursesContext } from '@/hooks/CoursesContext';
// Use simple payment form to prevent stack overflow issues
const SimplePaymentForm = React.lazy(() => import('@/components/SimplePaymentForm'));
const EftDetailsModal = React.lazy(() => import('@/components/EftDetailsModal'));
const ProofOfPaymentForm = React.lazy(() => import('@/components/ProofOfPaymentForm'));

// Course card images (same mapping used by the grid/cards)
import aiHumanNew from '../../images/generation-7f218044-3139-41b5-8dc7-afedae829ae7.png';
import soundEngineeringNew from '../../images/generation-9c9ad650-aa25-4df1-9236-b137241521c0.png';
import podcastNew from '../../images/generation-8d3c5693-9f7f-4360-8c0b-533dc0da09bd.png';
import dieselMechanicNew from '../../images/generation-c8135d13-bf83-4379-847e-e306db926631.png';
import motorMechanicNew from '../../images/generation-147b4caa-7110-471b-bea0-9f848409020e.png';
import computerRepairsNew from '../../images/generation-223f5d12-39ae-4748-84af-466e0078c55d.png';
import entrepreneurshipNew from '../../images/generation-0fca7938-9dd0-47b3-9d36-a552cd0e2ed2.png';
import cellphoneRepairsNew from '../../images/generation-f3a5d1c2-fed5-4324-be4b-7b9c526b3455.png';
import hairDressingNew from '../../images/generation-14193c97-8259-4674-ac20-0b8a10a628ea.png';
import nailTechnicianNew from '../../images/generation-ca8e153c-3951-4b5e-b646-5b4e33e835cc.png';
import plumbingNew from '../../images/generation-704ccdce-48ca-411f-b5de-3adbe0ef98c1.png';
import tilingNew from '../../images/generation-25c77381-c00b-4f6f-a660-5de57dbf0cc5.png';
import roofingNew from '../../images/generation-8dea647f-b6de-42c7-8708-d6e68a0fe5d1.png';

const courseImages: Record<string, string> = {
  'Entrepreneurship': entrepreneurshipNew,
  'entrepreneurship-final': entrepreneurshipNew,
  'AI and Human Relations': aiHumanNew,
  'ai-human-relations': aiHumanNew,
  'Sound Engineering': soundEngineeringNew,
  'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d5': soundEngineeringNew,
  'Podcast Management': podcastNew,
  'podcast-management-101': podcastNew,
  'Diesel Mechanic': dieselMechanicNew,
  'diesel-mechanic': dieselMechanicNew,
  'Motor Mechanic (Petrol Engine)': motorMechanicNew,
  'motor-mechanic-petrol-02': motorMechanicNew,
  'Computer & Laptop Repairs': computerRepairsNew,
  'computer-repairs': computerRepairsNew,
  'Cellphone Repairs and Maintenance': cellphoneRepairsNew,
  'cellphone-repairs-101': cellphoneRepairsNew,
  'Hair Dressing': hairDressingNew,
  'hair-dressing': hairDressingNew,
  'Nail Technician': nailTechnicianNew,
  'nail-technician': nailTechnicianNew,
  'Plumbing': plumbingNew,
  'plumbing101': plumbingNew,
  'Professional Tiling': tilingNew,
  'tiling-101': tilingNew,
  'Professional Roofing': roofingNew,
  'roofing101': roofingNew,
  'Motor Mechanic (Diesel)': dieselMechanicNew,
  'motor-mechanic-diesel': dieselMechanicNew,
  'Emotional Intelligence': aiHumanNew,
  'emotional-intelligence': aiHumanNew,
};

const PaymentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useCoursesContext();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showEftDetails, setShowEftDetails] = useState(false);
  const [showProofOfPayment, setShowProofOfPayment] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'eft' | 'card'>('eft');

  const course = courses?.find(c => c.id === courseId);
  const courseImage = course ? (courseImages[course.id] || courseImages[course.title] || '/placeholder.svg') : '/placeholder.svg';

  const payfastReturnUrl = course
    ? `${window.location.origin}/payment-success?course=${encodeURIComponent(course.id)}&provider=payfast`
    : `${window.location.origin}/payment-success?provider=payfast`;
  const payfastCancelUrl = course
    ? `${window.location.origin}/payment-failed?course=${encodeURIComponent(course.id)}&provider=payfast`
    : `${window.location.origin}/payment-failed?provider=payfast`;
  const payfastNotifyUrl = `${window.location.origin}/api/payfast-notify`;

  // Enhanced debug logging
  console.log('PaymentPage: courseId:', courseId);
  console.log('PaymentPage: courses:', courses);
  console.log('PaymentPage: course found:', course);
  console.log('PaymentPage: coursesLoading:', coursesLoading);
  console.log('PaymentPage: user:', user);
  
  // Add error boundary for this component
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('PaymentPage error:', error);
      setPageError(error.message);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!courseId) {
      navigate('/courses');
      return;
    }

    // Check if course exists after courses are loaded
    if (!coursesLoading && courses && courseId && !course) {
      console.log('PaymentPage: Course not found, redirecting to courses');
      toast({
        title: "Course not found",
        description: "The course you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate('/courses');
      return;
    }
  }, [user, courseId, navigate, courses, course, coursesLoading, toast]);



  const handleGoBack = () => {
    navigate('/courses');
  };

  const handlePaymentFormSuccess = (paymentData: any) => {
    const params = new URLSearchParams({
      payment_id: paymentData.payment_id,
      course_id: courseId || '',
      amount: paymentData.amount.toString(),
      currency: paymentData.currency,
      description: paymentData.description,
      status: 'success',
      transaction_reference: paymentData.transaction_reference || paymentData.payment_id,
      bank_reference: paymentData.bank_reference || 'SIMULATED_BANK_REF'
    });

    navigate(`/payment-success?${params.toString()}`);
  };

  const handleEftProofSuccess = () => {
    setShowProofOfPayment(false);
    toast({
      title: "Enrollment Pending",
      description: "Your proof of payment was submitted successfully. Your enrollment is in review and will be approved shortly.",
      duration: 10000,
    });
    const forceRefreshEvent = new CustomEvent('force-course-card-refresh', {
      detail: { timestamp: new Date().toISOString(), source: 'eft-payment' }
    });
    window.dispatchEvent(forceRefreshEvent);
    navigate('/courses');
  };

  const handlePaymentFormCancel = () => {
    setShowPaymentForm(false);
  };
  
  const handleEftDetailsOpen = () => {
    setShowEftDetails(true);
  };
  
  const handleEftDetailsClose = () => {
    setShowEftDetails(false);
  };
  
  const handleSubmitProofClick = () => {
    setShowEftDetails(false);
    try { (window as any).__current_course_title__ = course?.title; } catch {}
    setShowProofOfPayment(true);
  };
  
  const handleProofOfPaymentClose = () => {
    setShowProofOfPayment(false);
  };

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Error</h1>
          <p className="text-gray-600 mb-4">{pageError}</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading course information...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Enrollment</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Course Details</span>
                <Badge variant="secondary">Course</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mt-2">{course.description}</p>
              </div>
              
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={courseImage} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Price:</span>
                  <span className="font-semibold">R290.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">Online Course</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💳 Payment Information</h4>
                <p className="text-blue-700 text-sm">
                  Choose your payment method below. EFT requires admin approval after proof of payment. Card payments grant access immediately after successful payment.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Course Fee</span>
                  <span className="font-semibold">R290.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">VAT (0%)</span>
                  <span className="font-semibold">R0.00</span>
                </div>
                <div className="flex justify-between items-center py-3 text-lg font-bold">
                  <span>Total</span>
                  <span>R290.00</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleEftDetailsOpen}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Pay via EFT / Bank Transfer - R290.00
                </Button>

                <div className="w-full">
                  <Button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className="w-full"
                    size="lg"
                    variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with Card (PayFast) - R290.00
                  </Button>

                  {selectedPaymentMethod === 'card' && (
                    <div className="mt-4 flex justify-center">
                      <form
                        name="PayFastPayNowForm"
                        action="https://payment.payfast.io/eng/process"
                        method="post"
                      >
                        <input type="hidden" name="cmd" value="_paynow" />
                        <input type="hidden" name="receiver" value="33842633" />
                        <input type="hidden" name="return_url" value={payfastReturnUrl} />
                        <input type="hidden" name="cancel_url" value={payfastCancelUrl} />
                        <input type="hidden" name="notify_url" value={payfastNotifyUrl} />
                        <input type="hidden" name="amount" value={(course.price || 290).toFixed(2)} />
                        <input type="hidden" name="item_name" value="Registration Fee" />
                        <input
                          type="hidden"
                          name="item_description"
                          value="Registration fee allows you to register for one online course and study at your own pace until completion."
                        />
                        <input
                          type="hidden"
                          name="m_payment_id"
                          value={`${course.id}::${user?.id || 'anonymous'}::${Date.now()}`}
                        />

                        <input
                          type="image"
                          src="https://my.payfast.io/images/buttons/PayNow/Primary-Large-PayNow.png"
                          alt="Pay Now"
                          title="Pay Now with Payfast"
                        />
                      </form>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By proceeding with payment, you agree to our terms and conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <React.Suspense fallback={<div className="p-4 text-center">Loading payment form...</div>}>
              <SimplePaymentForm
                amount={course.price || 0}
                currency="R"
                description={`Payment for ${course.title}`}
                onPaymentSuccess={handlePaymentFormSuccess}
                onPaymentCancel={handlePaymentFormCancel}
                userEmail={user?.email || 'customer@example.com'}
                userName={user?.user_metadata?.full_name || 'Customer'}
                courseId={course.id}
              />
            </React.Suspense>
          </div>
        </div>
      )}

      {/* EFT Details Modal */}
      {showEftDetails && (
        <React.Suspense fallback={<div className="p-4 text-center">Loading EFT details...</div>}>
          <EftDetailsModal
            amount={course.price || 0}
            reference={user?.user_metadata?.full_name || user?.email || `user-${user?.id.substring(0, 8)}`}
            onClose={handleEftDetailsClose}
            onSubmitProof={handleSubmitProofClick}
          />
        </React.Suspense>
      )}

      {/* Proof of Payment Form */}
      {showProofOfPayment && (
        <React.Suspense fallback={<div className="p-4 text-center">Loading proof of payment form...</div>}>
          <ProofOfPaymentForm
            courseId={course.id}
            reference={user?.user_metadata?.full_name || user?.email || `user-${user?.id.substring(0, 8)}`}
            amount={course.price || 0}
            onClose={handleProofOfPaymentClose}
            onSuccess={handleEftProofSuccess}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default PaymentPage;
