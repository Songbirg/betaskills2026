import { useState, useMemo, useEffect } from 'react';
import { useCoursesContext } from '@/hooks/CoursesContext';
import { useCourseFiltering } from '@/hooks/useCourseFiltering';
import { useCoursePriorities } from '@/hooks/useCoursePriorities';
import { useEnrollments } from '@/hooks/EnrollmentContext';
import Footer from '@/components/Footer';
import CoursesGrid from '@/components/courses/CoursesGrid';
import EmptyCoursesState from '@/components/courses/EmptyCoursesState';
import CoursesLoadingState from '@/components/courses/CoursesLoadingState';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

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
  const { isLoading: enrollmentsLoading } = useEnrollments();
  const [, setRefreshTrigger] = useState(0);
  const [courseView, setCourseView] = useState<'available' | 'enrolled' | 'pending'>('available');

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
    // If priorities haven't loaded yet (or user isn't enrolled in anything),
    // still apply the pinned order + forced-last rules.
    let baseSorted = courses;

    if (sortedCourseIds.length) {
      // Create a map for quick course lookup
      const courseMap = new Map(courses.map(course => [course.id, course]));
      
      // Return courses in priority order, followed by any remaining courses
      const sortedCourses = sortedCourseIds
        .map(id => courseMap.get(id))
        .filter((course): course is NonNullable<typeof course> => Boolean(course));
      
      const remainingCourses = courses.filter(course => 
        !sortedCourseIds.includes(course.id)
      );

      baseSorted = [...sortedCourses, ...remainingCourses];
    }

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
        const aIsForcedLast = a.id === 'ai-human-relations';
        const bIsForcedLast = b.id === 'ai-human-relations';
        if (aIsForcedLast !== bIsForcedLast) return aIsForcedLast ? 1 : -1;

        const ai = pinnedIndexById.has(a.id) ? (pinnedIndexById.get(a.id) as number) : Number.POSITIVE_INFINITY;
        const bi = pinnedIndexById.has(b.id) ? (pinnedIndexById.get(b.id) as number) : Number.POSITIVE_INFINITY;
        if (ai !== bi) return ai - bi;
        return 0;
      });
  }, [courses, sortedCourseIds]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const c of courses) {
      if (c?.category) set.add(String(c.category));
    }
    return Array.from(set).sort();
  }, [courses]);

  const { searchFilters, setSearchFilters, filteredCourses, handleClearFilters } = useCourseFiltering(prioritySortedCourses as any);

  const enrolledSet = useMemo(() => new Set(courseGroups?.enrolled?.map((c: any) => c.courseId) || []), [courseGroups]);
  const pendingSet = useMemo(() => new Set(courseGroups?.pending?.map((c: any) => c.courseId) || []), [courseGroups]);
  const availableSet = useMemo(() => new Set(courseGroups?.available?.map((c: any) => c.courseId) || []), [courseGroups]);

  const viewFilteredCourses = useMemo(() => {
    const ids =
      courseView === 'enrolled'
        ? enrolledSet
        : courseView === 'pending'
          ? pendingSet
          : availableSet;
    if (courseView === 'available' && ids.size === 0) return filteredCourses;
    return filteredCourses.filter((c: any) => ids.has(c.id));
  }, [filteredCourses, courseView, enrolledSet, pendingSet, availableSet]);

  const viewCounts = useMemo(() => {
    const available = courseGroups?.totalAvailable ?? (availableSet.size || filteredCourses.length);
    const enrolled = courseGroups?.totalEnrolled ?? enrolledSet.size;
    const pending = courseGroups?.totalPending ?? pendingSet.size;
    return { available, enrolled, pending };
  }, [courseGroups, availableSet, enrolledSet, pendingSet, filteredCourses.length]);

  // Wait for both courses and enrollments to load
  if ((loading || prioritiesLoading || enrollmentsLoading) && courses.length === 0) {
    return <CoursesLoadingState />;
  }
  
  // Debug logging (reduced)
  console.log('🎯 Courses page - Loading:', { coursesLoading: loading, prioritiesLoading, enrollmentsLoading });

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      {/* Simple background */}
      <div className="fixed inset-0 w-full h-full z-0 bg-gray-50" />
      <div className="relative z-10">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCourseView('available')}
                  className={`group relative overflow-hidden inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 shadow-sm ring-1 ${
                    courseView === 'available'
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white ring-black/10 shadow-md'
                      : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-all ${
                    courseView === 'available'
                      ? 'bg-white/15 ring-white/20'
                      : 'bg-red-50 ring-red-100 group-hover:bg-red-100'
                  }`}
                  >
                    <span className={`${courseView === 'available' ? 'text-white' : 'text-red-600'}`}>📚</span>
                  </span>
                  <span>Available Courses</span>
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${courseView === 'available' ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-700'}`}>{viewCounts.available}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourseView('enrolled')}
                  className={`group relative overflow-hidden inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 shadow-sm ring-1 ${
                    courseView === 'enrolled'
                      ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white ring-black/10 shadow-md'
                      : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-all ${
                    courseView === 'enrolled'
                      ? 'bg-white/15 ring-white/20'
                      : 'bg-indigo-50 ring-indigo-100 group-hover:bg-indigo-100'
                  }`}
                  >
                    <span className={`${courseView === 'enrolled' ? 'text-white' : 'text-indigo-600'}`}>✅</span>
                  </span>
                  <span>Enrolled Courses</span>
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${courseView === 'enrolled' ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-700'}`}>{viewCounts.enrolled}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourseView('pending')}
                  className={`group relative overflow-hidden inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 shadow-sm ring-1 ${
                    courseView === 'pending'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white ring-black/10 shadow-md'
                      : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-all ${
                    courseView === 'pending'
                      ? 'bg-white/15 ring-white/20'
                      : 'bg-amber-50 ring-amber-100 group-hover:bg-amber-100'
                  }`}
                  >
                    <span className={`${courseView === 'pending' ? 'text-white' : 'text-amber-700'}`}>⏳</span>
                  </span>
                  <span>Pending Approval</span>
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${courseView === 'pending' ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-700'}`}>{viewCounts.pending}</span>
                </button>
              </div>

              <div className="w-full lg:w-auto">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 px-4 py-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={searchFilters.search}
                        onChange={(e) => setSearchFilters((prev) => ({ ...prev, search: e.target.value }))}
                        placeholder="Search courses..."
                        className="pl-10 rounded-xl"
                      />
                    </div>

                    <div className="min-w-[220px]">
                      <select
                        value={searchFilters.category || 'all'}
                        onChange={(e) => setSearchFilters((prev) => ({ ...prev, category: e.target.value === 'all' ? '' : e.target.value }))}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {(searchFilters.search || searchFilters.category) && (
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 ring-1 ring-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {viewFilteredCourses.length === 0 ? (
            <div className="animate-fade-in">
              <EmptyCoursesState onClearFilters={handleClearFilters} />
            </div>
          ) : (
            <div className="animate-slide-in-right delay-200">
              <CoursesGrid 
                courses={viewFilteredCourses} 
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
