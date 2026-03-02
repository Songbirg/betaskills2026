import type { Module } from '@/types/course';
import lesson1 from './lesson1-ei-in-leadership';
import lesson2 from './lesson2-ei-in-teamwork';
import lesson3 from './lesson3-personal-professional-growth';
import lesson4 from './lesson4-improving-ei-daily-life';
import quiz from './quiz';

const module7: Module = {
  id: 7,
  title: '🎯 Module 7: Applying Emotional Intelligence',
  description: 'Learn how to apply emotional intelligence in real-world contexts. Explore EI in leadership, teamwork and collaboration, personal and professional growth, and discover practical ways to improve your emotional intelligence in daily life.',
  lessons: [
    lesson1,
    lesson2,
    lesson3,
    lesson4
  ],
  quiz
};

export default module7;
