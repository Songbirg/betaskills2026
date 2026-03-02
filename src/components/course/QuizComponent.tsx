import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Download
} from 'lucide-react';
import type { QuizLesson } from '@/types/course';
import { useModuleScores } from '@/hooks/useModuleScores';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useParams } from 'react-router-dom';
import { useCourseCompletion } from '@/hooks/useCourseCompletion';
import { useCourseData } from '@/hooks/useCourseData';
import { useAuth } from '@/hooks/AuthContext';

interface QuizComponentProps {
  lesson: QuizLesson;
  onComplete: () => void;
  onNext: () => void;
  moduleId: number;
  lessonId: number;
  courseId?: string | undefined; // Add courseId as optional prop for reliability
}

const QuizComponent = ({ lesson, onComplete, onNext, moduleId, lessonId, courseId: propCourseId }: QuizComponentProps) => {
  const { courseId: paramCourseId } = useParams<{ courseId: string }>();
  // Use prop courseId first, then param, for maximum reliability
  const courseId = propCourseId || paramCourseId;
  const { user, profile } = useAuth(); // Get current user and profile for admin bypass
  const { submitScore, scores, getGradeColor, fetchScores, fetchCourseSummary } = useModuleScores(courseId);
  const { saveQuizScore, markLessonCompleted } = useUserProgress(courseId);
  const { course } = useCourseData(courseId || '');
  useCourseCompletion(course);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(lesson.content.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Quiz state management
  const [passedQuiz, setPassedQuiz] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState(lesson.content.questions);
  const [attemptCount, setAttemptCount] = useState(0);
  const [countdown, setCountdown] = useState(2);

  // 70% pass mark for ALL courses
  const PASS_MARK = 70;

  // Debug admin bypass
  const userEmail = user?.email || profile?.email;
  const isAdminUser = userEmail === 'john.doe@gmail.com' || userEmail === 'maxmon@gmail.com';
  
  // FORCE ADMIN BYPASS FOR admin users - PERMANENT FIX
  const forceAdminBypass = userEmail === 'john.doe@gmail.com' || userEmail === 'maxmon@gmail.com';

  const canProceed = score >= PASS_MARK || isAdminUser || forceAdminBypass;

  const moduleIndex = course?.modules?.findIndex((m) => m.id === moduleId) ?? -1;
  const lessonIndexInModule =
    moduleIndex >= 0
      ? (course?.modules?.[moduleIndex]?.lessons?.findIndex((l) => l.id === lessonId) ?? -1)
      : -1;
  const isModuleQuiz = lesson?.type === 'quiz';
  const isLastLessonInModule =
    moduleIndex >= 0 &&
    lessonIndexInModule >= 0 &&
    lessonIndexInModule === (course?.modules?.[moduleIndex]?.lessons?.length ?? 0) - 1;
  const hasNextModule = moduleIndex >= 0 && moduleIndex < (course?.modules?.length ?? 0) - 1;
  const canGoToNextModule =
    isModuleQuiz &&
    canProceed &&
    isLastLessonInModule &&
    hasNextModule;

  const handleGoToNextModule = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onComplete();
  };
  
  console.log('🔍 Admin bypass debug:', {
    userEmail,
    profileEmail: profile?.email,
    userEmailFromUser: user?.email,
    isAdmin: isAdminUser,
    user: user,
    profile: profile
  });

  const questions = randomizedQuestions;
  const currentQ = questions[currentQuestion] || questions[0];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Function to randomize questions for retry
  const randomizeQuestions = () => {
    const shuffled = [...lesson.content.questions].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffled);
    console.log('🔄 Questions randomized for retry attempt');
  };

  const submitQuiz = async () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++;
      }
    });
    
    const percentage = (correctCount / questions.length) * 100;
    const scorePoints = correctCount;
    const totalPoints = questions.length;
    
    setScore(percentage);
    setShowResults(true);
    setQuizCompleted(true);
    setAttemptCount(prev => prev + 1);
    
    // ALWAYS submit the score first (regardless of pass/fail)
        if (courseId && moduleId !== undefined && lessonId !== undefined) {
          try {
        console.log('🎯 Submitting quiz score:', {
          moduleId,
          lessonId,
          correctCount,
          totalQuestions: questions.length,
          scorePoints,
          totalPoints,
          percentage
        });
        
          const scoreSubmitted = await submitScore(moduleId, lessonId, scorePoints, totalPoints);
          
          if (scoreSubmitted) {
            console.log('✅ Score submitted successfully');
            await fetchScores();
            await fetchCourseSummary();
            console.log('✅ Scores refreshed successfully');
          } else {
            console.error('❌ Failed to submit score');
          }
        } catch (error) {
          console.error('❌ Error during quiz submission:', error);
      }
    }
    
    // Check if user is admin (john.doe@gmail.com) - allow bypass
    // Use the isAdminUser from component scope
    
    console.log('🎯 Quiz submission debug:', {
      percentage,
      PASS_MARK,
      isAdminUser,
      userEmail: user?.email,
      passedByScore: percentage >= PASS_MARK,
      passedByAdmin: isAdminUser
    });
    
      // Check if user passed the quiz (70% or higher) OR is admin user
  const hasPassed = percentage >= PASS_MARK;
  const isAdmin = isAdminUser || forceAdminBypass;
    
    console.log('🎯 Final pass check:', {
      percentage,
      PASS_MARK,
      hasPassed,
      isAdmin,
      userEmail,
      finalResult: hasPassed || isAdmin
    });
    
    if (hasPassed || isAdmin) {
      setPassedQuiz(true);
      
              if (isAdmin) {
          console.log(`🔓 Admin bypass! Score: ${percentage}% (Admin: ${userEmail})`);
        } else {
          console.log(`✅ Quiz passed! Score: ${percentage}% (Required: ${PASS_MARK}%)`);
        }
      
      // Only mark as completed if passed OR admin user
      if (courseId && moduleId !== undefined && lessonId !== undefined) {
        try {
          await saveQuizScore(moduleId, lessonId, percentage);
          await markLessonCompleted(moduleId, lessonId);
          console.log('✅ Progress saved successfully');
        } catch (error) {
          console.error('❌ Error saving progress:', error);
        }
      }
      
      // Auto-progress when quiz is passed (70% or more)
      console.log('🚀 Auto-advancing to next lesson...');
      
      // Start countdown
      let timeLeft = 2;
      setCountdown(timeLeft);
      
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          onComplete(); // Automatically move to next lesson
        }
      }, 1000);
    } else {
      // Quiz failed - don't allow progression
      setPassedQuiz(false);
      console.log(`❌ Quiz failed! Score: ${percentage}% (Required: ${PASS_MARK}%)`);
      
      // Don't mark as completed or allow progression
      // User must retry the quiz
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setQuizCompleted(false);
    setScore(0);
    setPassedQuiz(false);
    setCountdown(2); // Reset countdown
    
    // Randomize questions for ALL courses on retry
    if (attemptCount > 0) {
      randomizeQuestions();
    }
  };

  const handleDownloadCertificate = () => {
    if (!course) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const certificateImg = new Image();
    certificateImg.crossOrigin = 'anonymous';

    certificateImg.onload = () => {
      canvas.width = certificateImg.width;
      canvas.height = certificateImg.height;
      ctx.drawImage(certificateImg, 0, 0);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const studentName = (() => {
        if (profile?.first_name && profile?.last_name) {
          return `${profile.first_name} ${profile.last_name}`;
        } else if (user?.user_metadata?.full_name) {
          return user.user_metadata.full_name;
        } else if (user?.email) {
          return user.email.split('@')[0];
        }
        return 'Student';
      })();

      ctx.font = 'bold 72px "Times New Roman", serif';
      ctx.fillStyle = '#1a365d';
      ctx.fillText(studentName, canvas.width / 2, canvas.height * 0.42);

      ctx.font = 'bold 48px "Times New Roman", serif';
      ctx.fillStyle = '#2d3748';
      ctx.fillText(course.title, canvas.width / 2, canvas.height * 0.55);

      ctx.font = '36px "Times New Roman", serif';
      ctx.fillStyle = '#4a5568';
      ctx.fillText(
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        canvas.width / 2,
        canvas.height * 0.75
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;

          const cleanName = studentName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
          const cleanCourse = course.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
          a.download = `Certificate_${cleanCourse}_${cleanName}.png`;

          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
    };

    certificateImg.onerror = () => {
      alert('Failed to generate certificate. Please try again.');
    };

    certificateImg.src = '/beta-skill-certificate-template.png';
  };

  const allAnswered = answers.every(answer => answer !== null);
  const currentAnswerSelected = answers[currentQuestion] !== null;

  // Remove the problematic useEffect that causes infinite re-renders
  // useEffect(() => {
  //   setRefreshKey(prev => prev + 1);
  // }, [scores]);

  if (showResults) {
    // Debug logging for quiz state
    console.log('🔍 Quiz Results State Debug:', {
      score,
      PASS_MARK,
      passedQuiz,
      isAdminUser,
      userEmail: user?.email,
      shouldShowFailed: !passedQuiz && score > 0 && score < PASS_MARK,
      shouldShowPassed: passedQuiz && score >= PASS_MARK,
      shouldShowAdminBypass: isAdminUser && score > 0 && score < PASS_MARK && passedQuiz
    });
    
    // Filter past attempts for this module/lesson
    const pastAttempts = scores.filter(
      (s) => s.module_id === moduleId && s.lesson_id === lessonId
    );
    const latestAttempt = pastAttempts[0];
    
    // Module score for this module - FIXED CALCULATION
    const moduleScores = scores.filter(s => s.module_id === moduleId);
    const totalScore = moduleScores.reduce((sum, s) => sum + s.score, 0);
    const totalPoints = moduleScores.reduce((sum, s) => sum + s.total_points, 0);
    const percentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    
    // Debug logging
    console.log('🎯 Quiz Results Debug:', {
      moduleId,
      lessonId,
      pastAttempts: pastAttempts.length,
      latestAttempt,
      moduleScores: moduleScores.length,
      totalScore,
      totalPoints,
      percentage,
      grade,
      allScores: scores,
      scoresLength: scores.length
    });

    const shouldShowCertificate = !!course && (() => {
      // BULLETPROOF COMPLETION DETECTION
      const allLessons = course.modules.flatMap(m => m.lessons);
      const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
      const isLastLessonOverall = currentLessonIndex === allLessons.length - 1;

      const totalModules = course.modules.length;
      const lastModuleIndex = totalModules - 1;
      const lastModule = course.modules[lastModuleIndex];
      const isLastModule = lastModule ? moduleId === lastModule.id : false;
      const isLastLessonOfLastModule = lastModule && lastModule.lessons && lastModule.lessons.length > 0
        ? lessonId === lastModule.lessons[lastModule.lessons.length - 1]?.id
        : false;

      const allQuizzes = allLessons.filter(l => l.type === 'quiz');
      const currentQuizIndex = allQuizzes.findIndex(q => q.id === lessonId);
      const isLastQuiz = currentQuizIndex === allQuizzes.length - 1;

      const isFinalQuiz = isLastLessonOverall || (isLastModule && isLastLessonOfLastModule) || isLastQuiz;

      console.log('🎓 CERTIFICATE DEBUG:', {
        courseId: course.id,
        courseTitle: course.title,
        moduleId,
        lessonId,
        totalModules,
        lastModuleIndex,
        lastModuleId: lastModule?.id,
        isLastModule,
        isLastLessonOfLastModule,
        currentLessonIndex,
        totalLessons: allLessons.length,
        isLastLessonOverall,
        totalQuizzes: allQuizzes.length,
        currentQuizIndex,
        isLastQuiz,
        isFinalQuiz,
        showResults,
        passedQuiz
      });

      return isFinalQuiz;
    })();

    const displayStudentName = (() => {
      if (profile?.first_name && profile?.last_name) {
        return `${profile.first_name} ${profile.last_name}`;
      } else if (user?.user_metadata?.full_name) {
        return user.user_metadata.full_name;
      } else if (user?.email) {
        return user.email.split('@')[0];
      }
      return 'Student';
    })();

    const completionDateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Flex row for percentage widget and module score */}
        <div className="flex flex-col md:flex-row md:items-stretch md:gap-8 w-full justify-center">
          {/* Dynamic Score Widget (centered, replaces old percentage text) */}
          {latestAttempt && (
            <div className="flex justify-center mb-2 md:mb-0">
              <div className="relative w-[220px] h-[220px] bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-2xl border border-blue-200/40 dark:border-blue-900/40 backdrop-blur-lg glassmorphism-card group hover:scale-105 transition-transform duration-300 animate-fade-in">
                {/* Animated Circular Progress */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="95" fill="#f3f4f6" />
                  <circle
                    cx="110" cy="110" r="95" fill="none"
                    stroke="url(#score-gradient)"
                    strokeWidth="18"
                    strokeDasharray={2 * Math.PI * 95}
                    strokeDashoffset={2 * Math.PI * 95 * (1 - (latestAttempt.percentage / 100))}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-in-out"
                    style={{ filter: 'drop-shadow(0 0 16px #a5b4fc)' }}
                  />
                  <defs>
                    <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a21caf" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Animated Percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 animate-pulse">
                    {Math.round(latestAttempt.percentage)}%
                  </span>
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-200 mt-2 animate-fade-in">Score</span>
                  <span className={`mt-3 px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(latestAttempt.grade)} animate-bounce`}>{latestAttempt.grade}</span>
                  <span className="text-xs text-gray-500 mt-2 animate-fade-in">Attempt #{pastAttempts.length}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Failed Quiz Message for ALL courses */}
          {score > 0 && score < PASS_MARK && !isAdminUser && (
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-2xl max-w-md text-center mx-4">
                <div className="flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 mr-2 sm:mr-3" />
                  <h3 className="text-xl sm:text-2xl font-bold">❌ Quiz Failed</h3>
                </div>
                <p className="text-base sm:text-lg mb-3 sm:mb-4">
                  You scored <strong>{Math.round(score)}%</strong> but need <strong>70%</strong> to pass.
                </p>
                <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
                  Please review the incorrect answers below and try again.
                </p>
                <div className="text-xs opacity-75">
                  Questions will be randomized on your next attempt.
                </div>
              </div>
            </div>
          )}
          
          {/* Quiz Passed Success Message */}
          {score >= PASS_MARK && (
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-2xl max-w-md text-center mx-4">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 mr-2 sm:mr-3" />
                  <h3 className="text-xl sm:text-2xl font-bold">✅ Quiz Passed!</h3>
                </div>
                <p className="text-base sm:text-lg mb-3 sm:mb-4">
                  Congratulations! You scored <strong>{Math.round(score)}%</strong> and passed the quiz.
                </p>
                <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
                  You can now proceed to the next module.
                </p>
                <div className="text-xs opacity-75 animate-pulse">
                  🚀 Auto-advancing to next lesson in {countdown} second{countdown !== 1 ? 's' : ''}...
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Bypass Notification for john.doe@gmail.com */}
          {isAdminUser && score > 0 && score < PASS_MARK && (
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-6 rounded-2xl shadow-2xl max-w-md text-center">
                <div className="flex items-center justify-center mb-3">
                  <Trophy className="w-8 h-8 text-yellow-300 mr-3" />
                  <h3 className="text-2xl font-bold">🔓 Admin Bypass</h3>
                </div>
                <p className="text-lg mb-4">
                  You scored <strong>{Math.round(score)}%</strong> but can proceed as admin.
                </p>
                <p className="text-sm opacity-90 mb-4">
                  Use the purple "Admin Bypass" button below to continue.
                </p>
                <div className="text-xs opacity-75">
                  This bypass is only available for john.doe@gmail.com
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Course Completion with Certificate - ALWAYS shows after FINAL quiz */}
        {shouldShowCertificate && (
          <div className="mt-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl max-w-lg text-center">
                <div className="flex items-center justify-center mb-3">
                  <Trophy className="w-8 h-8 text-yellow-300 mr-3" />
                  <h3 className="text-2xl font-bold">🎉 Final Quiz Complete!</h3>
                </div>
                <p className="text-lg mb-2">
                  {canProceed
                    ? `Congratulations! You've successfully completed ${course.title}`
                    : `You've completed the final quiz for ${course.title}`}
                </p>
                <p className="text-sm opacity-90">
                  {canProceed
                    ? 'Your certificate is ready. Use the button below to download it.'
                    : 'Pass this quiz with 70%+ to unlock your certificate download.'}
                </p>
                <div className="mt-4">
                  {canProceed ? (
                    <Button
                      onClick={handleDownloadCertificate}
                      className="bg-white text-blue-700 hover:bg-white/90 px-6 py-3 rounded-lg inline-flex items-center gap-2 text-base font-bold"
                    >
                      <Download className="w-5 h-5" />
                      Download Certificate
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="bg-white/50 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 text-base font-bold cursor-not-allowed opacity-70"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Download Locked
                    </Button>
                  )}
                </div>
                <p className="mt-3 text-xs opacity-90">
                  {displayStudentName} - {completionDateStr}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 animate-fade-in">
          
          {/* Try Again Button - always show */}
          <Button
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            Try Again
          </Button>
          
          {/* Mark as Complete Button - show based on pass/fail status or admin bypass */}
          {canProceed ? (
            <Button
              onClick={onComplete}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 rounded-full text-white font-bold shadow-lg transition-all duration-200 focus:outline-none text-sm sm:text-base ${
                isAdminUser && score < PASS_MARK
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-400'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-400'
              }`}
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                              {isAdminUser && score < PASS_MARK 
                  ? '🔓 Admin Bypass - Continue' 
                  : '✨ Auto-Advancing...'
                }
            </Button>
          ) : (
            <Button
              disabled
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 rounded-full bg-gray-400 text-white font-bold shadow-lg cursor-not-allowed opacity-50 text-sm sm:text-base"
            >
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              ❌ Must Score 70%+ to Continue
            </Button>
          )}

          {canGoToNextModule && (
            <Button
              onClick={handleGoToNextModule}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              Go to Next Module
            </Button>
          )}
        </div>
        {/* Answer Review */}
        <Card className="animate-fade-in transition-all duration-200 hover:shadow-xl hover:scale-[1.015]" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle>
              {!canProceed ? 'Quiz Results' : 'Answer Review'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.01] animate-fade-in" style={{ animationDelay: `${0.1 * qIndex}s` }}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center animate-scale-in">
                    {qIndex + 1}
                  </span>
                  {question.question}
                </h4>
                <div className="space-y-2 mb-3">
                  {question.options.map((option, oIndex) => {
                    const isCorrect = oIndex === question.correct;
                    const isSelected = answers[qIndex] === oIndex;
                    const isWrong = isSelected && !isCorrect;
                    
                    // For failed quizzes, only show wrong answers to help learning
                    if (!canProceed && isCorrect && !isSelected) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={oIndex}
                        className={`p-2 rounded border transition-all duration-200 hover:shadow-sm hover:scale-[1.01] ${
                          !canProceed
                            ? isWrong
                              ? 'bg-red-100 border-red-300'
                              : 'bg-gray-50'
                            : isCorrect
                            ? 'bg-green-100 border-green-300'
                            : isSelected
                            ? 'bg-red-100 border-red-300'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {canProceed && isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {isWrong && <XCircle className="h-4 w-4 text-red-600" />}
                          <span>{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Show explanation for failed quizzes or when user got it wrong */}
                {(!canProceed || answers[qIndex] !== question.correct) && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Past Attempts Section */}
        {pastAttempts.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold mb-3 mt-6 text-blue-700">Past Attempts</h3>
            <div className="grid gap-4">
              {pastAttempts.map((attempt, idx) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-blue-100 shadow-md animate-fade-in"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div>
                    <div className="font-semibold text-base text-blue-900">Attempt {pastAttempts.length - idx}</div>
                    <div className="text-xs text-gray-500">{new Date(attempt.completed_at || attempt.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-lg">
                      {attempt.score}/{attempt.total_points} ({attempt.percentage}%)
                    </span>
                    <span className={`mt-1 px-2 py-1 rounded text-xs font-bold border ${getGradeColor(attempt.grade)}`}>{attempt.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover-scale transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4 animate-slide-in-right">
            <h2 className="text-2xl font-bold">{lesson.title}</h2>
            <Badge variant="secondary" className="bg-white/20 text-white animate-scale-in" style={{ animationDelay: '0.2s' }}>
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 animate-fade-in"
              style={{ 
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                animationDelay: '0.4s'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-0 shadow-xl hover-scale transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
              <HelpCircle className="h-5 w-5" />
            </div>
            <span>Question {currentQuestion + 1}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>{currentQ?.question || ''}</h3>
            
            <RadioGroup 
              value={answers[currentQuestion]?.toString() || ''} 
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {(currentQ?.options || []).map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50 hover-scale transition-all duration-200 animate-fade-in" 
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '1s' }}>
            <Button 
              onClick={goToPrevQuestion}
              disabled={isFirstQuestion}
              variant="outline"
              className="flex items-center gap-2 hover-scale transition-all duration-200"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
            </div>

            {!isLastQuestion ? (
              <Button 
                onClick={goToNextQuestion}
                disabled={!currentAnswerSelected}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover-scale transition-all duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={submitQuiz}
                disabled={!allAnswered}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 hover-scale transition-all duration-200"
              >
                Submit Quiz
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Answer Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Select your answer and navigate through all questions before submitting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizComponent;
