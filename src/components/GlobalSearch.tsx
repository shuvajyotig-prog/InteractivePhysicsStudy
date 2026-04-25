import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, PenTool, Lightbulb } from 'lucide-react';
import { syllabus } from '../data/syllabus';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContent: (subjectId: string, topicId: string) => void;
}

export function GlobalSearch({ isOpen, onClose, onSelectContent }: GlobalSearchProps) {
  const [query, setQuery] = useState('');

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = React.useMemo(() => {
    if (query.trim().length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const results: Array<{
      subjectId: string;
      subjectTitle: string;
      topicId: string;
      topicTitle: string;
      description: string;
      type: 'topic' | 'simulation' | 'theory';
    }> = [];

    Object.entries(syllabus).forEach(([grade, topics]) => {
      topics.forEach((topic) => {
        // Check topic title
        const matchesTitle = topic.title.toLowerCase().includes(lowerQuery);
        // Check description
        const matchesDesc = topic.description.toLowerCase().includes(lowerQuery);

        if (matchesTitle || matchesDesc) {
          results.push({
            subjectId: grade,
            subjectTitle: `Physics`,
            topicId: topic.id,
            topicTitle: topic.title,
            description: topic.description,
            type: 'topic'
          });
        }

        if (topic.hasSimulation && (matchesTitle || lowerQuery.includes('lab') || lowerQuery.includes('simulation'))) {
          results.push({
            subjectId: grade,
            subjectTitle: `Physics`,
            topicId: topic.id,
            topicTitle: `${topic.title} Lab`,
            description: `Interactive simulation for ${topic.title}`,
            type: 'simulation'
          });
        }
      });
    });

    return results.slice(0, 8); // top 8 results
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-nat-dark/40 backdrop-blur-sm z-[100] p-4 sm:p-6 md:p-12 lg:p-20 flex items-start justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col mt-4 md:mt-0"
            >
              <div className="relative p-4 md:p-6 border-b border-nat-border">
                <Search className="absolute left-8 md:left-10 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-nat-muted" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search physics concepts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-nat-light border-0 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-16 pr-12 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-nat-primary focus:bg-white transition-all"
                />
                <button 
                  onClick={onClose}
                  className="absolute right-7 md:right-9 top-1/2 -translate-y-1/2 p-1.5 md:p-2 text-nat-muted hover:text-nat-dark transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 md:p-4 max-h-[70vh] overflow-y-auto">
                {query.trim().length < 2 ? (
                  <div className="text-center py-10 md:py-16 text-nat-muted">
                    <Lightbulb className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium text-sm md:text-base">Type at least 2 characters to search</p>
                    <p className="text-[11px] md:text-sm mt-1">Try "Kinematics", "Voltage", or "Simulation"</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12 text-nat-muted">
                    <p className="font-medium">No results found for "{query}"</p>
                  </div>
                ) : (
                  <ul className="space-y-1 md:space-y-2">
                    {searchResults.map((result, i) => (
                      <li key={`${result.topicId}-${result.type}-${i}`}>
                        <button
                          onClick={() => {
                            onSelectContent(result.subjectId, result.topicId);
                            onClose();
                          }}
                          className="w-full text-left p-3 md:p-4 rounded-xl hover:bg-nat-light transition-colors flex items-start gap-3 md:gap-4 group"
                        >
                          <div className="mt-0.5 p-1.5 md:p-2 bg-white rounded-lg shadow-sm border border-nat-border group-hover:border-nat-primary/30 transition-colors shrink-0">
                            {result.type === 'simulation' ? (
                              <PenTool className="w-4 h-4 md:w-5 md:h-5 text-nat-primary" />
                            ) : (
                              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-[#c27a56]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-nat-muted">{result.subjectTitle}</span>
                              <span className="text-nat-border hidden md:inline">•</span>
                              <span className="text-[8px] md:text-[10px] font-bold text-nat-muted px-1.5 py-0.5 bg-white rounded border border-nat-border tracking-tighter">
                                {result.type === 'simulation' ? 'LAB' : 'CONCEPT'}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm md:text-base text-nat-dark group-hover:text-nat-primary transition-colors truncate">{result.topicTitle}</h4>
                            <p className="text-xs md:text-sm text-nat-text line-clamp-1">{result.description}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
