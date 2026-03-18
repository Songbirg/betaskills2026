import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { parseYouTubeRenderer, parseYouTubeLink } from './formatters/YouTubeParser';
import { VisualTableRenderer, parseTableContent } from './formatters/VisualTableRenderer';
import { processHtmlContent } from './formatters/HtmlContentProcessor';
import { replaceEmojiIcons } from '@/utils/courseIcons';

interface ContentFormatterProps {
  content: string;
}

function isYouTubeUrl(url: string) {
  return (
    url.includes('youtube.com/watch?v=') ||
    url.includes('youtu.be/')
  );
}

function getYouTubeId(url: string) {
  // Handles both youtu.be and youtube.com/watch?v= formats
  const ytMatch = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return ytMatch ? ytMatch[1] : null;
}

// Check if content contains HTML
function hasHtmlContent(content: string): boolean {
  return content.includes('<div') || 
         content.includes('<h2>') || 
         content.includes('<ul>') ||
         content.includes('<li>') ||
         content.includes('<p>') ||
         content.includes('class=') ||
         content.includes('<section>') ||
         content.includes('<iframe>');
}

const preprocessYouTubeEmbeds = (content: string) => {
  // Replace all custom YouTube formats with proper markdown links
  // We'll use a regex to find all lines that match custom YouTube patterns
  // and replace them with markdown links that can be processed by the renderer
  const patterns = [
    /📺\s*YOUTUBE:\s*([^-\n]+?)\s*-\s*(https?:\/\/[^\s<\n]+)/gi,
    /YOUTUBE:\s*([^-\n]+?)\s*-\s*(https?:\/\/[^\s<\n]+)/gi,
    /🎬\s*YOUTUBE\s*LINK:\s*(.+)/gi,
    /📺\s*YOUTUBE\s*LINK:\s*(.+)/gi,
    /YOUTUBE\s*LINK:\s*(.+)/gi,
    /🎥\s*(.+youtube\.com.+)/gi,
    /🎥\s*(.+youtu\.be.+)/gi
  ];
  let processed = content;
  patterns.forEach(pattern => {
    processed = processed.replace(pattern, (match, ...groups) => {
      // Try to extract the URL from the match
      const url = groups.find(g => typeof g === 'string' && g.includes('http'));
      if (url) {
        // Convert to markdown link format so it gets processed by the 'a' component
        return `\n[Watch Video](${url.trim()})\n`;
      }
      return match;
    });
  });
  
  // Also convert standalone YouTube URLs to markdown links
  const standaloneYoutubeRegex = /(?<!\()(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s<\n]+)(?!\))/gi;
  processed = processed.replace(standaloneYoutubeRegex, (match, url) => {
    return `[Watch Video](${url})`;
  });
  
  return processed;
};

// Enhanced YouTube Video Component
const YouTubeVideo = ({ videoId, title }: { videoId: string; title?: string }) => {
  // EMERGENCY FIX: Use YouTube nocookie domain + extreme parameters
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0&fs=1&cc_load_policy=0&iv_load_policy=3&showinfo=0&controls=1&disablekb=1&playsinline=1&origin=${window.location.origin}&widget_referrer=${window.location.origin}&enablejsapi=0&color=white&theme=dark&end=99999999&playlist=${videoId}&loop=1`;
  
  // EMERGENCY DEBUG - This will be VERY visible in console
  console.error('🚨 EMERGENCY DEBUG: ContentFormatter YouTubeVideo rendering!', { 
    videoId, 
    iframeSrc,
    timestamp: new Date().toISOString()
  });

  
  return (
    <div className="relative w-full my-8 group animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 youtube-container">
        {/* Video Container with proper aspect ratio */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
          <iframe
            src={iframeSrc}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-2xl transition-transform duration-300"
          />
        </div>
        
        {/* Enhanced overlay effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            ▶ Play
          </div>
        </div>
      </div>
      
      {/* Video title or description */}
      {title && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
      )}
    </div>
  );
};

// Enhanced Paragraph Component with Dynamic Styling
const DynamicParagraph = ({ children, ...props }: any) => {
  // Safely convert children to string, handling objects properly
  const getTextContent = (child: any): string => {
    if (typeof child === 'string') return child;
    if (typeof child === 'number') return String(child);
    if (React.isValidElement(child)) {
      // React element - return empty string as it will render separately
      return '';
    }
    if (child === null || child === undefined) return '';
    if (typeof child === 'object') {
      // Handle object with textContent or other string properties
      if (child.textContent && typeof child.textContent === 'string') {
        return child.textContent;
      }
      if (child.toString && typeof child.toString === 'function') {
        const str = child.toString();
        if (str !== '[object Object]') return str;
      }
      // If it's an object but has no useful string representation, return empty
      return '';
    }
    return String(child);
  };

  // Filter out empty strings and objects from children
  const validChildren = React.Children.toArray(children).filter(child => {
    if (typeof child === 'string' || typeof child === 'number') return true;
    if (React.isValidElement(child)) return true;
    if (child === null || child === undefined) return false;
    if (typeof child === 'object') {
      // Filter out plain objects that would render as [object Object]
      const str = String(child);
      return str !== '[object Object]';
    }
    return true;
  });

  const text = validChildren.map(getTextContent).join('');
  
  // If we have React elements as children (like YouTubeVideo), render them directly
  const hasReactElements = validChildren.some(child => React.isValidElement(child));
  if (hasReactElements || validChildren.length === 0 || text.length === 0) {
    return (
      <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg group hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 animate-fade-in-up relative pl-4 border-l-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 rounded-r-lg py-2 -ml-2 mobile-paragraph">
        {validChildren}
      </p>
    );
  }
  
  // Check if this is a dense paragraph that needs breaking up
  const isDenseParagraph = text.length > 200 && !text.includes('\n');
  
  if (isDenseParagraph) {
    // Split into sentences and create dynamic blocks
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return (
      <div className="space-y-4 mb-6 animate-fade-in-up">
        {sentences.map((sentence, index) => (
          <div key={index} className="relative">
            {/* Decorative element for every other sentence */}
            {index % 2 === 0 && (
              <div className="absolute -left-6 top-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
            )}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg pl-4 border-l-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 rounded-r-lg py-2 -ml-2 mobile-paragraph">
              {sentence.trim()}.
            </p>
          </div>
        ))}
      </div>
    );
  }
  
  // Regular paragraph with enhanced styling
  return (
    <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg group hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 animate-fade-in-up relative pl-4 border-l-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 rounded-r-lg py-2 -ml-2 mobile-paragraph">
      {children}
    </p>
  );
};

// Enhanced List Item Component
const DynamicListItem = ({ children, ...props }: any) => (
  <li className="mb-3 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 relative pl-6 animate-fade-in-up">
    <div className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
    <span className="relative z-10">{children}</span>
  </li>
);

const components = {
  h1: ({node, ...props}) => (
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 mt-8 animate-fade-in-up flex items-center">
      <span className="mr-3 text-2xl">🚀</span>
      {props.children}
    </h1>
  ),
  h2: ({node, ...props}) => (
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8 border-l-4 border-blue-500 pl-4 animate-fade-in-up flex items-center">
      <span className="mr-3 text-xl">📋</span>
      {props.children}
    </h2>
  ),
  h3: ({node, ...props}) => (
    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6 animate-fade-in-up flex items-center">
      <span className="mr-2 text-lg">💡</span>
      {props.children}
    </h3>
  ),
  h4: ({node, ...props}) => (
    <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 mt-4 animate-fade-in-up flex items-center">
      <span className="mr-2">⚡</span>
      {props.children}
    </h4>
  ),
  p: ({node, ...props}) => {
    // Replace any YouTube link in the paragraph with an embedded video, inline
    const children = React.Children.map(props.children, child => {
      if (typeof child === 'string') {
        // Find all YouTube links in the string
        const parts = child.split(/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11})/g);
        return parts.map((part, i) => {
          if (/^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/.test(part)) {
            const videoId = getYouTubeId(part);
            if (videoId) {
              return <YouTubeVideo key={i} videoId={videoId} />;
            }
          }
          return part;
        });
      }
      return child;
    });
    
    return <DynamicParagraph>{children}</DynamicParagraph>;
  },
  ul: ({node, ...props}) => (
    <ul className="list-none ml-0 mb-6 space-y-2 animate-fade-in-up bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100/50 dark:border-blue-800/50 mobile-list" {...props} />
  ),
  ol: ({node, ...props}) => (
    <ol className="list-decimal ml-6 mb-6 space-y-2 animate-fade-in-up bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-green-100/50 dark:border-green-800/50 mobile-list" {...props} />
  ),
  li: ({node, ...props}) => <DynamicListItem {...props} />,
  a: ({node, ...props}) => {
    // If the link is a YouTube link, render as embed inline
    if (typeof props.href === 'string' && isYouTubeUrl(props.href)) {
      const videoId = getYouTubeId(props.href);

      if (videoId) {
        return <YouTubeVideo videoId={videoId} />;
      }
    }
    // Otherwise, render as normal link
    return (
      <a 
        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium bg-blue-50/50 dark:bg-blue-900/20 px-1 rounded" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props} 
      />
    );
  },
  code: ({node, ...props}) => (
    <code className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 text-sm font-mono text-pink-600 dark:text-pink-400 border border-gray-200 dark:border-gray-700" {...props} />
  ),
  blockquote: ({node, ...props}) => (
    <blockquote className="border-l-4 border-blue-400 pl-6 italic text-gray-600 dark:text-gray-400 my-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 py-4 rounded-r-lg animate-fade-in-up relative shadow-lg mobile-blockquote">
      <div className="absolute top-2 left-2 text-2xl opacity-30">💬</div>
      <div className="relative z-10">{props.children}</div>
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
    </blockquote>
  ),
  th: ({node, ...props}) => (
    <th className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-blue-800 dark:text-blue-300" {...props} />
  ),
  td: ({node, ...props}) => (
    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300" {...props} />
  ),
  img: ({node, ...props}) => (
    <img className="rounded-xl shadow-lg max-w-full my-6 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" {...props} />
  ),
  div: ({node, ...props}) => {
    if (props.children && typeof props.children[0] === 'string' && props.children[0].includes('iframe')) {
      return <div className="my-6 animate-fade-in-up">{props.children}</div>;
    }
    return <div {...props} />;
  },
};

// Modernize dense textbook content by breaking into digestible chunks
const modernizeContent = (content: string): string => {
  // Split long paragraphs into shorter ones for better readability
  const lines = content.split('\n');
  const result: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Keep headers and list items as-is
    if (trimmed.startsWith('#') || 
        trimmed.startsWith('-') || 
        trimmed.startsWith('*') ||
        trimmed.startsWith('**') ||
        trimmed.startsWith('>')) {
      result.push(line);
      continue;
    }
    
    // Skip empty lines but preserve them
    if (!trimmed) {
      result.push(line);
      continue;
    }
    
    // For long paragraphs (dense text), add visual breaks
    if (trimmed.length > 150 && !trimmed.includes('  ')) {
      // Split into sentences and add line breaks for visual breathing room
      const sentences = trimmed.match(/[^.!?]+[.!?]+[\s]*/g) || [trimmed];
      
      if (sentences.length > 2) {
        // Group sentences into smaller chunks (2-3 sentences each)
        let chunk = '';
        let sentenceCount = 0;
        
        for (const sentence of sentences) {
          chunk += sentence.trim() + ' ';
          sentenceCount++;
          
          if (sentenceCount >= 2 && chunk.length > 100) {
            result.push(chunk.trim());
            result.push(''); // Add breathing room
            chunk = '';
            sentenceCount = 0;
          }
        }
        
        // Add remaining chunk
        if (chunk.trim()) {
          result.push(chunk.trim());
        }
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }
  
  return result.join('\n');
};

const ContentFormatter = ({ content }: ContentFormatterProps) => {
  // Check if content contains HTML and use HTML processor instead
  if (hasHtmlContent(content)) {
  
    return (
      <div className="max-w-none animate-fade-in">
        <div className="lesson-content-modern-card">
          {processHtmlContent(content)}
        </div>
        <style>{`
          .lesson-content-modern-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);
            box-shadow: 
              0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
            border-radius: 1.5rem;
            padding: 3rem 2.5rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            animation: slideInCard 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #374151;
          }
        `}</style>
      </div>
    );
  }


  // Preprocess for YouTube custom formats and replace emoji icons with minimal dots
  let processedContent = modernizeContent(replaceEmojiIcons(preprocessYouTubeEmbeds(content)));
  
  // Replace table markdown with custom table renderer if needed
  const tables = parseTableContent(processedContent);
  tables.forEach(table => {
    processedContent = processedContent.replace(table.fullMatch, table.placeholder);
  });

  // Replace placeholders with actual table components
  let finalContent = processedContent;
  tables.forEach(table => {
    finalContent = finalContent.replace(
      table.placeholder,
      `<div class="custom-table-placeholder" data-table-index="${tables.indexOf(table)}"></div>`
    );
  });

  // Create components with access to tables
  const components = {
    h1: ({node, ...props}) => (
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 mt-8 animate-fade-in-up flex items-center">
        <span className="mr-3 text-2xl">🚀</span>
        {props.children}
      </h1>
    ),
    h2: ({node, ...props}) => (
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8 border-l-4 border-blue-500 pl-4 animate-fade-in-up flex items-center">
        <span className="mr-3 text-xl">📋</span>
        {props.children}
      </h2>
    ),
    h3: ({node, ...props}) => (
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6 animate-fade-in-up flex items-center">
        <span className="mr-2 text-lg">💡</span>
        {props.children}
      </h3>
    ),
    h4: ({node, ...props}) => (
      <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 mt-4 animate-fade-in-up flex items-center">
        <span className="mr-2">⚡</span>
        {props.children}
      </h4>
    ),
    p: ({node, ...props}) => {
      // Replace any YouTube link in the paragraph with an embedded video, inline
      const children = React.Children.map(props.children, child => {
        if (typeof child === 'string') {
          // Find all YouTube links in the string
          const parts = child.split(/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11})/g);
          return parts.map((part, i) => {
            if (/^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/.test(part)) {
              const videoId = getYouTubeId(part);
              if (videoId) {
                return <YouTubeVideo key={i} videoId={videoId} />;
              }
            }
            return part;
          });
        }
        return child;
      });
      
      return <DynamicParagraph>{children}</DynamicParagraph>;
    },
    ul: ({node, ...props}) => (
      <ul className="list-none ml-0 mb-6 space-y-2 animate-fade-in-up bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100/50 dark:border-blue-800/50 mobile-list" {...props} />
    ),
    ol: ({node, ...props}) => (
      <ol className="list-decimal ml-6 mb-6 space-y-2 animate-fade-in-up bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-green-100/50 dark:border-green-800/50 mobile-list" {...props} />
    ),
    li: ({node, ...props}) => <DynamicListItem {...props} />,
    a: ({node, ...props}) => {
      // If the link is a YouTube link, render as embed inline
      if (typeof props.href === 'string' && isYouTubeUrl(props.href)) {
        const videoId = getYouTubeId(props.href);

        if (videoId) {
          return <YouTubeVideo videoId={videoId} />;
        }
      }
      // Otherwise, render as normal link
      return (
        <a 
          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium bg-blue-50/50 dark:bg-blue-900/20 px-1 rounded" 
          target="_blank" 
          rel="noopener noreferrer" 
          {...props} 
        />
      );
    },
    code: ({node, ...props}) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 text-sm font-mono text-pink-600 dark:text-pink-400 border border-gray-200 dark:border-gray-700" {...props} />
    ),
    blockquote: ({node, ...props}) => (
      <blockquote className="border-l-4 border-blue-400 pl-6 italic text-gray-600 dark:text-gray-400 my-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 py-4 rounded-r-lg animate-fade-in-up relative shadow-lg mobile-blockquote">
        <div className="absolute top-2 left-2 text-2xl opacity-30">💬</div>
        <div className="relative z-10">{props.children}</div>
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
      </blockquote>
    ),
    table: ({node, ...props}) => {
      // Check if this table matches any of our parsed tables
      const tableText = props.children?.toString() || '';
      const matchingTable = tables.find(table => 
        tableText.includes(table.header1) && tableText.includes(table.header2)
      );
      
      if (matchingTable) {
        return (
          <VisualTableRenderer
            header1={matchingTable.header1}
            header2={matchingTable.header2}
            header3={matchingTable.header3}
            header4={matchingTable.header4}
            header5={matchingTable.header5}
            header6={matchingTable.header6}
            rows={matchingTable.rows}
          />
        );
      }
      
      // Default table rendering
      return (
        <div className="overflow-x-auto my-6 rounded-lg shadow-lg animate-fade-in-up bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
        </div>
      );
    },
    th: ({node, ...props}) => (
      <th className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-blue-800 dark:text-blue-300" {...props} />
    ),
    td: ({node, ...props}) => (
      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300" {...props} />
    ),
    img: ({node, ...props}) => (
      <img className="rounded-xl shadow-lg max-w-full my-6 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" {...props} />
    ),
    div: ({node, ...props}) => {
      // Check if this is a custom table placeholder
      if (props.className === 'custom-table-placeholder' && props['data-table-index'] !== undefined) {
        const tableIndex = parseInt(props['data-table-index']);
        const table = tables[tableIndex];
        if (table) {
          return (
            <VisualTableRenderer
              header1={table.header1}
              header2={table.header2}
              header3={table.header3}
              header4={table.header4}
              header5={table.header5}
              header6={table.header6}
              rows={table.rows}
            />
          );
        }
      }
      
      if (props.children && typeof props.children[0] === 'string' && props.children[0].includes('iframe')) {
        return <div className="my-6 animate-fade-in-up">{props.children}</div>;
      }
      return <div {...props} />;
    },
  };
  
  // Check if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // MOBILE CONTENT PROCESSING: Strip problematic container elements on mobile
  if (isMobile) {
    // Remove problematic container divs but keep their content
    processedContent = processedContent
      // Remove highlight-box wrapper but keep content
      .replace(/<div class="highlight-box">([\s\S]*?)<\/div>/g, '$1')
      // Remove definition-card wrapper but keep content
      .replace(/<div class="definition-card">([\s\S]*?)<\/div>/g, '$1')
      // Remove component-card wrapper but keep content
      .replace(/<div class="component-card">([\s\S]*?)<\/div>/g, '$1')
      // Remove impact-item wrapper but keep content
      .replace(/<div class="impact-item">([\s\S]*?)<\/div>/g, '$1')
      // Remove impact-grid wrapper but keep content
      .replace(/<div class="impact-grid">([\s\S]*?)<\/div>/g, '$1')
      // Remove components-section wrapper but keep content
      .replace(/<div class="components-section">([\s\S]*?)<\/div>/g, '$1')
      // Remove intro-section wrapper but keep content
      .replace(/<div class="intro-section">([\s\S]*?)<\/div>/g, '$1')
      // Remove component-icon divs entirely
      .replace(/<div class="component-icon">[^<]*<\/div>/g, '')
      // Remove component-content wrapper but keep content
      .replace(/<div class="component-content">([\s\S]*?)<\/div>/g, '$1')
      // Remove lesson-content wrapper but keep content
      .replace(/<div class="lesson-content">([\s\S]*?)<\/div>/g, '$1');
  }

  return (
    <div className="animate-fade-in">
      {isMobile ? (
        // Mobile: No card wrapper, direct content
        <ReactMarkdown
          children={finalContent}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        />
      ) : (
        // Desktop: Keep card wrapper
        <div className="lesson-content-modern-card">
          <ReactMarkdown
            children={finalContent}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
          />
        </div>
      )}
      <style>{`
        /* Global mobile override for all content containers */
        @media (max-width: 768px) {
          /* Override ALL container constraints */
          .container,
          [class*="container"],
          [class*="max-w"],
          .max-w-4xl,
          .max-w-6xl,
          .max-w-7xl,
          .max-w-full,
          .lesson-content-modern-card,
          .lesson-content-modern-card *,
          [class*="card"],
          .mobile-full-width,
          .mobile-full-width * {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            backdrop-filter: none !important;
            border: none !important;
            animation: none !important;
            width: 100vw !important;
            max-width: 100vw !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Force all content to use full viewport width */
          body,
          #root,
          .min-h-screen,
          main,
          .course-content-stable {
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
          }
          
          /* Force full width for all content */
          .mobile-full-width {
            width: 100vw !important;
            max-width: 100vw !important;
            margin-left: calc(-50vw + 50%) !important;
            margin-right: calc(-50vw + 50%) !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          /* Remove paragraph backgrounds and borders on mobile */
          .mobile-paragraph {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0.5rem 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          
          /* Remove all hover effects on mobile */
          .mobile-paragraph:hover {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
          
          /* Remove list backgrounds and borders on mobile */
          .mobile-list {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0.5rem 0 !important;
            margin: 0.5rem 0 !important;
            box-shadow: none !important;
          }
          
          /* Remove blockquote backgrounds and borders on mobile */
          .mobile-blockquote {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0.5rem 0 !important;
            margin: 0.5rem 0 !important;
            box-shadow: none !important;
          }
          
          /* Remove all decorative elements on mobile */
          .mobile-blockquote .absolute {
            display: none !important;
          }
          
          /* Override content-specific CSS classes on mobile */
          .highlight-box,
          .definition-card,
          .component-card,
          .impact-item,
          .components-section,
          .impact-grid,
          .impact-section {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0.5rem 0 !important;
            margin: 0.5rem 0 !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            border-left: none !important;
            border-top: none !important;
          }
          
          /* Remove grid layouts on mobile */
          .impact-grid,
          .impact-section {
            display: block !important;
            grid-template-columns: none !important;
            gap: 0 !important;
          }
          
          /* Remove flex layouts on mobile */
          .component-card {
            display: block !important;
            flex-direction: column !important;
            gap: 0 !important;
          }
          
          /* Remove component icons on mobile */
          .component-icon {
            display: none !important;
          }
          
          /* NUCLEAR OPTION: Force ALL content to be transparent and full width */
          * {
            max-width: 100vw !important;
          }
          
          /* Remove ALL backgrounds and containers */
          div,
          section,
          article,
          aside {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* Force text to use full width */
          p,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          span,
          strong,
          em {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0.5rem 0 !important;
            padding: 0 !important;
          }
          
          /* Override CoursePlayerView specific containers */
          .container.mx-auto,
          .container.mx-auto *,
          [class*="max-w-full md:max-w-4xl"],
          [class*="max-w-full md:max-w-4xl"] * {
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 0 1rem !important;
          }
          
          /* Force lesson content to use full width */
          .animate-fade-in,
          .animate-fade-in * {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Override ANY inline styles that might be creating containers */
          [style*="background"],
          [style*="border"],
          [style*="box-shadow"],
          [style*="border-radius"] {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          /* Force all divs to be transparent and full width */
          div[class*="highlight-box"],
          div[class*="definition-card"],
          div[class*="component-card"],
          div[class*="impact-item"] {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0.5rem 0 !important;
            margin: 0.5rem 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        .lesson-content-modern-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-radius: 1.5rem;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          animation: slideInCard 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #374151;
        }
        
        /* Mobile: Remove content containers to prevent squeezing - FORCE OVERRIDE */
        @media (max-width: 768px) {
          .lesson-content-modern-card {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin-bottom: 1rem !important;
            backdrop-filter: none !important;
            border: none !important;
            animation: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          /* Also remove any other potential content containers */
          .lesson-content-modern-card * {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        
        /* Tablet: Reduce padding */
        @media (min-width: 769px) and (max-width: 1024px) {
          .lesson-content-modern-card {
            padding: 2rem 2rem;
            border-radius: 1rem;
          }
        }
        
        /* Desktop: Full styling */
        @media (min-width: 1025px) {
          .lesson-content-modern-card {
            padding: 3rem 2.5rem;
            border-radius: 1.5rem;
          }
        }
        
        /* Enhanced video styling */
        iframe {
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        

        
        /* NUCLEAR OPTION: Hide YouTube overlays completely */
        iframe[src*="youtube"] {
          pointer-events: auto;
        }
        
        /* Hide YouTube's "More videos" overlay and end screen */
        iframe[src*="youtube"]::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          pointer-events: none;
          z-index: 1000;
        }
        
        /* Additional YouTube overlay blocking */
        .youtube-container {
          position: relative;
          overflow: hidden;
        }
        
        .youtube-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 999;
        }
      `}</style>
    </div>
  );
};

export default ContentFormatter;