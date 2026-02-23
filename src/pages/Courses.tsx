import { useState, useMemo, useEffect } from 'react';
import { useCoursesContext } from '@/hooks/CoursesContext';
import { useCourseFiltering } from '@/hooks/useCourseFiltering';
import { useCoursePriorities } from '@/hooks/useCoursePriorities';
import { useAuth } from '@/hooks/AuthContext';
import { useEnrollments } from '@/hooks/EnrollmentContext';
import Footer from '@/components/Footer';
import CourseFilters from '@/components/courses/CourseFilters';
import CoursesGrid from '@/components/courses/CoursesGrid';
import EmptyCoursesState from '@/components/courses/EmptyCoursesState';
import CoursesPageHeader from '@/components/courses/CoursesPageHeader';
import CoursesLoadingState from '@/components/courses/CoursesLoadingState';
import CourseFilter from '@/components/CourseFilter';
import { COURSE_CATEGORIES } from '@/types/unifiedCourse';

import { CheckCircle, Clock } from 'lucide-react';

const PINNED_COURSE_TITLES = [
  'Entrepreneurship',
  'Social Media Marketing 101',
  'AI Assisted Cartoon Movie Making',
  'Roofing',
  'Plumbing',
  'Tiling 101',
  'Landscaping',
  'Hair Dressing',
  'Nail Technician',
  'Online Trading - Financial Markets',
  'Petrol Motor Mechanic',
  'Diesel Motor Mechanic',
  'Master Electrician Online',
  'Solar Energy Systems: Installation & Maintenance',
  'Mastering Podcast Management',
  'Selling Online',
  'Cybersecurity',
  'Master Chef',
  'Smart Home Automation',
].map(t => t.trim().toLowerCase());

const Courses = () => {
  const { courses, loading } = useCoursesContext();
  const { user } = useAuth();
  const { isLoading: enrollmentsLoading } = useEnrollments();
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [horizontalFilters, setHorizontalFilters] = useState({
    keyword: '',
    category: '',
    availability: ''
  });

  // Listen for enrollment status changes and refresh the page
  useEffect(() => {
    const handleEnrollmentSuccess = (event: CustomEvent) => {
      console.log('🎯 Courses page: Received enrollment success event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
    };

    const handleForceRefresh = (event: CustomEvent) => {
      console.log('🎯 Courses page: Received force refresh event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
    };

    const handleEnrollmentStatusRefresh = (event: CustomEvent) => {
      console.log('🎯 Courses page: Received enrollment status refresh event:', event.detail);
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('enrollment-success', handleEnrollmentSuccess as EventListener);
    window.addEventListener('force-course-card-refresh', handleForceRefresh as EventListener);
    window.addEventListener('enrollment-status-refresh', handleEnrollmentStatusRefresh as EventListener);
    window.addEventListener('enrollment-created', handleEnrollmentSuccess as EventListener);

    return () => {
      window.removeEventListener('enrollment-success', handleEnrollmentSuccess as EventListener);
      window.removeEventListener('force-course-card-refresh', handleForceRefresh as EventListener);
      window.removeEventListener('enrollment-status-refresh', handleEnrollmentStatusRefresh as EventListener);
      window.removeEventListener('enrollment-created', handleEnrollmentSuccess as EventListener);
    };
  }, []);

  // Get course IDs for priority calculation
  const courseIds = useMemo(() => courses.map(course => course.id), [courses]);
  
  // Calculate course priorities based on enrollment status (reactive to refresh trigger)
  const { 
    coursePriorities, 
    loading: prioritiesLoading,
    sortedCourseIds,
    courseGroups
  } = useCoursePriorities(courseIds);

  // Sort courses based on priority calculation
  const prioritySortedCourses = useMemo(() => {
    if (!sortedCourseIds.length) return courses;
    
    // Create a map for quick course lookup
    const courseMap = new Map(courses.map(course => [course.id, course]));
    
    // Return courses in priority order, followed by any remaining courses
    const sortedCourses = sortedCourseIds
      .map(id => courseMap.get(id))
      .filter((course): course is NonNullable<typeof course> => Boolean(course));
    
    const remainingCourses = courses.filter(course => 
      !sortedCourseIds.includes(course.id)
    );
    
    const baseSorted = [...sortedCourses, ...remainingCourses];

    // Force all courses to show as available and avoid being filtered out
    const normalized = baseSorted.map((course) => ({
      ...(course as any),
      isComingSoon: false,
      available: true,
    }));

    // Pin selected courses to the top (in the user-specified order)
    const pinnedIndexById = new Map<string, number>();
    for (const course of normalized) {
      const idx = PINNED_COURSE_TITLES.indexOf(String(course.title || '').trim().toLowerCase());
      if (idx !== -1) {
        pinnedIndexById.set(course.id, idx);
      }
    }

    return normalized
      .slice()
      .sort((a, b) => {
        const ai = pinnedIndexById.has(a.id) ? (pinnedIndexById.get(a.id) as number) : Number.POSITIVE_INFINITY;
        const bi = pinnedIndexById.has(b.id) ? (pinnedIndexById.get(b.id) as number) : Number.POSITIVE_INFINITY;
        if (ai !== bi) return ai - bi;
        return 0;
      });
  }, [courses, sortedCourseIds]);

  // Get unique categories from courses and combine with predefined categories
  const categories = useMemo(() => {
    const dynamicCategories = courses.map(course => course.category);
    const predefinedCategories = Object.values(COURSE_CATEGORIES);
    const combinedCategories = [...new Set([...predefinedCategories, ...dynamicCategories])];
    return combinedCategories.sort();
  }, [courses]);

  // Filter courses based on horizontal filters
  const horizontallyFilteredCourses = useMemo(() => {
    return prioritySortedCourses.filter(course => {
      const matchesKeyword = !horizontalFilters.keyword || 
        course.title.toLowerCase().includes(horizontalFilters.keyword.toLowerCase()) ||
        course.description.toLowerCase().includes(horizontalFilters.keyword.toLowerCase());
      
      const matchesCategory = !horizontalFilters.category || course.category === horizontalFilters.category;
      
      const matchesAvailability = !horizontalFilters.availability || 
        (horizontalFilters.availability === 'available' && !course.isComingSoon) ||
        (horizontalFilters.availability === 'coming-soon' && course.isComingSoon);
      
      return matchesKeyword && matchesCategory && matchesAvailability;
    });
  }, [prioritySortedCourses, horizontalFilters]);

  const {
    setSearchFilters,
    filteredCourses,
    handleClearFilters
  } = useCourseFiltering(horizontallyFilteredCourses);

  // Wait for both courses and enrollments to load
  if ((loading || prioritiesLoading || enrollmentsLoading) && courses.length === 0) {
    return <CoursesLoadingState />;
  }
  
  // Debug logging (reduced)
  console.log('🎯 Courses page - Loading:', { coursesLoading: loading, prioritiesLoading, enrollmentsLoading });

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>

      {/* Sliding Filter Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-xs z-50 flex items-center transition-transform duration-500 ease-in-out ${filterOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} animate-filter-slide`}
        style={{ borderTopRightRadius: '2rem', borderBottomRightRadius: '2rem', pointerEvents: filterOpen ? 'auto' : 'none' }}
      >
        <div className="relative w-full h-[90vh] mx-2 my-auto flex flex-col justify-center items-center bg-white/70 backdrop-blur-2xl shadow-2xl border-0"
          style={{ borderTopRightRadius: '2rem', borderBottomRightRadius: '2rem', minWidth: '320px', maxWidth: '360px' }}
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-[2rem] pointer-events-none z-0 animate-gradient-border" style={{ border: '3px solid transparent', background: 'linear-gradient(120deg, #ff3c3c 0%, #ff7b7b 50%, #ff3c3c 100%)', opacity: 0.18 }} />
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-2xl font-bold focus:outline-none transition-colors duration-200 z-10 bg-white/70 rounded-full p-1 shadow-md"
            onClick={() => setFilterOpen(false)}
            aria-label="Close Filters"
          >
            ×
          </button>
          {/* Filter Content */}
          <div className="w-full flex flex-col items-center justify-center gap-6 px-6 py-8 z-10">
            <h2 className="text-lg font-bold text-red-700 mb-2 tracking-wide">Filter Courses</h2>
            <CourseFilters onFiltersChange={setSearchFilters} hideLevel hidePrice />
          </div>
        </div>
        <style>{`
          .animate-filter-slide {
            transition: transform 0.5s cubic-bezier(.4,2,.3,1), opacity 0.5s cubic-bezier(.4,2,.3,1);
          }
          .animate-gradient-border {
            background-size: 200% 200%;
            animation: gradientBorder 4s ease-in-out infinite alternate;
          }
          @keyframes gradientBorder {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
      {/* Simple background */}
      <div className="fixed inset-0 w-full h-full z-0 bg-gray-50" />
      <div className="relative z-10">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-6 py-8">
          <CoursesPageHeader />
          
          {/* Horizontal Course Filter */}
          <div className="mb-8">
            <CourseFilter 
              onFilterChange={setHorizontalFilters}
              categories={categories}
            />
          </div>
          
          {filteredCourses.length === 0 ? (
            <div className="animate-fade-in">
              <EmptyCoursesState onClearFilters={handleClearFilters} />
            </div>
          ) : (
            <div className="animate-slide-in-right delay-200">
              {/* Course Sections with Priority Indicators */}
              {user?.id && courseGroups && (
                <div className="mb-8">
                  {/* Enrolled Courses Section */}
                  {courseGroups.hasEnrolled && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-bold">My Enrolled Courses ({courseGroups.totalEnrolled})</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-green-400 to-transparent flex-1"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Pending Courses Section */}
                  {courseGroups.hasPending && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full shadow-lg">
                          <Clock className="w-5 h-5" />
                          <span className="font-bold">Pending Approval ({courseGroups.totalPending})</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1"></div>
                      </div>
                    </div>
                  )}

                  {/* Available Courses Section */}
                  {courseGroups.hasAvailable && (courseGroups.hasEnrolled || courseGroups.hasPending) && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg">
                          <span className="font-bold">Available Courses ({courseGroups.totalAvailable})</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-blue-400 to-transparent flex-1"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <CoursesGrid 
                courses={filteredCourses} 
                coursePriorities={coursePriorities || []}
                showPriorityIndicators={true}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
      </div>
      <style>{`
        .animate-bg-fade {
          animation: bgFadeIn 1.5s cubic-bezier(.4,2,.3,1);
        }
        @keyframes bgFadeIn {
          from { opacity: 0; filter: blur(8px); }
          to { opacity: 1; filter: blur(0); }
        }
      `}</style>
      

    </div>
  );
};

export default Courses;
