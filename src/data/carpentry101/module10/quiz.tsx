import type { Quiz } from '@/types/course';

const quiz: Quiz = {
  id: 10,
  title: 'Module 10 Quiz: Capstone Project & Portfolio',
  questions: [
    {
      id: 1,
      question: 'What is the primary purpose of creating detailed project plans before starting a carpentry project?',
      options: [
        'To impress potential clients',
        'To ensure accurate material estimation and workflow sequencing',
        'To fulfill legal requirements',
        'To practice drawing skills'
      ],
      correctAnswer: 1,
      explanation: 'Detailed project plans are essential for accurate material estimation, workflow sequencing, and identifying potential challenges before they occur.'
    },
    {
      id: 2,
      question: 'Which of the following is most important when documenting a completed carpentry project for your portfolio?',
      options: [
        'Only showing the final finished piece',
        'Including progress photos, technical details, and client testimonials',
        'Focusing only on mistakes made during the project',
        'Documenting only the tools used'
      ],
      correctAnswer: 1,
      explanation: 'A comprehensive portfolio includes progress photos, technical details, client testimonials, and challenges overcome, demonstrating your full capabilities.'
    },
    {
      id: 3,
      question: 'What should be your first step when planning a major carpentry project?',
      options: [
        'Ordering all materials immediately',
        'Creating detailed drawings and specifications',
        'Hiring additional workers',
        'Setting up the workshop'
      ],
      correctAnswer: 1,
      explanation: 'Creating detailed drawings and specifications should always be the first step, as this guides all subsequent planning and material decisions.'
    },
    {
      id: 4,
      question: 'How can you best demonstrate problem-solving skills in your carpentry portfolio?',
      options: [
        'By only showing perfect projects with no issues',
        'By documenting challenges and how you overcame them',
        'By listing all tools you own',
        'By including certificates only'
      ],
      correctAnswer: 1,
      explanation: 'Documenting challenges and solutions demonstrates real-world problem-solving abilities, which is highly valued by clients and employers.'
    },
    {
      id: 5,
      question: 'What is the most effective way to present your carpentry portfolio to potential clients?',
      options: [
        'Showing only photos without descriptions',
        'Including project context, your role, challenges, and outcomes',
        'Focusing only on pricing information',
        'Presenting only technical drawings'
      ],
      correctAnswer: 1,
      explanation: 'Effective portfolios include project context, your specific role, challenges overcome, and measurable outcomes, telling a complete story of your capabilities.'
    }
  ]
};

export default quiz;
