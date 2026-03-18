import { Module } from '../../types';
import lesson1 from './lesson1-cash-management';
import lesson2 from './lesson2-bank-reconciliation';
import lesson3 from './lesson3-petty-cash';
import { quiz10 } from './quiz10';

const module10: Module = {
  id: 'module10',
  title: 'Cash and Bank Management',
  description: 'Effective cash management, bank reconciliation procedures, and petty cash systems for optimal liquidity control.',
  lessons: [lesson1, lesson2, lesson3],
  quiz: quiz10,
  order: 10,
};

export default module10;
