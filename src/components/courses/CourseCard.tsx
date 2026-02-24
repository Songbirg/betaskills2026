import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, Eye } from 'lucide-react';
import type { Course } from '@/hooks/useCourses';
import CourseAvailabilityBadge from './CourseAvailabilityBadge';

// Import course images
import entrepreneurshipNew from '../../../images/generation-0fca7938-9dd0-47b3-9d36-a552cd0e2ed2.png';
import aiHumanNew from '../../../images/generation-7f218044-3139-41b5-8dc7-afedae829ae7.png';
import soundEngineeringNew from '../../../images/generation-9c9ad650-aa25-4df1-9236-b137241521c0.png';
import podcastNew from '../../../images/generation-8d3c5693-9f7f-4360-8c0b-533dc0da09bd.png';
import dieselMechanicNew from '../../../images/generation-c8135d13-bf83-4379-847e-e306db926631.png';
import motorMechanicNew from '../../../images/generation-147b4caa-7110-471b-bea0-9f848409020e.png';
import computerRepairsNew from '../../../images/generation-223f5d12-39ae-4748-84af-466e0078c55d.png';
import cellphoneRepairsNew from '../../../images/generation-f3a5d1c2-fed5-4324-be4b-7b9c526b3455.png';
import hairDressingNew from '../../../images/generation-14193c97-8259-4674-ac20-0b8a10a628ea.png';
import nailTechnicianNew from '../../../images/generation-ca8e153c-3951-4b5e-b646-5b4e33e835cc.png';
import plumbingNew from '../../../images/generation-704ccdce-48ca-411f-b5de-3adbe0ef98c1.png';
import tilingNew from '../../../images/generation-25c77381-c00b-4f6f-a660-5de57dbf0cc5.png';
import roofingNew from '../../../images/generation-8dea647f-b6de-42c7-8708-d6e68a0fe5d1.png';
import tilingCourseImage from '@/assets/tiling-course.jpg';
import dieselMechanicCourseImage from '@/assets/diesel-mechanic-course.jpg';

const courseImages: Record<string, string> = {
  'c9d8e7f6-a5b4-9483-d2e3-f4a5b6c7d8e9': entrepreneurshipNew,
  'ai-human-relations': aiHumanNew,
  'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d4': soundEngineeringNew,
  'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d5': soundEngineeringNew, // Sound Engineering
  'podcast-management': podcastNew,
  'podcast-management-101': podcastNew,
  'b8c7d6e5-f4a3-9281-b0c9-d8e7f6a5b4c3': dieselMechanicNew,
  'a7b6c5d4-e3f2-8391-a2b3-c4d5e6f7a8b9': motorMechanicNew,
  'computer-repairs': computerRepairsNew,
  'cellphone-repairs': cellphoneRepairsNew,
  'cellphone-repairs-course': cellphoneRepairsNew,
  'cellphone-repairs-101': cellphoneRepairsNew,
  'hair-dressing-course': hairDressingNew,
  'hair-dressing': hairDressingNew,
  'nail-technician-course': nailTechnicianNew,
  'nail-technician': nailTechnicianNew,
  'plumbing-course': plumbingNew,
  'plumbing101': plumbingNew,
  'tiling-course': tilingNew,
  'tiling-101': tilingCourseImage,
  'motor-mechanic-diesel': dieselMechanicCourseImage,
  'motor-mechanic-petrol-02': motorMechanicNew,
  'roofing101': roofingNew,
  'roofing-course': roofingNew,
};

const courseAvailability: Record<string, 'Available' | 'Coming Soon'> = {
  'entrepreneurship-final': 'Available',
  'ai-human-relations': 'Available',
  'roofing101': 'Available',
  'plumbing101': 'Available',
  'tiling-101': 'Available',
  'hair-dressing': 'Available',
  'nail-technician': 'Available',
  'motor-mechanic-petrol-02': 'Available',
  'motor-mechanic-diesel': 'Available',
  'podcast-management-101': 'Available',
  'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d5': 'Available', // Sound Engineering
  'computer-repairs': 'Available',
  'cellphone-repairs-101': 'Available',
};

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const courseImage = courseImages[course.id] || '/placeholder.svg';
  const availability = 'Available';
  const instructor = course.instructor || { first_name: 'Unknown', last_name: 'Instructor' };

  return (
    <Card className="group h-full overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white dark:bg-gray-800 border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={courseImage}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          
          
          {/* Continue Learning Badge (if enrolled and available) */}
          {course.available && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-green-600/90 text-white border-0 font-medium">
                <BookOpen className="w-3 h-3 mr-1" />
                Continue Learning
              </Badge>
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students}</span>
            </div>
          </div>
          {/* Availability Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${
            'bg-green-500 text-white'
          }`}>
            {availability}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {course.is_free ? 'Free' : `${course.currency} ${course.price}`}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Master {instructor.first_name} {instructor.last_name}
            </span>
          </div>
          
          <Link to={`/course/${course.id}`}>
            {course.available ? (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transform transition-all duration-300 hover:scale-105">
                Continue Learning
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-600 hover:bg-orange-50 transform transition-all duration-300 hover:scale-105"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
