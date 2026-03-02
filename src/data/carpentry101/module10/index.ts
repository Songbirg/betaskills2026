import type { Module } from '@/types/course';
import lesson1 from './lesson1-major-project-design';
import lesson2 from './lesson2-major-project-execution';
import lesson3 from './lesson3-portfolio-building';
import quiz from './quiz';

const module10: Module = {
  id: 10,
  title: 'Capstone Project & Portfolio',
  description: 'Plan, execute, and present a major carpentry project, then build a professional portfolio for employment or running your own business.',
  lessons: [lesson1, lesson2, lesson3],
  quiz
};

export default module10;
