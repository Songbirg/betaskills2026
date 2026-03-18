import type { Module } from '@/types/course';
import lesson1GeneralJournal from './lesson1-general-journal';
import lesson2CashReceiptsJournal from './lesson2-cash-receipts-journal';
import lesson3CashPaymentsJournal from './lesson3-cash-payments-journal';
import lesson4SalesJournal from './lesson4-sales-journal';
import lesson5PurchasesJournal from './lesson5-purchases-journal';
import quiz5 from './quiz5';

const module5: Module = {
  id: 5,
  title: 'Module 5: Journals (Books of First Entry)',
  description: 'Understanding various journals including general journal, cash receipts journal, cash payments journal, sales journal, and purchases journal.',
  lessons: [
    lesson1GeneralJournal,
    lesson2CashReceiptsJournal,
    lesson3CashPaymentsJournal,
    lesson4SalesJournal,
    lesson5PurchasesJournal,
    quiz5
  ]
};

export default module5;
