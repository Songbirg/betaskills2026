import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enhancedNavigationHandler } from '@/services/EnhancedNavigationHandler';
import { useNavigate } from 'react-router-dom';

type EnrollmentStatus = 'enrolled' | 'pending' | 'unenrolled' | 'loading';

interface Props {
  status: EnrollmentStatus;
  onEnrollClick: () => void;
  onContinueClick?: () => Promise<void> | void; // Made optional since we'll handle navigation internally
  courseTitle?: string;
  courseId?: string;
  userId?: string;
  isComingSoon?: boolean;
}

const CourseGridEnrollmentButton: React.FC<Props> = ({ 
  status, 
  onEnrollClick, 
  onContinueClick, 
  courseTitle = 'course',
  courseId,
  userId,
  isComingSoon = false
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContinueClick = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setNavigationError(null);
    
    try {
      // Use legacy onContinueClick if provided, otherwise use enhanced navigation handler
      if (onContinueClick) {
        await onContinueClick();
      } else if (courseId && userId) {
        // Use enhanced navigation handler for improved reliability
        await enhancedNavigationHandler.handleContinueCourseClick(
          userId,
          courseId,
          navigate
        );
      } else {
        throw new Error('Missing course ID or user ID for navigation');
      }
      
      // Show success feedback
      toast({
        title: "Accessing Course",
        description: `Loading ${courseTitle}...`,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Navigation error:', error);
      const errorMessage = error?.message || 'Failed to access course. Please try again.';
      setNavigationError(errorMessage);
      
      toast({
        title: "Navigation Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  };

  const handleRetry = async () => {
    if (retryCount >= 3) {
      toast({
        title: "Maximum Retries Reached",
        description: "Please refresh the page or contact support if the issue persists.",
        variant: "destructive",
        duration: 8000,
      });
      return;
    }

    setRetryCount(prev => prev + 1);
    setNavigationError(null);
    
    // Add exponential backoff delay
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
    setTimeout(() => {
      handleContinueClick();
    }, delay);
  };

  if (status === 'loading') {
    return (
      <Button disabled className="w-full bg-gray-500 text-white font-bold text-xs shadow-lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (status === 'enrolled') {
    return (
      <div className="w-full space-y-1">
        <Button 
          onClick={handleContinueClick} 
          disabled={isNavigating}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white font-bold text-xs shadow-lg hover:scale-105 hover:from-green-700 hover:to-green-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/60 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isNavigating ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Accessing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-3 w-3" />
              Continue Course
            </>
          )}
        </Button>
        
        {navigationError && (
          <div className="space-y-1">
            <div className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <AlertCircle className="mr-1 h-3 w-3" />
              <span className="truncate">{navigationError}</span>
            </div>
            {retryCount < 3 && (
              <Button
                onClick={handleRetry}
                size="sm"
                variant="outline"
                className="w-full h-6 text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Retry ({3 - retryCount} left)
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <Button disabled className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-xs shadow-lg cursor-not-allowed">
        Pending Approval
      </Button>
    );
  }

  if (isComingSoon) {
    return (
      <Button disabled className="w-full bg-gray-500 text-white font-bold text-xs shadow-lg cursor-not-allowed opacity-70">
        Coming Soon
      </Button>
    );
  }

  return (
    <Button onClick={onEnrollClick} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60">
      Enroll Now
    </Button>
  );
};

export default CourseGridEnrollmentButton;
