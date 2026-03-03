import React, { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types/course';
import { FastCourse } from '@/hooks/useFastCourses';
import { CoursePriority } from '@/types/enrollment';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/hooks/AuthContext';
import { getEnrollmentStatus } from '@/utils/enrollmentPersistence';
import { safeGetEnrollmentStatus } from '@/utils/enrollmentErrorFix';
// import CourseCard from '@/components/courses/CourseCard'; // Not used in this component
// import { Skeleton } from '@/components/ui/skeleton'; // Not used in this component
import {
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import CourseProgressBar from './CourseProgressBar';
import CourseGridEnrollmentButton from './CourseGridEnrollmentButton';
import aiHumanNew from '../../../images/generation-7f218044-3139-41b5-8dc7-afedae829ae7.png';
import soundEngineeringNew from '../../../images/generation-9c9ad650-aa25-4df1-9236-b137241521c0.png';
import podcastNew from '../../../images/generation-8d3c5693-9f7f-4360-8c0b-533dc0da09bd.png';
import dieselMechanicNew from '../../../images/generation-c8135d13-bf83-4379-847e-e306db926631.png';
import motorMechanicNew from '../../../images/generation-147b4caa-7110-471b-bea0-9f848409020e.png';
import computerRepairsNew from '../../../images/generation-223f5d12-39ae-4748-84af-466e0078c55d.png';
import entrepreneurshipNew from '../../../images/generation-0fca7938-9dd0-47b3-9d36-a552cd0e2ed2.png';
import cellphoneRepairsNew from '../../../images/generation-f3a5d1c2-fed5-4324-be4b-7b9c526b3455.png';
import hairDressingNew from '../../../images/generation-14193c97-8259-4674-ac20-0b8a10a628ea.png';
import nailTechnicianNew from '../../../images/generation-ca8e153c-3951-4b5e-b646-5b4e33e835cc.png';
import plumbingNew from '../../../images/generation-704ccdce-48ca-411f-b5de-3adbe0ef98c1.png';
import tilingNew from '../../../images/generation-25c77381-c00b-4f6f-a660-5de57dbf0cc5.png';
import roofingNew from '../../../images/generation-8dea647f-b6de-42c7-8708-d6e68a0fe5d1.png';

interface CoursesGridProps {
  courses: Course[] | FastCourse[];
  coursePriorities?: CoursePriority[];
  showPriorityIndicators?: boolean;
}

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
};

const CoursesGrid: React.FC<CoursesGridProps> = ({ 
  courses, 
  coursePriorities = [], 
  showPriorityIndicators = false 
}) => {
  const navigate = useNavigate();
  const { enrollments, refetch } = useEnrollments();
  const { user } = useAuth();
  const gridRef = useRef<HTMLDivElement>(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [enrollmentStatusCache, setEnrollmentStatusCache] = React.useState<Map<string, {
    status: string;
    timestamp: number;
    confidence: number;
  }>>(new Map());
  const [loadingEnrollmentStatus, setLoadingEnrollmentStatus] = React.useState<Set<string>>(new Set());

  // Listen for enrollment status changes and force refresh
  React.useEffect(() => {
    const handleEnrollmentSuccess = (event: CustomEvent) => {
      console.log('🎯 CoursesGrid: Received enrollment success event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
      
      // Clear enrollment status cache for affected course
      if (event.detail?.courseId) {
        setEnrollmentStatusCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(event.detail.courseId);
          return newCache;
        });
        // Immediately update status for the affected course
        updateEnrollmentStatusCache(event.detail.courseId);
      }
      
      // Force refetch enrollments from the hook
      if (refetch) {
        console.log('🔄 CoursesGrid: Calling refetch from useEnrollments');
        refetch();
      }
      // Force a small delay then refresh again to ensure data is updated
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 1000);
    };

    const handleForceRefresh = (event: CustomEvent) => {
      console.log('🎯 CoursesGrid: Received force refresh event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
      // Force refetch enrollments from the hook
      if (refetch) {
        console.log('🔄 CoursesGrid: Calling refetch from useEnrollments');
        refetch();
      }
      // Force a small delay then refresh again to ensure data is updated
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 1000);
    };

    const handleEnrollmentStatusRefresh = (event: CustomEvent) => {
      console.log('🎯 CoursesGrid: Received enrollment status refresh event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
      // Force refetch enrollments from the hook
      if (refetch) {
        console.log('🔄 CoursesGrid: Calling refetch from useEnrollments');
        refetch();
      }
      // Force a small delay then refresh again to ensure data is updated
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 1000);
    };

    const handleEnrollmentCreated = (event: CustomEvent) => {
      console.log('🎯 CoursesGrid: Received enrollment created event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
      // Force refetch enrollments from the hook
      if (refetch) {
        console.log('🔄 CoursesGrid: Calling refetch from useEnrollments');
        refetch();
      }
      // Force a small delay then refresh again to ensure data is updated
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 1000);
    };

    // Listen for localStorage changes directly
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'enrollments' || e.key?.startsWith('user-enrollments-') || e.key?.startsWith('enrollment-')) {
        console.log('🎯 CoursesGrid: localStorage enrollment change detected:', e.key);
        setRefreshTrigger(prev => prev + 1);
        if (refetch) {
          console.log('🔄 CoursesGrid: Calling refetch due to localStorage change');
          refetch();
        }
      }
    };

    window.addEventListener('enrollment-success', handleEnrollmentSuccess as EventListener);
    window.addEventListener('force-course-card-refresh', handleForceRefresh as EventListener);
    window.addEventListener('enrollment-status-refresh', handleEnrollmentStatusRefresh as EventListener);
    window.addEventListener('enrollment-created', handleEnrollmentCreated as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('enrollment-success', handleEnrollmentSuccess as EventListener);
      window.removeEventListener('force-course-card-refresh', handleForceRefresh as EventListener);
      window.removeEventListener('enrollment-status-refresh', handleEnrollmentStatusRefresh as EventListener);
      window.removeEventListener('enrollment-created', handleEnrollmentCreated as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refetch]);
  
  // Debug logging (reduced)
  console.log('🎯 CoursesGrid: Courses:', courses.length, 'Enrollments:', Object.keys(enrollments || {}).length);

  // Create priority map for quick lookup
  const priorityMap = useMemo(() => {
    const map = new Map<string, CoursePriority>();
    coursePriorities.forEach(priority => {
      map.set(priority.courseId, priority);
    });
    return map;
  }, [coursePriorities]);

  // Get enrollment status styling and indicators
  const getEnrollmentStatusIndicator = (status: string, confidence: number) => {
    switch (status) {
      case 'enrolled':
        return {
          badge: {
            text: confidence > 0.8 ? 'Enrolled ✓' : 'Enrolled',
            className: confidence > 0.8 
              ? 'bg-green-500 text-white' 
              : 'bg-green-400 text-white border border-green-600',
            icon: CheckCircle
          },
          cardStyle: confidence > 0.8 
            ? 'ring-2 ring-green-400 ring-offset-2' 
            : 'ring-1 ring-green-300 ring-offset-1'
        };
      case 'pending':
        return {
          badge: {
            text: 'Pending Approval',
            className: 'bg-yellow-500 text-white animate-pulse',
            icon: Clock
          },
          cardStyle: 'ring-2 ring-yellow-400 ring-offset-2'
        };
      case 'loading':
        return {
          badge: {
            text: 'Checking Status...',
            className: 'bg-blue-500 text-white animate-pulse',
            icon: Clock
          },
          cardStyle: 'ring-1 ring-blue-300 ring-offset-1'
        };
      default:
        return null;
    }
  };

  // Get priority indicator for a course
  const getPriorityIndicator = (courseId: string) => {
    const priority = priorityMap.get(courseId);
    if (!priority || !showPriorityIndicators) return null;

    switch (priority.enrollmentStatus) {
      case 'ENROLLED':
        return {
          icon: CheckCircle,
          label: 'Enrolled',
          className: 'bg-green-500 text-white',
          priority: priority.priority
        };
      case 'PENDING':
        return {
          icon: Clock,
          label: 'Pending Approval',
          className: 'bg-yellow-500 text-white',
          priority: priority.priority
        };
      default:
        return null;
    }
  };

  // Update enrollment status cache using enhanced navigation handler
  const updateEnrollmentStatusCache = React.useCallback(async (courseId: string) => {
    if (!user) return;
    
    const userId = user.id || user.email;
    if (!userId) return;

    // Set loading state
    setLoadingEnrollmentStatus(prev => new Set(prev.add(courseId)));

    try {
      const { enhancedNavigationHandler } = await import('@/services/EnhancedNavigationHandler');
      const statusInfo = await enhancedNavigationHandler.getEnrollmentStatusForDisplay(userId, courseId);
      
      setEnrollmentStatusCache(prev => new Map(prev.set(courseId, {
        status: statusInfo.status,
        timestamp: Date.now(),
        confidence: statusInfo.confidence
      })));
      
      console.log(`✅ Updated enrollment status for ${courseId}: ${statusInfo.status} (confidence: ${statusInfo.confidence})`);
    } catch (error) {
      console.error('Failed to update enrollment status cache:', error);
    } finally {
      // Clear loading state
      setLoadingEnrollmentStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  }, [user]);

  // Enhanced enrollment status determination with unified validation
  const getEnrollmentStatusForCourse = React.useCallback((courseId: string) => {
    // CRITICAL: If user is not logged in, always return unenrolled
    if (!user) {
      console.log('🚫 getEnrollmentStatusForCourse: No user logged in, returning unenrolled');
      return 'unenrolled';
    }

    const userId = user.id || user.email;
    if (!userId) {
      console.log('🚫 getEnrollmentStatusForCourse: No valid user identifier, returning unenrolled');
      return 'unenrolled';
    }

    // Show loading state if currently updating
    if (loadingEnrollmentStatus.has(courseId)) {
      return 'loading';
    }

    // Check cache first for real-time status
    const cachedStatus = enrollmentStatusCache.get(courseId);
    if (cachedStatus && (Date.now() - cachedStatus.timestamp) < 30000) { // 30 second cache
      console.log(`🎯 Using cached status for ${courseId}: ${cachedStatus.status} (confidence: ${cachedStatus.confidence})`);
      return cachedStatus.status;
    }

    // First check priority indicators (most reliable for admin-managed enrollments)
    const priority = priorityMap.get(courseId);
    if (priority) {
      switch (priority.enrollmentStatus) {
        case 'ENROLLED':
          return 'enrolled';
        case 'PENDING':
          return 'pending';
        default:
          return 'unenrolled';
      }
    }

    // Use bulletproof persistence utility as fallback
    try {
      const status = getEnrollmentStatus(courseId, userId);
      console.log(`🔍 getEnrollmentStatusForCourse: Course ${courseId}, User ${userId}, Status: ${status}, Trigger: ${refreshTrigger}`);
      
      // Async update cache for next time (but don't wait for it)
      updateEnrollmentStatusCache(courseId);
      
      return status;
    } catch (error) {
      console.error('Error in getEnrollmentStatus, using safe fallback:', error);
      // Use safe fallback that won't crash the app
      return safeGetEnrollmentStatus(courseId, userId);
    }
  }, [user, priorityMap, refreshTrigger, enrollmentStatusCache, loadingEnrollmentStatus, updateEnrollmentStatusCache]);

  // Preload enrollment status for all courses
  React.useEffect(() => {
    if (!user || !courses.length) return;
    
    // Preload enrollment status for all visible courses
    courses.forEach(course => {
      updateEnrollmentStatusCache(course.id);
    });
  }, [courses, user, updateEnrollmentStatusCache]);

  const handleEnrollClick = (courseId: string) => {
    console.log('🎯🎯🎯 ENROLL CLICK - Course ID:', courseId);
    
    // Run enrollment flow test
    try {
      // Import the test function dynamically
      import('@/utils/enrollmentFlowTest').then(({ testEnrollmentFlow }) => {
        const testResult = testEnrollmentFlow(courseId, courses, user);
        
        if (!testResult.isReady) {
          console.error('❌ Enrollment flow test failed');
          if (!testResult.courseExists) {
            console.error('❌ Course not found');
            return;
          }
          if (!testResult.userLoggedIn) {
            console.error('❌ User not logged in');
            navigate('/auth');
            return;
          }
        }
      }).catch(error => {
        console.warn('⚠️ Test function failed to load:', error);
      });
    } catch (error) {
      console.warn('⚠️ Enrollment test failed:', error);
    }
    
    // Basic validation before navigation
    if (!courseId) {
      console.error('❌ No course ID provided');
      return;
    }
    
    if (!user) {
      console.error('❌ User not logged in');
      navigate('/auth');
      return;
    }
    
    const course = courses?.find(c => c.id === courseId);
    if (!course) {
      console.error('❌ Course not found:', courseId);
      console.log('Available courses:', courses?.map(c => c.id));
      return;
    }
    
    console.log('✅ All checks passed, navigating to payment page');
    navigate(`/payment/${courseId}`);
  };

  const handleContinueClick = async (courseId: string) => {
    console.log('🎯 Continue Course clicked in CoursesGrid for course:', courseId);
    
    if (!user) {
      console.log('❌ No user logged in');
      navigate('/login');
      return;
    }

    const userId = user.id || user.email;
    if (!userId) {
      console.error('❌ No valid user ID found');
      navigate('/login');
      return;
    }

    try {
      // Import the enhanced navigation handler
      const { enhancedNavigationHandler } = await import('@/services/EnhancedNavigationHandler');
      
      // Use enhanced navigation handler for reliable course access with improved error handling
      await enhancedNavigationHandler.handleContinueCourseClick(
        userId,
        courseId,
        navigate
      );
    } catch (error) {
      console.error('❌ Enhanced navigation failed:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to access course';
      console.error('Navigation error details:', errorMessage);
      
      // Fallback to direct navigation with error handling
      try {
        navigate(`/course/${courseId}`);
      } catch (fallbackError) {
        console.error('❌ Fallback navigation also failed:', fallbackError);
        navigate('/courses'); // Final fallback to courses page
      }
    }
  };

  // Loading state is now handled by the parent component

  return (
    <div ref={gridRef} className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-12 courses-grid">
      {courses.map((course, index) => {
        const courseImage = courseImages[course.id] || courseImages[course.title] || '/placeholder.svg';
        const status = getEnrollmentStatusForCourse(course.id);
        const isEnrolled = status === 'enrolled';
        const isLoading = status === 'loading';
        
        // Get cached enrollment info for confidence display
        const cachedInfo = enrollmentStatusCache.get(course.id);
        const confidence = cachedInfo?.confidence || 0;
        
        // Debug logging for each course (reduced)
        if (status !== 'unenrolled') {
          console.log(`🎯 Course: ${course.title} - Status: ${status}, Confidence: ${confidence}`);
        }
        const priorityIndicator = getPriorityIndicator(course.id);
        const enrollmentIndicator = getEnrollmentStatusIndicator(status, confidence);

        return (
          <div
            key={course.id}
            className={`course-card rounded-3xl shadow-xl border-0 overflow-hidden flex flex-col h-64 group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:scale-[1.03] relative ${
              priorityIndicator ? 'ring-2 ring-offset-2 ' + (
                priorityIndicator.className.includes('green') 
                  ? 'ring-green-400 priority-course' 
                  : 'ring-yellow-400 pending-course'
              ) : enrollmentIndicator ? enrollmentIndicator.cardStyle : ''
            }`}
            style={{ 
              background: 'white', 
              minHeight: 200, 
              opacity: 1, 
              zIndex: priorityIndicator ? 10 : 1, 
              animationDelay: `${index * 100}ms`,
              transform: priorityIndicator ? 'translateY(-2px)' : 'none'
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={courseImage}
                alt={course.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={e => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
              />
            </div>

            {/* Consistent black overlay for readability */}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} />

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
              {/* Status Indicator Badges */}
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                {/* Priority Indicator Badge */}
                {priorityIndicator && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse ${priorityIndicator.className}`}>
                    <priorityIndicator.icon className="w-3 h-3" />
                    <span>{priorityIndicator.label}</span>
                  </div>
                )}
                
                {/* Enrollment Status Badge */}
                {enrollmentIndicator && !priorityIndicator && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-lg ${enrollmentIndicator.badge.className}`}>
                    <enrollmentIndicator.badge.icon className="w-3 h-3" />
                    <span>{enrollmentIndicator.badge.text}</span>
                  </div>
                )}
                
                {/* Confidence Indicator for enrolled courses */}
                {status === 'enrolled' && confidence > 0 && confidence < 0.8 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-500 text-white shadow-lg">
                    <AlertCircle className="w-3 h-3" />
                    <span>Low Confidence</span>
                  </div>
                )}
              </div>

              {/* Header section */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white line-clamp-2 rounded-lg px-2 py-1 bg-gradient-to-r from-red-600 to-red-800 inline-block w-fit shadow-md">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2">{course.description}</p>

                {/* Course Stats Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2 py-1 rounded-full text-xs font-semibold shadow-lg bg-green-500 text-white">
                    Available
                  </div>
                  
                  {/* Real-time enrollment status badge */}
                  {status !== 'unenrolled' && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                      status === 'enrolled' 
                        ? confidence > 0.8 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-500 text-white border border-green-700'
                        : status === 'pending'
                        ? 'bg-yellow-500 text-white animate-pulse'
                        : status === 'loading'
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {status === 'enrolled' && <CheckCircle className="w-3 h-3" />}
                      {status === 'pending' && <Clock className="w-3 h-3" />}
                      {status === 'loading' && <Clock className="w-3 h-3" />}
                      <span>
                        {status === 'enrolled' ? 'Enrolled' : 
                         status === 'pending' ? 'Pending' : 
                         status === 'loading' ? 'Checking...' : status}
                      </span>
                      {status === 'enrolled' && confidence > 0 && confidence < 0.8 && (
                        <span className="text-xs opacity-75">({Math.round(confidence * 100)}%)</span>
                      )}
                    </div>
                  )}
                </div>

                <CourseProgressBar  
                  courseId={course.id}
                  enrolled={isEnrolled}
                />
              </div>

              {/* Buttons section */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => navigate(`/course/${course.id}/overview`)}
                  className="w-full py-2 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-xs shadow-lg hover:scale-105 hover:from-red-700 hover:to-red-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400/60"
                >
                  View Course
                </button>
                
                {/* Refresh enrollment status button for low confidence */}
                {status === 'enrolled' && confidence > 0 && confidence < 0.6 && (
                  <button
                    onClick={() => updateEnrollmentStatusCache(course.id)}
                    disabled={isLoading}
                    className="w-full py-1 rounded-full bg-orange-500 text-white font-bold text-xs shadow-lg hover:scale-105 hover:bg-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Refreshing...' : 'Refresh Status'}
                  </button>
                )}
                
                <CourseGridEnrollmentButton
                  status={status as any}
                  onEnrollClick={() => handleEnrollClick(course.id)}
                  onContinueClick={() => handleContinueClick(course.id)}
                  courseTitle={course.title}
                  courseId={course.id}
                  userId={user?.id || user?.email || ''}
                />
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .group:hover {
          box-shadow: 0 8px 32px 0 rgba(239,68,68,0.15), 0 0 0 4px rgba(239,68,68,0.10);
          transform: translateY(-8px) scale(1.04);
        }
        
        /* Course reordering animations */
        .course-card-enter {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        
        .course-card-enter-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .course-card-exit {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .course-card-exit-active {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Priority course animations */
        .priority-course {
          animation: priorityPulse 2s ease-in-out infinite;
        }
        
        @keyframes priorityPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
          }
        }
        
        .pending-course {
          animation: pendingPulse 2s ease-in-out infinite;
        }
        
        @keyframes pendingPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(234, 179, 8, 0);
          }
        }
        
        /* Smooth grid transitions */
        .courses-grid {
          transition: all 0.3s ease-in-out;
        }
        
        .course-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Stagger animation for course cards */
        .course-card:nth-child(1) { animation-delay: 0ms; }
        .course-card:nth-child(2) { animation-delay: 100ms; }
        .course-card:nth-child(3) { animation-delay: 200ms; }
        .course-card:nth-child(4) { animation-delay: 300ms; }
        .course-card:nth-child(5) { animation-delay: 400ms; }
        .course-card:nth-child(6) { animation-delay: 500ms; }
        .course-card:nth-child(7) { animation-delay: 600ms; }
        .course-card:nth-child(8) { animation-delay: 700ms; }
        
        /* Enrollment status animations */
        .enrollment-status-update {
          animation: statusUpdate 0.5s ease-in-out;
        }
        
        @keyframes statusUpdate {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Loading state animations */
        .enrollment-loading {
          animation: loadingPulse 1.5s ease-in-out infinite;
        }
        
        @keyframes loadingPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        /* Confidence indicator animations */
        .low-confidence {
          animation: confidenceWarning 2s ease-in-out infinite;
        }
        
        @keyframes confidenceWarning {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(249, 115, 22, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesGrid;
