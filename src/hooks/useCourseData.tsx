
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Course, Lesson, Module } from '@/types/course';
import { courseLoadingMonitor } from '@/services/CourseLoadingPerformanceMonitor';
import { resolveCourseId } from '@/utils/resolveCourseId';

// Static imports - more reliable for production
import doggrooming101 from '@/data/doggrooming101';
import beautyTherapy101 from '@/data/beautyTherapy101';
import masterchef101 from '@/data/masterchef101';
import landscaping101 from '@/data/landscaping101';
import socialMediaMarketing101 from '@/data/socialMediaMarketing101';
import electrician101 from '@/data/electrician101';
import solar101 from '@/data/solar101';
import plumbing101 from '@/data/plumbing101';
import roofing101 from '@/data/roofing101';
import tiling101 from '@/data/tiling101';
import cellphoneRepairs101 from '@/data/cellphoneRepairs101';
import prophet from '@/data/prophet';
import cybersecurity101 from '@/data/cybersecurity101';
import entrepreneurshipFinalCourse from '@/data/entrepreneurshipFinalCourse';
import { aiHumanRelationsCourse } from '@/data/aiHumanRelations/index';
import { petrolMechanicCourse } from '@/data/petrolMechanic/index';
import { dieselMechanicCourse } from '@/data/dieselMechanic/index';
import { podcastManagementCourse } from '@/data/podcastManagement/index';
import { computerLaptopRepairsCourse } from '@/data/computerLaptopRepairs/index';
import { hairDressingCourse } from '@/data/hairDressing/index';
import { nailTechnicianCourse } from '@/data/nailTechnician/index';
import motorMechanicDieselCourse from '@/data/motorMechanicDiesel/index';
import aiCartoonMoviesCourse from '@/data/aiCartoonMovies/index';
import { soundEngineeringCourse } from '@/data/soundEngineering/index';
import bookkeepingCourse from '@/data/bookkeeping';

import sellingOnlineCourse from '@/data/sellingOnline';
import onlineTradingCourse from '@/data/onlineTrading';
import emotionalIntelligenceCourse from '@/data/emotionalIntelligence';
import smartHomeAutomationCourse from '@/data/smartHomeAutomation';
import carpentry101Course from '@/data/carpentry101';
import aiAssistedProgrammingCourse from '@/data/aiAssistedProgrammingCourse';
import aiAssistedWebDevelopmentCourse from '@/data/aiAssistedWebDevelopmentCourse';

interface CourseLoadResult {
  course: Course | null;
  status: 'success' | 'partial' | 'fallback' | 'failed';
  errors: string[];
}

interface CourseValidation {
  isValid: boolean;
  hasModules: boolean;
  hasLessons: boolean;
  missingData: string[];
  canProceed: boolean;
}

export const useCourseData = (courseId?: string) => {
  const params = useParams<{ id: string; courseId: string }>();
  const rawIdFromParams = courseId || params.courseId || params.id;
  const idFromParams = resolveCourseId(rawIdFromParams);
  
  // Debug logging
  console.log('🔧 useCourseData init:', { 
    passedCourseId: courseId, 
    paramsCourseId: params.courseId, 
    paramsId: params.id,
    rawResolved: rawIdFromParams,
    resolved: idFromParams
  });
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadResult, setLoadResult] = useState<CourseLoadResult>({
    course: null,
    status: 'failed',
    errors: []
  });

  // Validate course data structure
  const validateCourseData = (course: Course): CourseValidation => {
    const validation: CourseValidation = {
      isValid: true,
      hasModules: false,
      hasLessons: false,
      missingData: [],
      canProceed: false
    };

    if (!course) {
      validation.isValid = false;
      validation.missingData.push('Course object is null');
      return validation;
    }

    // Check for required fields
    if (!course.id) validation.missingData.push('Course ID');
    if (!course.title) validation.missingData.push('Course title');
    if (!course.description) validation.missingData.push('Course description');

    // Check modules
    if (course.modules && Array.isArray(course.modules) && course.modules.length > 0) {
      validation.hasModules = true;
      
      // Check lessons within modules
      const totalLessons = course.modules.reduce((count: number, module: Module) => {
        return count + (module.lessons ? module.lessons.length : 0);
      }, 0);
      
      if (totalLessons > 0) {
        validation.hasLessons = true;
      } else {
        validation.missingData.push('Course lessons');
      }
    } else {
      validation.missingData.push('Course modules');
    }

    // Determine if course can proceed
    validation.canProceed = validation.hasModules && (validation.hasLessons || validation.missingData.length === 1);
    validation.isValid = validation.missingData.length === 0;

    return validation;
  };

  // Create fallback course structure for missing course data
  const createFallbackCourse = (courseId: string, featuredCourse?: any): Course => {
    console.log('Creating fallback course for ID:', courseId);
    
    const fallbackCourse: Course = {
      id: courseId,
      title: featuredCourse?.title || 'Course Content Loading',
      description: featuredCourse?.description || 'Course content is being prepared and will be available soon.',
      category: featuredCourse?.category || 'General',
      level: featuredCourse?.level?.toLowerCase() || 'beginner',
      duration: featuredCourse?.duration || '6 weeks',
      is_free: featuredCourse?.price === 0 || false,
      price: featuredCourse?.price || 290,
      currency: featuredCourse?.currency || 'ZAR',
      students: featuredCourse?.students || 0,
      rating: featuredCourse?.rating || 5,
      instructor: {
        id: 'betaskilltutor',
        first_name: 'Beta Skill',
        last_name: 'Tutor',
        email: 'betaskilltraining@gmail.com'
      },
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      available: true,
      isComingSoon: false,
      overview: featuredCourse?.description || 'Course overview will be available soon.',
      thumbnail: featuredCourse?.image || '',
      modules: [
        {
          id: 1,
          title: 'Course Preparation',
          description: 'Course content is being finalized. You will have access once lessons are ready.',
          lessons: [
            {
              id: 1,
              title: 'Welcome & Course Information',
              duration: '5 minutes',
              type: 'video' as const,
              content: {
                videoUrl: '',
                textContent: `
                  <div class="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div class="mb-6">
                      <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-white text-2xl">📚</span>
                      </div>
                      <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to ${featuredCourse?.title || 'Your Course'}!</h2>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
                      <h3 class="text-xl font-semibold mb-3 text-blue-600">🎯 Course Status</h3>
                      <p class="text-lg mb-4 text-gray-700">Thank you for enrolling in this course!</p>
                      <p class="mb-4 text-gray-600">Our expert instructors are putting the finishing touches on your course content.</p>
                      <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-blue-800 font-medium">✨ You will be automatically notified when lessons are ready</p>
                      </div>
                    </div>

                    <div class="bg-green-50 p-6 rounded-lg">
                      <h3 class="text-xl font-semibold mb-3 text-green-600">🚀 What to Expect</h3>
                      <ul class="text-left space-y-2 text-gray-700">
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> High-quality video lessons</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Practical exercises and assignments</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Interactive quizzes and assessments</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Certificate upon completion</li>
                      </ul>
                    </div>
                  </div>
                `
              }
            }
          ]
        }
      ],
      learningObjectives: [
        `Master the fundamentals of ${featuredCourse?.title || 'this subject'}`,
        'Gain practical skills and hands-on experience',
        'Prepare for career opportunities in this field',
        'Earn a recognized certificate of completion'
      ]
    };

    return fallbackCourse;
  };

  useEffect(() => {
    const loadCourse = async () => {
      if (!idFromParams) {
        setIsLoading(false);
        setCourse(null);
        return;
      }

      setIsLoading(true);
      console.log("useCourseData: Loading course with ID:", idFromParams);
      
      // Start performance monitoring
      const loadingId = courseLoadingMonitor.startLoading(idFromParams);
      
      const result: CourseLoadResult = {
        course: null,
        status: 'failed',
        errors: []
      };
      
      // Static course map - guaranteed to work in production
      // All courses with full content data
      const courseMap: Record<string, Course> = {
        'doggrooming101': doggrooming101,
        'beautyTherapy101': beautyTherapy101,
        'masterchef101': masterchef101,
        'landscaping101': landscaping101,
        'social-media-marketing-101': socialMediaMarketing101,
        'electrician101': electrician101,
        'solar101': solar101,
        'plumbing101': plumbing101,
        'roofing101': roofing101,
        'tiling-101': tiling101,
        'cellphone-repairs-101': cellphoneRepairs101,
        'prophet': prophet,
        'cybersecurity101': cybersecurity101,
        'entrepreneurship-final': entrepreneurshipFinalCourse,
        'ai-human-relations': aiHumanRelationsCourse,
        'petrol-mechanic': petrolMechanicCourse,
        'diesel-mechanic': dieselMechanicCourse,
        'motor-mechanic-diesel': motorMechanicDieselCourse,
        'podcast-management': podcastManagementCourse,
        'computer-laptop-repairs': computerLaptopRepairsCourse,
        'hair-dressing': hairDressingCourse,
        'nail-technician': nailTechnicianCourse,
        'ai-cartoon-movies': aiCartoonMoviesCourse,
        'sound-engineering': soundEngineeringCourse,
        'bookkeeping': bookkeepingCourse,

        'selling-online': sellingOnlineCourse,
        'online-trading': onlineTradingCourse,
        'emotional-intelligence': emotionalIntelligenceCourse,
        'smart-home-automation': smartHomeAutomationCourse,
        'carpentry101': carpentry101Course,
        'ai-assisted-programming': aiAssistedProgrammingCourse,
        'ai-assisted-web-development': aiAssistedWebDevelopmentCourse
      };
      
      console.log('📚 Available courses in map:', Object.keys(courseMap));
      console.log('🔍 Looking for course ID:', idFromParams);

      let foundCourse: Course | null = null;
      let featuredCourseData: any = null;

      try {
        // Get featured course data for fallback
        const { featuredCourses } = await import('@/data/featuredCourses');
        featuredCourseData = featuredCourses.find(c =>
          c.id === idFromParams ||
          c.courseId === idFromParams ||
          (!!rawIdFromParams && (c.id === rawIdFromParams || c.courseId === rawIdFromParams))
        );
      } catch (error) {
        console.warn('Could not load featured courses:', error);
      }

      try {
        // Direct lookup from static map
        if (courseMap[idFromParams]) {
          foundCourse = courseMap[idFromParams];
          console.log("✅ Loaded from static map:", idFromParams);
          result.status = 'success';
        } else if (featuredCourseData?.courseId && courseMap[featuredCourseData.courseId]) {
          // If we navigated via Supabase UUID (or some other ID), recover the canonical courseId slug
          // and load the full static course definition.
          foundCourse = courseMap[featuredCourseData.courseId];
          console.log("✅ Loaded from static map via featuredCourses.courseId:", {
            requested: idFromParams,
            canonical: featuredCourseData.courseId
          });
          result.status = 'success';
        } else {
          // Course not in map - create fallback
          console.log("⚠️ Course not in static map:", idFromParams);
          foundCourse = createFallbackCourse(
            idFromParams,
            featuredCourseData || { id: idFromParams, title: 'Course', description: 'Course content is being prepared.' }
          );
          result.status = 'fallback';
        }

        // GUARANTEE: Always set a course, never null
        if (!foundCourse) {
          console.warn("⚠️ foundCourse is null, creating emergency fallback");
          foundCourse = createFallbackCourse(
            idFromParams,
            featuredCourseData || { id: idFromParams, title: 'Course', description: 'Course content is being prepared.' }
          );
          result.status = 'fallback';
        }
        
        result.course = foundCourse;
        setCourse(foundCourse);
        setLoadResult(result);
        console.log("✅ Course set:", foundCourse?.title, "Status:", result.status);
      } catch (error: any) {
        console.error('❌ Error loading course:', error);
        // ALWAYS create a fallback on error
        const fallback = createFallbackCourse(
          idFromParams,
          featuredCourseData || { id: idFromParams, title: 'Course', description: 'Course content is being prepared.' }
        );
        result.course = fallback;
        result.status = 'fallback';
        result.errors.push(`Error: ${error?.message || 'Unknown error'}`);
        setCourse(fallback);
        setLoadResult(result);
        console.log("✅ Fallback course set after error");
      } finally {
        setIsLoading(false);
        
        // Finish performance monitoring
        if (loadingId && idFromParams) {
          const status = result.status === 'success' || result.status === 'partial' || result.status === 'fallback' 
            ? 'success' 
            : 'error';
          
          const errorMessage = result.errors.length > 0 ? result.errors.join('; ') : undefined;
          
          // Calculate additional metrics
          const moduleCount = result.course?.modules?.length || 0;
          const lessonCount = result.course?.modules?.reduce((count, module) => 
            count + (module.lessons?.length || 0), 0) || 0;
          
          courseLoadingMonitor.finishLoading(loadingId, status, errorMessage, {
            cacheHit: false, // We're always loading fresh in this implementation
            moduleCount,
            lessonCount,
          });
        }
      }
    };

    loadCourse();
  }, [idFromParams]);

  // Flatten all lessons from all modules for easier navigation
  const allLessons: Lesson[] = course?.modules?.flatMap((module: Module) => module.lessons || []) || [];

  return {
    course,
    allLessons,
    isLoading,
    loadResult,
    validateCourseData,
    createFallbackCourse
  };
};
