import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Bell, BookOpen, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, Search, Upload, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useBulletproofDashboard } from '@/hooks/useBulletproofDashboard';
import { filterRealEnrollments } from '@/utils/clearFakeData';
import globalDataRecovery from '@/utils/globalDataRecovery';

// Helper for animated confetti
// REMOVE Confetti component definition and all references to <Confetti />

const StudentDashboard = ({ profile, enrollments = [], courses = [], userId }: any) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    imageUrl: profile?.imageUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  // Use bulletproof dashboard hook for real user-specific data
  const {
    dashboardData,
    recentActivities,
    dashboardStats,
    isInitialized,
    updatePreferences,
  } = useBulletproofDashboard();
  
  // Use real enrollments hook to get latest data
  const { enrollments: enrollmentsFromHook } = useEnrollments();
  
  // Debug logging to see what data we have
  React.useEffect(() => {
    console.log('📊 Bulletproof Dashboard Data:', {
      isInitialized,
      dashboardData: !!dashboardData,
      recentActivities: recentActivities?.length || 0,
      userId,
      profile: profile?.email
    });
  }, [isInitialized, dashboardData, recentActivities, userId, profile]);

  // Listen for enrollment status updates to refresh data
  React.useEffect(() => {
    const handleEnrollmentStatusUpdate = (event: CustomEvent) => {
      console.log('🔄 Enrollment status update received in student dashboard:', event.detail);
      // Force refresh of enrollment data
      window.location.reload();
    };

    window.addEventListener('enrollment-status-updated', handleEnrollmentStatusUpdate as EventListener);
    
    return () => {
      window.removeEventListener('enrollment-status-updated', handleEnrollmentStatusUpdate as EventListener);
    };
  }, []);
  
  // Use ONLY real enrollments from the database - filter out any fake data
  const userEnrollments = filterRealEnrollments(enrollmentsFromHook || []);

  // Get actual student name with better fallbacks
  const studentName = React.useMemo(() => {
    // Use bulletproof data if available
    if (dashboardData?.profile?.first_name && dashboardData?.profile?.last_name) {
      return `${dashboardData.profile.first_name} ${dashboardData.profile.last_name}`;
    }
    if (dashboardData?.profile?.first_name) {
      return dashboardData.profile.first_name;
    }
    
    // Fallback to profile data
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (profile?.email) {
      const emailName = profile.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[._]/g, ' ');
    }
    return 'Student';
  }, [dashboardData, profile]);

  // Map ONLY real enrollments to course progress and completion
  const enrolledCourses = userEnrollments.map((enrollment: any) => {
    const course = courses.find((c: any) => c.id === enrollment.course_id || c.id === enrollment.id);
    const progress = Math.round((enrollment.progress || 0)); // Already in percentage
    const courseModules = course?.modules;
    const totalLessons = Array.isArray(courseModules)
      ? courseModules.reduce((acc: number, m: any) => acc + (m?.lessons?.length || 0), 0)
      : undefined;

    const completedLessonsCount = dashboardData?.courseProgress?.[course?.id || enrollment.course_id || enrollment.id]?.completedLessons?.length;

    return {
      id: course?.id || enrollment.course_id || enrollment.id,
      title: course?.title || enrollment.course_title || enrollment.title || 'Untitled Course',
      progress: progress,
      completed: progress >= 100,
      level: course?.level,
      totalLessons,
      completedLessonsCount,
      certificateUrl: enrollment.certificate_url || enrollment.certificateUrl || '#',
      status: enrollment.status,
      enrolled_at: enrollment.enrolled_at,
      last_accessed: enrollment.last_accessed,
      timeSpent: enrollment.timeSpent || 0,
    };
  });

  // Calculate overall progress based on real enrollments only
  const overallProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
    : 0;

  // Use ONLY real activities from bulletproof system - no mock activities
  const activities = recentActivities || [];

  const pendingEnrollmentsCount = userEnrollments.filter((e: any) => e?.status === 'pending').length;

  const computedStats = dashboardStats || {
    totalCourses: enrolledCourses.length,
    completedCourses: enrolledCourses.filter((c) => c.completed).length,
    inProgressCourses: enrolledCourses.filter((c) => !c.completed && c.progress > 0).length,
    averageProgress: overallProgress,
    totalTimeSpent: enrolledCourses.reduce((acc, c) => acc + (c.timeSpent || 0), 0),
    totalActivities: activities.length,
    lastLogin: dashboardData?.session?.lastLogin,
    totalSessions: dashboardData?.session?.totalSessions,
  };

  const inferredLevel = (() => {
    const completed = computedStats.completedCourses || 0;
    if (completed >= 5) return 'Advanced';
    if (completed >= 2) return 'Intermediate';
    return 'Beginner';
  })();

  const averageQuizScore = (() => {
    const progressByCourse = dashboardData?.courseProgress || {};
    const scores: number[] = [];
    Object.values(progressByCourse).forEach((p: any) => {
      const quizScores = p?.quizScores || {};
      Object.values(quizScores).forEach((s) => {
        if (typeof s === 'number' && Number.isFinite(s)) scores.push(s);
      });
    });
    if (!scores.length) return 0;
    return Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length);
  })();

  const studyProcess = {
    engage: computedStats.totalCourses > 0 ? Math.round((computedStats.inProgressCourses / computedStats.totalCourses) * 100) : 0,
    grow: computedStats.totalCourses > 0 ? Math.round(((computedStats.totalCourses - computedStats.completedCourses) / computedStats.totalCourses) * 100) : 0,
    skills: computedStats.averageProgress || 0,
    rate: averageQuizScore,
  };

  const handleAvatarUpload = async (file: File) => {
    if (!userId) {
      setError('Unable to upload: missing user id.');
      return;
    }

    setError('');
    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (!data?.publicUrl) {
        throw new Error('Could not get a public URL for uploaded image.');
      }

      setEditProfile((p: any) => ({ ...p, imageUrl: data.publicUrl }));
    } catch (e: any) {
      setError(e?.message || 'Failed to upload profile image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save profile changes to Supabase and bulletproof system
  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editProfile.first_name,
          last_name: editProfile.last_name,
          imageUrl: editProfile.imageUrl,
        })
        .eq('id', userId);

      if (error) throw error;

      // Update in bulletproof system
      if (dashboardData) {
        await updatePreferences({
          lastDashboardView: 'profile_updated',
        });
      }

      setShowProfileModal(false);
    } catch (e) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };



  // Animation variants
  const fadeSlideIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
    exit: { opacity: 0, y: 40, transition: { duration: 0.4, ease: 'easeIn' } },
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f7f8fb]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeSlideIn}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div className="flex items-center justify-between gap-4" variants={fadeIn}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-gray-900" />
            </div>
            <div className="font-semibold text-gray-900">Beta Skills</div>
          </div>

          <div className="hidden md:flex items-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 px-2 py-1">
            <Link to="/courses" className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              All courses
            </Link>
            <Link to="/dashboard" className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white">
              Dashboard
            </Link>
            <button className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900" type="button">
              Support
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200" type="button">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200" type="button">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button
              className="inline-flex items-center gap-3 rounded-full bg-white shadow-sm ring-1 ring-gray-200 pl-2 pr-3 py-1"
              type="button"
              onClick={() => setShowProfileModal(true)}
            >
              {profile?.imageUrl ? (
                <img src={profile.imageUrl} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-900 to-gray-500 flex items-center justify-center text-white font-semibold">
                  {profile?.first_name ? profile.first_name[0].toUpperCase() : 'S'}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-gray-900">{studentName}</span>
            </button>
          </div>
        </motion.div>

        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in-up">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowProfileModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Profile</h2>
              <div className="flex flex-col items-center gap-4 mb-4">
                {editProfile.imageUrl ? (
                  <img src={editProfile.imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 to-gray-500 flex items-center justify-center text-white font-bold text-3xl">
                    {editProfile.first_name ? editProfile.first_name[0].toUpperCase() : 'S'}
                  </div>
                )}
                <label className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingAvatar || saving}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleAvatarUpload(file);
                    }}
                  />
                  <div
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer ${
                      uploadingAvatar ? 'opacity-60' : ''
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingAvatar ? 'Uploading...' : 'Upload profile picture'}
                  </div>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editProfile.first_name}
                  onChange={e => setEditProfile({ ...editProfile, first_name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editProfile.last_name}
                  onChange={e => setEditProfile({ ...editProfile, last_name: e.target.value })}
                />
              </div>
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              <div className="space-y-3">
                <Button className="w-full" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={async () => {
                    if (profile?.email) {
                      const wasRecovered = await globalDataRecovery.forceRecovery(profile.email);
                      if (wasRecovered) {
                        alert('✅ Data recovered successfully! Page will reload...');
                        setTimeout(() => window.location.reload(), 1000);
                      } else {
                        alert('❌ No data to recover or recovery failed');
                      }
                    }
                  }}
                  disabled={saving}
                >
                  🔄 Recover Data
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.section className="lg:col-span-4" variants={fadeIn}>
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-gray-900">Statistic</div>
                <Link to="/courses" className="text-xs font-medium text-gray-600 hover:text-gray-900">View all</Link>
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="relative">
                  {profile?.imageUrl ? (
                    <img src={profile.imageUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100" />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-900 to-gray-500 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-gray-100">
                      {profile?.first_name ? profile.first_name[0].toUpperCase() : 'S'}
                    </div>
                  )}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    {inferredLevel}
                  </div>
                </div>

                <div className="mt-6 text-xl font-semibold text-gray-900">Welcome, {studentName}</div>

                <div className="mt-6 w-full">
                  <div className="flex items-baseline gap-3">
                    <div className="text-4xl font-bold text-gray-900">{overallProgress}%</div>
                    <div className="text-sm text-gray-500">Total month activity</div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-1.5 rounded-full bg-pink-300" />
                    <div className="h-1.5 rounded-full bg-yellow-300" />
                    <div className="h-1.5 rounded-full bg-red-500" />
                  </div>
                </div>

                <div className="mt-6 grid w-full grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-4">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-gray-900">
                      {computedStats.inProgressCourses}
                    </div>
                    <div className="text-xs text-gray-500">In progress</div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-4">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-gray-900">
                      {pendingEnrollmentsCount}
                    </div>
                    <div className="text-xs text-gray-500">Upcoming</div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-4">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-gray-900">
                      {computedStats.completedCourses}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>

                <div className="mt-6 w-full rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-4 text-left">
                  <div className="text-sm font-semibold text-gray-900">Quick links</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link to="/courses" className="inline-flex items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      Browse courses
                    </Link>
                    <Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      My dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section className="lg:col-span-8" variants={fadeIn}>
            <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-800 to-black p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-semibold text-white">Your courses</div>
                  <div className="mt-1 text-sm text-white/80">Continue where you left off</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white" type="button">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white" type="button">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <Link to="/courses" className="ml-2 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                    View all
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                {(enrolledCourses.length ? enrolledCourses : [{ id: 'empty', title: 'Browse courses', progress: 0 }]).slice(0, 8).map((course: any) => (
                  <div key={course.id} className="min-w-[260px] max-w-[260px] rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-gray-900 line-clamp-2">{course.title}</div>
                      <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {course.progress}%
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      {course.level ? (
                        <div className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-700">{course.level}</div>
                      ) : null}
                      {typeof course.totalLessons === 'number' ? (
                        <div className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-700">
                          {typeof course.completedLessonsCount === 'number' ? `${course.completedLessonsCount}/${course.totalLessons} lessons` : `${course.totalLessons} lessons`}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <div className="text-2xl font-bold text-gray-900">{course.progress}%</div>
                      <div className="text-xs text-gray-500">completed</div>
                      <div className="mt-3">
                        <Progress value={course.progress} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {course.id !== 'empty' ? (
                        <Link to={`/course/${course.id}`} className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white">
                          Continue
                        </Link>
                      ) : (
                        <Link to="/courses" className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white">
                          Browse
                        </Link>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-4 w-4" />
                        Mentor
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-gray-900">Study process</div>
                    <div className="text-sm text-gray-500">Weekly overview</div>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    Week
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-3 items-end">
                  {[{ label: 'Engage', value: studyProcess.engage }, { label: 'Grow', value: studyProcess.grow }, { label: 'Skills', value: studyProcess.skills }, { label: 'Rate', value: studyProcess.rate }].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2">
                      <div className="relative w-full max-w-[90px]">
                        <div className="h-32 rounded-2xl bg-gray-100" />
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-2xl bg-gradient-to-t from-red-700 to-black"
                          style={{ height: `${Math.min(100, Math.max(0, item.value))}%` }}
                        />
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-900 ring-1 ring-gray-200">
                          {item.value}%
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 p-6 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-gray-900">Recent activity</div>
                    <div className="text-sm text-gray-500">Latest updates</div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {activities.slice(0, 6).length ? (
                    activities.slice(0, 6).map((a: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl bg-white ring-1 ring-gray-100 px-3 py-2">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-800 line-clamp-1">{a.title || a.type || 'Activity'}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{a.description || ''}</div>
                        </div>
                        <div className="text-[10px] text-gray-500">{a.timestamp ? new Date(a.timestamp).toLocaleDateString() : ''}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500">No recent activity yet.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
