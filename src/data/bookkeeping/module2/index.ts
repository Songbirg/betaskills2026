import type { Module } from '@/types/course';
import { lesson1BusinessEntity } from './lesson1-business-entity';
import { lesson2GoingConcern } from './lesson2-going-concern';
import { lesson3HistoricalCost } from './lesson3-historical-cost';
import { lesson4ConsistencyPrudence } from './lesson4-consistency-prudence';
import { lesson5AccrualCash } from './lesson5-accrual-cash';
import { quiz2 } from './quiz2';

const module2: Module = {
  id: 2,
  title: 'Module 2: Basic Accounting Concepts and Principles',
  description: 'Understanding fundamental accounting concepts and principles that form the foundation of accurate financial recording and reporting.',
  lessons: [
    lesson1BusinessEntity,
    lesson2GoingConcern,
    lesson3HistoricalCost,
    lesson4ConsistencyPrudence,
    lesson5AccrualCash,
    quiz2
  ]
};

export default module2;
