import { Quiz } from '../../types';

export const quiz10: Quiz = {
  id: 'quiz10',
  title: 'Cash and Bank Management Quiz',
  questions: [
    {
      question: 'What is the primary purpose of cash management in a business?',
      options: [
        'To maximize profits at all costs',
        'To ensure sufficient funds for daily operations while maximizing returns on excess cash',
        'To eliminate all expenses',
        'To borrow as much money as possible'
      ],
      correct: 1,
      explanation: 'Cash management aims to maintain adequate liquidity for operations while optimizing the use of excess cash to generate returns.'
    },
    {
      question: 'The cash conversion cycle is calculated as:',
      options: [
        'Inventory Period + Receivables Period + Payables Period',
        'Inventory Period + Receivables Period - Payables Period',
        'Receivables Period - Inventory Period - Payables Period',
        'Payables Period - Inventory Period + Receivables Period'
      ],
      correct: 1,
      explanation: 'The cash conversion cycle equals the inventory period plus the receivables period minus the payables period, showing the time between paying for inventory and collecting cash from sales.'
    },
    {
      question: 'What are deposits in transit in bank reconciliation?',
      options: [
        'Deposits that have bounced',
        'Deposits recorded in the cash book but not yet appearing on the bank statement',
        'Deposits made directly by customers',
        'Deposits that have been rejected by the bank'
      ],
      correct: 1,
      explanation: 'Deposits in transit are deposits recorded in the company\'s books but not yet processed by the bank, typically due to timing differences near the statement cutoff date.'
    },
    {
      question: 'Outstanding cheques are:',
      options: [
        'Cheques that have been returned for insufficient funds',
        'Cheques recorded in the cash book but not yet presented for payment',
        'Cheques that have been cancelled',
        'Cheques written for amounts larger than the account balance'
      ],
      correct: 1,
      explanation: 'Outstanding cheques are cheques that have been issued and recorded in the cash book but have not yet been presented to the bank for payment.'
    },
    {
      question: 'A petty cash fund is typically used for:',
      options: [
        'Large capital expenditures',
        'Salary payments to employees',
        'Small, immediate expenses where formal payment methods are impractical',
        'Major supplier payments'
      ],
      correct: 2,
      explanation: 'Petty cash is designed for small, frequent expenses where writing a cheque or making electronic payment would be inefficient or impractical.'
    },
    {
      question: 'What is the main purpose of bank reconciliation?',
      options: [
        'To calculate interest earned on bank accounts',
        'To compare and match company cash records with bank records to ensure accuracy',
        'To request additional loans from the bank',
        'To close bank accounts that are not needed'
      ],
      correct: 1,
      explanation: 'Bank reconciliation verifies that the company\'s cash records match the bank\'s records, ensuring accuracy and identifying discrepancies.'
    },
    {
      question: 'Which of the following is NOT a typical internal control for petty cash?',
      options: [
        'Segregation of duties between custodian and reviewer',
        'Regular surprise counts of the petty cash fund',
        'Allowing any employee to access petty cash without authorization',
        'Requirement for supporting documentation for all disbursements'
      ],
      correct: 2,
      explanation: 'Proper internal controls require authorization and limited access to petty cash, not allowing unrestricted access by any employee.'
    },
    {
      question: 'When preparing a bank reconciliation statement, outstanding cheques are:',
      options: [
        'Added to the bank statement balance',
        'Deducted from the bank statement balance',
        'Added to the cash book balance',
        'Ignored as they will clear automatically'
      ],
      correct: 1,
      explanation: 'Outstanding cheques are deducted from the bank statement balance because they represent payments that have not yet cleared the bank.'
    },
    {
      question: 'The current ratio measures a business\'s ability to:',
      options: [
        'Generate profits from sales',
        'Meet short-term obligations with current assets',
        'Manage inventory efficiently',
        'Collect receivables quickly'
      ],
      correct: 1,
      explanation: 'The current ratio (Current Assets ÷ Current Liabilities) measures a company\'s ability to meet its short-term obligations with its current assets.'
    },
    {
      question: 'A petty cash replenishment should be done when:',
      options: [
        'The fund is completely empty',
        'The fund reaches a predetermined minimum level',
        'At the end of each month regardless of balance',
        'Only when requested by the CEO'
      ],
      correct: 1,
      explanation: 'Petty cash funds should be replenished when they reach a predetermined minimum level to ensure availability for small expenses while maintaining control.'
    },
    {
      question: 'Which expense would most likely be paid from petty cash?',
      options: [
        'Monthly rent payment',
        'Purchase of office equipment',
        'Postage stamps for mail',
        'Employee salaries'
      ],
      correct: 2,
      explanation: 'Postage stamps are small, frequent expenses that are typically paid from petty cash due to their small amount and immediate need.'
    },
    {
      question: 'Bank charges that appear on the bank statement but not in the cash book should be:',
      options: [
        'Added to the bank statement balance',
        'Deducted from the bank statement balance',
        'Added to the cash book balance',
        'Ignored as they are bank errors'
      ],
      correct: 2,
      explanation: 'Bank charges not yet recorded in the cash book should be deducted from the cash book balance (or added to the bank statement balance) in the reconciliation.'
    },
    {
      question: 'The primary purpose of maintaining a petty cash fund is to:',
      options: [
        'Reduce the need for bank accounts',
        'Avoid the paperwork and delay associated with small payments',
        'Increase employee salaries',
        'Hide small expenses from management'
      ],
      correct: 1,
      explanation: 'Petty cash funds exist to provide a convenient way to handle small expenses without the administrative burden of formal payment methods.'
    },
    {
      question: 'Which of the following would improve cash flow management?',
      options: [
        'Paying suppliers immediately upon receiving invoices',
        'Offering customers extended payment terms',
        'Implementing stricter credit control and faster collection procedures',
        'Maintaining large amounts of idle cash in non-interest-bearing accounts'
      ],
      correct: 2,
      explanation: 'Improving collection procedures and credit control helps accelerate cash inflows, which is essential for effective cash flow management.'
    },
    {
      question: 'A petty cash voucher should include all of the following EXCEPT:',
      options: [
        'Date and amount of disbursement',
        'Purpose of the expense',
        'Employee\'s bank account number',
        'Authorizing signature'
      ],
      correct: 2,
      explanation: 'A petty cash voucher does not require the employee\'s bank account number, as it\'s for documenting small cash payments, not electronic transfers.'
    }
  ]
};
