import type { QuizLesson } from '@/types/course';

const quiz6: QuizLesson = {
  id: 6,
  title: 'Module 6 Quiz: Ledger Account',
  type: 'quiz',
  duration: '10 min',
  content: {
    questions: [
    {
      question: 'What is the primary purpose of the general ledger in bookkeeping?',
      options: [
        'To record only cash transactions',
        'To store original source documents',
        'To accumulate all account balances for financial statements',
        'To replace journals'
      ],
      correct: 2,
      explanation: 'The general ledger accumulates balances for all accounts and is used to prepare financial statements.'
    },
    {
      question: 'Which of the following is NOT typically an account category in the general ledger?',
      options: ['Assets', 'Liabilities', 'Budgets', 'Expenses'],
      correct: 2,
      explanation: 'General ledger accounts are typically assets, liabilities, equity, income, and expenses.'
    },
    {
      question: 'Transactions are first recorded in journals and then transferred to the general ledger through a process called:',
      options: ['Reconciling', 'Posting', 'Balancing', 'Auditing'],
      correct: 1,
      explanation: 'Posting is the process of transferring journal entries into ledger accounts.'
    },
    {
      question: 'Why is the general ledger considered the “backbone” of the accounting system?',
      options: [
        'It records only large transactions',
        'It summarises all financial activity and maintains the accounting equation',
        'It replaces financial statements',
        'It eliminates the need for trial balances'
      ],
      correct: 1,
      explanation: 'It summarises all financial activity while maintaining the accounting equation through double-entry.'
    },
    {
      question: 'What document is prepared using balances extracted directly from the general ledger?',
      options: ['Cash flow statement', 'Bank reconciliation', 'Trial balance', 'Source document'],
      correct: 2,
      explanation: 'A trial balance is compiled using account balances from the general ledger.'
    },
    {
      question: 'Which feature of the general ledger helps auditors trace transactions back to their origin?',
      options: ['Account codes', 'Folio references and posting references', 'Trial balance totals', 'Depreciation schedules'],
      correct: 1,
      explanation: 'Posting/folio references link ledger entries back to journals and source documents.'
    },
    {
      question: 'If a business purchases equipment on credit, which accounts are affected in the general ledger?',
      options: [
        'Equipment (Asset) and Cash',
        'Equipment (Asset) and Accounts Payable',
        'Expense and Revenue',
        'Cash and Equity'
      ],
      correct: 1,
      explanation: 'Equipment increases (asset) and Accounts Payable increases (liability) when purchased on credit.'
    },
    {
      question: 'What is the main reason subsidiary ledgers (such as debtors or creditors ledgers) are used alongside the general ledger?',
      options: [
        'To replace the general ledger',
        'To reduce bookkeeping workload completely',
        'To provide detailed individual account information while the general ledger holds totals',
        'To eliminate reconciliation'
      ],
      correct: 2,
      explanation: 'Subsidiary ledgers hold detail; the general ledger holds control totals.'
    },
    {
      question: 'In a computerised accounting system, the general ledger is updated:',
      options: [
        'Only at year-end',
        'Manually once a month',
        'Automatically from journals and source documents',
        'Only by auditors'
      ],
      correct: 2,
      explanation: 'Computerised systems typically update the general ledger automatically from captured transactions.'
    },
    {
      question: 'If total debits do not equal total credits in the trial balance, the error most likely originates from:',
      options: ['Financial statements', 'Bank reconciliation', 'Incorrect or incomplete posting to the general ledger', 'Excessive expenses'],
      correct: 2,
      explanation: 'An out-of-balance trial balance indicates an error in recording or posting transactions.'
    }
    ]
  }
};

export { quiz6 };
export default quiz6;
