import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { comingSoonCourses } from '@/data/comingSoonCourses';
import bookkeepingCourse from '@/data/bookkeeping';
import { aiHumanRelationsCourse } from '@/data/aiHumanRelations';
import { Course } from '@/types/course';

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        // Restored comprehensive static course list
        const now = new Date().toISOString();
        const instructor = { id: 'betaskilltutor', first_name: 'Beta Skill', last_name: 'Tutor', email: 'betaskilltraining@gmail.com' };
        const staticCourses: any[] = [
          { id: 'entrepreneurship-final', title: 'Entrepreneurship', description: '"Entrepreneurship: Creating Your Business" is a comprehensive online course designed to empower aspiring entrepreneurs with the skills, mindset, and strategies needed to launch and sustain a successful business.', category: 'Business', level: 'intermediate', duration: '6 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1247, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          bookkeepingCourse,
          aiHumanRelationsCourse,
          { id: 'roofing101', title: 'Roofing', description: 'Comprehensive online course covering roofing design, installation, maintenance, and modern sustainable practices.', category: 'Construction and Civil', level: 'beginner', duration: '8-10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 650, rating: 4.7, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'plumbing101', title: 'Plumbing', description: 'Comprehensive online course covering plumbing fundamentals, tools, systems, installation, and professional practices.', category: 'Construction and Civil', level: 'beginner', duration: '8-10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 650, rating: 4.7, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'tiling-101', title: 'Tiling', description: 'Learn professional tiling techniques for floors and walls with hands-on projects and safety best practices.', category: 'Construction and Civil', level: 'beginner', duration: '8-10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 540, rating: 4.6, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'hair-dressing', title: 'Hair Dressing', description: 'Become a professional hair stylist. Learn cutting, coloring, styling, and client care.', category: 'Health and Beauty', level: 'beginner', duration: '6-8 weeks', is_free: false, price: 290, currency: 'ZAR', students: 720, rating: 4.7, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'nail-technician', title: 'Nail Technician', description: 'Master nail care, art, and salon hygiene to become a certified nail technician.', category: 'Health and Beauty', level: 'beginner', duration: '6-8 weeks', is_free: false, price: 290, currency: 'ZAR', students: 690, rating: 4.7, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'motor-mechanic-petrol-02', title: 'Petrol Motor Mechanic', description: 'Hands-on training for petrol engine mechanics including diagnostics and repair.', category: 'Motor Vehicles', level: 'intermediate', duration: '10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 480, rating: 4.6, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'motor-mechanic-diesel', title: 'Diesel Motor Mechanic', description: 'Comprehensive diesel engine diagnostics, maintenance, and repair training.', category: 'Motor Vehicles', level: 'intermediate', duration: '10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 460, rating: 4.6, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'landscaping101', title: 'Landscaping', description: 'Comprehensive online course covering landscaping fundamentals, design principles, plant and soil management, hardscaping, installation techniques, sustainable practices, and business operations.', category: 'Construction and Trades', level: 'beginner', duration: '8-10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1150, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'social-media-marketing-101', title: 'Social Media Marketing', description: 'Comprehensive online course covering social media marketing fundamentals, platform strategies, content creation, paid advertising, analytics, and advanced tactics. Master Instagram, TikTok, LinkedIn, and emerging platforms.', category: 'Digital Marketing', level: 'beginner', duration: '10-12 weeks', is_free: false, price: 290, currency: 'ZAR', students: 850, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'electrician101', title: 'Master Electrician Online', description: 'Comprehensive Training for Electrical Expertise. Master electrical installations, safety protocols, troubleshooting, and NEC standards for residential, commercial, and industrial settings.', category: 'Construction and Trades', level: 'beginner', duration: '14-16 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1450, rating: 4.9, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'solar101', title: 'Solar Energy Systems: Installation & Maintenance', description: 'Comprehensive training in solar PV technology covering photovoltaic system components, design principles, installation procedures, maintenance practices, safety protocols, and compliance standards.', category: 'Renewable Energy', level: 'beginner', duration: '14-16 weeks', is_free: false, price: 290, currency: 'ZAR', students: 2850, rating: 4.9, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'carpentry101', title: 'Carpentry', description: 'Comprehensive carpentry training covering hand tools, power tools, wood properties, joinery techniques, assembly methods, finishing, furniture making, cabinet making, and professional business skills for a successful carpentry career.', category: 'Skilled Trades', level: 'beginner', duration: '12-14 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1850, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'podcast-management-101', title: 'Mastering Podcast Management', description: 'Plan, record, edit, and publish professional podcasts with marketing strategies.', category: 'Film & Broadcasting', level: 'intermediate', duration: '8 weeks', is_free: false, price: 290, currency: 'ZAR', students: 830, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'computer-repairs', title: 'Computer & Laptop Repairs', description: 'Diagnose and repair common computer and laptop hardware/software issues.', category: 'Electronics', level: 'intermediate', duration: '8 weeks', is_free: false, price: 290, currency: 'ZAR', students: 900, rating: 4.7, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'cellphone-repairs-101', title: 'Cellphone Repairs and Maintenance', description: 'Professional smartphone diagnostics, component replacement, and maintenance.', category: 'Electronics', level: 'intermediate', duration: '8 weeks', is_free: false, price: 290, currency: 'ZAR', students: 910, rating: 4.7, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d5', title: 'Sound Engineering', description: 'Sound recording, mixing, mastering, and audio production techniques.', category: 'Film & Broadcasting', level: 'intermediate', duration: '10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1020, rating: 4.9, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'masterchef101', title: 'Master Chef', description: 'Comprehensive professional culinary arts course covering foundations, essential cooking techniques, international cuisines, advanced techniques, creativity, nutrition, business, and leadership. Master professional culinary skills for a successful career in the culinary industry.', category: 'Hospitality and Culinary', level: 'beginner', duration: '12-16 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1200, rating: 4.9, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'cybersecurity101', title: 'Cybersecurity', description: 'This course equips learners with foundational knowledge and practical skills in cybersecurity. It covers essential concepts such as threat identification, secure communication, ethical hacking, malware protection, and risk management. Learners will explore both technical and behavioral aspects of securing digital environments, preparing them for personal safety and entry-level careers in cybersecurity.', category: 'ICT', level: 'beginner', duration: '10-12 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1500, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'doggrooming101', title: 'Dog Grooming & Training', description: 'Comprehensive professional dog grooming and training course covering grooming fundamentals, breed-specific techniques, health and safety, business operations, and advanced training methods. Master the skills needed for a successful career in pet care.', category: 'Professional Services', level: 'beginner', duration: '10-12 weeks', is_free: false, price: 290, currency: 'ZAR', students: 950, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'beautyTherapy101', title: 'Beauty Therapy', description: 'Comprehensive professional beauty therapy course covering skincare, makeup, nail care, hair removal, body treatments, and business skills. Master the techniques and knowledge needed for a successful career in the beauty industry.', category: 'Health and Beauty', level: 'beginner', duration: '10-12 weeks', is_free: false, price: 290, currency: 'ZAR', students: 1100, rating: 4.8, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'emotional-intelligence', title: 'Emotional Intelligence', description: 'Master the art of understanding and managing emotions to enhance your personal and professional life. This comprehensive course covers the five key components of emotional intelligence: self-awareness, self-regulation, motivation, empathy, and social skills. Learn practical strategies to build stronger relationships, improve communication, resolve conflicts, and achieve success in all areas of life.', category: 'Personal Development', level: 'beginner', duration: '8-10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 0, rating: 4.9, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
          { id: 'prophet', title: 'Prophet', description: 'Prophetic Ministry Training Course: Hearing, Speaking, and Living God\'s Voice. This course is designed for believers who are called to operate in the office of a prophet (Ephesians 4:11) or function in prophetic ministry. It focuses on cultivating the gift of prophecy, spiritual maturity, and the ability to discern and deliver God\'s word with accuracy, humility, and accountability.', category: 'Spiritual Development', level: 'intermediate', duration: '8-10 weeks', is_free: false, price: 290, currency: 'ZAR', students: 0, rating: 4.9, instructor, status: 'approved', created_at: now, updated_at: now, available: true },
        ];

        // Merge Coming Soon courses and normalize defaults
        const allCourses = [...staticCourses, ...comingSoonCourses as any].map((c: any) => ({
          ...c,
          instructor: c.instructor || instructor,
          created_at: c.created_at || now,
          updated_at: c.updated_at || now,
          currency: c.currency || 'ZAR',
          is_free: c.is_free ?? false,
          students: c.students ?? 0,
          rating: c.rating ?? 5,
          available: c.isComingSoon ? false : (c.available ?? true),
          status: c.status || 'approved',
          // Add missing properties for comingSoonCourses
          category: c.category || 'Professional Services',
          level: c.level || 'beginner',
          duration: c.duration || '6-8 weeks',
          price: c.price || 290,
        })) as Course[];

        const normalizeTitle = (t: unknown) => String(t || '').trim().toLowerCase();
        const titlesToDedupe = new Set([
          'forex trading',
          'cell phone repairs',
          'electrician',
          'solar energy - installations and repairs',
          'landscaping',
          'beauty therapy essentials',
          'dog grooming and training',
          'social media marketing',
        ]);

        const seenDedupeTitles = new Set<string>();
        const dedupedCourses = allCourses.filter((course) => {
          const normalizedTitle = normalizeTitle((course as any).title);
          if (!titlesToDedupe.has(normalizedTitle)) return true;
          if (seenDedupeTitles.has(normalizedTitle)) return false;
          seenDedupeTitles.add(normalizedTitle);
          return true;
        });

        setCourses(dedupedCourses);
        setLoading(false);
        console.log('CoursesProvider loaded courses:', dedupedCourses);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, loading, error }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCoursesContext = () => {
  const context = useContext(CoursesContext);
  if (!context) throw new Error('useCoursesContext must be used within a CoursesProvider');
  return context;
};
