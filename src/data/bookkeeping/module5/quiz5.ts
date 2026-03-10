import type { Quiz } from '@/types/course';

const quiz5: Quiz = {
  id: 5,
  title: 'Module 5 Quiz: Journals (Books of First Entry)',
  questions: [
    {
      question: 'Which of the following correctly expresses the basic accounting equation?',
      options: [
        'Assets + Liabilities = Equity',
        'Assets = Liabilities + Equity',
        'Assets - Liabilities = Equity',
        'Liabilities = Assets + Equity'
      ],
      correct: 1,
      explanation: 'The basic accounting equation is Assets = Liabilities + Equity.'
    },
    {
      question: 'What happens to the accounting equation if a business purchases inventory for cash?',
      options: [
        'Assets increase, liabilities increase',
        'Assets decrease, equity increases',
        'One asset increases while another asset decreases',
        'Equity decreases, liabilities increase'
      ],
      correct: 2,
      explanation: 'When purchasing inventory for cash, one asset (inventory) increases while another asset (cash) decreases.'
    },
    {
      question: 'A company receives a loan from the bank. Which accounts are affected?',
      options: [
        'Assets and Equity',
        'Assets and Liabilities',
        'Liabilities and Revenue',
        'Assets and Expenses'
      ],
      correct: 1,
      explanation: 'Receiving a loan increases assets (cash) and increases liabilities (loan payable).'
    },
    {
      question: 'If a business earns revenue on credit, what is the immediate effect on the accounting equation?',
      options: [
        'Increase in assets and equity',
        'Decrease in assets and increase in liabilities',
        'Increase in liabilities only',
        'Decrease in equity only'
      ],
      correct: 0,
      explanation: 'Revenue on credit increases assets (accounts receivable) and increases equity (through profit).'
    },
    {
      question: 'Owner\'s drawings from the business account result in:',
      options: [
        'Increase in assets, decrease in liabilities',
        'Decrease in assets and equity',
        'Increase in liabilities and equity',
        'No effect on accounting equation'
      ],
      correct: 1,
      explanation: 'Owner\'s drawings decrease assets (cash) and decrease equity (capital).'
    },
    {
      question: 'How are liabilities classified in the accounting equation?',
      options: [
        'As resources owned by the business',
        'As obligations owed to external parties',
        'As residual interest after liabilities',
        'As revenue earned from sales'
      ],
      correct: 1,
      explanation: 'Liabilities are classified as obligations owed to external parties.'
    },
    {
      question: 'Which of the following expands the basic accounting equation to include the effects of profit and loss?',
      options: [
        'Assets = Liabilities - Equity',
        'Assets = Liabilities + Equity + (Revenue - Expenses)',
        'Assets = Liabilities + Equity - Revenue',
        'Assets + Expenses = Liabilities + Revenue'
      ],
      correct: 1,
      explanation: 'The expanded equation is Assets = Liabilities + Equity + (Revenue - Expenses).'
    },
    {
      question: 'Paying wages to employees affects the accounting equation by:',
      options: [
        'Increasing assets and decreasing liabilities',
        'Decreasing assets and equity',
        'Increasing liabilities and equity',
        'Increasing assets only'
      ],
      correct: 1,
      explanation: 'Paying wages decreases assets (cash) and decreases equity (through expenses).'
    },
    {
      question: 'Why is the accounting equation considered the foundation of double-entry bookkeeping?',
      options: [
        'It shows how income is distributed to owners',
        'It ensures every transaction affects at least two accounts to maintain balance',
        'It records revenue and expenses only',
        'It tracks only the owner\'s investments'
      ],
      correct: 1,
      explanation: 'The accounting equation ensures every transaction affects at least two accounts to maintain balance.'
    },
    {
      question: 'A company purchases equipment on credit. How does this transaction affect the equation?',
      options: [
        'Assets increase, liabilities increase',
        'Assets increase, equity decreases',
        'Liabilities increase, equity increase',
        'Assets decrease, liabilities decrease'
      ],
      correct: 0,
      explanation: 'Purchasing equipment on credit increases assets (equipment) and increases liabilities (accounts payable).'
    }
  ]
};

export default quiz5;
