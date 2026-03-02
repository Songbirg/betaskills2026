import type { Module } from '@/types/course';
import lesson1 from './lesson1-what-are-social-skills';
import lesson2 from './lesson2-effective-communication';
import lesson3 from './lesson3-conflict-resolution';
import lesson4 from './lesson4-collaboration-and-teamwork';
import lesson5 from './lesson5-building-rapport';
import lesson6 from './lesson6-influencing-others-positively';
import lesson7 from './lesson7-importance-of-social-skills';
import quiz from './quiz';

const module6: Module = {
  id: 6,
  title: '🗣️ Module 6: Social Skills',
  description: 'Master the essential social skills for effective communication and relationship-building. Learn about effective communication, conflict resolution, collaboration, building rapport, positive influence, and understand why social skills are crucial for personal and professional success.',
  lessons: [
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
    lesson6,
    lesson7
  ],
  quiz
};

export default module6;
