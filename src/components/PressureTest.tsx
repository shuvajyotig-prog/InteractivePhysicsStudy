import React, { useState } from 'react';
import { generateQuestion, QuizQuestion } from '../services/ai';
import { Loader2, CheckCircle2, XCircle, ArrowRight, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PressureTestProps {
  grade: string;
  topic: string;
}

export function PressureTest({ grade, topic }: PressureTestProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesLog, setMistakesLog] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);

  const startTest = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setResults([]);
    loadNextQuestion(selectedDifficulty, []);
  };

  const loadNextQuestion = async (
    currentDifficulty: 'easy' | 'medium' | 'hard',
    history: { question: string; isCorrect: boolean }[]
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const q = await generateQuestion(grade, topic, currentDifficulty, history);
      setQuestions(prev => [...prev, q]);
    } catch (err) {
      setError("Failed to load question. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (selectedOption !== null && currentQuestion) {
      setIsSubmitted(true);
      const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
      setResults(prev => [...prev, isCorrect]);
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        setMistakesLog(prev => [...prev, currentQuestion.explanation]);
      }
    }
  };

  const handleNext = async () => {
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    
    const updatedHistory = questions.map((q, i) => ({ 
      question: q.question, 
      isCorrect: i < results.length ? results[i] : isCorrect
    }));
    
    if (currentIndex < 4) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      await loadNextQuestion(difficulty!, updatedHistory);
    } else {
      setIsFinished(true);
      
      // Save attempt to Firebase
      if (auth.currentUser) {
        const pathForWrite = `users/${auth.currentUser.uid}/attempts`;
        try {
          await addDoc(collection(db, pathForWrite), {
            topicId: topic,
            score: score + (isCorrect ? 1 : 0),
            total: 5,
            difficulty,
            date: serverTimestamp(),
            mistakes: isCorrect ? mistakesLog : [...mistakesLog, currentQuestion.explanation]
          });
        } catch (e) {
          console.error("Failed to save attempt to log", e);
          handleFirestoreError(e, OperationType.WRITE, pathForWrite);
        }
      }
    }
  };

  const resetTest = () => {
    setDifficulty(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setMistakesLog([]);
    setError(null);
  };

  if (!difficulty && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-inner border border-nat-border text-center min-h-[400px]">
        <div className="w-16 h-16 bg-nat-secondary rounded-full flex items-center justify-center mb-4 text-white">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-nat-dark mb-2 font-serif italic">Ready for a Pressure Test?</h3>
        <p className="text-nat-muted max-w-md mb-6 text-sm">
          Test your conceptual understanding of {topic}. Select a difficulty level to begin.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <button
              key={level}
              onClick={() => startTest(level)}
              className={cn(
                "py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border-2",
                level === 'easy' && "border-[#84cc16] text-[#4d7c0f] hover:bg-[#84cc16] hover:text-white",
                level === 'medium' && "border-[#f59e0b] text-[#b45309] hover:bg-[#f59e0b] hover:text-white",
                level === 'hard' && "border-[#ef4444] text-[#b91c1c] hover:bg-[#ef4444] hover:text-white"
              )}
            >
              {level}
            </button>
          ))}
        </div>
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
          Level: <span className="uppercase text-nat-primary">{difficulty}</span> • Score: <span className="font-bold text-nat-primary">{score}</span> / 5
        </p>
        <div className="text-sm text-nat-muted max-w-md mb-8">
          {score === 5 ? "Perfect score! You have a flawless understanding of this level." :
           score >= 3 ? "Great job! A solid grasp of the concepts, but there's a little room for review." :
           "Keep studying! These were tough conceptual questions. Review the mistakes sections in the Concept Builder."}
        </div>
        <button 
          onClick={resetTest}
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
          Pressure Test ({difficulty?.toUpperCase()}): {currentIndex + 1}/5
        </h3>
        {isSubmitted && !isLoading && (
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
            <p className="text-nat-muted text-xs font-bold uppercase tracking-widest animate-pulse">Our AI is crafting your next challenge...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-nat-border border-dashed">
            <p className="text-[#991b1b] mb-4 text-sm font-bold">{error}</p>
            <button onClick={() => difficulty && loadNextQuestion(difficulty, [])} className="text-nat-primary font-bold text-xs uppercase tracking-widest underline">Try Again</button>
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
