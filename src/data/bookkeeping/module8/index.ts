import { Module } from '../../types';
import lesson1 from './lesson1-income-statement';
import lesson2 from './lesson2-balance-sheet';
import lesson3 from './lesson3-notes-to-accounts';
import { quiz8 } from './quiz8';

const module8: Module = {
  id: 'module8',
  title: 'Financial Statements',
  description: 'Understanding and preparing key financial statements including income statements, balance sheets, and notes to accounts.',
  lessons: [lesson1, lesson2, lesson3],
  quiz: quiz8,
  order: 8,
};

export default module8;
