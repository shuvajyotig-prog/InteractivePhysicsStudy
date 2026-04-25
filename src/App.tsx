import React, { useState, useEffect } from 'react';
import { ClassLevel, syllabus, Topic } from './data/syllabus';
import { ProjectileSimulation } from './components/ProjectileSimulation';
import { CircuitSimulation } from './components/CircuitSimulation';
import { OpticsSimulation } from './components/OpticsSimulation';
import { PressureTest } from './components/PressureTest';
import { ConceptBuilder } from './components/ConceptBuilder';
import { GlobalSearch } from './components/GlobalSearch';
import { AuthModal } from './components/AuthModal';
import { OtherSimulations } from './components/OtherSimulations';
import { BookOpen, Target, FlaskConical, GraduationCap, ChevronRight, Menu, X, CheckSquare, Search, LogIn, LogOut, User, ActivitySquare } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Cockpit } from './components/Cockpit';

type TabView = 'concept' | 'simulation' | 'practice' | 'cockpit';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("11");
  const [selectedTopic, setSelectedTopic] = useState<Topic>(syllabus["11"][0]);
  const [activeTab, setActiveTab] = useState<TabView>("concept");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

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

  const handleSearchSelect = (subjectId: string, topicId: string) => {
    // Find the class level the topic belongs to
    for (const [grade, topics] of Object.entries(syllabus)) {
      const topic = topics.find(t => t.id === topicId);
      if (topic) {
        setSelectedClass(grade as ClassLevel);
        setSelectedTopic(topic);
        setActiveTab('concept');
        break;
      }
    }
  };

  return (
    <div className="flex h-screen bg-nat-bg text-nat-text font-sans overflow-hidden">
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelectContent={handleSearchSelect} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

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

        <div className="p-4 border-b border-nat-border shrink-0 flex items-center justify-between">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 bg-[#c27a56] rounded-full flex items-center justify-center text-white shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-nat-dark leading-tight line-clamp-1">{user.email}</div>
                  <div className="text-[10px] text-nat-muted uppercase tracking-widest font-semibold">Student</div>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-nat-muted hover:text-nat-dark rounded-full hover:bg-nat-panel shrink-0 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="w-full bg-nat-dark text-white rounded-lg py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>

        <div className="p-6 border-b border-nat-border shrink-0">
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
        <header className="h-16 bg-white border-b border-nat-border flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm z-10 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button className="lg:hidden text-nat-muted hover:text-nat-dark shrink-0" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
               <h1 className="text-lg font-bold text-nat-dark leading-tight truncate">{selectedTopic.title}</h1>
               <p className="text-[10px] uppercase tracking-wider text-nat-muted font-semibold hidden md:block truncate">CBSE Class {selectedClass}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 mr-2 text-nat-muted hover:text-nat-dark hover:bg-nat-light rounded-full transition-colors hidden sm:flex items-center gap-2 bg-nat-panel border border-nat-border px-4 py-1.5"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Search...</span>
            </button>
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 mr-2 text-nat-muted hover:text-nat-dark hover:bg-nat-light rounded-full transition-colors sm:hidden"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="flex bg-nat-panel rounded-lg border border-nat-border p-1">
              <button
                onClick={() => setActiveTab('concept')}
                className={cn(
                  "flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === 'concept' ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Concept</span>
              </button>
              {selectedTopic.hasSimulation && (
                <button
                  onClick={() => setActiveTab('simulation')}
                  className={cn(
                    "flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-widest",
                    activeTab === 'simulation' ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
                  )}
                >
                  <FlaskConical className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Lab</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('practice')}
                className={cn(
                  "flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === 'practice' ? "bg-white text-nat-dark shadow-sm" : "text-nat-muted hover:text-nat-dark"
                )}
              >
                <CheckSquare className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Test</span>
              </button>
            </div>
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
                  <OtherSimulations topicId={selectedTopic.id} />
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
