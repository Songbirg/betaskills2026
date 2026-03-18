import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Users, Star } from 'lucide-react';
import mechanicHD from '@/assets/motor-mechanic-course.jpg';
import { useEffect, useState } from 'react';

interface CourseHeaderProps {
  course: any;
  totalDuration: string;
  totalLessons: number;
}

// Map course titles to relevant Unsplash images of black professionals at work
const courseHeroImages: Record<string, string> = {
  'Sound Engineering Professional Certification': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80', // Black sound engineer in studio
  'Diesel Mechanic Professional Certification': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80', // Black mechanic
  'Motor Mechanic (Petrol) Professional Certification': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80', // Black mechanic
  'Professional Hair Dressing Certification': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1600&q=80', // Black hairdresser
  'Professional Nail Technician Certification': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&q=80', // Black nail technician
  'Professional Plumbing Training Program': 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80', // Black plumber
  'Professional Tiling Certification': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1600&q=80', // Black tiler
  'Professional Roofing Certification': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1600&q=80', // Black roofer
  'Roofing Mastery: Design, Installation, and Maintenance': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80', // Black roofer
  'Entrepreneurship Fundamentals': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80', // Black entrepreneur
  'Entrepreneurship: Building Your Business': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80', // Black entrepreneur
  'AI and Human Relations': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80', // Black person with tech
  'Mastering Podcast Management': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80', // Black podcaster
  'Computer & Laptop Repairs': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&q=80', // Black IT professional
  'Cellphone Repairs and Maintenance': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&q=80', // Black cellphone repair
};

const CourseHeader = ({ course, totalDuration, totalLessons }: CourseHeaderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Update current slide
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Slides: multiple slides for auto-play carousel
  const slides = [
    {
      title: course.title,
      stats: (
        <div className="flex flex-wrap justify-center gap-4 mt-4 animate-fade-in-card">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <BookOpen className="h-4 w-4 text-white/90" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <Users className="h-4 w-4 text-white/90" />
            <span>{course.students?.toLocaleString() || 0} students</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <Star className="h-4 w-4 text-yellow-300" />
            <span className="text-yellow-200">{course.rating} rating</span>
          </div>
        </div>
      )
    },
    {
      title: "Learn at Your Own Pace",
      stats: (
        <div className="flex flex-wrap justify-center gap-4 mt-4 animate-fade-in-card">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <BookOpen className="h-4 w-4 text-white/90" />
            <span>Self-paced learning</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <Star className="h-4 w-4 text-white/90" />
            <span>Practical skills</span>
          </div>
        </div>
      )
    },
    {
      title: "Get Certified Today",
      stats: (
        <div className="flex flex-wrap justify-center gap-4 mt-4 animate-fade-in-card">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <BookOpen className="h-4 w-4 text-white/90" />
            <span>Professional certification</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 shadow-lg text-white text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-gradient-x">
            <Users className="h-4 w-4 text-white/90" />
            <span>Career advancement</span>
          </div>
        </div>
      )
    }
  ];

  // Dynamically select a relevant HD Unsplash image for the course
  const heroBg = courseHeroImages[course.title] || 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80';

  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl shadow-xl animate-fade-in min-h-[260px] max-h-[420px]" style={{height:'auto'}}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-80" />
      {/* HD Mechanic Image overlay */}
      <img src={heroBg} alt="Mechanics at work" className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" />
      {/* Black overlay for clarity */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Animated blurred shapes for depth */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse-glow z-20" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-glow delay-700 z-20" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-400/10 via-pink-400/10 to-purple-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-gradient-x z-20" />
      <div className="relative z-30 py-10 px-4 sm:px-8 flex flex-col items-center justify-center min-h-[180px] max-h-[340px]">
        <Badge className="mb-4 bg-blue-100 text-blue-800 px-3 py-1">
          {course.category} • {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
        </Badge>
        <Carousel 
          className="w-full max-w-3xl mx-auto"
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent>
            {slides.map((slide, idx) => (
              <CarouselItem key={idx} className="flex flex-col items-center justify-center text-center min-h-[200px]">
                <h1 className="text-lg md:text-xl font-semibold mb-2 drop-shadow-lg animate-fade-in delay-100" style={{color: '#fff'}}>{slide.title}</h1>
                {slide.stats}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-30" />
          <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-30" />
        </Carousel>
      </div>
      {/* Animated background keyframes */}
      <style>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-card {
          opacity: 0;
          transform: translateY(40px) scale(0.98);
          animation: fadeInCard 0.7s cubic-bezier(.4,2,.3,1) forwards;
        }
        @keyframes fadeInCard {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite alternate;
        }
        @keyframes pulseGlow {
          0% { opacity: 0.5; filter: blur(32px); }
          100% { opacity: 0.9; filter: blur(48px); }
        }
      `}</style>
    </div>
  );
};

export default CourseHeader;
