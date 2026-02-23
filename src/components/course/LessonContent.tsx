
import React, { memo } from 'react';
import LessonHeader from './content/LessonHeader';
import VideoLessonRenderer from './content/VideoLessonRenderer';
import QuizLessonRenderer from './content/QuizLessonRenderer';
import AssignmentLessonRenderer from './content/AssignmentLessonRenderer';
import CertificateLessonRenderer from './content/CertificateLessonRenderer';
import ContentFormatter from './content/animated-lesson/ContentFormatter';
import type { QuizQuestion } from '@/types/course';
import type { Lesson, QuizLesson, AssignmentLesson, CertificateLesson, VideoLesson, Course } from '@/types/course';

interface LessonContentProps {
  lesson: Lesson;
  course: Course;
  isCompleted: boolean;
  hasAttempted?: boolean;
  onMarkComplete: () => void;
  onNext: () => void;
  progress: number;
  moduleId: number;
  lessonId: number;
}

const LessonContent = ({ lesson, course, isCompleted, hasAttempted = false, onMarkComplete, onNext, progress, moduleId, lessonId, markdownContent }: LessonContentProps & { markdownContent?: string }) => {
  // Reduced logging - only log when lesson changes
  const lessonKey = `${course.id}-${lesson.id}`;
  React.useEffect(() => {
    console.log('LessonContent changed:', { courseId: course.id, lessonId: lesson.id, lessonType: lesson.type });
  }, [lessonKey]);

  const maybeComponentContent = (lesson as any)?.content;
  const hasComponentContent =
    typeof maybeComponentContent === 'function' ||
    React.isValidElement(maybeComponentContent);

  if (markdownContent) {
    console.log('Using markdown content for course:', course.id);
    return <ContentFormatter content={markdownContent} />;
  }

  if (hasComponentContent) {
    const Component = maybeComponentContent;

    return (
      <div className="space-y-6">
        <LessonHeader lesson={lesson} isCompleted={isCompleted} hasAttempted={hasAttempted} />
        <div className="prose prose-lg max-w-none">
          {typeof Component === 'function' ? <Component /> : Component}
        </div>
      </div>
    );
  }
  // Try to interpret video lessons that actually contain quiz HTML (legacy courses like tiling101)
  const maybeRenderEmbeddedQuiz = () => {
    if (lesson.type !== 'video') return null;
    const html = (lesson as VideoLesson).content?.textContent || '';
    if (!html) return null;

    // Heuristic: legacy quiz files have many "Question" labels and radio inputs
    const looksLikeQuiz = /Question\s*\d+:/i.test(html) && /input type="radio"/i.test(html);
    if (!looksLikeQuiz) return null;

    try {
      // Parse to a simple quiz structure by extracting questions and options
      const questionBlocks = html.split(/<div[^>]*>\s*<h4[^>]*>[^<]*Question\s*\d+:[\s\S]*?<\/div>/gi);
      // Fallback: simpler split by occurrences of "Question N:" to count
      const rawSegments = html.split(/Question\s*\d+:/i);
      if (rawSegments.length < 2) return null;

      const questions: QuizQuestion[] = [];
      const questionRegex = /Question\s*\d+:[\s\S]*?<div class=\"space-y-2\">([\s\S]*?)<\/div>/gi;
      let match: RegExpExecArray | null;
      while ((match = questionRegex.exec(html)) !== null) {
        const block = match[1];
        const optionRegex = /<span>(.*?)<\/span>/g;
        const options: string[] = [];
        let opt;
        while ((opt = optionRegex.exec(block)) !== null) {
          const text = opt[1].replace(/✅/g, '').trim();
          options.push(text);
        }
        // Determine correct index by presence of ✅ marker
        const correctIndex = (block.match(/✅/) ? options.findIndex((o, idx) => {
          const before = block.split('<span>')[idx + 1] || '';
          return /✅/.test(before);
        }) : -1);

        questions.push({
          question: 'Refer to on-screen question',
          options: options.length ? options : ['A','B','C','D'],
          correct: Math.max(0, correctIndex),
          explanation: ''
        });
      }

      if (questions.length >= 3) {
        const synthetic: QuizLesson = {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          type: 'quiz',
          content: { questions }
        };
        return (
          <QuizLessonRenderer
            lesson={synthetic}
            isCompleted={isCompleted}
            hasAttempted={hasAttempted}
            onMarkComplete={onMarkComplete}
            onNext={onNext}
            moduleId={moduleId}
            lessonId={lessonId}
          />
        );
      }
    } catch (e) {
      // Ignore parsing errors and fall back to normal rendering
    }
    return null;
  };

  const renderLessonContent = () => {
    // First, attempt embedded quiz rendering for legacy quiz lessons
    const embeddedQuiz = maybeRenderEmbeddedQuiz();
    if (embeddedQuiz) return embeddedQuiz;
    switch (lesson.type) {
      case 'video':
        return (
          <VideoLessonRenderer
            lesson={lesson as VideoLesson}
            isCompleted={isCompleted}
            onMarkComplete={onMarkComplete}
            onNext={onNext}
          />
        );
      case 'quiz':
        return (
          <QuizLessonRenderer
            lesson={lesson as QuizLesson}
            isCompleted={isCompleted}
            hasAttempted={hasAttempted}
            onMarkComplete={onMarkComplete}
            onNext={onNext}
            moduleId={moduleId}
            lessonId={lessonId}
          />
        );
      case 'assignment':
        return (
          <AssignmentLessonRenderer
            lesson={lesson as AssignmentLesson}
            isCompleted={isCompleted}
            onMarkComplete={onMarkComplete}
          />
        );
      case 'certificate':
        return (
          <CertificateLessonRenderer
            lesson={lesson as CertificateLesson}
            course={course}
            onMarkComplete={onMarkComplete}
            progress={progress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderLessonContent()}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when lesson content hasn't changed
export default memo(LessonContent, (prevProps, nextProps) => {
  return (
    prevProps.lesson.id === nextProps.lesson.id &&
    prevProps.lesson.type === nextProps.lesson.type &&
    prevProps.isCompleted === nextProps.isCompleted &&
    prevProps.hasAttempted === nextProps.hasAttempted &&
    prevProps.course.id === nextProps.course.id
  );
});
