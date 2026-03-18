import type { Module } from '@/types/course';
import lesson1GeneralLedger from './lesson1-general-ledger';
import lesson2DebtorsLedger from './lesson2-debtors-ledger';
import lesson3CreditorsLedger from './lesson3-creditors-ledger';
import lesson4TAccounts from './lesson4-t-accounts';
import lesson5BalancingAccounts from './lesson5-balancing-accounts';
import quiz6 from './quiz6';

const module6: Module = {
  id: 6,
  title: 'Module 6: Ledger Account',
  description: 'Learn how ledger accounts work, including the general ledger, subsidiary ledgers, T-accounts, and balancing accounts.',
  lessons: [
    lesson1GeneralLedger,
    lesson2DebtorsLedger,
    lesson3CreditorsLedger,
    lesson4TAccounts,
    lesson5BalancingAccounts,
    quiz6
  ]
};

export default module6;
