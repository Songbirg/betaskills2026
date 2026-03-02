import type { Module } from '@/types/course';
import lesson1 from './lesson1-self-regulation-definition-components';
import lesson2 from './lesson2-importance-of-self-regulation';
import lesson3 from './lesson3-key-self-regulation-skills';
import lesson4 from './lesson4-techniques-for-managing-emotions';
import lesson5 from './lesson5-examples-of-self-regulation-in-action';
import lesson6 from './lesson6-benefits-of-good-self-regulation';
import quiz from './quiz';

const module3: Module = {
  id: 3,
  title: '⚖️ Module 3: Self-Regulation',
  description: 'Master the art of self-regulation to manage your emotions, thoughts, and behaviors constructively. Learn key skills like impulse control, adaptability, and emotional management, along with practical techniques to stay calm, focused, and resilient in challenging situations.',
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

export default module3;
