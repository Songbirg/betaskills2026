import type { Module } from '@/types/course';
import lesson1 from './lesson1-what-is-empathy';
import lesson2 from './lesson2-types-of-empathy';
import lesson3 from './lesson3-active-listening';
import lesson4 from './lesson4-nonverbal-cues';
import lesson5 from './lesson5-benefits-of-empathy';
import lesson6 from './lesson6-how-to-strengthen-empathy';
import quiz from './quiz';

const module5: Module = {
  id: 5,
  title: '❤️ Module 5: Empathy',
  description: 'Explore the power of empathy in building meaningful connections. Learn about different types of empathy, master active listening and nonverbal communication, discover the benefits of empathy, and develop practical strategies to strengthen your empathetic abilities.',
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

export default module5;
