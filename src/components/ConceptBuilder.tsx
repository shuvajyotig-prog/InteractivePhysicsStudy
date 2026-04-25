import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { generateDeepDive, explainFormula, solveProblem } from '../services/ai';
import { getConceptData, ConceptSection } from '../data/concepts';
import { Loader2, Sparkles, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Beaker, BookOpen, Search, Calculator, Crosshair, PlayCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Topic } from '../data/syllabus';

interface ConceptBuilderProps {
  grade: string;
  topic: Topic;
}

export function ConceptBuilder({ grade, topic }: ConceptBuilderProps) {
  const data = getConceptData(topic.id, topic.title);
  const [sectionState, setSectionState] = useState<Record<string, { mainOpen: boolean; aiLoading: boolean; aiContent: string | null; aiOpen: boolean }>>({});

  const toggleMain = (id: string) => {
    setSectionState(prev => {
      const current = prev[id] || { mainOpen: false, aiLoading: false, aiContent: null, aiOpen: false };
      return { ...prev, [id]: { ...current, mainOpen: !current.mainOpen } };
    });
  };

  const handleLearnMore = async (section: ConceptSection) => {
    const state = sectionState[section.id] || { mainOpen: true, aiLoading: false, aiContent: null, aiOpen: false };
    
    if (state.aiOpen) {
      setSectionState(prev => ({ ...prev, [section.id]: { ...state, aiOpen: false } }));
      return;
    }
    
    if (state.aiContent) {
      setSectionState(prev => ({ ...prev, [section.id]: { ...state, aiOpen: true } }));
      return;
    }

    setSectionState(prev => ({ ...prev, [section.id]: { ...state, aiLoading: true, aiContent: null, aiOpen: true } }));
    
    try {
      let content = '';
      if (section.content.includes('$')) {
         content = await explainFormula(section.content);
      } else {
         content = await generateDeepDive(grade, topic.title, section.title);
      }
      setSectionState(prev => ({ ...prev, [section.id]: { ...prev[section.id], aiLoading: false, aiContent: content, aiOpen: true } }));
    } catch (err) {
      setSectionState(prev => ({ ...prev, [section.id]: { ...prev[section.id], aiLoading: false, aiContent: "Oops! The AI tutor had a hiccup. Please try again.", aiOpen: true } }));
    }
  };

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    );
  };

  const renderSection = (section: ConceptSection) => {
    // Make main contents open by default
    const state = sectionState[section.id] || { mainOpen: true, aiLoading: false, aiContent: null, aiOpen: false };
    
    return (
      <div key={section.id} className="bg-white rounded-2xl border border-nat-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group/card hover:border-nat-primary/30">
        <button 
          onClick={() => toggleMain(section.id)}
          className="w-full p-6 pb-4 flex justify-between items-start text-left group/btn"
        >
          <span className="font-bold text-nat-dark text-[14px] uppercase tracking-widest leading-relaxed group-hover/btn:text-nat-primary transition-colors">
            {section.title}
          </span>
          <div className="bg-nat-panel rounded-full p-1 group-hover/btn:bg-nat-primary/10 transition-colors">
            {state.mainOpen ? <ChevronUp className="w-4 h-4 text-nat-muted shrink-0 group-hover/btn:text-nat-primary transition-colors" /> : <ChevronDown className="w-4 h-4 text-nat-muted shrink-0 group-hover/btn:text-nat-primary transition-colors" />}
          </div>
        </button>
        
        <AnimatePresence initial={false}>
          {state.mainOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="text-nat-text text-[15px] leading-relaxed mb-6 prose prose-sm max-w-none prose-p:mb-4 prose-headings:font-serif prose-headings:text-nat-dark prose-strong:text-nat-dark prose-li:my-1">
                  {renderMarkdown(section.content)}
                </div>
                
                <button 
                  onClick={() => handleLearnMore(section)}
                  className={cn(
                    "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors px-4 py-2 rounded-full border",
                    state.aiOpen 
                      ? "bg-nat-panel text-nat-muted border-nat-border hover:bg-nat-light"
                      : "bg-[#fdfcf9] text-nat-primary hover:text-white hover:bg-nat-primary border-[#fde68a] shadow-sm"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {state.aiOpen ? "Collapse AI Details" : (section.content.includes('$') ? "Explain Formula with AI" : "Summon AI Deep Dive")}
                </button>

                <AnimatePresence>
                  {state.aiOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 pt-5 border-t border-dashed border-nat-border">
                        {state.aiLoading ? (
                          <div className="flex items-center gap-3 text-nat-muted py-3 bg-nat-panel-alt px-5 rounded-2xl border border-nat-border shadow-inner">
                            <Loader2 className="w-4 h-4 animate-spin text-nat-primary" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Summoning Tutor...</span>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-p:text-[14px] prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-nat-dark text-nat-dark bg-[#fdfcf9] p-6 sm:p-8 rounded-2xl border border-[#fde68a] shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4">
                              <Sparkles className="w-32 h-32 text-nat-primary" />
                            </div>
                            <div className="relative z-10">
                              {renderMarkdown(state.aiContent || "")}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };


  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="bg-white rounded-[2rem] shadow-lg border border-nat-border overflow-hidden ring-1 ring-black/[0.02]">
        <div className="p-8 md:p-12 pb-8 bg-[#fdfcf9]">
          <h2 className="text-4xl md:text-5xl font-serif italic text-nat-dark mb-4 tracking-tight">{topic.title}</h2>
          <p className="text-nat-text text-lg leading-relaxed max-w-3xl opacity-90">
            {data.intro}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Principles */}
        <div className="space-y-4">
          <h3 className="text-lg font-serif italic text-nat-dark flex items-center gap-2 mb-2">
            <Beaker className="w-5 h-5 text-nat-primary" />
            Core Principles
          </h3>
          <div className="flex flex-col gap-4">
            {data.principles.map(renderSection)}
          </div>
          
          {data.formulas.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-serif italic text-nat-dark flex items-center gap-2 mb-4">
                <span className="font-bold font-sans text-nat-primary italic">f(x)</span>
                Key Formulas
              </h3>
              <div className="flex flex-col gap-4">
                {data.formulas.map(renderSection)}
              </div>
            </div>
          )}
        </div>

        {/* Pro Techniques & Mistakes */}
        <div className="space-y-8">
          
          <div className="bg-nat-panel rounded-3xl border border-nat-secondary/30 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Lightbulb className="w-24 h-24 text-nat-secondary" />
            </div>
            <h3 className="text-lg font-serif italic text-nat-dark flex items-center gap-2 mb-4 relative z-10">
              <Lightbulb className="w-5 h-5 text-nat-secondary" fill="currentColor" />
              Pro Problem-Solving Patterns
            </h3>
            <div className="flex flex-col gap-4 relative z-10">
              {data.techniques.map(renderSection)}
            </div>
          </div>

          {data.samples && data.samples.length > 0 && (
            <div className="bg-[#f0f9ff] rounded-3xl border border-[#bae6fd] p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <BookOpen className="w-24 h-24 text-[#0284c7]" />
              </div>
              <h3 className="text-lg font-serif italic text-[#075985] flex items-center gap-2 mb-4 relative z-10">
                <BookOpen className="w-5 h-5 text-[#0ea5e9]" />
                Sample Solutions
              </h3>
              <div className="flex flex-col gap-4 relative z-10">
                {data.samples.map(renderSection)}
              </div>
            </div>
          )}

          <div className="bg-[#fff1f2] rounded-3xl border border-[#fda4af] p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <AlertTriangle className="w-24 h-24 text-[#e11d48]" />
            </div>
            <h3 className="text-lg font-serif italic text-[#9f1239] flex items-center gap-2 mb-4 relative z-10">
              <AlertTriangle className="w-5 h-5 text-[#e11d48]" />
              Fatal Mistakes to Avoid
            </h3>
            <div className="flex flex-col gap-4 relative z-10">
              {data.mistakes.map(renderSection)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
