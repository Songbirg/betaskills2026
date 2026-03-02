import type { Module } from '@/types/course';
import lesson1 from './lesson1-self-awareness-definition-components';
import lesson2 from './lesson2-importance-of-self-awareness';
import lesson3 from './lesson3-recognizing-emotions';
import lesson4 from './lesson4-understanding-strengths-weaknesses';
import lesson5 from './lesson5-tools-to-build-self-awareness';
import lesson6 from './lesson6-benefits-of-high-self-awareness';
import quiz from './quiz';

const module2: Module = {
  id: 2,
  title: '🔍 Module 2: Self-Awareness',
  description: 'Dive deep into self-awareness, the foundation of emotional intelligence. Learn to recognize your emotions, understand your strengths and weaknesses, and develop practical tools to build greater self-awareness for personal and professional success.',
  lessons: [
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
    lesson6
  ],
  quiz
};

export default module2;
