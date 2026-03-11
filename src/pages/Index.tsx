import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';

// Simple, reliable home page that always works
const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Beta Skills</h2>
          <p className="text-gray-600">Loading your learning platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/lovable-uploads/c890d50b-9e2b-4f34-8958-e006a579ccea.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/85 to-black/90"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white rounded-full p-4 shadow-2xl">
                <img 
                  src="/lovable-uploads/c890d50b-9e2b-4f34-8958-e006a579ccea.png" 
                  alt="Beta Skill Logo" 
                  className="h-20 w-auto"
                />
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
              <span className="text-red-500">BETA</span>
              <span className="ml-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                SKILL TRAINING
              </span>
            </h1>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              An Accredited Training Provider
            </h2>
            
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              FREE TRAINING TO START YOUR OWN BUSINESS
            </h3>
            
            <h3 className="text-lg md:text-xl font-bold text-white mb-8">
              Pay Just <span className="text-red-500">R290.00</span> – Registration fee!
            </h3>
            
            {/* Warning Messages */}
            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-red-700 to-red-800 text-white px-6 py-3 rounded-full shadow-xl inline-block">
                <div className="text-lg font-bold">FEES MUST FALL!</div>
              </div>
              <div className="block">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full shadow-2xl inline-block">
                  <div className="text-xl font-black">JOBS ARE AT RISK!</div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300">
                  OUR COURSES
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300">
                  APPLY NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-black tracking-tight text-gray-900">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">60+</span>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">Professional Courses</div>
              <div className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-black tracking-tight text-gray-900">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">1000+</span>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">Students Enrolled</div>
              <div className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-black tracking-tight text-gray-900">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">100%</span>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">Free Training</div>
              <div className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="relative bg-gray-50 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed to help you start your own business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Cards */}
            <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Entrepreneurship</h3>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    Business
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Learn to create and manage your own business</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                    R290
                  </span>
                  <Link to="/courses">
                    <Button className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Plumbing</h3>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    Construction
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Master plumbing fundamentals and techniques</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                    R290
                  </span>
                  <Link to="/courses">
                    <Button className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Hair Dressing</h3>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    Beauty
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Professional hair styling and salon management</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                    R290
                  </span>
                  <Link to="/courses">
                    <Button className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">AI and Human Relations</h3>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                    ICT
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Explore AI, ethics, communication, and workplace applications</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                    R290
                  </span>
                  <Link to="/course/ai-human-relations">
                    <Button className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" className="rounded-full bg-gray-900 hover:bg-black text-white px-8 py-4 text-lg font-bold shadow-lg">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/lovable-uploads/c890d50b-9e2b-4f34-8958-e006a579ccea.png" 
                  alt="Beta Skill Logo" 
                  className="h-12 w-auto mr-3"
                />
                <div>
                  <h3 className="text-xl font-bold">BETA SKILL</h3>
                  <p className="text-sm text-gray-400">Training Solutions</p>
                </div>
              </div>
              <p className="text-gray-400">
                Empowering you with free, world-class skills training to start your own business.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors">Apply Now</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>126 Plantation Rd.</p>
                <p>Blue Hills AH, Midrand</p>
                <p>Johannesburg</p>
                <p>Phone: 011 046 9483</p>
                <p>Email: registrar@betaskills.co.za</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Beta Skill Training Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;