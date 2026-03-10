/**
 * Courses Data
 * Unified data structure for all courses including featured and regular courses
 */

import { featuredCourses } from './featuredCourses';
import { comingSoonCourses } from './comingSoonCourses';
import { jobReadyCourses } from './jobReadyCourses';
import { UnifiedCourse } from '@/types/unifiedCourse';

// Import individual course data
import { aiAssistedProgrammingCourse } from './aiAssistedProgrammingCourse';
import { aiAssistedWebDevelopmentCourse } from './aiAssistedWebDevelopmentCourse';
import { computerRepairsCourse } from './computerRepairsCourse';
import { entrepreneurshipFinalCourse } from './entrepreneurshipFinalCourse';
import { soundEngineeringCourse } from './soundEngineeringCourse';
import { christianTeacherCourse } from './christianTeacherCourse';
import aiHumanRelationsCourse from './aiHumanRelations';
import roofingCourse from './roofingCourse';
import { smartHomeAutomationCourse } from './smartHomeAutomationCourse';
import { podcastManagementCourse } from './podcastManagement';
import { socialMediaMarketing101Course } from './socialMediaMarketing101Course';
import { landscaping101Course } from './landscaping101Course';
import masterchef101 from './masterchef101';
import beautyTherapy101 from './beautyTherapy101';
import doggrooming101 from './doggrooming101';
import { cybersecurity101Course } from './cybersecurity101Course';
import filmProduction101 from './filmProduction101';
import bookkeepingCourse from './bookkeeping';

// Helper function to convert Course to UnifiedCourse
const convertCourseToUnified = (course: any): UnifiedCourse => {
  // Map categories to standard categories
  const categoryMap: Record<string, string> = {
    'Culinary Arts': 'Hospitality and Culinary',
    'Beauty and Wellness': 'Health and Beauty',
    'Animal Care': 'Professional Services'
  };
  
  return {
    id: course.id,
    courseId: course.id,
    title: course.title,
    description: course.description,
    category: categoryMap[course.category] || course.category || 'Professional Services',
    level: course.level || 'beginner',
    duration: course.duration,
    price: course.price || 0,
    currency: course.currency || 'ZAR',
    instructor: typeof course.instructor === 'string' 
      ? course.instructor 
      : course.instructor?.name || 'Professional Instructor',
    rating: course.rating || 4.5,
    students: course.students || 0,
    image: course.thumbnail || course.image || '',
    isComingSoon: false,
    available: true
  };
};

// Combine all course data
const allCourseData = [
  ...featuredCourses,
  ...comingSoonCourses,
  ...jobReadyCourses,
  aiAssistedProgrammingCourse,
  aiAssistedWebDevelopmentCourse,
  computerRepairsCourse,
  entrepreneurshipFinalCourse,
  convertCourseToUnified(aiHumanRelationsCourse),
  soundEngineeringCourse,
  christianTeacherCourse,
  roofingCourse,
  smartHomeAutomationCourse,
  podcastManagementCourse,
  socialMediaMarketing101Course,
  landscaping101Course,
  convertCourseToUnified(masterchef101),
  convertCourseToUnified(beautyTherapy101),
  convertCourseToUnified(doggrooming101),
  cybersecurity101Course,
  convertCourseToUnified(filmProduction101),
  convertCourseToUnified(bookkeepingCourse)
];

// Normalize all courses to UnifiedCourse format
const normalizeToUnified = (course: any): UnifiedCourse | null => {
  if (!course || !course.id) return null;
  
  // If already UnifiedCourse, return as is
  if (course.courseId && course.image !== undefined) {
    return course as UnifiedCourse;
  }
  
  // Convert Course type or Partial<SimplifiedCourse> to UnifiedCourse
  return {
    id: course.id,
    courseId: course.id,
    title: course.title || '',
    description: course.description || '',
    category: course.category || 'Professional Services',
    level: course.level || 'beginner',
    duration: course.duration || '6-8 weeks',
    price: course.price || 0,
    currency: course.currency || 'ZAR',
    instructor: typeof course.instructor === 'string' 
      ? course.instructor 
      : course.instructor?.name || 'Professional Instructor',
    rating: course.rating || 4.5,
    students: course.students || 0,
    image: course.thumbnail || course.image || '',
    isComingSoon: course.isComingSoon ?? false,
    available: course.available ?? (course.isComingSoon ? false : true)
  };
};

// Remove duplicates based on ID
const uniqueCourses = new Map<string, UnifiedCourse>();

allCourseData.forEach(course => {
  const normalized = normalizeToUnified(course);
  if (normalized) {
    // Use the most complete version if duplicate exists
    const existing = uniqueCourses.get(normalized.id);
    if (!existing || Object.keys(normalized).length > Object.keys(existing).length) {
      uniqueCourses.set(normalized.id, normalized);
    }
  }
});

// Export unified courses data
export const coursesData: UnifiedCourse[] = Array.from(uniqueCourses.values());

// Export featured courses (already exported from featuredCourses.ts but re-export for convenience)
export { featuredCourses };

// Export coming soon courses
export { comingSoonCourses };

// Export job ready courses
export { jobReadyCourses };

/**
 * Get all courses
 */
export const getAllCourses = (): UnifiedCourse[] => {
  return coursesData;
};

/**
 * Get courses by category
 */
export const getCoursesByCategory = (category: string): UnifiedCourse[] => {
  return coursesData.filter(course => course.category === category);
};

/**
 * Get course by ID
 */
export const getCourseById = (id: string): UnifiedCourse | undefined => {
  return coursesData.find(course => course.id === id || course.courseId === id);
};

/**
 * Get available courses (not coming soon)
 */
export const getAvailableCourses = (): UnifiedCourse[] => {
  return coursesData.filter(course => course.available && !course.isComingSoon);
};

/**
 * Get free courses
 */
export const getFreeCourses = (): UnifiedCourse[] => {
  return coursesData.filter(course => course.price === 0);
};

/**
 * Get paid courses
 */
export const getPaidCourses = (): UnifiedCourse[] => {
  return coursesData.filter(course => course.price > 0);
};

/**
 * Search courses
 */
export const searchCourses = (query: string): UnifiedCourse[] => {
  const lowercaseQuery = query.toLowerCase();
  return coursesData.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.category.toLowerCase().includes(lowercaseQuery) ||
    course.instructor.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Get courses by level
 */
export const getCoursesByLevel = (level: string): UnifiedCourse[] => {
  return coursesData.filter(course => course.level === level);
};

/**
 * Get all unique categories
 */
export const getAllCategories = (): string[] => {
  const categories = coursesData.map(course => course.category);
  return [...new Set(categories)].sort();
};

/**
 * Get all unique levels
 */
export const getAllLevels = (): string[] => {
  const levels = coursesData.map(course => course.level);
  return [...new Set(levels)].sort();
};

/**
 * Get course statistics
 */
export const getCourseStats = () => {
  return {
    total: coursesData.length,
    featured: featuredCourses.length,
    comingSoon: comingSoonCourses.length,
    jobReady: jobReadyCourses.length,
    free: getFreeCourses().length,
    paid: getPaidCourses().length,
    categories: getAllCategories().length,
    levels: getAllLevels().length
  };
};

export default coursesData;