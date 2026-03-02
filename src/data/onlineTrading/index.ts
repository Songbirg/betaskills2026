import type { Course, Lesson, Module, QuizQuestion } from '@/types/course';
import module1 from './module1';
import module2 from './module2';
import module3 from './module3';
import module4 from './module4';
import module5 from './module5';
import module6 from './module6';
import module7 from './module7';
import module8 from './module8';

type RawQuiz = {
  title?: string;
  questions?: Array<{
    question: string;
    options: string[];
    correct?: number;
    correctAnswer?: number;
    explanation: string;
  }>;
};

type RawLesson = {
  title: string;
  duration: string;
  content: any;
  videoUrl?: string;
};

type RawModule = {
  title: string;
  description: string;
  lessons?: RawLesson[];
  quiz?: RawQuiz;
};

const normalizeQuizQuestions = (rawQuiz?: RawQuiz): QuizQuestion[] => {
  const questions = rawQuiz?.questions ?? [];
  return questions.map((q) => ({
    question: q.question,
    options: q.options,
    correct: typeof q.correct === 'number' ? q.correct : (q.correctAnswer ?? 0),
    explanation: q.explanation,
  }));
};

const normalizeModule = (raw: RawModule, moduleNumber: number): Module => {
  const rawLessons = raw.lessons ?? [];

  const lessons: Lesson[] = rawLessons.map((l, idx) => ({
    id: idx + 1,
    title: l.title,
    duration: l.duration,
    type: 'video',
    videoUrl: l.videoUrl,
    content: l.content,
  }));

  const quizQuestions = normalizeQuizQuestions(raw.quiz);
  if (quizQuestions.length > 0) {
    lessons.push({
      id: lessons.length + 1,
      title: raw.quiz?.title || `Module ${moduleNumber} Quiz`,
      duration: '10 minutes',
      type: 'quiz',
      content: { questions: quizQuestions },
    });
  }

  return {
    id: moduleNumber,
    title: raw.title,
    description: raw.description,
    lessons,
  };
};

export const onlineTradingCourse: Course = {
  id: 'online-trading',
  title: 'Online Trading – Financial Markets',
  description: 'This course provides a structured foundation in financial markets and online trading. Learners will understand how markets function, how to analyse assets, manage risk, and execute trades using modern trading platforms. The course balances theory, market mechanics, and practical trading application.',
  thumbnail: '/images/courses/online-trading.jpg',
  category: 'Business',
  level: 'Beginner',
  duration: '8-12 weeks',
  is_free: false,
  price: 290,
  currency: 'ZAR',
  students: 0,
  rating: 0,
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  available: true,
  modules: [
    normalizeModule(module1 as unknown as RawModule, 1),
    normalizeModule(module2 as unknown as RawModule, 2),
    normalizeModule(module3 as unknown as RawModule, 3),
    normalizeModule(module4 as unknown as RawModule, 4),
    normalizeModule(module5 as unknown as RawModule, 5),
    normalizeModule(module6 as unknown as RawModule, 6),
    normalizeModule(module7 as unknown as RawModule, 7),
    normalizeModule(module8 as unknown as RawModule, 8)
  ],
  learningObjectives: [
    'Understand how global financial markets operate',
    'Identify different types of financial markets and instruments',
    'Execute trades using online trading platforms',
    'Analyze assets using technical and fundamental analysis',
    'Manage trading risk effectively',
    'Develop and implement trading strategies'
  ],
  instructor: {
    id: 'online-trading-instructor',
    first_name: 'Financial Markets',
    last_name: 'Expert Team',
    email: 'trading@betaskills.com'
  }
};

export default onlineTradingCourse;
