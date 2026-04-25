import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, AlertCircle, CheckCircle2, TrendingUp, Award, BookOpen, Clock } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface TestAttempt {
  id: string;
  topicId: string;
  score: number;
  total: number;
  date: Date;
  mistakes: string[];
}

export function Cockpit() {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      const pathForGetDocs = `users/${auth.currentUser.uid}/attempts`;
      try {
        const q = query(
          collection(db, pathForGetDocs),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedAttempts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate()
          } as TestAttempt;
        });
        setAttempts(fetchedAttempts);
      } catch (e) {
        console.error("Failed to fetch stats", e);
        handleFirestoreError(e, OperationType.GET, pathForGetDocs);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth.currentUser]);

  if (!auth.currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-3xl m-6 border border-nat-border">
        <Award className="w-16 h-16 text-nat-muted mb-4 opacity-50" />
        <h2 className="text-2xl font-serif italic text-nat-dark mb-2">Performance Cockpit</h2>
        <p className="text-nat-muted max-w-sm">Sign in to track your performance, view your error logs, and get personalized insights.</p>
      </div>
    );
  }

  const totalTests = attempts.length;
  const averageScore = totalTests > 0 
    ? (attempts.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalTests) * 100 
    : 0;

  const allMistakes = attempts.flatMap(a => a.mistakes).filter(Boolean);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-nat-bg h-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-serif italic text-nat-dark flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-nat-primary" />
            Performance Cockpit
          </h1>
          <p className="text-nat-muted mt-2">Track your mastery and review your error logs.</p>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-white rounded-3xl" />
            <div className="h-64 bg-white rounded-3xl" />
          </div>
        ) : (
          <>
            {/* Aggregates Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-nat-border flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-nat-muted mb-1">Avg Score</div>
                  <div className="text-3xl font-mono text-nat-dark">{averageScore.toFixed(0)}%</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-nat-border flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-nat-muted mb-1">Tests Taken</div>
                  <div className="text-3xl font-mono text-nat-dark">{totalTests}</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-nat-border flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-nat-muted mb-1">Concepts to Review</div>
                  <div className="text-3xl font-mono text-nat-dark">{allMistakes.length}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Error Log */}
              <div className="bg-white rounded-3xl border border-nat-border shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-nat-border bg-nat-panel shrink-0">
                  <h3 className="font-bold text-nat-dark flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Error Log & Areas to Review
                  </h3>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  {allMistakes.length === 0 ? (
                    <div className="text-center text-nat-muted py-12">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No mistakes logged yet. Great job!</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {allMistakes.map((mistake, i) => (
                        <li key={i} className="bg-red-50/50 border border-red-100 p-4 rounded-xl text-sm text-nat-dark flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-3xl border border-nat-border shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-nat-border bg-nat-panel shrink-0">
                  <h3 className="font-bold text-nat-dark flex items-center gap-2">
                    <Clock className="w-5 h-5 text-nat-primary" />
                    Recent Test Attempts
                  </h3>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  {attempts.length === 0 ? (
                    <div className="text-center text-nat-muted py-12">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No tests taken yet. Start practicing!</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {attempts.map((attempt) => (
                        <li key={attempt.id} className="flex items-center justify-between p-4 rounded-xl border border-nat-border hover:bg-nat-light transition-colors">
                          <div>
                            <div className="font-bold text-nat-dark text-sm mb-1">{attempt.topicId.replace('-', ' ')}</div>
                            <div className="text-xs text-nat-muted">
                              {attempt.date.toLocaleDateString()} at {attempt.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-lg font-mono font-bold ${attempt.score >= attempt.total * 0.8 ? 'text-green-600' : attempt.score >= attempt.total * 0.5 ? 'text-orange-500' : 'text-red-500'}`}>
                              {attempt.score}/{attempt.total}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
