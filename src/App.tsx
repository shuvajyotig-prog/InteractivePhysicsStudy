import React, { useState } from 'react';
import { ClassLevel, syllabus, Topic } from './data/syllabus';
import { ProjectileSimulation } from './components/ProjectileSimulation';
import { CircuitSimulation } from './components/CircuitSimulation';
import { OpticsSimulation } from './components/OpticsSimulation';
import { PressureTest } from './components/PressureTest';
import { ConceptBuilder } from './components/ConceptBuilder';
import { BookOpen, Target, FlaskConical, GraduationCap, ChevronRight, Menu, X, CheckSquare } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type TabView = 'concept' | 'simulation' | 'practice';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("11");
  const [selectedTopic, setSelectedTopic] = useState<Topic>(syllabus["11"][0]);
  const [activeTab, setActiveTab] = useState<TabView>("concept");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // When class changes, reset topic to the first of that class
  const handleClassChange = (grade: ClassLevel) => {
    setSelectedClass(grade);
    setSelectedTopic(syllabus[grade][0]);
    setActiveTab("concept");
  };

  const handleTopicChange = (topic: Topic) => {
    setSelectedTopic(topic);
    setActiveTab("concept");
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-nat-bg text-nat-text font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-nat-dark/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-nat-light border-r border-nat-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-nat-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-nat-primary rounded-xl flex items-center justify-center text-white font-bold font-serif italic text-lg">Φ</div>
            <div className="font-bold text-nat-dark leading-tight">PhyQuest Pro</div>
          </div>
          <button className="lg:hidden text-nat-muted hover:text-nat-dark" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 border-b border-nat-border">
          <div className="text-xs font-bold text-nat-muted uppercase tracking-widest mb-3">Select Class</div>
          <div className="grid grid-cols-2 gap-2">
            {(["9", "10", "11", "12"] as ClassLevel[]).map((grade) => (
              <button
                key={grade}
                onClick={() => handleClassChange(grade)}
                className={cn(
                  "py-2 text-sm font-medium rounded-lg transition-colors border",
                  selectedClass === grade 
                    ? "bg-nat-primary border-nat-primary text-white" 
                    : "bg-white border-nat-border text-nat-text hover:bg-nat-bg"
                )}
              >
                 {grade}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-nat-muted mb-2">Curriculum</h2>
          <nav className="flex flex-col gap-2">
            {syllabus[selectedClass].map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all border",
                  selectedTopic.id === topic.id
                    ? "bg-nat-primary text-white border-nat-primary"
                    : "bg-white border-nat-border text-nat-text hover:bg-nat-panel"
                )}
              >
                <span className="font-medium truncate max-w-[140px] text-left">{topic.title}</span>
                {selectedTopic.id === topic.id ? (
                  <span className="text-[10px] font-bold bg-nat-accent px-2 py-0.5 rounded shrink-0">ACTIVE</span>
                ) : (
                  topic.hasSimulation && <div className="w-2 h-2 bg-nat-secondary rounded-full border border-white"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-nat-border flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-nat-muted hover:text-nat-dark" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
               <h1 className="text-lg font-bold text-nat-dark leading-tight">{selectedTopic.title}</h1>
               <p className="text-[10px] uppercase tracking-wider text-nat-muted font-semibold hidden md:block">CBSE Class {selectedClass}</p>
            </div>
          </div>
          
          <div className="flex bg-nat-panel rounded-lg border border-nat-border p-1">
            <button
              onClick={() => setActiveTab('concept')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-widest",
                activeTab === 'concept' ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" /> Concept
            </button>
            {selectedTopic.hasSimulation && (
              <button
                onClick={() => setActiveTab('simulation')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === 'simulation' ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
                )}
              >
                <FlaskConical className="w-3.5 h-3.5" /> Lab
              </button>
            )}
            <button
              onClick={() => setActiveTab('practice')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-widest",
                activeTab === 'practice' ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
              )}
            >
              <CheckSquare className="w-3.5 h-3.5" /> Test
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col items-center">
          <div className="w-full max-w-[1024px] space-y-8 flex-1">
            
            {activeTab === 'concept' && (
              <ConceptBuilder grade={selectedClass} topic={selectedTopic} />
            )}

            {activeTab === 'simulation' && selectedTopic.hasSimulation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                {selectedTopic.id === 'kinematics' || selectedTopic.id === 'motion' ? (
                  <ProjectileSimulation />
                ) : selectedTopic.id === 'electricity' || selectedTopic.id === 'current-electricity' ? (
                  <CircuitSimulation />
                ) : selectedTopic.id === 'light' || selectedTopic.id === 'optics' ? (
                  <OpticsSimulation />
                ) : (
                  <div className="bg-nat-panel border border-nat-border text-nat-text p-8 rounded-3xl text-center">
                    <FlaskConical className="w-12 h-12 mx-auto text-nat-muted mb-4" />
                    <h3 className="text-lg font-bold mb-2">Interactive Lab Locked</h3>
                    <p className="text-sm">We are currently building the simulation for {selectedTopic.title}.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'practice' && (
              <PressureTest grade={selectedClass} topic={selectedTopic.title} />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
