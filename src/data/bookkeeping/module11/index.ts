import { Module } from '../../types';
import lesson1 from './lesson1-ethics-bookkeeping';
import lesson2 from './lesson2-fraud-prevention';
import lesson3 from './lesson3-internal-controls';
import lesson4 from './lesson4-vat-awareness';
import lesson5 from './lesson5-record-retention';
import { quiz11 } from './quiz11';

const module11: Module = {
  id: 'module11',
  title: 'Ethics, Controls, and Compliance',
  description: 'Understanding ethical bookkeeping practices, fraud prevention, internal controls, VAT compliance, and record retention requirements.',
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5],
  quiz: quiz11,
  order: 11,
};

export default module11;
