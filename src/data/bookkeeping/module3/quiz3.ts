import type { Quiz } from '@/types/course';

const quiz3: Quiz = {
  id: 3,
  title: 'Module 3 Quiz: Source Documents',
  questions: [
    {
      question: 'What is the primary purpose of a sales invoice?',
      options: [
        'To acknowledge payment received from a customer',
        'To request payment from a customer for goods or services provided',
        'To record petty cash expenditures',
        'To reconcile bank statements'
      ],
      correct: 1,
      explanation: 'A sales invoice is used to request payment from a customer for goods or services provided.'
    },
    {
      question: 'Which of the following details is mandatory on a VAT-compliant invoice in South Africa?',
      options: [
        'Supplier tax number, invoice date, taxable amount, and VAT rate',
        'Bank account number of customer',
        'Petty cash voucher number',
        'Employee signature'
      ],
      correct: 0,
      explanation: 'VAT-compliant invoices must include supplier tax number, invoice date, taxable amount, and VAT rate.'
    },
    {
      question: 'A purchase invoice is primarily used to:',
      options: [
        'Record revenue received from customers',
        'Evidence costs incurred, allowing deduction against income and input VAT claims',
        'Authorise petty cash withdrawals',
        'Serve as a proof of cheque payment'
      ],
      correct: 1,
      explanation: 'Purchase invoices evidence costs incurred and allow deduction against income with input VAT claims.'
    },
    {
      question: 'Credit notes are issued to:',
      options: [
        'Increase the amount a customer owes',
        'Reduce the original invoice amount due to returns, discounts, or allowances',
        'Authorise payment from bank',
        'Track petty cash disbursements'
      ],
      correct: 1,
      explanation: 'Credit notes reduce the original invoice amount due to returns, discounts, or allowances.'
    },
    {
      question: 'Which of the following best describes a debit note?',
      options: [
        'A document issued to reduce a supplier\'s payment',
        'A document issued to correct an undercharge on a previously issued invoice',
        'A type of digital receipt',
        'A cheque authorization form'
      ],
      correct: 1,
      explanation: 'A debit note is issued to correct an undercharge on a previously issued invoice.'
    },
    {
      question: 'What is a key benefit of using digital invoices over paper invoices?',
      options: [
        'They are not legally valid in South Africa',
        'They reduce paper use, speed up delivery, and maintain compliance if details are complete',
        'They cannot include VAT details',
        'They replace the need for bank statements'
      ],
      correct: 1,
      explanation: 'Digital invoices reduce paper use, speed up delivery, and maintain compliance if details are complete.'
    },
    {
      question: 'Which practice is essential when managing petty cash vouchers?',
      options: [
        'Recording only large purchases above R5,000',
        'Including date, amount, purpose, payee signature, and authoriser approval for every transaction',
        'Avoiding receipts to save time',
        'Issuing vouchers only electronically'
      ],
      correct: 1,
      explanation: 'Essential practice includes date, amount, purpose, payee signature, and authoriser approval for every transaction.'
    },
    {
      question: 'Why is reconciling bank statements important in bookkeeping?',
      options: [
        'To process petty cash vouchers',
        'To verify ledger entries, detect errors or fraud, and ensure account balances match reality',
        'To issue credit notes to customers',
        'To calculate VAT on sales invoices'
      ],
      correct: 1,
      explanation: 'Bank statement reconciliation verifies ledger entries, detects errors or fraud, and ensures account balances match reality.'
    },
    {
      question: 'What is the main function of a receipt issued to a customer?',
      options: [
        'To request payment for goods or services',
        'To formally acknowledge that payment has been received',
        'To serve as a debit note',
        'To reconcile bank statements'
      ],
      correct: 1,
      explanation: 'The main function of a customer receipt is to formally acknowledge that payment has been received.'
    },
    {
      question: 'Sequential numbering on invoices, receipts, and petty cash vouchers is important because:',
      options: [
        'It speeds up payments to suppliers',
        'It ensures compliance with SARS, supports audits, and prevents gaps or duplication in financial records',
        'It allows digital vouchers to be optional',
        'It prevents VAT from being calculated'
      ],
      correct: 1,
      explanation: 'Sequential numbering ensures compliance with SARS, supports audits, and prevents gaps or duplication in financial records.'
    }
  ]
};

export default quiz3;
