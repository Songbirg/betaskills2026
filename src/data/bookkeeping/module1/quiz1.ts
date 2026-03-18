import type { QuizLesson } from '@/types/course';

const quiz1: QuizLesson = {
  id: 6,
  title: 'Module 1 Quiz: Introduction to Bookkeeping',
  type: 'quiz',
  duration: '10 min',
  content: {
    questions: [
    {
      question: 'What best defines bookkeeping?',
      options: [
        'Interpreting financial statements for strategic planning',
        'Systematically recording, organising, and maintaining financial transactions',
        'Auditing financial records for compliance',
        'Preparing tax returns and forecasts'
      ],
      correct: 1,
      explanation: 'Bookkeeping is the systematic recording, organising, and maintaining of financial transactions to provide accurate ongoing financial information.'
    },
    {
      question: 'Which of the following activities is primarily associated with bookkeeping rather than accounting?',
      options: [
        'Analysing profit trends',
        'Preparing financial ratios',
        'Recording daily income and expenses',
        'Advising on tax strategies'
      ],
      correct: 2,
      explanation: 'Bookkeeping focuses on recording daily income and expenses, while accounting involves analysis and strategic advice.'
    },
    {
      question: 'What is the main purpose of recording every financial transaction in bookkeeping?',
      options: [
        'To reduce tax liability',
        'To ensure every rand is accounted for accurately',
        'To replace accounting functions',
        'To eliminate the need for audits'
      ],
      correct: 1,
      explanation: 'The main purpose is to ensure every rand is accounted for accurately, providing a complete financial picture.'
    },
    {
      question: 'Which principle requires that every transaction affects at least two accounts with equal debit and credit entries?',
      options: [
        'Cash basis principle',
        'Prudence principle',
        'Double-entry system',
        'Historical cost principle'
      ],
      correct: 2,
      explanation: 'The double-entry system requires every transaction to affect at least two accounts with equal debit and credit entries.'
    },
    {
      question: 'Why is chronological recording of transactions important in bookkeeping?',
      options: [
        'It reduces the need for reconciliation',
        'It improves tax deductions automatically',
        'It creates a clear audit trail for verification',
        'It replaces the need for ledgers'
      ],
      correct: 2,
      explanation: 'Chronological recording creates a clear audit trail that allows for verification and tracking of transactions over time.'
    },
    {
      question: 'What is the primary function of classifying transactions into ledgers?',
      options: [
        'To eliminate errors completely',
        'To group similar accounts for organised reference and reporting',
        'To prepare tax returns directly',
        'To forecast future profits'
      ],
      correct: 1,
      explanation: 'Classifying transactions groups similar accounts for organised reference and reporting, making financial information more accessible.'
    },
    {
      question: 'How does bookkeeping support informed business decision-making?',
      options: [
        'By providing strategic advice',
        'By forecasting market conditions',
        'By supplying accurate, reliable financial records',
        'By calculating complex financial ratios'
      ],
      correct: 2,
      explanation: 'Bookkeeping supports decision-making by supplying accurate, reliable financial records that form the basis for analysis.'
    },
    {
      question: 'Which statement correctly distinguishes bookkeeping from accounting?',
      options: [
        'Bookkeeping focuses on analysis, while accounting focuses on data entry',
        'Bookkeeping records transactions, while accounting interprets and reports them',
        'Both perform the same role in a business',
        'Accounting replaces the need for bookkeeping'
      ],
      correct: 1,
      explanation: 'Bookkeeping records transactions while accounting interprets and reports them for strategic decision-making.'
    },
    {
      question: 'What risk arises when bookkeeping records are incomplete or inaccurate?',
      options: [
        'Reduced customer satisfaction',
        'Increased sales',
        'Distorted financial reality leading to poor decisions',
        'Faster tax processing'
      ],
      correct: 2,
      explanation: 'Incomplete or inaccurate records lead to distorted financial reality, which can result in poor business decisions.'
    },
    {
      question: 'Why is bookkeeping considered foundational to financial management?',
      options: [
        'It eliminates the need for accountants',
        'It guarantees business profitability',
        'It provides the raw financial data required for analysis, compliance, and planning',
        'It focuses only on tax reporting'
      ],
      correct: 2,
      explanation: 'Bookkeeping provides the raw financial data required for analysis, compliance, and planning, making it foundational to financial management.'
    }
    ]
  }
};

export default quiz1;
