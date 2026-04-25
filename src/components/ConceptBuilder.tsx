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
  const [activeTab, setActiveTab] = useState<'learn' | 'solver'>('learn');
  const [problemInput, setProblemInput] = useState('');
  const [problemSolution, setProblemSolution] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);

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

  const handleSolveProblem = async () => {
    if (!problemInput.trim()) return;
    setIsSolving(true);
    setProblemSolution(null);
    try {
      const solution = await solveProblem(problemInput);
      setProblemSolution(solution);
    } catch (e) {
      setProblemSolution("Failed to generate a solution.");
    } finally {
      setIsSolving(false);
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
      <div key={section.id} className="bg-white rounded-xl border border-nat-border shadow-sm transition-all overflow-hidden flex flex-col">
        <button 
          onClick={() => toggleMain(section.id)}
          className="w-full p-5 pb-4 flex justify-between items-start text-left group"
        >
          <span className="font-bold text-nat-dark text-[13px] uppercase tracking-widest leading-relaxed">
            {section.title}
          </span>
          {state.mainOpen ? <ChevronUp className="w-5 h-5 text-nat-muted shrink-0 group-hover:text-nat-dark transition-colors" /> : <ChevronDown className="w-5 h-5 text-nat-muted shrink-0 group-hover:text-nat-dark transition-colors" />}
        </button>
        
        <AnimatePresence initial={false}>
          {state.mainOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6">
                <div className="text-nat-text text-[15px] leading-relaxed mb-6 prose prose-sm max-w-none prose-p:mb-4 prose-headings:font-serif prose-headings:text-nat-dark prose-strong:text-nat-dark prose-li:my-1">
                  {renderMarkdown(section.content)}
                </div>
                
                <button 
                  onClick={() => handleLearnMore(section)}
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-nat-primary hover:text-white hover:bg-nat-primary transition-colors bg-nat-panel border border-nat-border px-4 py-2 rounded-full"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {state.aiOpen ? "Collapse Details" : (section.content.includes('$') ? "Explain Formula" : "Summon AI Deep Dive")}
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
                          <div className="flex items-center gap-3 text-nat-muted py-2 bg-nat-panel-alt px-5 rounded-xl border border-nat-border shadow-inner">
                            <Loader2 className="w-4 h-4 animate-spin text-nat-primary" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Summoning Tutor...</span>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-p:text-[14px] prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-nat-dark text-nat-dark bg-[#fdfcf9] p-6 rounded-xl border border-nat-secondary/20 shadow-inner mt-2 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                              <Sparkles className="w-16 h-16 text-nat-primary" />
                            </div>
                            {renderMarkdown(state.aiContent || "")}
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
      <div className="bg-white rounded-3xl shadow-sm border border-nat-border overflow-hidden">
        <div className="p-8 pb-6 border-b border-nat-border bg-nat-panel-alt">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-nat-border rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 text-nat-muted shadow-sm">
            <BookOpen className="w-3 h-3" /> Concept Guide
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif italic text-nat-dark mb-3">{topic.title}</h2>
          <p className="text-nat-text leading-relaxed max-w-3xl">
            {data.intro}
          </p>
        </div>
        <div className="flex px-4 pt-2 gap-4 border-b border-nat-border bg-white">
          <button 
            onClick={() => setActiveTab('learn')}
            className={cn("px-4 py-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-colors", activeTab === 'learn' ? 'text-nat-primary border-nat-primary' : 'text-nat-muted border-transparent hover:text-nat-dark')}
          >
            Concepts & Formulas
          </button>
          <button 
            onClick={() => setActiveTab('solver')}
            className={cn("px-4 py-3 font-bold text-xs uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2", activeTab === 'solver' ? 'text-nat-primary border-nat-primary' : 'text-nat-muted border-transparent hover:text-nat-dark')}
          >
            <HelpCircle className="w-4 h-4" /> AI Problem Solver
          </button>
        </div>
      </div>

      {activeTab === 'solver' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-nat-border shadow-sm">
          <h3 className="text-xl font-serif italic text-nat-dark mb-4">Physics Problem Solver</h3>
          <p className="text-sm text-nat-muted mb-6">Paste any physics homework problem here, and our AI tutor will break it down step-by-step using Polya's method.</p>
          
          <textarea
            className="w-full h-32 p-4 rounded-xl border border-nat-border bg-nat-light focus:outline-none focus:ring-2 focus:ring-nat-primary focus:bg-white resize-none mb-4"
            placeholder="E.g., A car accelerates from rest to 20 m/s in 5 seconds. Find its acceleration and distance traveled."
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
          />
          
          <button
            onClick={handleSolveProblem}
            disabled={isSolving || !problemInput.trim()}
            className="px-6 py-3 bg-nat-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nat-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {isSolving ? "Analyzing..." : "Solve Problem"}
          </button>

          {problemSolution && !isSolving && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
               <div className="prose prose-sm prose-blue max-w-none prose-headings:font-serif prose-headings:text-nat-dark prose-p:leading-relaxed prose-li:my-1">
                  {renderMarkdown(problemSolution)}
               </div>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'learn' && (
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
      )}
    </div>
  );
}
