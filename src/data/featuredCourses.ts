import { UnifiedCourse, COURSE_CATEGORIES } from '@/types/unifiedCourse';

/**
 * Featured Courses Data
 * This file contains curated list of featured courses with complete data structure
 * All courses are validated against UnifiedCourse interface
 */

// Raw featured courses data with proper structure in the requested order
const rawFeaturedCourses = [
  {
    id: 'entrepreneurship-final',
    title: 'Entrepreneurship',
    instructor: 'Beta Skill Tutor',
    rating: 4.7,
    students: 1567,
    duration: '6 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Start your own business with proven entrepreneurial strategies.',
    category: 'Business',
    courseId: 'entrepreneurship-final'
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing 101',
    instructor: 'Digital Marketing Team',
    rating: 4.8,
    students: 2100,
    duration: '8 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Master social media marketing strategies across major platforms to grow brands and drive engagement.',
    category: 'Business',
    courseId: 'social-media-marketing'
  },
  {
    id: 'ai-cartoon-movies',
    title: 'AI Assisted Cartoon Movie Making',
    instructor: 'Creative AI Production Team',
    rating: 4.9,
    students: 0,
    duration: '8-10 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Master art of creating animated films using AI tools. Learn how to leverage artificial intelligence for scriptwriting, character design, animation, voice acting, editing, and distribution to produce professional-quality cartoon movies efficiently.',
    category: 'Film & Broadcasting',
    courseId: 'ai-cartoon-movies'
  },
  {
    id: 'podcast-management',
    title: 'Mastering Podcast Management',
    instructor: 'Sarah Johnson',
    rating: 4.6,
    students: 734,
    duration: '10 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Create and manage successful podcasts from concept to distribution.',
    category: 'Film & Broadcasting',
    courseId: 'podcast-management'
  },
  {
    id: 'roofing101',
    title: 'Roofing',
    instructor: 'Beta Skill Tutor',
    rating: 4.7,
    students: 650,
    duration: '8 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Comprehensive online course covering roofing design, installation, maintenance, and modern sustainable practices.',
    category: 'Construction and Civil',
    courseId: 'roofing101'
  },
  {
    id: 'plumbing101',
    title: 'Plumbing',
    instructor: 'Beta Skill Tutor',
    rating: 4.8,
    students: 1200,
    duration: '10 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Master plumbing fundamentals from installation to maintenance with hands-on training.',
    category: 'Construction and Civil',
    courseId: 'plumbing101'
  },
  {
    id: 'tiling-101',
    title: 'Tiling 101',
    instructor: 'Beta Skill Tutor',
    rating: 4.7,
    students: 890,
    duration: '6 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Learn professional tiling techniques for floors and walls with modern tools and materials.',
    category: 'Construction and Civil',
    courseId: 'tiling-101'
  },
  {
    id: 'landscaping',
    title: 'Landscaping',
    instructor: 'Landscaping Experts',
    rating: 4.6,
    students: 750,
    duration: '8 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Design and maintain beautiful outdoor spaces with professional landscaping techniques.',
    category: 'Professional Services',
    courseId: 'landscaping'
  },
  {
    id: 'hair-dressing',
    title: 'Hair Dressing',
    instructor: 'Expert Hair Styling Team',
    rating: 4.9,
    students: 3247,
    duration: '12 weeks',
    price: 500,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Comprehensive online course covering hair structure, cutting techniques, coloring, styling, and salon management for aspiring hair professionals.',
    category: 'Health and Beauty',
    courseId: 'hair-dressing'
  },
  {
    id: 'nail-technician',
    title: 'Nail Technician',
    instructor: 'Professional Nail Artistry Team',
    rating: 4.9,
    students: 0,
    duration: '10 weeks',
    price: 0,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Comprehensive online program covering nail anatomy, advanced manicure/pedicure techniques, gel and acrylic applications, nail art design, and salon management',
    category: 'Health and Beauty',
    courseId: 'nail-technician'
  },
  {
    id: 'petrol-mechanic',
    title: 'Petrol Motor Mechanic',
    instructor: 'Automotive Experts',
    rating: 4.7,
    students: 1100,
    duration: '12 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Master petrol engine repair, maintenance, and diagnostics with modern automotive technology.',
    category: 'Automotive',
    courseId: 'petrol-mechanic'
  },
  {
    id: 'motor-mechanic-diesel',
    title: 'Diesel Motor Mechanic',
    instructor: 'Automotive Experts',
    rating: 4.6,
    students: 950,
    duration: '12 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Learn diesel engine systems, repair, and maintenance for heavy-duty vehicles.',
    category: 'Automotive',
    courseId: 'motor-mechanic-diesel'
  },
  {
    id: 'electrician',
    title: 'Master Electrician Online',
    instructor: 'Electrical Experts',
    rating: 4.8,
    students: 1300,
    duration: '14 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Comprehensive electrical training from basics to advanced systems for professional electrician certification.',
    category: 'Construction and Civil',
    courseId: 'electrician'
  },
  {
    id: 'master-chef',
    title: 'Master Chef',
    instructor: 'Culinary Experts',
    rating: 4.9,
    students: 1800,
    duration: '16 weeks',
    price: 490,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Master culinary arts from basic techniques to gourmet cuisine with professional chef training.',
    category: 'Hospitality and Culinary',
    courseId: 'master-chef'
  },
  {
    id: 'selling-online',
    title: 'Selling Online',
    instructor: 'Online Business Expert Team',
    rating: 4.8,
    students: 0,
    duration: '12 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Learn how to sell products or services online successfully. Master choosing what to sell, setting up stores, attracting customers, managing fulfillment, and scaling profitably using data and marketing strategies.',
    category: 'Business',
    courseId: 'selling-online'
  },
  {
    id: 'solar101',
    title: 'Solar Energy Systems: Installation & Maintenance',
    instructor: 'Renewable Energy Experts',
    rating: 4.8,
    students: 1400,
    duration: '10 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Master solar panel installation, maintenance, and system design for renewable energy careers.',
    category: 'Electronics',
    courseId: 'solar101'
  },
  {
    id: 'smart-home-automation',
    title: 'Smart Home Automation',
    instructor: 'IoT Experts',
    rating: 4.7,
    students: 850,
    duration: '8 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Learn to design and install smart home systems using IoT technology and automation platforms.',
    category: 'ICT',
    courseId: 'smart-home-automation'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    instructor: 'Security Experts',
    rating: 4.8,
    students: 1600,
    duration: '12 weeks',
    price: 390,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Master cybersecurity fundamentals, ethical hacking, and network protection for digital security careers.',
    category: 'ICT',
    courseId: 'cybersecurity'
  },
  {
    id: 'online-trading',
    title: 'Online Trading - Financial Markets',
    instructor: 'Financial Markets Expert Team',
    rating: 4.9,
    students: 0,
    duration: '8-12 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'This course provides a structured foundation in financial markets and online trading. Learners will understand how markets function, how to analyse assets, manage risk, and execute trades using modern trading platforms. The course balances theory, market mechanics, and practical trading application.',
    category: 'Business',
    courseId: 'online-trading'
  },
  {
    id: 'carpentry101',
    title: 'Carpentry',
    instructor: 'Woodworking Experts',
    rating: 4.8,
    students: 1100,
    duration: '12 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Master carpentry skills from basic joinery to advanced furniture making and construction techniques.',
    category: 'Construction and Civil',
    courseId: 'carpentry101'
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    instructor: 'EI Specialists',
    rating: 4.9,
    students: 0,
    duration: '8-10 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Beginner',
    description: 'Master art of understanding and managing emotions to enhance your personal and professional life. This comprehensive course covers five key components of emotional intelligence: self-awareness, self-regulation, motivation, empathy, and social skills.',
    category: 'Personal Development',
    courseId: 'emotional-intelligence'
  },
  {
    id: 'prophet',
    title: 'Prophet',
    instructor: 'Beta Skill Tutor',
    rating: 4.9,
    students: 0,
    duration: '8-10 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Prophetic Ministry Training Course: Hearing, Speaking, and Living God\'s Voice. This course is designed for believers who are called to operate in office of a prophet or function in prophetic ministry.',
    category: 'Religion',
    courseId: 'prophet'
  },
  {
    id: 'ai-human-relations',
    title: 'AI and Human Relations',
    instructor: 'Beta Skill Tutor',
    rating: 4.9,
    students: 680,
    duration: '8 weeks',
    price: 290,
    image: '/courses-hero-bg.png',
    level: 'Intermediate',
    description: 'Explore the intersection of artificial intelligence and human interaction, covering AI fundamentals, ethics, and workplace applications.',
    category: 'ICT',
    courseId: 'ai-human-relations'
  }
];

/**
 * Validate and normalize course category
 */
function validateCategory(category: string): string {
  // Check if category exists in predefined categories
  if (Object.values(COURSE_CATEGORIES).includes(category as any)) {
    return category;
  }
  
  // Fallback to Professional Services if category is not found
  console.warn(`Category "${category}" not found in COURSE_CATEGORIES, using fallback`);
  return 'Professional Services';
}

/**
 * Validate course data structure
 */
function validateCourseData(course: any): boolean {
  const requiredFields = ['id', 'title', 'description', 'category', 'level', 'duration', 'instructor'];
  
  for (const field of requiredFields) {
    if (!course[field]) {
      console.error(`Missing required field "${field}" in course:`, course.title || course.id);
      return false;
    }
  }
  
  if (typeof course.price !== 'number' || course.price < 0) {
    console.error(`Invalid price for course:`, course.title || course.id);
    return false;
  }
  
  if (typeof course.rating !== 'number' || course.rating < 0 || course.rating > 5) {
    console.error(`Invalid rating for course:`, course.title || course.id);
    return false;
  }
  
  return true;
}

// Convert to UnifiedCourse format with validation
export const featuredCourses: UnifiedCourse[] = rawFeaturedCourses
  .filter(course => validateCourseData(course))
  .map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    category: validateCategory(course.category),
    level: course.level,
    duration: course.duration,
    instructor: course.instructor,
    rating: course.rating,
    students: course.students,
    price: course.price,
    currency: 'ZAR',
    image: course.image,
    is_free: course.price === 0,
    available: true,
    courseId: course.courseId || course.id
  }));

export default featuredCourses;
