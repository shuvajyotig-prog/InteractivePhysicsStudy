import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { generateDeepDive, explainFormula, solveProblem } from '../services/ai';
import { getCachedContent, setCachedContent } from '../services/cacheService';
import { getConceptData, ConceptSection } from '../data/concepts';
import { Loader2, Sparkles, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Beaker, BookOpen, Search, Calculator, Crosshair, PlayCircle, HelpCircle, X, ChevronRight, FlaskConical, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Topic } from '../data/syllabus';

interface ConceptBuilderProps {
  grade: string;
  topic: Topic;
  onSwitchTab?: (tab: string) => void;
}

export function ConceptBuilder({ grade, topic, onSwitchTab }: ConceptBuilderProps) {
  const data = getConceptData(topic.id, topic.title);
  const [activeIndex, setActiveIndex] = useState(0);
  const [readCounts, setReadCounts] = useState<Record<string, number>>({});
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string | null;
    loading: boolean;
    type: 'dive' | 'formula';
  }>({
    isOpen: false,
    title: '',
    content: null,
    loading: false,
    type: 'dive'
  });

  // Combine all sections for a sequential reading experience
  const allSections = [
    ...data.principles,
    ...data.formulas,
    ...data.techniques,
    ...(data.samples || []),
    ...data.mistakes,
    ...(data.bridge || [])
  ];

  // Track read counts when active index changes
  useEffect(() => {
    const activeSectionId = allSections[activeIndex]?.id;
    if (activeSectionId) {
      setReadCounts(prev => ({
        ...prev,
        [activeSectionId]: (prev[activeSectionId] || 0) + 1
      }));
    }
  }, [activeIndex, allSections.length]);

  const handleLearnMore = async (section: ConceptSection) => {
    const isFormula = section.content.includes('$');
    
    setModalState({
      isOpen: true,
      title: section.title,
      content: null,
      loading: true,
      type: isFormula ? 'formula' : 'dive'
    });
    
    try {
      const cacheKey = isFormula ? section.content : `${grade}:${topic.title}:${section.title}`;
      const cached = await getCachedContent(isFormula ? 'formula' : 'dive', cacheKey);
      
      if (cached) {
        setModalState(prev => ({ ...prev, loading: false, content: cached }));
        return;
      }

      let content = '';
      if (isFormula) {
         content = await explainFormula(section.content);
      } else {
         content = await generateDeepDive(grade, topic.title, section.title);
      }
      setModalState(prev => ({ ...prev, loading: false, content }));

      if (content && !content.includes("hiccup")) {
        await setCachedContent(isFormula ? 'formula' : 'dive', cacheKey, content);
      }
    } catch (err) {
      setModalState(prev => ({ ...prev, loading: false, content: "Oops! Your tutor had a hiccup. Please try again." }));
    }
  };

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mb-12"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-nat-primary mb-3 block">Topic Overview</span>
        <h2 className="text-4xl md:text-5xl font-serif italic text-nat-dark mb-4">{topic.title}</h2>
        <p className="text-nat-text text-lg leading-relaxed">{data.intro}</p>
      </motion.div>

      {/* Vertical Card List */}
      <div className="w-full max-w-2xl mt-12 mb-32 flex flex-col gap-6 px-4">
        {allSections.map((section, index) => {
          const actualIndex = index;
          const isActive = activeIndex === actualIndex;
          const isBridge = data.bridge?.some(b => b.id === section.id);
          
          // Zigzag logic for the list: small rotation and offset for non-active cards
          // Alternating based on index
          const rotate = isActive ? 0 : (actualIndex % 2 === 0 ? 1.5 : -1.5);
          const xOffset = isActive ? 0 : (actualIndex % 2 === 0 ? 8 : -8);

          return (
            <motion.div
              key={section.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isActive ? 1 : 0.6,
                x: xOffset,
                rotate: rotate,
                scale: isActive ? 1 : 0.98,
                filter: isActive ? 'blur(0px)' : 'blur(0.5px)',
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                layout: { duration: 0.4, ease: "easeOut" }
              }}
              onClick={() => setActiveIndex(actualIndex)}
              className={cn(
                "w-full transition-all cursor-pointer",
                isActive ? "z-20 scale-100" : "z-10 hover:opacity-100 hover:scale-[0.99]"
              )}
            >
              <div className={cn(
                "bg-white rounded-[2.5rem] border overflow-hidden p-8 md:p-12 transition-all relative group shadow-sm hover:shadow-md",
                isActive 
                  ? (isBridge ? "border-nat-secondary shadow-2xl ring-8 ring-nat-secondary/5" : "border-nat-primary shadow-2xl ring-8 ring-nat-primary/5")
                  : "border-nat-border"
              )}>
                {/* Decorative Watermark */}
                <div className="absolute -top-8 -right-8 p-10 opacity-[0.02] pointer-events-none rotate-12 transition-all group-hover:scale-110">
                  {section.content.includes('$') ? (
                    <Calculator className="w-48 h-48" />
                  ) : (
                    <Lightbulb className="w-48 h-48" />
                  )}
                </div>

                {/* Top Status Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <div className={cn(
                      "w-2 h-2 rounded-full",
                      isBridge ? "bg-nat-secondary animate-pulse" : "bg-nat-primary"
                    )} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-nat-muted">
                      {isBridge ? "Advanced Bridge" : "Concept Core"} • {actualIndex + 1}
                    </span>
                  </div>
                  {!isActive && (
                    <ChevronDown className="w-4 h-4 text-nat-muted opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                {/* Card Title */}
                <h3 className={cn(
                  "text-xl font-black uppercase tracking-[0.1em] transition-colors",
                  isActive ? "text-nat-dark mb-6" : "text-nat-muted"
                )}>
                  {section.title}
                </h3>
                
                {/* Expandable Content Area */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="relative z-10"
                    >
                      <div className="prose prose-nat max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-nat-dark/80 prose-strong:text-nat-primary prose-code:bg-nat-light prose-code:px-2 prose-code:rounded prose-blockquote:border-nat-primary/30">
                        {renderMarkdown(section.content)}
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 pt-8 border-t border-nat-border/50 flex flex-col sm:flex-row items-center justify-between gap-8"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-nat-secondary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nat-dark">Knowledge Synthesis</span>
                          </div>
                          <p className="text-xs text-nat-muted italic">"Deep dive into the underlying physics."</p>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleLearnMore(section); }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-8 py-4 rounded-2xl bg-nat-dark text-white hover:bg-black hover:shadow-xl active:scale-95 group/btn"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          Master Concept
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tutor Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-nat-dark/40 backdrop-blur-md"
              onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
            />
            
            <motion.div
              layoutId={modalState.isOpen ? 'tutor-modal' : undefined}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-nat-border"
            >
              {/* Modal Header */}
              <div className="p-8 md:p-10 bg-nat-panel border-b border-nat-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-nat-primary/10 rounded-[1.5rem] flex items-center justify-center text-nat-primary shadow-inner">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif italic text-nat-dark tracking-tight">{modalState.title}</h3>
                    <p className="text-[10px] text-nat-muted uppercase tracking-[0.25em] font-bold mt-1.5 opacity-70">
                      {modalState.type === 'formula' ? 'Deep Formula Analysis' : 'Conceptual Deep Dive'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                  className="w-12 h-12 bg-white border border-nat-border hover:bg-nat-panel rounded-full transition-all flex items-center justify-center text-nat-muted hover:text-nat-dark shadow-sm active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar bg-[#fdfcf9]">
                {modalState.loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="relative">
                       <Loader2 className="w-12 h-12 text-nat-primary animate-spin" />
                       <Sparkles className="w-5 h-5 text-nat-secondary absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold text-nat-muted animate-pulse">Summoning Tutor Knowledge...</span>
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="prose prose-lg max-w-none prose-p:text-nat-text prose-p:leading-[1.8] prose-headings:font-serif prose-headings:text-nat-dark prose-strong:text-nat-dark prose-li:text-nat-text prose-blockquote:border-l-nat-primary prose-blockquote:bg-nat-panel-alt prose-blockquote:p-6 prose-blockquote:rounded-r-2xl"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transform rotate-12">
                      <Sparkles className="w-72 h-72 text-nat-primary" />
                    </div>
                    
                    <div className="relative z-10 mb-16">
                      {modalState.content?.split('\n\n').map((para, i) => (
                        <motion.div 
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          className="mb-8"
                        >
                          {renderMarkdown(para)}
                        </motion.div>
                      ))}
                    </div>

                    {/* Simulation Link Hook */}
                    {topic.hasSimulation && (
                       <motion.div 
                         variants={{
                           hidden: { opacity: 0, scale: 0.98 },
                           visible: { opacity: 1, scale: 1 }
                         }}
                         className="mt-16 pt-12 border-t border-nat-border/50"
                       >
                         <div className="flex items-center gap-2 mb-6">
                            <FlaskConical className="w-4 h-4 text-nat-primary" />
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-nat-muted">See in the Real World</h4>
                         </div>
                         <button 
                           onClick={() => {
                             setModalState(prev => ({ ...prev, isOpen: false }));
                             onSwitchTab?.('lab');
                           }}
                           className="w-full group bg-white border border-nat-primary p-8 rounded-[2.5rem] flex items-center justify-between hover:shadow-2xl transition-all duration-500 scale-100 hover:scale-[1.01]"
                         >
                            <div className="flex items-center gap-7">
                              <div className="w-16 h-16 bg-nat-panel rounded-3xl flex items-center justify-center text-nat-primary group-hover:bg-nat-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                <FlaskConical className="w-8 h-8" />
                              </div>
                              <div className="text-left">
                                <div className="text-xl font-serif italic text-nat-dark capitalize">{topic.title} Interactive Lab</div>
                                <div className="text-sm text-nat-muted mt-1 opacity-80">Launch the simulation to verify these concepts through virtual experiments.</div>
                              </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-nat-panel flex items-center justify-center text-nat-muted group-hover:translate-x-2 group-hover:bg-nat-primarygroup-hover:text-nat-primary transition-all duration-500">
                              <ChevronRight className="w-6 h-6" />
                            </div>
                         </button>
                       </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-[#fdfcf9] border-t border-nat-border flex justify-center">
                 <p className="text-[10px] text-nat-muted uppercase tracking-[0.25em] opacity-60">
                   Theoretical accuracy may vary • Consult your official CBSE textbook for exams
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

