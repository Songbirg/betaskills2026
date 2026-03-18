import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import LessonHeader from './LessonHeader';
import LessonActions from './video-lesson/LessonActions';
import AnimatedLessonContent from './AnimatedLessonContent';
import ContentFormatter from './animated-lesson/ContentFormatter';
import Module1HardwareContent from './lessons/Module1HardwareContent';
import SoundEngineeringContent from './lessons/SoundEngineeringContent';
import MinimalIconProcessor from './MinimalIconProcessor';
import { generateFallbackContent } from './video-lesson/ContentGenerator';
// import YouTubeVideoRenderer from './YouTubeVideoRenderer';
import type { VideoLesson } from '@/types/course';

interface VideoLessonRendererProps {
  lesson: VideoLesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNext: () => void;
}

const VideoLessonRenderer = ({ lesson, isCompleted, onMarkComplete, onNext }: VideoLessonRendererProps) => {
  const [contentCompleted, setContentCompleted] = useState(false);

  const componentContent = React.useMemo(() => {
    const contentAny = lesson.content as any;

    if (React.isValidElement(contentAny)) return contentAny;
    if (typeof contentAny === 'function') return React.createElement(contentAny);

    return null;
  }, [lesson.content]);

  // Helper function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1].split('?')[0];
    } else if (url.includes('www.youtube.com/watch?')) {
      return url.split('v=')[1].split('&')[0];
    }
    return url;
  };

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  // Check if this is Module 1 Lesson 1 (Hardware Fundamentals) - keep special content for this
  const isModule1Lesson1 = lesson.id === 1 && (
    lesson.title === 'Introduction to Computer Hardware' || 
    lesson.title === 'Computer Hardware Fundamentals'
  );

  // Check if this is a Sound Engineering lesson that should use special content
  const isSoundEngineeringLegacyLesson = false; // Disable legacy content for now
  
  // Use animated content for ALL other lessons by default (including Sound Engineering and Podcast Management)
  const useAnimatedContent = !isModule1Lesson1 && !isSoundEngineeringLegacyLesson;

  // Check if content contains HTML (applies to any course with HTML content)
  const textContent = typeof lesson.content === 'string'
    ? lesson.content
    : (lesson.content as any)?.textContent;

  const resolvedVideoUrl = (lesson as any)?.content?.videoUrl || (lesson as any)?.videoUrl || '';

  const hasHtmlContent = !!textContent && (
    textContent.includes('<div') ||
    textContent.includes('<h2>') ||
    textContent.includes('<ul>') ||
    textContent.includes('<li>') ||
    textContent.includes('<p>') ||
    textContent.includes('class=')
  );

  // Always preserve original content - DO NOT generate fallback for existing content
  const lessonContent = textContent || generateFallbackContent(lesson);
  
  // Use original content without adding YouTube text - videos will be handled by the renderer
  const enhancedContent = lessonContent;
  
  // Debug logging - minimal to avoid performance issues
  React.useEffect(() => {
    if (lesson.content?.textContent?.length === 0) {
      console.warn('VideoLessonRenderer: Empty content for lesson', lesson.id);
    }
    if (resolvedVideoUrl) {
      console.log(`VideoLessonRenderer: Processing video for lesson "${lesson.title}"`);
      console.log(`VideoLessonRenderer: Video URL: ${resolvedVideoUrl}`);
      console.log(`VideoLessonRenderer: Enhanced content starts with: ${enhancedContent.substring(0, 100)}...`);
    }
  }, [lesson.id, (lesson as any)?.content?.videoUrl, (lesson as any)?.videoUrl, lesson.title, enhancedContent, resolvedVideoUrl]);

  const handleContentComplete = () => {
    setContentCompleted(true);
  };

  const handleMarkComplete = () => {
    onMarkComplete();
  };

  return (
    <div className="space-y-6 animate-fade-in mobile-full-width">
      {/* Header */}
      <LessonHeader lesson={lesson} isCompleted={isCompleted} />

      {/* Video Player - Add this back */}
      {resolvedVideoUrl && (
        <div className="mb-6">
          <div className="youtube-container rounded-xl overflow-hidden shadow-2xl">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${extractVideoId(resolvedVideoUrl)}?rel=0&modestbranding=1&playsinline=1`}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {componentContent ? (
        <div className="animate-fade-in">
          {componentContent}
          <div className="mt-6 text-center">
            <Button onClick={handleContentComplete} className="bg-blue-600 hover:bg-blue-700">
              I've Read This Content
            </Button>
          </div>
        </div>
      ) : useAnimatedContent ? (
        <AnimatedLessonContent
          content={enhancedContent}
          lessonTitle={lesson.title}
          onComplete={handleContentComplete}
        />
      ) : isModule1Lesson1 ? (
        <div className="animate-fade-in">
          <Module1HardwareContent />
          <div className="mt-6 text-center">
            <Button onClick={handleContentComplete} className="bg-blue-600 hover:bg-blue-700">
              I've Read This Content
            </Button>
          </div>
        </div>
      ) : isSoundEngineeringLegacyLesson ? (
        <div className="animate-fade-in">
          <SoundEngineeringContent lesson={lesson} />
          <div className="mt-6 text-center">
            <Button onClick={handleContentComplete} className="bg-blue-600 hover:bg-blue-700">
              I've Read This Content
            </Button>
          </div>
        </div>
      ) : (
        <AnimatedLessonContent
          content={enhancedContent}
          lessonTitle={lesson.title}
          onComplete={handleContentComplete}
        />
      )}

      {/* Actions */}
      <LessonActions
        contentCompleted={contentCompleted}
        isCompleted={isCompleted}
        onMarkComplete={handleMarkComplete}
        onNext={onNext}
      />
    </div>
  );
};

export default VideoLessonRenderer;
