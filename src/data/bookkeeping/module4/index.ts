import type { Module } from '@/types/course';
import lesson1AccountingEquation from './lesson1-accounting-equation';
import lesson2DebitCreditRules from './lesson2-debit-credit-rules';
import lesson3Elements from './lesson3-elements';
import lesson4TransactionsEffects from './lesson4-transactions-effects';
import quiz4 from './quiz4';

const module4: Module = {
  id: 4,
  title: 'Module 4: Double-Entry Bookkeeping System',
  description: 'Understanding the double-entry bookkeeping system including the accounting equation, debit and credit rules, financial elements, and transaction effects.',
  lessons: [
    lesson1AccountingEquation,
    lesson2DebitCreditRules,
    lesson3Elements,
    lesson4TransactionsEffects,
    quiz4
  ]
};

export default module4;
