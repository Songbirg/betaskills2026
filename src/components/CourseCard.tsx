import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import { Course } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEnrollments } from '@/hooks/useEnrollments';
import { EnrollmentStatus } from '@/types/enrollment';
// import CourseCardProgress from './courses/CourseCardProgress';

// Simplified course images - using placeholder for now
const courseImages: Record<string, string> = {
  'entrepreneurship-final': '/placeholder.svg',
  'ai-human-relations': '/placeholder.svg',
  'roofing101': '/placeholder.svg',
  'plumbing101': '/placeholder.svg',
  'tiling-101': '/placeholder.svg',
  'hair-dressing': '/placeholder.svg',
  'nail-technician': '/placeholder.svg',
  'motor-mechanic-diesel': '/placeholder.svg',
};

const courseAvailability: Record<string, 'Available'> = {
  'entrepreneurship-final': 'Available',
  'ai-human-relations': 'Available',
  'roofing101': 'Available',
  'plumbing101': 'Available',
  'tiling-101': 'Available',
  'hair-dressing': 'Available',
  'nail-technician': 'Available',
  'podcast-management-101': 'Available',
  'emotional-intelligence': 'Available',
  'prophet': 'Available',
  'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d5': 'Available',
  'computer-repairs': 'Available',
  'cellphone-repairs': 'Available',
  'motor-mechanic-petrol': 'Available',
  'motor-mechanic-diesel': 'Available',
};

interface CourseCardProps {
  course: Course;
  enrollment?: any;
  onEnroll?: (courseId: string) => void;
  onStatusChange?: (courseId: string, status: string) => void;
  showAdminControls?: boolean;
}

// Enhanced enrollment state interface for better type safety
interface EnrollmentState {
  status: EnrollmentStatus | null;
  isLoading: boolean;
  hasAccess: boolean;
  requiresApproval: boolean;
  paymentType?: string;
}

const CourseCard = ({ 
  course, 
  enrollment, 
  onEnroll, 
  onStatusChange, 
  showAdminControls = false 
}: CourseCardProps) => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { getEnrollment, isEnrolled, hasPendingEnrollment } = useEnrollments();
  const courseImage = courseImages[course.id] || '/placeholder.svg';
  const availability = 'Available';
  
  // Enhanced state management for enrollment
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    status: null,
    isLoading: false,
    hasAccess: false,
    requiresApproval: false
  });

  // Real-time enrollment status tracking
  const [realTimeStatus, setRealTimeStatus] = useState<EnrollmentStatus | null>(null);

  // Update enrollment state based on current enrollment data
  useEffect(() => {
    if (!user) {
      setEnrollmentState({
        status: null,
        isLoading: false,
        hasAccess: false,
        requiresApproval: false
      });
      return;
    }

    // Get current enrollment from useEnrollments hook
    const currentEnrollment = getEnrollment(course.id);
    const userIsEnrolled = isEnrolled(course.id);
    const userHasPending = hasPendingEnrollment(course.id);

    // Determine enrollment status
    let status: EnrollmentStatus | null = null;
    let hasAccess = false;
    let requiresApproval = false;

    if (currentEnrollment) {
      // Map legacy status to new EnrollmentStatus enum
      const normalized = String((currentEnrollment as any)?.status || '').toLowerCase();
      switch (normalized) {
        case 'approved':
          status = EnrollmentStatus.APPROVED;
          hasAccess = true;
          break;
        case 'pending':
        case 'pending_approval':
          status = EnrollmentStatus.PENDING_APPROVAL;
          requiresApproval = true;
          break;
        case 'rejected':
          status = EnrollmentStatus.REJECTED;
          break;
        default:
          if (normalized.includes('approved')) {
            status = EnrollmentStatus.APPROVED;
            hasAccess = true;
          } else if (normalized.includes('pending')) {
            status = EnrollmentStatus.PENDING_APPROVAL;
            requiresApproval = true;
          } else if (normalized.includes('reject')) {
            status = EnrollmentStatus.REJECTED;
          } else {
            status = EnrollmentStatus.PENDING;
          }
      }
    } else if (userHasPending) {
      status = EnrollmentStatus.PENDING_APPROVAL;
      requiresApproval = true;
    } else if (userIsEnrolled) {
      status = EnrollmentStatus.APPROVED;
      hasAccess = true;
    }

    setEnrollmentState({
      status: realTimeStatus || status,
      isLoading: false,
      hasAccess,
      requiresApproval
    });
  }, [user, course.id, getEnrollment, isEnrolled, hasPendingEnrollment, realTimeStatus]);

  // Real-time enrollment status updates - Requirements 3.1, 3.2, 3.3
  useEffect(() => {
    if (!user) return;

    const handleEnrollmentStatusUpdate = (event: CustomEvent) => {
      const { enrollmentId, userId, courseId } = event.detail || {};
      const status: EnrollmentStatus | undefined = (event.detail?.status || event.detail?.newStatus) as any;
      
      // Only update if this event is for the current user and course
      if (status && userId === user.id && courseId === course.id) {
        console.log('📡 CourseCard: Real-time enrollment status update:', {
          courseId,
          oldStatus: enrollmentState.status,
          newStatus: status
        });
        
        setRealTimeStatus(status);
        
        // Update enrollment state immediately
        setEnrollmentState(prev => ({
          ...prev,
          status,
          hasAccess: status === EnrollmentStatus.APPROVED,
          requiresApproval: status === EnrollmentStatus.PENDING_APPROVAL,
          isLoading: false
        }));
      }
    };

    const handleCourseAccessGranted = (event: CustomEvent) => {
      const { userEmail, courseId } = event.detail;
      
      if (userEmail === user.email && courseId === course.id) {
        console.log('🎯 CourseCard: Course access granted:', { courseId });
        
        setRealTimeStatus(EnrollmentStatus.APPROVED);
        setEnrollmentState(prev => ({
          ...prev,
          status: EnrollmentStatus.APPROVED,
          hasAccess: true,
          requiresApproval: false,
          isLoading: false
        }));
      }
    };

    const handleAdminApproval = (event: CustomEvent) => {
      const { userEmail, courseId } = event.detail;
      
      if (userEmail === user.email && courseId === course.id) {
        console.log('✅ CourseCard: Admin approval received:', { courseId });
        
        setRealTimeStatus(EnrollmentStatus.APPROVED);
        setEnrollmentState(prev => ({
          ...prev,
          status: EnrollmentStatus.APPROVED,
          hasAccess: true,
          requiresApproval: false,
          isLoading: false
        }));
      }
    };

    // Listen to global events
    window.addEventListener('enrollment-status-updated', handleEnrollmentStatusUpdate as EventListener);
    window.addEventListener('course-access-granted', handleCourseAccessGranted as EventListener);
    window.addEventListener('admin-approval', handleAdminApproval as EventListener);

    return () => {
      window.removeEventListener('enrollment-status-updated', handleEnrollmentStatusUpdate as EventListener);
      window.removeEventListener('course-access-granted', handleCourseAccessGranted as EventListener);
      window.removeEventListener('admin-approval', handleAdminApproval as EventListener);
    };
  }, [user, course.id, enrollmentState.status]);

  const handleEnroll = async () => {
    // Requirement 1.1: Redirect non-logged users to authentication
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setEnrollmentState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // EFT-only enrollment flow - navigate to enrollment page
      console.log('🏦 CourseCard: Initiating EFT enrollment for course:', course.id);
      
      // Navigate to payment page where user can pay via EFT and upload proof of payment
      // (Route is defined in App.tsx as /payment/:courseId)
      navigate(`/payment/${course.id}`);
      
      // Fallback to legacy enrollment if onEnroll callback is provided
      if (onEnroll) {
        onEnroll(course.id);
      }
    } catch (error) {
      console.error('❌ CourseCard: Enrollment error:', error);
      setEnrollmentState(prev => ({ ...prev, isLoading: false }));
      
      // Show user-friendly error message
      alert('Enrollment failed. Please check your connection and try again.');
    }
  };

  const handleContinue = () => {
    navigate(`/course/${course.id}`);
  };

  // Enhanced button rendering with proper enrollment logic - Requirements 1.1, 1.2, 1.3, 6.1, 6.3, 6.4
  const renderEnrollmentButton = () => {
    // CRITICAL: Hardcoded full access for specific users - check FIRST before anything else
    // Also check localStorage cache for mobile browsers where session might not be loaded yet
    const specialAccessEmails = ['ericmnisi007@gmail.com', 'john.doe@gmail.com', 'maxmon@gmail.com', 'carlowalljee@gmail.com', 'mopalamitshepo@gmail.com'];
    
    // Get email from multiple sources to handle mobile session issues
    let userEmail = user?.email?.toLowerCase();
    
    // Fallback: check localStorage for cached session if user email not available
    if (!userEmail) {
      try {
        const cachedSession = localStorage.getItem('supabase-auth-session');
        if (cachedSession) {
          const sessionData = JSON.parse(cachedSession);
          userEmail = sessionData?.user?.email?.toLowerCase();
        }
        // Also check Supabase's own storage
        if (!userEmail) {
          const supabaseAuth = localStorage.getItem('SupabaseAuth');
          if (supabaseAuth) {
            const authData = JSON.parse(supabaseAuth);
            userEmail = authData?.user?.email?.toLowerCase();
          }
        }
      } catch (e) {
        console.warn('Error reading cached session:', e);
      }
    }
    
    const hasSpecialAccess = userEmail && specialAccessEmails.includes(userEmail);
    
    // Special access users ALWAYS get Continue Course button - no profile check needed
    if (hasSpecialAccess) {
      return (
        <Button 
          onClick={() => navigate(`/course/${course.id}`)}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/60 h-7 sm:h-8"
        >
          Continue Course
        </Button>
      );
    }
    
    // Admin users get full access to all courses
    if (profile?.role === 'admin') {
      return (
        <Button 
          onClick={() => navigate(`/course/${course.id}`)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/60 h-7 sm:h-8"
        >
          👑 Admin Access
        </Button>
      );
    }

    // Requirement 1.1: Not logged in - show "Register To Enroll"
    if (!user) {
      return (
        <Button
          className="w-full py-1 sm:py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold text-xs shadow-lg hover:scale-105 hover:from-gray-500 hover:to-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/60 h-7 sm:h-8"
          onClick={() => navigate('/auth')}
        >
          Register To Enroll
        </Button>
      );
    }

    // Not a student - no enrollment button
    if (profile?.role !== 'student') {
      return null;
    }

    // Loading state - show processing indicator
    if (enrollmentState.isLoading) {
      return (
        <Button 
          disabled
          className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white cursor-not-allowed text-xs py-1 sm:py-2 h-7 sm:h-8 flex items-center justify-center gap-1"
        >
          <Loader2 className="w-3 h-3 animate-spin" />
          Processing...
        </Button>
      );
    }

    // Handle enrollment status-based button states
    switch (enrollmentState.status) {
      case EnrollmentStatus.APPROVED:
      case EnrollmentStatus.COMPLETED:
        // Requirement 6.4: Approved enrollment - show "Continue Course"
        return (
          <Button 
            onClick={handleContinue}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/60 h-7 sm:h-8 flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Continue Course
          </Button>
        );

      case EnrollmentStatus.PENDING_APPROVAL:
        // Requirement 6.3: EFT payments awaiting admin approval - show "Pending Approval"
        return (
          <Button 
            disabled
            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white cursor-not-allowed text-xs py-1 sm:py-2 h-7 sm:h-8 flex items-center justify-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Pending Approval
          </Button>
        );

      case EnrollmentStatus.PAYMENT_PROCESSING:
        // Payment is being processed
        return (
          <Button 
            disabled
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white cursor-not-allowed text-xs py-1 sm:py-2 h-7 sm:h-8 flex items-center justify-center gap-1"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing Payment
          </Button>
        );

      case EnrollmentStatus.PAYMENT_REQUIRED:
        // Payment required - retry enrollment
        return (
          <Button 
            onClick={handleEnroll}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/60 h-7 sm:h-8"
          >
            Complete Payment
          </Button>
        );

      case EnrollmentStatus.REJECTED:
        // Enrollment was rejected
        return (
          <Button 
            onClick={handleEnroll}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/60 h-7 sm:h-8"
          >
            Enroll Again
          </Button>
        );

      case EnrollmentStatus.FAILED:
        // Enrollment failed - retry
        return (
          <Button 
            onClick={handleEnroll}
            className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400/60 h-7 sm:h-8"
          >
            Retry Enrollment
          </Button>
        );

      default:
        // Requirement 1.2: Logged in but not enrolled - show "Enroll Now"
        return (
          <Button 
            onClick={handleEnroll}
            disabled={enrollmentState.isLoading}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400/60 h-7 sm:h-8"
          >
            Enroll Now
          </Button>
        );
    }
  };

  // Enhanced status badge rendering with real-time updates
  const renderStatusBadge = () => {
    if (!enrollmentState.status) return null;

    switch (enrollmentState.status) {
      case EnrollmentStatus.APPROVED:
      case EnrollmentStatus.COMPLETED:
        return (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-1">
            <CheckCircle className="w-2 h-2" />
            Enrolled
          </div>
        );

      case EnrollmentStatus.PENDING_APPROVAL:
        return (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center gap-1">
            <Clock className="w-2 h-2" />
            Pending Approval
          </div>
        );

      case EnrollmentStatus.PAYMENT_PROCESSING:
        return (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-1">
            <Loader2 className="w-2 h-2 animate-spin" />
            Processing
          </div>
        );

      case EnrollmentStatus.PAYMENT_REQUIRED:
        return (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center gap-1">
            <AlertCircle className="w-2 h-2" />
            Payment Required
          </div>
        );

      case EnrollmentStatus.REJECTED:
        return (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center gap-1">
            <AlertCircle className="w-2 h-2" />
            Rejected
          </div>
        );

      case EnrollmentStatus.FAILED:
        return (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-gray-500 to-gray-600 text-white flex items-center gap-1">
            <AlertCircle className="w-2 h-2" />
            Failed
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card 
      data-course-id={course.id}
      className="hover-lift animate-fade-in group overflow-hidden h-48 sm:h-56 md:h-64 relative"
    >
      <div className="relative h-full w-full">
        <img
          src={courseImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Black overlay with 90% opacity */}
        <div className="absolute inset-0 bg-black/90" />
        
        {/* Availability Badge */}
        <div className={`absolute top-1 right-1 sm:top-2 sm:right-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 ${
          'bg-green-500 text-white'
        }`}>
          {availability}
        </div>
        
        {/* Enhanced Status Badge with Real-time Updates */}
        {renderStatusBadge()}
        
        {/* Special Access Badge for john.doe@gmail.com (only if no enrollment status) */}
        {user?.email === 'john.doe@gmail.com' && !enrollmentState.status && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold shadow-lg z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            🎯 Special Access
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute inset-0 p-2 sm:p-3 flex flex-col justify-between z-10">
          {/* Header section */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {course.title}
              </h3>
            </div>
            
            <p className="text-xs text-gray-300 line-clamp-2 leading-tight">
              {course.description}
            </p>
          </div>

          {/* Progress and buttons section */}
          <div className="space-y-1 sm:space-y-2">
            {/* Temporarily commented out to fix loading issue */}
            {/* <CourseCardProgress 
              courseId={course.id}
              enrolled={!!enrollment}
            /> */}

            <div className="flex flex-col gap-1">
              {/* Enhanced enrollment button with real-time updates */}
              {renderEnrollmentButton()}

              {/* Admin controls for pending enrollments */}
              {showAdminControls && course.status === 'pending' && (
                 <div className="flex gap-1">
                   <Button 
                     onClick={() => onStatusChange?.(course.id, 'approved')}
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 sm:py-2 h-7 sm:h-8"
                   >
                     Approve
                   </Button>
                   <Button 
                     onClick={() => onStatusChange?.(course.id, 'rejected')}
                     variant="destructive"
                     className="flex-1 text-xs py-1 sm:py-2 h-7 sm:h-8"
                   >
                     Reject
                   </Button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
