import type { Module } from '@/types/course';
import { lesson1Definition } from './lesson1-definition';
import { lesson2Purpose } from './lesson2-purpose';
import { lesson3BookkeepingVsAccounting } from './lesson3-bookkeeping-vs-accounting';
import { lesson4BusinessTypes } from './lesson4-business-types';
import { lesson5BookkeeperRole } from './lesson5-bookkeeper-role';
import { quiz1 } from './quiz1';

const module1: Module = {
  id: 1,
  title: 'Module 1: Introduction to Bookkeeping',
  description: 'Understanding the fundamentals of bookkeeping, its purpose, and role in business operations.',
  lessons: [
    lesson1Definition,
    lesson2Purpose,
    lesson3BookkeepingVsAccounting,
    lesson4BusinessTypes,
    lesson5BookkeeperRole,
    quiz1
  ]
};

export default module1;
