import type { QuizLesson } from '@/types/course';

const quiz7: QuizLesson = {
  id: 4,
  title: 'Module 7 Quiz: Purpose of a Trial Balance',
  type: 'quiz',
  duration: '10 min',
  content: {
    questions: [
    {
      question: 'What is the primary purpose of preparing a trial balance?',
      options: [
        'To calculate profit or loss',
        'To list all transactions for the period',
        'To verify that total debits equal total credits',
        'To reconcile the bank account'
      ],
      correct: 2,
      explanation: 'A trial balance is primarily prepared to confirm that total debits equal total credits.'
    },
    {
      question: 'A trial balance is prepared using balances taken from which accounting record?',
      options: ['Source documents', 'Journals', 'General ledger', 'Bank statements'],
      correct: 2,
      explanation: 'Trial balances are compiled from the balances of accounts in the general ledger.'
    },
    {
      question: 'Which of the following errors is most likely to be revealed by a trial balance?',
      options: [
        'Error of omission',
        'Error of principle',
        'Incorrect posting to the wrong side of an account',
        'Compensating error'
      ],
      correct: 2,
      explanation: 'Wrong-side postings typically cause a debit/credit mismatch and are revealed by a trial balance.'
    },
    {
      question: 'Why is a trial balance described as an “internal check” in bookkeeping?',
      options: [
        'It replaces an external audit',
        'It ensures tax compliance',
        'It detects arithmetic inaccuracies before financial statements are prepared',
        'It confirms cash availability'
      ],
      correct: 2,
      explanation: 'It provides an internal arithmetic check before preparing financial statements.'
    },
    {
      question: 'If total debits do not equal total credits in a trial balance, this indicates:',
      options: [
        'The business made a loss',
        'Errors exist in recording or posting transactions',
        'Assets exceed liabilities',
        'Revenues are understated'
      ],
      correct: 1,
      explanation: 'Disagreement indicates an error in recording or posting.'
    },
    {
      question: 'Which of the following errors would not affect the agreement of the trial balance?',
      options: [
        'Posting a debit as a credit',
        'Omitting a transaction entirely',
        'Recording different amounts on debit and credit sides',
        'Incorrect addition of an account balance'
      ],
      correct: 1,
      explanation: 'An omission of a full transaction affects neither side, so the trial balance can still agree.'
    },
    {
      question: 'How does the trial balance assist in preparing financial statements?',
      options: [
        'By replacing journals and ledgers',
        'By providing verified account balances ready for summarisation',
        'By calculating depreciation automatically',
        'By reconciling subsidiary ledgers'
      ],
      correct: 1,
      explanation: 'It provides a list of account balances that form the basis of financial statements.'
    },
    {
      question: 'In practice, why is it important to prepare a trial balance before final accounts?',
      options: [
        'To identify fraud immediately',
        'To comply with legal filing requirements',
        'To ensure ledger balances are mathematically correct before reporting',
        'To value inventory'
      ],
      correct: 2,
      explanation: 'It confirms the ledger balances are mathematically correct before reporting.'
    },
    {
      question: 'Which situation best illustrates the trial balance acting as an “early warning system”?',
      options: [
        'Declining sales figures',
        'Negative cash flow',
        'Debit and credit totals not agreeing due to posting errors',
        'High debtor balances'
      ],
      correct: 2,
      explanation: 'A mismatch of debit and credit totals is an early warning that errors exist.'
    },
    {
      question: 'Which management benefit does a trial balance provide?',
      options: [
        'Detailed customer profitability analysis',
        'Immediate snapshot of unusual account balances for corrective action',
        'Automatic detection of all bookkeeping errors',
        'Replacement of financial statements'
      ],
      correct: 1,
      explanation: 'It gives management a quick snapshot of account balances that may require action.'
    }
    ]
  }
};

export { quiz7 };
export default quiz7;
