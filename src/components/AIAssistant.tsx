import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { solveProblem } from '../services/ai';
import { Loader2, Calculator, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAssistantProps {
  topicTitle: string;
}

export function AIAssistant({ topicTitle }: AIAssistantProps) {
  const [problemInput, setProblemInput] = useState('');
  const [problemSolution, setProblemSolution] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-[2rem] p-8 md:p-12 border border-nat-border shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-nat-primary/10 rounded-xl flex items-center justify-center text-nat-primary">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-serif italic text-nat-dark">Ask your Physics Tutor</h3>
          <p className="text-sm text-nat-muted">Get step-by-step explanations for {topicTitle}</p>
        </div>
      </div>
      
      <div className="relative mb-6 group">
        <textarea
          className="w-full h-40 p-6 rounded-2xl border border-nat-border bg-nat-light focus:outline-none focus:ring-2 focus:ring-nat-primary focus:bg-white resize-none transition-all placeholder:text-nat-muted/50 text-nat-dark"
          placeholder="E.g., 'A car accelerates from rest to 20 m/s in 5 seconds... What is its acceleration?' or 'Explain the difference between mass and weight'"
          value={problemInput}
          onChange={(e) => setProblemInput(e.target.value)}
        />
        <div className="absolute top-4 right-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
          <Sparkles className="w-8 h-8 text-nat-primary" />
        </div>
      </div>
      
      <button
        onClick={handleSolveProblem}
        disabled={isSolving || !problemInput.trim()}
        className="px-8 py-4 bg-nat-dark text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-md active:scale-95"
      >
        {isSolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
        {isSolving ? "Analyzing Physics..." : "Summon Solution"}
      </button>

      {problemSolution && !isSolving && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 p-8 md:p-10 bg-[#fdfcf9] border border-nat-border rounded-3xl shadow-inner relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Sparkles className="w-32 h-32 text-nat-primary" />
          </div>
          <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-nat-dark prose-p:leading-relaxed prose-p:text-nat-text prose-strong:text-nat-dark prose-li:my-2 relative z-10">
            {renderMarkdown(problemSolution)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
