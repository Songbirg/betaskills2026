import type { Module } from '@/types/course';
import lesson1Invoices from './lesson1-invoices';
import lesson2Receipts from './lesson2-receipts';
import lesson3CreditDebitNotes from './lesson3-credit-debit-notes';
import lesson4ChequesBankStatements from './lesson4-cheques-bank-statements';
import lesson5PettyCashVouchers from './lesson5-petty-cash-vouchers';
import quiz3 from './quiz3';

const module3: Module = {
  id: 3,
  title: 'Module 3: Source Documents',
  description: 'Understanding various source documents used in bookkeeping including invoices, receipts, credit/debit notes, cheques, bank statements, and petty cash vouchers.',
  lessons: [
    lesson1Invoices,
    lesson2Receipts,
    lesson3CreditDebitNotes,
    lesson4ChequesBankStatements,
    lesson5PettyCashVouchers,
    quiz3
  ]
};

export default module3;
