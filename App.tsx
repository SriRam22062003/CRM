
import React, { useState, useEffect } from 'react';
import { MOCK_CONTACTS, MOCK_DEALS, MOCK_TASKS, MOCK_INVOICES, MOCK_PRODUCTS } from './constants';
import { Deal, Contact, Task, Invoice, DealStage, Product } from './types';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import ContactsList from './components/ContactsList';
import FinanceView from './components/FinanceView';
import ProjectView from './components/ProjectView';
import PricingView from './components/PricingView';
import ClientProjectsView from './components/ClientProjectsView';
import AIChatModal from './components/AIChatModal';
import DealModal from './components/DealModal';
import TaskModal from './components/TaskModal';
import InvoiceModal from './components/InvoiceModal';
import ContactModal from './components/ContactModal';
import IntegrationsModal from './components/IntegrationsModal';
import { connectToOutlook, getOutlookEvents } from './services/outlookService';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Users, 
  Settings, 
  Plus, 
  LogOut,
  MonitorSpeaker,
  Briefcase,
  Receipt,
  CheckSquare,
  Tag,
  FolderGit2,
  Menu,
  X
} from 'lucide-react';

// Helper to load data from localStorage or fallback to constants
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Failed to load ${key} from storage`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  // Application State with Persistence
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'projects' | 'finance' | 'contacts' | 'tasks' | 'pricing' | 'client-projects'>('dashboard');
  
  // Data State - Initialize from Storage
  const [deals, setDeals] = useState<Deal[]>(() => loadFromStorage('av_crm_deals', MOCK_DEALS));
  const [contacts, setContacts] = useState<Contact[]>(() => loadFromStorage('av_crm_contacts', MOCK_CONTACTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage('av_crm_tasks', MOCK_TASKS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('av_crm_invoices', MOCK_INVOICES));
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('av_crm_products', MOCK_PRODUCTS));
  const [isOutlookConnected, setIsOutlookConnected] = useState(() => loadFromStorage('av_crm_outlook_connected', false));
  
  // User Profile State - Initialize from Storage
  const [userProfile, setUserProfile] = useState(() => loadFromStorage('av_crm_profile', {
    appName: 'AV Pro CRM',
    userName: 'Admin User',
    role: 'Sales & Ops Manager',
    initials: 'AD'
  }));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [initialDealStage, setInitialDealStage] = useState<DealStage | undefined>(undefined);
  const [initialContactId, setInitialContactId] = useState<string | undefined>(undefined);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence Effects - Save to Storage whenever data changes
  useEffect(() => { localStorage.setItem('av_crm_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('av_crm_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('av_crm_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('av_crm_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('av_crm_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('av_crm_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('av_crm_outlook_connected', JSON.stringify(isOutlookConnected)); }, [isOutlookConnected]);

  // Handlers
  const handleNavClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleOpenAI = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsAIModalOpen(true);
  };

  const handleCreateDeal = () => {
    setDealToEdit(null);
    setInitialDealStage(DealStage.LEAD_IN);
    setInitialContactId(undefined);
    setIsDealModalOpen(true);
  };

  const handleCreateProject = () => {
    setDealToEdit(null);
    setInitialDealStage(DealStage.CLOSED_WON);
    setInitialContactId(undefined);
    setIsDealModalOpen(true);
  };

  const handleCreateProjectForClient = (contactId: string) => {
      setDealToEdit(null);
      setInitialDealStage(DealStage.CLOSED_WON);
      setInitialContactId(contactId);
      setIsDealModalOpen(true);
  };

  const handleCreateOpportunityForClient = (contactId: string) => {
      setDealToEdit(null);
      setInitialDealStage(DealStage.LEAD_IN);
      setInitialContactId(contactId);
      setIsDealModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setDealToEdit(deal);
    setInitialDealStage(undefined);
    setInitialContactId(undefined);
    setIsDealModalOpen(true);
  };

  const handleSaveDeal = (deal: Deal) => {
    if (deals.find(d => d.id === deal.id)) {
      setDeals(deals.map(d => d.id === deal.id ? deal : d));
    } else {
      setDeals([...deals, deal]);
    }
    // Also add a default task for new deals
    if (!dealToEdit) {
        setTasks([...tasks, {
            id: `t-${Date.now()}`,
            title: deal.stage === DealStage.CLOSED_WON ? `Project Kickoff: ${deal.title}` : `Follow up: ${deal.title}`,
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            priority: 'Medium',
            status: 'Pending',
            type: deal.stage === DealStage.CLOSED_WON ? 'Meeting' : 'Call',
            relatedDealId: deal.id,
            source: 'CRM'
        }]);
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (tasks.find(t => t.id === task.id)) {
        setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
        setTasks([...tasks, task]);
    }
  };

  const handleConnectOutlook = async () => {
      const success = await connectToOutlook();
      if (success) {
          setIsOutlookConnected(true);
          const events = await getOutlookEvents();
          // Filter out events that might already exist to avoid dupes in this mock env
          const newEvents = events.filter(e => !tasks.some(t => t.id === e.id));
          setTasks([...tasks, ...newEvents]);
      }
  };

  const handleDisconnectOutlook = () => {
      setIsOutlookConnected(false);
      setTasks(tasks.filter(t => t.source !== 'Outlook'));
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
  };

  const handleSaveContact = (contact: Contact) => {
    if (contacts.find(c => c.id === contact.id)) {
        setContacts(contacts.map(c => c.id === contact.id ? contact : c));
    } else {
        setContacts([...contacts, contact]);
    }
  };

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleImportCSV = () => {
      alert("Simulated CSV Import: Added 1 new contact.");
      const newContact: Contact = {
          id: `c${Date.now()}`,
          name: "Alex Murphy",
          company: "OmniCorp",
          role: "Operations Head",
          email: "alex@omnicorp.com",
          phone: "555-9000"
      };
      setContacts([...contacts, newContact]);
  };

  const getContactForDeal = (deal: Deal | null): Contact => {
    if (!deal) return contacts[0];
    return contacts.find(c => c.id === deal.contactId) || contacts[0];
  };

  const isProjectTask = (task: Task) => {
    const deal = deals.find(d => d.id === task.relatedDealId);
    return deal && deal.stage === DealStage.CLOSED_WON;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
                  deals={deals} 
                  tasks={tasks} 
                  invoices={invoices} 
                  onAddTask={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}
                  onViewTasks={() => setActiveTab('tasks')}
                  onEditTask={handleEditTask}
                  onConnectOutlook={() => setIsSettingsOpen(true)}
                  isOutlookConnected={isOutlookConnected}
               />;
      case 'pipeline':
        return (
          <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Sales Pipeline</h2>
              <button 
                onClick={handleCreateDeal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors w-full sm:w-auto justify-center"
              >
                <Plus size={18} />
                <span>New Opportunity</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
               <KanbanBoard 
                  deals={deals} 
                  contacts={contacts} 
                  onDealClick={handleEditDeal} 
                  onOpenAI={handleOpenAI}
               />
            </div>
          </div>
        );
      case 'projects':
        const wonDeals = deals.filter(d => d.stage === 'Closed Won');
        return <ProjectView 
                  projects={wonDeals}
                  tasks={tasks}
                  onManageProject={handleEditDeal} 
                  onAddProject={handleCreateProject}
                  onEditTask={handleEditTask}
               />;
      case 'client-projects':
        return <ClientProjectsView 
                  contacts={contacts} 
                  deals={deals} 
                  onEditDeal={handleEditDeal}
                  onAddProject={handleCreateProjectForClient}
                  onAddOpportunity={handleCreateOpportunityForClient}
                  onEditContact={(contact) => { setContactToEdit(contact); setIsContactModalOpen(true); }}
               />;
      case 'finance':
        return <FinanceView invoices={invoices} deals={deals} onAddInvoice={() => setIsInvoiceModalOpen(true)} />;
      case 'contacts':
         return (
          <div className="h-full">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <h2 className="text-2xl font-bold text-white">Client Directory</h2>
                 <div className="flex space-x-3 w-full sm:w-auto">
                     <button onClick={handleImportCSV} className="flex-1 sm:flex-none bg-gray-800 text-white px-4 py-2 rounded-lg text-sm border border-gray-700 hover:bg-gray-700">Import CSV</button>
                     <button 
                        onClick={() => { setContactToEdit(null); setIsContactModalOpen(true); }}
                        className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-colors"
                     >
                        <Plus size={18} />
                        <span>Add Client</span>
                     </button>
                 </div>
             </div>
             <ContactsList 
                contacts={contacts}
                deals={deals}
                onContactClick={(contact) => { setContactToEdit(contact); setIsContactModalOpen(true); }}
             />
          </div>
         );
      case 'tasks':
         return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Tasks</h2>
                    <button 
                        onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Task</span>
                    </button>
                </div>
                
                <div className="grid gap-4 overflow-y-auto">
                    {tasks.map(task => {
                        const isProj = isProjectTask(task);
                        return (
                        <div key={task.id} className={`bg-gray-800 p-4 rounded-xl border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 ${isProj ? 'border-l-4 border-l-emerald-500 border-t-gray-700 border-r-gray-700 border-b-gray-700' : 'border-gray-700'}`}>
                            <div className="flex-1 cursor-pointer" onClick={() => handleEditTask(task)}>
                                <div className="flex items-center space-x-2 flex-wrap">
                                     <h4 className={`font-bold ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</h4>
                                     {isProj && <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700">PROJECT</span>}
                                     {task.source === 'Outlook' && <span className="text-[10px] bg-blue-600 text-white px-1 rounded">Outlook</span>}
                                </div>
                                <p className="text-sm text-gray-400 mt-1">Due: {task.dueDate} {task.startTime && `@ ${task.startTime}`} • Priority: {task.priority} {task.location && `• ${task.location}`}</p>
                            </div>
                            {task.status === 'Pending' && (
                                <button 
                                    onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, status: 'Completed'} : t))}
                                    className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30 w-full sm:w-auto text-center"
                                >
                                    Mark Done
                                </button>
                            )}
                        </div>
                    )})}
                </div>
            </div>
         );
      case 'pricing':
          return <PricingView 
                    deals={deals} 
                    contacts={contacts} 
                    products={products} 
                    onAddProduct={handleAddProduct} 
                    onAddDeal={handleSaveDeal}
                 />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden text-gray-100 font-sans selection:bg-indigo-500/30">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <MonitorSpeaker size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white truncate max-w-[140px]">{userProfile.appName}</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-2">Overview</div>
          
          <button 
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-6">Sales</div>
          
          <button 
            onClick={() => handleNavClick('pipeline')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'pipeline' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <KanbanSquare size={20} />
            <span className="font-medium">Pipeline / BOQs</span>
          </button>
           <button 
            onClick={() => handleNavClick('contacts')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'contacts' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <Users size={20} />
            <span className="font-medium">Contacts</span>
          </button>
          
          <button 
            onClick={() => handleNavClick('pricing')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'pricing' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <Tag size={20} />
            <span className="font-medium">Products & Pricing</span>
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-6">Operations</div>

          <button 
            onClick={() => handleNavClick('projects')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <Briefcase size={20} />
            <span className="font-medium">Projects</span>
          </button>
          <button 
            onClick={() => handleNavClick('client-projects')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'client-projects' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <FolderGit2 size={20} />
            <span className="font-medium">Client Projects</span>
          </button>
           <button 
            onClick={() => handleNavClick('tasks')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'tasks' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <CheckSquare size={20} />
            <span className="font-medium">Tasks</span>
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-6">Finance</div>

          <button 
            onClick={() => handleNavClick('finance')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'finance' ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          >
            <Receipt size={20} />
            <span className="font-medium">Invoices & POs</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          <button 
            onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
           <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 relative w-full">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-10">
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 p-2 -ml-2 hover:text-white">
                <Menu size={24} />
             </button>
             <span className="font-bold text-white text-lg">{userProfile.appName}</span>
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-400">
               {userProfile.initials}
             </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-gray-800 items-center justify-between px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="text-sm text-gray-400">
            Role: <span className="text-white font-semibold">{userProfile.role}</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-400 shadow shadow-indigo-500/30">
               {userProfile.initials}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedDeal && (
        <AIChatModal 
          isOpen={isAIModalOpen}
          onClose={() => { setIsAIModalOpen(false); setSelectedDeal(null); }}
          deal={selectedDeal}
          contact={getContactForDeal(selectedDeal)}
        />
      )}

      <DealModal 
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        onSave={handleSaveDeal}
        deal={dealToEdit}
        contacts={contacts}
        initialStage={initialDealStage}
        initialContactId={initialContactId}
      />

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={taskToEdit}
      />

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        deals={deals}
        contacts={contacts}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
        contact={contactToEdit}
        deals={deals}
      />

      <IntegrationsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isOutlookConnected={isOutlookConnected}
        onConnectOutlook={handleConnectOutlook}
        onDisconnectOutlook={handleDisconnectOutlook}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        deals={deals}
        contacts={contacts}
        tasks={tasks}
        invoices={invoices}
        products={products}
      />
    </div>
  );
};

export default App;
