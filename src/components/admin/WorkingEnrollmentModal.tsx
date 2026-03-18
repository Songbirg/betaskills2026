import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  User, 
  Calendar, 
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  X
} from 'lucide-react';
import { useProgressTracking } from '@/hooks/useProgressTracking';

interface Enrollment {
  id: string;
  user_id: string;
  user_email: string;
  course_id: string;
  course_title: string;
  status: 'pending' | 'approved' | 'rejected';
  enrolled_at: string;
  approved_at?: string;
  progress: number;
  proof_of_payment?: string;
  payment_ref?: string;
  payment_date?: string;
  payment_type?: 'card' | 'eft' | 'manual';
  last_updated?: string;
  metadata?: any;
  user?: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

interface WorkingEnrollmentModalProps {
  enrollment: Enrollment | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewProof?: (enrollment: Enrollment) => void;
}

const WorkingEnrollmentModal = ({ 
  enrollment, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject,
  onViewProof
}: WorkingEnrollmentModalProps) => {
  const {
    isInitialized: progressInitialized,
    getEnrollmentProgress,
    getProgressPercentage,
    getDetailedProgress,
    isProgressLoading,
    getProgressError
  } = useProgressTracking();

  useEffect(() => {
    if (!isOpen || !enrollment) return;
    if (!progressInitialized) return;

    void getEnrollmentProgress(enrollment.id, enrollment.user_id, enrollment.course_id);
  }, [isOpen, enrollment, progressInitialized, getEnrollmentProgress]);

  const progressPercentage = enrollment ? getProgressPercentage(enrollment.id) : 0;
  const progressData = enrollment ? getDetailedProgress(enrollment.id) : null;
  const progressLoading = enrollment ? isProgressLoading(enrollment.id) : false;
  const progressError = enrollment ? getProgressError(enrollment.id) : null;

  const completedLessons = progressData?.completedLessons?.length ?? null;
  const completedModules = progressData?.completedModules?.length ?? null;
  const timeSpentMinutes = typeof progressData?.timeSpent === 'number' ? progressData.timeSpent : null;
  const lastAccessed = progressData?.lastAccessed ? new Date(progressData.lastAccessed).toLocaleString() : null;

  if (!isOpen || !enrollment) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Enrollment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Course Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Information
            </h3>
            <div className="space-y-2">
              <div><span className="font-medium">Course:</span> {enrollment.course_title}</div>
              <div><span className="font-medium">Course ID:</span> {enrollment.course_id}</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span> 
                <Badge variant={
                  enrollment.status === 'approved' ? 'default' :
                  enrollment.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Student Information
            </h3>
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {enrollment.user?.first_name} {enrollment.user?.last_name}</div>
              <div><span className="font-medium">Email:</span> {enrollment.user_email}</div>
              <div><span className="font-medium">Role:</span> {enrollment.user?.role || 'Student'}</div>
            </div>
          </div>

          {/* Enrollment Details */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Enrollment Details
            </h3>
            <div className="space-y-2">
              <div><span className="font-medium">Enrolled:</span> {new Date(enrollment.enrolled_at).toLocaleString()}</div>
              {enrollment.approved_at && (
                <div><span className="font-medium">Approved:</span> {new Date(enrollment.approved_at).toLocaleString()}</div>
              )}
              <div><span className="font-medium">Progress:</span> {Math.max(0, Math.min(100, Math.round(progressPercentage || enrollment.progress || 0)))}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min(Math.max(0, Math.round(progressPercentage || enrollment.progress || 0)), 100)}%` }}
                />
              </div>

              {progressInitialized ? (
                <div className="pt-2 text-sm text-gray-700">
                  {progressLoading ? (
                    <div className="text-gray-500">Loading progress details...</div>
                  ) : progressError ? (
                    <div className="text-red-600">Failed to load progress details</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {completedLessons !== null ? (
                        <div><span className="font-medium">Completed Lessons:</span> {completedLessons}</div>
                      ) : null}
                      {completedModules !== null ? (
                        <div><span className="font-medium">Completed Modules:</span> {completedModules}</div>
                      ) : null}
                      {timeSpentMinutes !== null ? (
                        <div><span className="font-medium">Time Spent:</span> {timeSpentMinutes} min</div>
                      ) : null}
                      {lastAccessed ? (
                        <div><span className="font-medium">Last Accessed:</span> {lastAccessed}</div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Payment Information
            </h3>
            <div className="space-y-2">
              <div><span className="font-medium">Payment Type:</span> 
                <Badge className="ml-2" variant="outline">
                  {enrollment.payment_type?.toUpperCase() || 'MANUAL'}
                </Badge>
              </div>
              <div><span className="font-medium">Payment Reference:</span> {enrollment.payment_ref || 'N/A'}</div>
              <div><span className="font-medium">Payment Date:</span> {enrollment.payment_date || 'N/A'}</div>
              
              {enrollment.proof_of_payment && (
                <div className="flex items-center gap-3 mt-3">
                  <span className="font-medium">Proof of Payment:</span>
                  <div className="flex gap-2">
                    <a 
                      href={enrollment.proof_of_payment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Document
                    </a>
                    {onViewProof && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewProof(enrollment)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Proof
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {!enrollment.proof_of_payment && (
                <div className="text-sm text-gray-500 italic">No proof of payment attached</div>
              )}
            </div>
          </div>

          {/* Actions */}
          {enrollment.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => onApprove(enrollment.id)}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Enrollment
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject(enrollment.id)}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Enrollment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingEnrollmentModal;