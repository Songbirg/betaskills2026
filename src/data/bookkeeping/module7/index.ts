import type { Module } from '@/types/course';
import lesson1TrialBalancePurpose from './lesson1-trial-balance-purpose';
import lesson2TypesOfErrors from './lesson2-types-of-errors';
import lesson3SuspenseAccounts from './lesson3-suspense-accounts';
import quiz7 from './quiz7';

const module7: Module = {
  id: 7,
  title: 'Module 7: Trial Balance',
  description: 'Understand the purpose of a trial balance, common errors, and how suspense accounts help during investigations.',
  lessons: [
    lesson1TrialBalancePurpose,
    lesson2TypesOfErrors,
    lesson3SuspenseAccounts,
    quiz7
  ]
};

export default module7;
