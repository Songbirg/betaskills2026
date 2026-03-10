import type { Quiz } from '@/types/course';

const quiz2: Quiz = {
  id: 2,
  title: 'Module 2 Quiz: Basic Accounting Concepts and Principles',
  questions: [
    {
      question: 'What is the main principle of business entity concept?',
      options: [
        'Treating personal and business finances as one',
        'Recording only personal expenses in business ledger',
        'Treating business as a separate entity from its owners',
        'Allowing owner drawings to be considered business expenses'
      ],
      correct: 2,
      explanation: 'The business entity concept treats the business as a separate entity from its owners, maintaining distinct financial records.'
    },
    {
      question: 'Which of the following is an example of maintaining the business entity concept?',
      options: [
        'Paying for groceries from business bank account',
        'Recording supplier invoices for materials in business ledger',
        'Using business funds for personal holidays',
        'Combining owner salary with revenue from services'
      ],
      correct: 1,
      explanation: 'Recording supplier invoices for materials in the business ledger maintains the separation between business and personal finances.'
    },
    {
      question: 'Why is separating personal and business finances important?',
      options: [
        'It avoids the need for tax submissions',
        'It ensures an accurate assessment of business profitability',
        'It allows personal expenses to reduce business tax liability',
        'It eliminates the need for bookkeeping'
      ],
      correct: 1,
      explanation: 'Separating finances ensures accurate assessment of business profitability without distortion from personal transactions.'
    },
    {
      question: 'In which situation could the business entity concept protect the owner?',
      options: [
        'When personal assets are used for business purchases',
        'When business is a separate legal entity and incurs debts',
        'When personal and business accounts are mixed',
        'When drawings are treated as business expenses'
      ],
      correct: 1,
      explanation: 'When the business is a separate legal entity, the business entity concept protects personal assets from business debts.'
    },
    {
      question: 'How should owner drawings be treated under the business entity concept?',
      options: [
        'As business expenses',
        'As revenue',
        'As reductions in capital (equity)',
        'As liabilities owed to suppliers'
      ],
      correct: 2,
      explanation: 'Owner drawings should be treated as reductions in capital or equity, not as business expenses.'
    },
    {
      question: 'Which of the following statements reflects proper compliance with the business entity concept?',
      options: [
        'Filing company tax returns based on combined personal and business income',
        'Paying suppliers from owner\'s personal account and recording it as a business expense',
        'Maintaining separate ledgers and accounts for business transactions',
        'Including owner personal debts in business financial statements'
      ],
      correct: 2,
      explanation: 'Maintaining separate ledgers and accounts for business transactions ensures proper compliance with the business entity concept.'
    },
    {
      question: 'How does the business entity concept help in attracting investors or partners?',
      options: [
        'By including personal debts in business finances',
        'By presenting a clear financial picture of the business alone',
        'By allowing owners to draw unlimited personal funds without records',
        'By mixing personal and operational costs to appear larger'
      ],
      correct: 1,
      explanation: 'Presenting a clear financial picture of the business alone helps attract investors and partners.'
    },
    {
      question: 'What is the risk of violating the business entity concept?',
      options: [
        'Increased interest on loans',
        'Distorted profitability and inaccurate financial reporting',
        'Immediate business closure',
        'Elimination of legal liability'
      ],
      correct: 1,
      explanation: 'Violating the business entity concept leads to distorted profitability and inaccurate financial reporting.'
    },
    {
      question: 'Which of the following would NOT comply with the business entity concept?',
      options: [
        'Using a business bank account to pay for client invoices',
        'Recording wages paid to employees in business ledgers',
        'Paying for owner\'s personal car insurance from business funds',
        'Logging supplier payments for materials purchased'
      ],
      correct: 2,
      explanation: 'Paying for personal expenses like car insurance from business funds violates the business entity concept.'
    },
    {
      question: 'Why is the business entity concept particularly important for small trades like electrical or tiling services?',
      options: [
        'It allows owners to deduct personal living expenses as business costs',
        'It ensures clear, objective financial records for profitability and compliance',
        'It removes the need for bookkeeping entirely',
        'It allows combining multiple business projects into one account'
      ],
      correct: 1,
      explanation: 'The business entity concept ensures clear, objective financial records essential for profitability assessment and compliance in small trades.'
    }
  ]
};

export default quiz2;
