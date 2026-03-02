import type { ComponentType, ReactElement } from 'react';

export interface BaseLesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'assignment' | 'certificate' | 'reading';
}

export interface VideoContent {
  videoUrl: string;
  textContent: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

export interface AssignmentContent {
  title: string;
  description: string;
  requirements: string[];
  deliverables: string;
  rubric: Record<string, string>;
}

export interface CertificateContent {
  title: string;
  description: string;
  certificateText: string;
}

export interface VideoLesson extends BaseLesson {
  type: 'video';
  videoUrl?: string;
  content: string | VideoContent | ComponentType<any> | ReactElement;
}

export interface ReadingLesson extends BaseLesson {
  type: 'reading';
  content: string;
}

export interface QuizLesson extends BaseLesson {
  type: 'quiz';
  content: QuizContent;
}

export interface AssignmentLesson extends BaseLesson {
  type: 'assignment';
  content: AssignmentContent;
}

export interface CertificateLesson extends BaseLesson {
  type: 'certificate';
  content: CertificateContent;
}

export type Lesson = VideoLesson | ReadingLesson | QuizLesson | AssignmentLesson | CertificateLesson;

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz?: any; // Add this line to allow quizzes on modules
}

export interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  is_free: boolean;
  price: number;
  currency: string;
  students: number;
  rating: number;
  instructor: Instructor;
  status: string;
  created_at: string;
  updated_at: string;
  available: boolean;
  available_date?: string;
  isComingSoon?: boolean;
  overview?: string;
  thumbnail?: string;
  modules: Module[];
  learningObjectives?: string[];
}

export interface SimplifiedCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  is_free: boolean;
  price: number;
  currency: string;
  students: number;
  rating: number;
  instructor: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
  available: boolean;
  available_date?: string;
  isComingSoon?: boolean;
  overview?: string;
  thumbnail?: string;
}