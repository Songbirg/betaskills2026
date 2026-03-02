import type { Module } from '@/types/course';
import lesson1 from './lesson1-motivation-definition-components';
import lesson2 from './lesson2-types-of-motivation';
import lesson3 from './lesson3-setting-meaningful-goals';
import lesson4 from './lesson4-role-of-optimism';
import lesson5 from './lesson5-resilience-and-motivation';
import lesson6 from './lesson6-how-to-boost-motivation';
import quiz from './quiz';

const module4: Module = {
  id: 4,
  title: '🔥 Module 4: Motivation',
  description: 'Discover the power of motivation in driving personal and professional success. Learn about intrinsic and extrinsic motivation, set meaningful SMART goals, harness optimism, build resilience, and develop practical strategies to boost and sustain your motivation.',
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

export default module4;
