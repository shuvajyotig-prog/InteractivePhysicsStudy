import React, { useState } from 'react';
import { generatePressureTest, QuizQuestion } from '../services/ai';
import { Loader2, CheckCircle2, XCircle, ArrowRight, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PressureTestProps {
  grade: string;
  topic: string;
}

export function PressureTest({ grade, topic }: PressureTestProps) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    try {
      const qs = await generatePressureTest(grade, topic);
      setQuestions(qs);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions ? questions[currentIndex] : null;

  const handleSubmit = () => {
    if (selectedOption !== null && currentQuestion) {
      setIsSubmitted(true);
      if (selectedOption === currentQuestion.correctOptionIndex) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (questions && currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  if (!questions && !isLoading && !error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-inner border border-nat-border text-center min-h-[400px]">
        <div className="w-16 h-16 bg-nat-secondary rounded-full flex items-center justify-center mb-4 text-white">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-nat-dark mb-2 font-serif italic">Ready for a Pressure Test?</h3>
        <p className="text-nat-muted max-w-md mb-6 text-sm">
          Test your conceptual understanding of {topic}. Our AI teacher will generate 5 challenging questions designed to catch common misconceptions.
        </p>
        <button 
          onClick={loadQuestions}
          className="bg-nat-primary text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-nat-primary-hover transition-colors flex items-center gap-2"
        >
          Generate Concept Test
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-inner border border-nat-border text-center min-h-[400px]">
        <div className="w-16 h-16 bg-[#f59e0b] rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-nat-dark mb-2 font-serif italic">Test Complete!</h3>
        <p className="text-nat-text max-w-md mb-6 text-lg font-medium">
          You scored <span className="font-bold text-nat-primary">{score}</span> out of <span className="font-bold">5</span>.
        </p>
        <div className="text-sm text-nat-muted max-w-md mb-8">
          {score === 5 ? "Perfect score! You have a flawless understanding of this topic." :
           score >= 3 ? "Great job! A solid grasp of the concepts, but there's a little room for review." :
           "Keep studying! These were tough conceptual questions. Review the mistakes sections in the Concept Builder."}
        </div>
        <button 
          onClick={loadQuestions}
          className="bg-nat-dark text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors flex items-center gap-2"
        >
          Retake Test
        </button>
      </div>
    );
  }

  return (
    <div className="bg-nat-panel rounded-3xl border border-nat-border overflow-hidden shadow-sm">
      <div className="p-6 border-b border-nat-border flex justify-between items-center bg-nat-panel-alt">
        <h3 className="font-bold text-nat-dark flex items-center gap-2 text-sm uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-nat-secondary"></span>
          Pressure Test: {topic} ({currentIndex + 1}/5)
        </h3>
        {isSubmitted && (
          <button 
            onClick={handleNext}
            className="text-xs font-bold uppercase tracking-widest text-nat-primary hover:text-nat-primary-hover flex items-center gap-1"
          >
            {currentIndex < 4 ? 'Next Question' : 'View Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-nat-primary animate-spin mb-4" />
            <p className="text-nat-muted text-xs font-bold uppercase tracking-widest animate-pulse">Our AI is crafting 5 challenges...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-nat-border border-dashed">
            <p className="text-[#991b1b] mb-4 text-sm font-bold">{error}</p>
            <button onClick={loadQuestions} className="text-nat-primary font-bold text-xs uppercase tracking-widest underline">Try Again</button>
          </div>
        ) : currentQuestion ? (
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-xl font-serif text-nat-dark pb-2 leading-relaxed">
              {currentQuestion.question}
            </div>
            
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctOptionIndex;
                const showStatus = isSubmitted;

                return (
                  <button
                    key={idx}
                    onClick={() => !isSubmitted && setSelectedOption(idx)}
                    disabled={isSubmitted}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center",
                      !isSubmitted && !isSelected && "border-nat-border bg-white hover:border-nat-secondary hover:bg-nat-light",
                      !isSubmitted && isSelected && "border-nat-primary bg-nat-light shadow-sm",
                      showStatus && isCorrect && "border-[#65a30d] bg-[#f7fee7]",
                      showStatus && isSelected && !isCorrect && "border-[#e11d48] bg-[#fff1f2]",
                      showStatus && !isSelected && !isCorrect && "border-nat-border bg-white opacity-50"
                    )}
                  >
                    <span className={cn(
                      "font-sans text-sm",
                      isSelected && !isSubmitted && "font-bold text-nat-dark",
                      !isSelected && !isSubmitted && "text-nat-text font-medium",
                      showStatus && isCorrect && "text-[#3f6212] font-bold",
                      showStatus && isSelected && !isCorrect && "text-[#881337] font-bold"
                    )}>
                      <span className="opacity-50 mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                    </span>
                    
                    {showStatus && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#65a30d]" />}
                    {showStatus && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#e11d48]" />}
                  </button>
                );
              })}
            </div>

            {!isSubmitted ? (
               <button 
                 onClick={handleSubmit}
                 disabled={selectedOption === null}
                 className="w-full mt-6 bg-nat-dark text-white p-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-[#1a1a10]"
               >
                 Submit Answer
               </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mt-6 p-6 rounded-2xl border",
                  selectedOption === currentQuestion.correctOptionIndex ? "bg-[#f7fee7] border-[#d9f99d]" : "bg-[#fffbeb] border-[#fde68a]"
                )}
              >
                <h4 className={cn(
                  "font-serif italic text-lg mb-2",
                  selectedOption === currentQuestion.correctOptionIndex ? "text-[#3f6212]" : "text-[#92400e]"
                )}>
                  {selectedOption === currentQuestion.correctOptionIndex ? "Excellent Work!" : "Not quite right!"}
                </h4>
                <p className="text-nat-text leading-relaxed text-sm">
                  <span className="font-bold block mb-2">
                    Correct Option: {currentQuestion.options[currentQuestion.correctOptionIndex]}
                  </span>
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
