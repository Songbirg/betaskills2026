import { Quiz } from '../../types';

export const quiz8: Quiz = {
  id: 'quiz8',
  title: 'Financial Statements Quiz',
  questions: [
    {
      question: 'What is the primary purpose of an income statement?',
      options: [
        'To show assets and liabilities at a point in time',
        'To summarise financial performance over a specific period',
        'To calculate cash balances only',
        'To list owner contributions'
      ],
      correct: 1,
      explanation: 'An income statement summarizes revenues, expenses, and profits over a specific period, showing the business\'s financial performance.'
    },
    {
      question: 'Revenue is recognised in the income statement when:',
      options: [
        'Cash is received from customers',
        'An invoice is paid',
        'It is earned, regardless of when cash is received',
        'Expenses are incurred'
      ],
      correct: 2,
      explanation: 'Under the accrual basis of accounting, revenue is recognised when it is earned, not necessarily when cash is received.'
    },
    {
      question: 'Which of the following is classified as cost of sales?',
      options: [
        'Office rent',
        'Advertising expenses',
        'Direct materials used to produce goods sold',
        'Bank charges'
      ],
      correct: 2,
      explanation: 'Cost of sales includes direct costs associated with producing goods or services, such as direct materials, direct labour, and direct overheads.'
    },
    {
      question: 'Gross profit is calculated as:',
      options: [
        'Revenue minus operating expenses',
        'Revenue minus cost of sales',
        'Operating profit minus tax',
        'Net profit plus interest'
      ],
      correct: 1,
      explanation: 'Gross profit = Revenue - Cost of Sales. It shows the profitability of core business operations before operating expenses.'
    },
    {
      question: 'Which expense would normally be classified as an operating expense?',
      options: [
        'Raw materials',
        'Delivery costs of inventory',
        'Salaries of administrative staff',
        'Purchase of inventory'
      ],
      correct: 2,
      explanation: 'Operating expenses include selling, administrative, and general expenses not directly tied to production, such as administrative salaries.'
    },
    {
      question: 'What does operating profit (EBIT) represent?',
      options: [
        'Profit after tax',
        'Profit before operating expenses',
        'Profit from core operations before interest and tax',
        'Cash generated from operations'
      ],
      correct: 2,
      explanation: 'EBIT (Earnings Before Interest and Tax) represents profit from core business operations before considering interest expenses and taxes.'
    },
    {
      question: 'Which item is NOT deducted when calculating operating profit?',
      options: [
        'Rent expense',
        'Marketing expenses',
        'Interest expense',
        'Salaries'
      ],
      correct: 2,
      explanation: 'Interest expense is a non-operating item and is not deducted when calculating operating profit. It appears after operating profit.'
    },
    {
      question: 'Net profit is best described as:',
      options: [
        'Revenue minus cost of sales only',
        'Profit before expenses',
        'Final profit after all expenses, interest, and tax',
        'Cash available in the bank'
      ],
      correct: 2,
      explanation: 'Net profit is the final bottom-line profit after deducting all expenses, including operating expenses, interest, and taxes.'
    },
    {
      question: 'The fundamental accounting equation for a balance sheet is:',
      options: [
        'Revenue - Expenses = Profit',
        'Assets = Liabilities + Equity',
        'Cash In - Cash Out = Net Cash',
        'Debits = Credits'
      ],
      correct: 1,
      explanation: 'The accounting equation states that Assets must always equal Liabilities plus Equity, ensuring the balance sheet always balances.'
    },
    {
      question: 'Current assets are expected to be converted to cash or used up within:',
      options: [
        '30 days',
        '90 days',
        '6 months',
        '1 year'
      ],
      correct: 3,
      explanation: 'Current assets are defined as assets that will be converted to cash, sold, or consumed within one year or one operating cycle.'
    },
    {
      question: 'Which of the following is a non-current liability?',
      options: [
        'Trade payables',
        'Bank overdraft',
        'Mortgage bond due in 5 years',
        'Accrued expenses'
      ],
      correct: 2,
      explanation: 'Non-current liabilities are obligations due after more than one year, such as long-term loans and mortgage bonds.'
    },
    {
      question: 'Notes to accounts are important because they:',
      options: [
        'Increase the total profit',
        'Provide additional detail and explain accounting policies',
        'Reduce the amount of tax payable',
        'Simplify the main financial statements'
      ],
      correct: 1,
      explanation: 'Notes to accounts provide essential supplementary information, explain accounting policies, and give context to the figures in the main statements.'
    },
    {
      question: 'A contingent liability should be disclosed in the notes when:',
      options: [
        'It is certain to occur',
        'The amount is known exactly',
        'There is a possible obligation whose existence depends on future events',
        'It has already been paid'
      ],
      correct: 2,
      explanation: 'Contingent liabilities are potential obligations that depend on future events and must be disclosed when there is a possible liability.'
    },
    {
      question: 'Why are financial statements often compared with prior periods?',
      options: [
        'To change accounting policies',
        'To calculate VAT',
        'To identify trends in profitability and financial position',
        'To reconcile bank accounts'
      ],
      correct: 2,
      explanation: 'Comparing financial statements with prior periods helps identify trends, assess performance, and make informed business decisions.'
    },
    {
      question: 'The current ratio measures:',
      options: [
        'Profitability',
        'Efficiency of asset use',
        'Ability to meet short-term obligations',
        'Long-term solvency'
      ],
      correct: 2,
      explanation: 'The current ratio (Current Assets ÷ Current Liabilities) measures a company\'s ability to meet its short-term obligations.'
    }
  ]
};
