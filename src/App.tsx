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
import { AIAssistant } from './components/AIAssistant';
import { BookOpen, Target, FlaskConical, GraduationCap, ChevronRight, Menu, X, CheckSquare, Search, LogIn, LogOut, User, ActivitySquare, HelpCircle, Settings } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Cockpit } from './components/Cockpit';

type TabView = 'theory' | 'lab' | 'test' | 'ai' | 'cockpit';

export default function App() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("11");
  const [selectedTopic, setSelectedTopic] = useState<Topic>(syllabus["11"][0]);
  const [activeTab, setActiveTab] = useState<TabView>("theory");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    setActiveTab("theory");
  };

  const handleTopicChange = (topic: Topic) => {
    // Find the class level the topic belongs to
    for (const [grade, topics] of Object.entries(syllabus)) {
      const found = topics.find(t => t.id === topic.id);
      if (found) {
        setSelectedClass(grade as ClassLevel);
        break;
      }
    }
    setSelectedTopic(topic);
    setActiveTab("theory");
    setSidebarOpen(false);
  };

  const handleSearchSelect = (subjectId: string, topicId: string) => {
    // Find the class level the topic belongs to
    for (const [grade, topics] of Object.entries(syllabus)) {
      const topic = topics.find(t => t.id === topicId);
      if (topic) {
        setSelectedClass(grade as ClassLevel);
        setSelectedTopic(topic);
        setActiveTab('theory');
        break;
      }
    }
  };

  return (
    <div className="flex h-screen bg-nat-bg text-nat-text font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-nat-dark/50 z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Persistent on tablets and desktop (md+) */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-nat-light border-r border-nat-border overflow-hidden transition-all duration-500 ease-in-out md:translate-x-0 md:static md:flex md:flex-col shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className={cn(
          "h-16 flex items-center px-4 border-b border-nat-border shrink-0 bg-white transition-all",
          sidebarCollapsed ? "justify-center gap-1" : "justify-between"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-nat-primary rounded-xl flex items-center justify-center text-white font-bold font-serif italic text-xl shadow-lg border border-nat-primary/20 shrink-0">Φ</div>
            {!sidebarCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="font-bold text-nat-dark leading-none text-sm tracking-tight whitespace-nowrap">PhyQuest Pro</div>
                <div className="text-[10px] text-nat-muted uppercase tracking-[0.2em] mt-1 font-bold whitespace-nowrap">Physics Labs</div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-nat-panel text-nat-muted hover:text-nat-primary transition-all md:flex hidden items-center justify-center shrink-0"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronRight className={cn("w-4 h-4 transition-transform duration-500", sidebarCollapsed ? "" : "rotate-180")} />
          </button>

          {!sidebarCollapsed && (
            <button className="md:hidden text-nat-muted hover:text-nat-dark p-1 rounded-full hover:bg-nat-panel" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-8 custom-scrollbar no-scrollbar">
          {user && (
            <div className="flex flex-col gap-2">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2 px-2 mb-1 animate-in fade-in duration-300">
                  <div className="h-[1px] flex-1 bg-nat-border"></div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nat-muted whitespace-nowrap">Intelligence</h2>
                  <div className="h-[1px] flex-1 bg-nat-border"></div>
                </div>
              )}
              <button
                onClick={() => { setActiveTab('cockpit'); setSidebarOpen(false); }}
                title={sidebarCollapsed ? "Student Cockpit" : undefined}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all border group",
                  activeTab === 'cockpit'
                     ? "bg-nat-primary text-white border-nat-primary shadow-md" 
                     : "bg-white border-nat-border text-nat-text hover:border-nat-primary/50 hover:bg-nat-panel",
                  sidebarCollapsed && "justify-center px-0"
                )}
              >
                  <span className={cn("font-bold truncate text-left flex items-center gap-2", sidebarCollapsed && "justify-center")}>
                     <Target className={cn("w-4 h-4", activeTab === 'cockpit' ? "text-white" : "text-nat-primary")} /> 
                     {!sidebarCollapsed && <span className="animate-in fade-in duration-300">Student Cockpit</span>}
                  </span>
                  {!sidebarCollapsed && activeTab === 'cockpit' && (
                     <ActivitySquare className="w-3 h-3 text-white animate-pulse" />
                  )}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2 px-2 mb-1 animate-in fade-in duration-300">
                  <div className="h-[1px] flex-1 bg-nat-border"></div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nat-muted whitespace-nowrap">Curriculum</h2>
                  <div className="h-[1px] flex-1 bg-nat-border"></div>
                </div>
              )}
              <nav className="flex flex-col gap-1">
                {(Object.keys(syllabus) as ClassLevel[]).flatMap(grade => syllabus[grade]).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicChange(topic)}
                    title={sidebarCollapsed ? topic.title : undefined}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl text-[13px] transition-all border group",
                      selectedTopic.id === topic.id && activeTab !== 'cockpit'
                        ? "bg-nat-dark text-white border-nat-dark shadow-sm"
                        : "bg-white/50 border-transparent text-nat-text hover:bg-white hover:border-nat-border hover:shadow-sm",
                      sidebarCollapsed && "justify-center px-0"
                    )}
                  >
                    {!sidebarCollapsed ? (
                      <>
                        <span className={cn(
                          "font-medium truncate max-w-[160px] text-left animate-in fade-in duration-300",
                          selectedTopic.id === topic.id && activeTab !== 'cockpit' ? "font-bold" : ""
                        )}>{topic.title}</span>
                        
                        {selectedTopic.id === topic.id && activeTab !== 'cockpit' ? (
                          <div className="w-1.5 h-1.5 bg-nat-accent rounded-full shadow-[0_0_8px_rgba(230,186,138,0.8)]"></div>
                        ) : (
                          topic.hasSimulation && <FlaskConical className="w-3 h-3 text-nat-muted group-hover:text-nat-primary transition-colors opacity-40" />
                        )}
                      </>
                    ) : (
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedTopic.id === topic.id && activeTab !== 'cockpit' ? "bg-nat-accent" : "bg-nat-muted/30"
                      )} />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Header content */}
      </div>
        {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-nat-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-20 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button className="md:hidden text-nat-muted hover:text-nat-dark shrink-0 p-2 hover:bg-nat-panel rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
               <h1 className="text-lg font-bold text-nat-dark leading-tight truncate font-serif italic">
                 {activeTab === 'cockpit' ? "Dashboard" : selectedTopic.title}
               </h1>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-nat-secondary animate-pulse"></div>
                  <p className="text-[9px] uppercase tracking-wider text-nat-muted font-bold truncate">
                    {activeTab === 'cockpit' ? "Cognitive Progress Tracker" : `${selectedTopic.id.replace(/-/g, ' ')}`}
                  </p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 mr-2 text-nat-muted hover:text-nat-dark hover:bg-white rounded-full transition-colors hidden sm:flex items-center gap-2 bg-white shadow-sm border border-nat-border px-4 py-1.5 w-48 lg:w-80"
            >
              <Search className="w-4 h-4 text-nat-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-nat-muted text-left flex-1 truncate">Search concept...</span>
            </button>
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-nat-primary hover:text-nat-dark bg-white shadow-sm border border-nat-border rounded-full transition-colors sm:hidden"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-4 border-l border-nat-border h-10">
                <div className="flex flex-col items-end justify-center">
                  <span className="text-[10px] font-medium text-nat-muted truncate max-w-[150px] leading-tight mb-0.5">{user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-nat-primary hover:text-nat-dark transition-colors flex items-center gap-1 group/out"
                  >
                    Logout
                    <LogOut className="w-2.5 h-2.5 transition-transform group-hover/out:translate-x-0.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center pl-4 border-l border-nat-border h-8">
                <button
                  onClick={() => setAuthOpen(true)}
                  className="bg-nat-dark text-white rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-sm flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" /> 
                  <span>Sign In</span>
                </button>
              </div>
            )}
           </div>
        </header>

        {activeTab !== 'cockpit' && (
          <div className="w-full bg-white/80 backdrop-blur-md border-b border-nat-border z-10 flex justify-center px-4 shrink-0">
            <div className="w-full max-w-[1024px] py-3 flex items-center gap-2 md:gap-6 overflow-x-auto no-scrollbar">
              {[
                { id: 'theory', icon: BookOpen, label: 'Theory' },
                { id: 'lab', icon: FlaskConical, label: 'Lab', show: selectedTopic.hasSimulation },
                { id: 'test', icon: CheckSquare, label: 'Practice' },
                { id: 'ai', icon: HelpCircle, label: 'Ask Tutor' }
              ].filter(t => t.show !== false).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabView)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all uppercase tracking-[0.2em] whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-nat-dark text-white shadow-lg ring-1 ring-black/10 scale-[1.02]" 
                      : "text-nat-muted hover:text-nat-dark hover:bg-nat-light"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-[1024px] p-4 md:p-8 space-y-8 flex-1">
            
            {activeTab === 'theory' && (
              <ConceptBuilder 
                grade={selectedClass} 
                topic={selectedTopic} 
                onSwitchTab={(tab) => setActiveTab(tab as TabView)} 
              />
            )}

            {activeTab === 'lab' && selectedTopic.hasSimulation && (
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

            {activeTab === 'test' && (
              <PressureTest grade={selectedClass} topic={selectedTopic.title} />
            )}

            {activeTab === 'ai' && (
              <AIAssistant topicTitle={selectedTopic.title} />
            )}

            {activeTab === 'cockpit' && user && (
              <Cockpit />
            )}
          </div>
        </main>
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelectContent={handleSearchSelect} />
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={() => {
          setAuthOpen(false);
          setActiveTab('cockpit');
          setSidebarOpen(false);
        }}
      />
    </div>
  );
}
