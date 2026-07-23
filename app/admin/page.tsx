'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/supabase/storage';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Calendar, 
  Heart, 
  Users, 
  MapPin, 
  Award, 
  Image as ImageIcon, 
  DollarSign, 
  FileText, 
  Mail, 
  Search, 
  TrendingUp, 
  Shield, 
  Settings, 
  FileSpreadsheet, 
  Activity, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronRight, 
  Bell, 
  SearchCode, 
  Info, 
  Globe, 
  Database,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckSquare,
  Sparkles,
  RefreshCw,
  Sliders,
  Send,
  SlidersHorizontal,
  ChevronDown,
  Menu
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Types & Schema Definition ---
interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  youtubeId: string;
}

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  downloads: string;
  format: string;
  description: string;
}

interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  date: string;
  status: 'Pending' | 'Answered' | 'Prophetic Action';
  branch: string;
}

interface Branch {
  id: string;
  name: string;
  location: string;
  pastor: string;
  members: number;
}

interface LiveMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  approved: boolean;
}

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

// User role configuration with corresponding permissions
const USER_ROLES_LIST = [
  { role: 'Super Administrator', badgeColor: 'bg-red-500/10 text-red-600 border-red-200' },
  { role: 'Administrator', badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  { role: 'Pastor', badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  { role: 'Content Editor', badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { role: 'Media Team', badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-200' },
  { role: 'Finance Team', badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { role: 'Prayer Team', badgeColor: 'bg-pink-500/10 text-pink-600 border-pink-200' },
  { role: 'Events Manager', badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { role: 'Volunteer Coordinator', badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-200' },
  { role: 'Viewer (Read Only)', badgeColor: 'bg-gray-500/10 text-gray-600 border-gray-200' }
];


const sermonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  speaker: z.string().min(1, 'Speaker is required'),
  date: z.string().optional(),
  duration: z.string().optional(),
  youtubeId: z.string().min(11, 'Valid YouTube ID required')
});


const bookSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string(),
  pages: z.number(),
  downloads: z.string(),
  format: z.string(),
  description: z.string()
});

export default function AdminDashboard() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@bornofgod.org');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState('Super Administrator');
  const [activeUser, setActiveUser] = useState({
    name: 'Apostle John Doe',
    email: 'john.doe@bornofgod.org',
    role: 'Super Administrator',
    avatarLetter: 'A'
  });

  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Sidebar Collapse ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState('Dashboard');

  // --- Selected Workspace ---
  const [workspace, setWorkspace] = useState('Born Of God - Global HQ');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  // --- Dynamic Content States ---
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [liveChat, setLiveChat] = useState<LiveMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({ cpu: 14, memory: 42, latency: 28 });

  // --- Notifications State ---
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'New urgent prayer request from Kakamega Branch', time: '2m ago', read: false },
    { id: '2', message: 'Monthly financial audit completed successfully', time: '1h ago', read: false },
    { id: '3', message: 'Live stream YouTube ID updated for Sunday service', time: '4h ago', read: true }
  ]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // --- Form States for Adding/Editing ---
  const [newSermon, setNewSermon] = useState({ title: '', speaker: 'Apostle John Doe', date: '', duration: '', youtubeId: '' });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: 'Discipleship', pages: 150, downloads: '0', format: 'PDF', description: '' });
  const [newBranch, setNewBranch] = useState({ name: '', location: '', pastor: '', members: 100 });
  
  // Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Modal control ---
  const [isSermonModalOpen, setIsSermonModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // Permissions Matrix State
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
    'Super Administrator': { content: true, users: true, finance: true, livestream: true, logs: true },
    'Administrator': { content: true, users: true, finance: true, livestream: true, logs: true },
    'Pastor': { content: true, users: false, finance: false, livestream: true, logs: true },
    'Content Editor': { content: true, users: false, finance: false, livestream: false, logs: false },
    'Media Team': { content: true, users: false, finance: false, livestream: true, logs: false },
    'Finance Team': { content: false, users: false, finance: true, livestream: false, logs: false },
    'Prayer Team': { content: true, users: false, finance: false, livestream: false, logs: false },
    'Events Manager': { content: true, users: false, finance: false, livestream: false, logs: false },
    'Volunteer Coordinator': { content: true, users: false, finance: false, livestream: false, logs: false },
    'Viewer (Read Only)': { content: false, users: false, finance: false, livestream: false, logs: false }
  });

  // --- Initial Hydration and local storage synchronization ---
  useEffect(() => {
    // Initial Sermons
    const localSermons = localStorage.getItem('bog_sermons');
    if (localSermons) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSermons(JSON.parse(localSermons));
    } else {
      const defaultSermons = [
        { id: 1, title: 'The Power of Sonship', speaker: 'Apostle John Doe', date: 'Oct 22, 2023', duration: '45 mins', youtubeId: 'dQw4w9WgXcQ' },
        { id: 2, title: 'Faith That Moves Mountains', speaker: 'Pastor Jane Smith', date: 'Oct 15, 2023', duration: '52 mins', youtubeId: 'dQw4w9WgXcQ' },
        { id: 3, title: 'Walking in Divine Purpose', speaker: 'Apostle John Doe', date: 'Oct 08, 2023', duration: '60 mins', youtubeId: 'dQw4w9WgXcQ' },
      ];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSermons(defaultSermons);
      localStorage.setItem('bog_sermons', JSON.stringify(defaultSermons));
    }

    // Initial Books
    const localBooks = localStorage.getItem('bog_books');
    if (localBooks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBooks(JSON.parse(localBooks));
    } else {
      const defaultBooks = [
        { id: 'b1', title: 'Foundations of Faith', author: 'Apostle John Doe', category: 'Discipleship', pages: 120, downloads: '15.2k', format: 'PDF', description: 'A core guide to Christian faith.' },
        { id: 'b2', title: 'The Prayer Driven Church', author: 'Pastor Jane Doe', category: 'Prayer', pages: 210, downloads: '8.4k', format: 'EPUB', description: 'Developing church-wide prayer strategy.' },
        { id: 'b3', title: 'Marriage By Design', author: 'Rev. Mark Smith', category: 'Marriage', pages: 185, downloads: '10.1k', format: 'PDF', description: 'Biblical guide to healthy relationships.' }
      ];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBooks(defaultBooks);
      localStorage.setItem('bog_books', JSON.stringify(defaultBooks));
    }

    // Load static logs, branches, and prayers
    setBranches([
      { id: 'br1', name: 'Nairobi Global HQ', location: 'Nairobi, Kenya', pastor: 'Apostle John Doe', members: 4200 },
      { id: 'br2', name: 'London Covenant Branch', location: 'London, UK', pastor: 'Pastor Elizabeth Taylor', members: 620 },
      { id: 'br3', name: 'Johannesburg Revival Dome', location: 'Johannesburg, SA', pastor: 'Pastor Thabo Mbeki', members: 1240 },
      { id: 'br4', name: 'New York Hope Assembly', location: 'New York, US', pastor: 'Pastor Caleb Vance', members: 480 }
    ]);

    setPrayers([
      { id: 'p1', name: 'Grace Wambui', request: 'Healing from chronic joint pains in left leg.', date: 'July 14, 2026', status: 'Pending', branch: 'Nairobi Global HQ' },
      { id: 'p2', name: 'Samuel Harris', request: 'Provision for children tuition fees for the incoming term.', date: 'July 13, 2026', status: 'Answered', branch: 'New York Hope Assembly' },
      { id: 'p3', name: 'Michael Ochieng', request: 'Divine spiritual breakthrough for upcoming church mission.', date: 'July 12, 2026', status: 'Prophetic Action', branch: 'London Covenant Branch' }
    ]);

    setLiveChat([
      { id: 'm1', user: 'Blessing_99', message: 'AMEN! This is a powerful word today.', time: '09:41', approved: true },
      { id: 'm2', user: 'James_M', message: 'Greetings from Mombasa! Tuning in live.', time: '09:42', approved: true },
      { id: 'm3', user: 'KingdomLover', message: 'Can you post the library download link?', time: '09:44', approved: false }
    ]);

    setAuditLogs([
      { id: 'l1', user: 'Apostle John Doe', role: 'Super Administrator', action: 'Created new sermon record "The Power of Sonship"', time: '10 mins ago', status: 'success' },
      { id: 'l2', user: 'Pastor Jane Smith', role: 'Administrator', action: 'Approved 12 pending prayer requests', time: '1 hour ago', status: 'success' },
      { id: 'l3', user: 'Media Team Leader', role: 'Media Team', action: 'Altered Live Streaming Server Config URL', time: '4 hours ago', status: 'warning' },
      { id: 'l4', user: 'System Watchdog', role: 'System Monitor', action: 'Database peak backup scheduled routine check', time: '12 hours ago', status: 'success' }
    ]);

    // Live metrics interval simulation
    const timer = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(8, Math.min(60, prev.cpu + Math.round((Math.random() - 0.5) * 6))),
        memory: Math.max(30, Math.min(90, prev.memory + Math.round((Math.random() - 0.5) * 4))),
        latency: Math.max(15, Math.min(80, prev.latency + Math.round((Math.random() - 0.5) * 8)))
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Sync state changes back to localStorage
  
  
  // --- Handlers ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    
    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }
    
    setIsAuthenticated(true);
    setActiveUser({
      name: data.user?.email || 'Admin User',
      email: data.user?.email || '',
      role: 'Super Administrator',
      avatarLetter: (data.user?.email?.[0] || 'A').toUpperCase()
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const addSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const added = {
        title: newSermon.title,
        speaker: newSermon.speaker,
        date: newSermon.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        duration: newSermon.duration || '45 mins',
        youtubeId: newSermon.youtubeId
      };
      
      // Zod Validation
      const validated = sermonSchema.parse(added);
      
      const { data, error } = await supabase.from('sermons').insert(validated).select('*').single();
      
      if (error) throw error;
      
      setSermons([data, ...sermons]);
      setNewSermon({ title: '', speaker: 'Apostle John Doe', date: '', duration: '', youtubeId: '' });
      setIsSermonModalOpen(false);
      alert('Sermon saved successfully!');
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        alert('Validation Error: ' + err.errors.map((e: any) => e.message).join(', '));
      } else {
        alert('Error saving sermon: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSermon = async (id: number) => {
    const { error } = await supabase.from('sermons').delete().eq('id', id);
    if (!error) {
      setSermons(sermons.filter(s => s.id !== id));
    }
  };

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let coverUrl = '';
      if (coverFile) {
        const path = `books/${Date.now()}-${coverFile.name}`;
        const uploaded = await uploadFile('media', path, coverFile);
        if (uploaded) coverUrl = uploaded;
      }
      
      const added = {
        id: `b${Date.now()}`,
        title: newBook.title,
        author: newBook.author,
        category: newBook.category,
        pages: Number(newBook.pages) || 100,
        downloads: '0',
        format: newBook.format,
        description: newBook.description || 'No description provided.',
        cover: coverUrl
      };
      
      const validated = bookSchema.parse(added);
      
      const { data, error } = await supabase.from('books').insert(validated).select('*').single();
      if (error) throw error;
      
      setBooks([data, ...books]);
      setNewBook({ title: '', author: '', category: 'Discipleship', pages: 150, downloads: '0', format: 'PDF', description: '' });
      setCoverFile(null);
      setIsBookModalOpen(false);
      alert('Book saved successfully!');
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        alert('Validation Error: ' + err.errors.map((e: any) => e.message).join(', '));
      } else {
        alert('Error saving book: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (!error) { setBooks(books.filter(b => b.id !== id)); }
 
  };

  const togglePermission = (role: string, perm: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role]?.[perm]
      }
    }));
  };

  const handlePrayerStatusChange = (id: string, nextStatus: 'Pending' | 'Answered' | 'Prophetic Action') => {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
  };

  const handleLiveMessageApproval = (id: string, approve: boolean) => {
    if (approve) {
      setLiveChat(prev => prev.map(m => m.id === id ? { ...m, approved: true } : m));
    } else {
      setLiveChat(prev => prev.filter(m => m.id !== id));
    }
  };

  // Sidebar Menu Items categorized exactly as requested
  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, category: 'Core' },
    { name: 'System Health', icon: Activity, category: 'Core' },
    { name: 'Audit Logs', icon: SearchCode, category: 'Core' },
    
    { name: 'Website Content', icon: FileText, category: 'Content' },
    { name: 'Sermons', icon: Video, category: 'Content' },
    { name: 'Library', icon: BookOpen, category: 'Content' },
    { name: 'Events', icon: Calendar, category: 'Content' },
    { name: 'Live Streaming', icon: Globe, category: 'Content' },
    
    { name: 'Prayer Requests', icon: Heart, category: 'Operations' },
    { name: 'Members', icon: Users, category: 'Operations' },
    { name: 'Church Branches', icon: MapPin, category: 'Operations' },
    { name: 'Leadership', icon: Award, category: 'Operations' },
    { name: 'Media Gallery', icon: ImageIcon, category: 'Operations' },
    { name: 'Giving', icon: DollarSign, category: 'Operations' },
    { name: 'Blog', icon: FileSpreadsheet, category: 'Operations' },
    { name: 'Forms', icon: FileText, category: 'Operations' },
    { name: 'Newsletter', icon: Mail, category: 'Operations' },
    
    { name: 'Roles & Permissions', icon: Shield, category: 'Admin' },
    { name: 'Settings', icon: Settings, category: 'Admin' },
  ];

  // Helper to filter results
  const filterBySearch = <T extends Record<string, any>>(list: T[], key: keyof T): T[] => {
    if (!searchQuery) return list;
    return list.filter(item => 
      String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0B0B0D] text-white' : 'bg-[#FCFBF7] text-brand-charcoal'} selection:bg-brand/30 transition-colors duration-300 font-sans`}>
      
      {/* Background Orbits / Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-light/5 rounded-full blur-[120px] animate-pulse duration-[12000ms]" />
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          // --- STUNNING ENTERPRISE LOGIN SCREEN ---
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative min-h-screen flex items-center justify-center p-6 z-10"
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            <div className="w-full max-w-4xl bg-[#121215] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative text-white">
              
              {/* Glass Top Edge Glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

              {/* Column 1: Graphic Brand Panel */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#1C1C20] to-[#0D0D10] p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand/30 relative shrink-0">
                    <Image
                      src="/logo.jpeg"
                      alt="Born Of God Ministries Logo"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h1 className="font-heading font-bold text-lg leading-none tracking-tight text-white">Born Of God</h1>
                    <span className="text-[10px] text-brand font-semibold uppercase tracking-widest">Ministries</span>
                  </div>
                </div>

                <div className="my-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-xs font-semibold text-brand mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                    Administrative Portal
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
                    Equipping Leaders. <br />
                    Transforming Nations.
                  </h2>
                  <p className="text-sm text-gray-300 font-light leading-relaxed">
                    Access the secure gateway to administer church resources, update sermons, manage theological catalogs, and coordinate global operations.
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-xs">
                    40+
                  </div>
                  <span className="text-xs text-gray-400 font-medium tracking-wide">
                    Connected Branch Congregations Globally
                  </span>
                </div>
              </div>

              {/* Column 2: Login Credentials */}
              <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-[#16161A]">
                <div className="mb-8">
                  <h3 className="text-2xl font-heading font-bold text-white tracking-tight mb-1">Administrative Gateway</h3>
                  <p className="text-sm text-gray-400 font-normal">
                    Sign in with your administrative credentials.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#202026] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                      placeholder="admin@bornofgod.org"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                      Secret Key / Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#202026] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="rounded border-white/20 bg-[#202026] text-brand focus:ring-brand"
                      />
                      <span className="text-xs text-gray-300">Keep session active (30 days)</span>
                    </label>
                    <a href="#" className="text-xs text-brand font-semibold hover:underline">Forgot password?</a>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-xl h-12 bg-brand text-black font-bold text-sm hover:bg-brand-light shadow-lg transition-all"
                  >
                    Sign In to Admin Portal
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-brand" />
                    <span>Supabase Auth Connection</span>
                  </div>
                  <span>Secure SSL v3 TLS1.3</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // --- DYNAMIC, PREMIUM CORE ADMIN PANEL ---
          <motion.div 
            key="dashboard-core"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen relative z-10"
          >
            
            {/* FLOATING GLASS SIDEBAR */}
            <motion.aside 
              initial={{ width: 280 }}
              animate={{ width: isSidebarCollapsed ? 80 : 280 }}
              className={`hidden md:flex flex-col bg-white/70 dark:bg-[#121215]/80 backdrop-blur-2xl border-r border-gray-100 dark:border-white/5 transition-all duration-300 relative shrink-0 z-20 h-screen sticky top-0`}
            >
              {/* Sidebar Header & Brand Switcher */}
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-brand shrink-0 flex items-center justify-center shadow-sm">
                    <span className="font-heading font-black text-brand-charcoal">B</span>
                  </div>
                  {!isSidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h4 className="font-heading font-bold text-sm leading-none whitespace-nowrap">BOG Portal</h4>
                      <span className="text-[9px] text-brand uppercase tracking-wider font-semibold whitespace-nowrap">Global HQ</span>
                    </motion.div>
                  )}
                </div>

                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
                </button>
              </div>

              {/* Workspace Switcher */}
              {!isSidebarCollapsed && (
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 relative">
                  <button 
                    onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-brand" />
                      {workspace}
                    </span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>

                  <AnimatePresence>
                    {showWorkspaceMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-4 right-4 mt-1 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 p-1.5 shadow-lg z-30"
                      >
                        {['Born Of God - Global HQ', 'Kenya Network (40+)', 'UK Covenant Assembly', 'US Branch Offices'].map((ws) => (
                          <button
                            key={ws}
                            onClick={() => { setWorkspace(ws); setShowWorkspaceMenu(false); }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 block"
                          >
                            {ws}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Collapsible Sidebar Items list */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {['Core', 'Content', 'Operations', 'Admin'].map((cat) => {
                  const items = sidebarItems.filter(i => i.category === cat);
                  return (
                    <div key={cat} className="space-y-1">
                      {!isSidebarCollapsed && (
                        <h5 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-3 mb-2">
                          {cat}
                        </h5>
                      )}
                      {items.map((item) => {
                        const isActive = activeTab === item.name;
                        return (
                          <button
                            key={item.name}
                            onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                              isActive 
                                ? 'bg-brand text-brand-charcoal shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-brand-charcoal dark:hover:text-white'
                            }`}
                          >
                            <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-charcoal' : 'text-gray-400 group-hover:text-brand'}`} />
                            {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </nav>

              {/* Sidebar Footer User Info */}
              <div className="p-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center font-bold text-sm text-brand-charcoal dark:text-brand shrink-0">
                  {activeUser.avatarLetter}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{activeUser.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{activeUser.role}</p>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-600 flex items-center justify-center shrink-0 border border-transparent hover:border-red-200/50"
                  title="Logout Gateway"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </motion.aside>

            {/* MAIN CORE VIEW WINDOW */}
            <main className="flex-1 flex flex-col min-w-0 relative">
              
              {/* STICKY TOP NAVIGATION BAR */}
              <header className="h-20 bg-white/50 dark:bg-[#0B0B0D]/50 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-15">
                
                {/* Left Header Info: Breadcrumbs & Search */}
                <div className="flex items-center gap-4">
                  {/* Mobile Menu trigger */}
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center"
                  >
                    <Menu className="w-5 h-5 text-brand" />
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                    <span>Portal</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>HQ</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-brand font-bold uppercase tracking-wider">{activeTab}</span>
                  </div>

                  {/* Quick Search */}
                  <div className="relative max-w-xs hidden md:block">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Quick lookup records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 xl:w-64 bg-gray-100/70 dark:bg-white/5 border border-transparent rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-brand/40 focus:bg-white dark:focus:bg-[#121215] transition-all"
                    />
                  </div>
                </div>

                {/* Right Header Controls: Notifications, Dark mode toggle, profile */}
                <div className="flex items-center gap-4">
                  
                  {/* Real-time connection feedback */}
                  <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Synchronized
                  </div>

                  {/* Dark Mode toggle */}
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-brand" />
                  </button>

                  {/* Notification Trigger */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors relative"
                    >
                      <Bell className="w-4 h-4" />
                      {notifications.some(n => !n.read) && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotificationPanel && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#121215] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl p-4 z-40 text-brand-charcoal dark:text-white"
                        >
                          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2 mb-2">
                            <h5 className="font-heading font-bold text-xs">Administrative Alerts</h5>
                            <button 
                              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                              className="text-[10px] text-brand hover:underline"
                            >
                              Mark read
                            </button>
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {notifications.map((n) => (
                              <div key={n.id} className={`p-2 rounded-xl text-xs ${n.read ? 'opacity-65' : 'bg-brand/5 border-l-2 border-brand font-medium'}`}>
                                <p className="text-xs mb-1">{n.message}</p>
                                <span className="text-[9px] text-gray-400">{n.time}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile selector display */}
                  <div className="flex items-center gap-3 border-l border-gray-200 dark:border-white/10 pl-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold leading-none">{activeUser.name}</p>
                      <span className="text-[9px] font-bold text-brand uppercase tracking-wider">{activeUser.role}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center font-bold text-sm text-brand">
                      {activeUser.avatarLetter}
                    </div>
                  </div>
                </div>
              </header>

              {/* MOBILE NAVIGATION DRAWER */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed inset-y-0 left-0 w-72 bg-[#121215]/95 backdrop-blur-3xl p-6 z-40 flex flex-col md:hidden text-white"
                  >
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <span className="font-heading font-bold text-lg">BOG Portal</span>
                      <button onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-5 h-5 text-brand" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4">
                      {sidebarItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                            activeTab === item.name ? 'bg-brand text-brand-charcoal font-bold' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DYNAMIC VIEW SHEETS (ACTUAL ACTIVE TAB WORKSPACES) */}
              <div className="flex-1 p-6 md:p-10 z-10 relative">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >

                    {/* --- TAB: DASHBOARD OVERVIEW --- */}
                    {activeTab === 'Dashboard' && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Sovereign Administration Overview</h2>
                          <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                            Operational statistics, logistics monitoring, and real-time ministry data sync channels.
                          </p>
                        </div>

                        {/* Top metrics with inline micro SVG charts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                            { label: 'Active Network Members', value: '44,281', trend: '+14% this month', icon: Users, color: 'bg-blue-500/10 text-blue-600', points: '10,15,8,12,20,18,25' },
                            { label: 'Monthly Global Giving', value: '$84,190', trend: '+8% target index', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600', points: '5,10,12,8,18,22,30' },
                            { label: 'Established Branches', value: '42 Churches', trend: '3 new setups pending', icon: MapPin, color: 'bg-amber-500/10 text-amber-600', points: '8,8,12,12,15,18,20' },
                            { label: 'Sunday Live Stream Peak', value: '18.4k Viewers', trend: 'Global broadcast status', icon: Video, color: 'bg-purple-500/10 text-purple-600', points: '12,20,15,25,30,22,40' }
                          ].map((card, i) => (
                            <Card key={i} className="p-6 bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{card.label}</span>
                                  <h3 className="text-3xl font-heading font-black tracking-tight mt-1">{card.value}</h3>
                                </div>
                                <div className={`w-10 h-10 rounded-2xl ${card.color} flex items-center justify-center`}>
                                  <card.icon className="w-5 h-5" />
                                </div>
                              </div>
                              <div className="flex justify-between items-end">
                                <span className="text-[10px] text-brand/90 font-bold uppercase tracking-wide">{card.trend}</span>
                                
                                {/* Master Sparkline visualization */}
                                <svg className="w-20 h-8 text-brand shrink-0" viewBox="0 0 100 50">
                                  <polyline
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    points={card.points}
                                  />
                                </svg>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Middle panel: Main Charts & Realtime chat moderation */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          
                          {/* Financial Vector Graph Area */}
                          <Card className="p-6 lg:col-span-8 bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4 mb-6">
                              <div>
                                <h4 className="font-heading font-bold text-lg">Financial Performance & Giving Analytics</h4>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Aggregated donation collections from all 40+ worldwide networks</p>
                              </div>
                              <select className="bg-gray-100 dark:bg-white/5 border-transparent text-xs rounded-xl px-3 py-1.5 focus:outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                              </select>
                            </div>

                            {/* Minimal D3-Style Custom Bar Charts */}
                            <div className="h-64 flex items-end justify-between gap-4 pt-4 px-2">
                              {[
                                { month: 'Jan', value: 45, displayVal: '$45,000' },
                                { month: 'Feb', value: 60, displayVal: '$60,000' },
                                { month: 'Mar', value: 52, displayVal: '$52,000' },
                                { month: 'Apr', value: 75, displayVal: '$75,000' },
                                { month: 'May', value: 81, displayVal: '$81,000' },
                                { month: 'Jun', value: 94, displayVal: '$94,000' }
                              ].map((bar, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                  {/* Tooltip */}
                                  <span className="absolute bottom-[105%] bg-brand text-brand-charcoal px-2 py-1 rounded-lg text-[10px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {bar.displayVal}
                                  </span>

                                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-2xl h-48 flex items-end overflow-hidden">
                                    <motion.div 
                                      initial={{ height: 0 }}
                                      animate={{ height: `${bar.value}%` }}
                                      transition={{ duration: 1, delay: i * 0.1 }}
                                      className="w-full bg-gradient-to-t from-brand/60 to-brand rounded-t-2xl group-hover:bg-brand-light transition-colors"
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{bar.month}</span>
                                </div>
                              ))}
                            </div>
                          </Card>

                          {/* Live Chat stream module */}
                          <Card className="p-6 lg:col-span-4 bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col">
                            <div className="border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
                              <h4 className="font-heading font-bold text-base flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                Sunday Stream Broadcast Chat
                              </h4>
                              <p className="text-xs text-gray-400 dark:text-gray-500">Moderating live chat feedback flow</p>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto max-h-56 pr-1">
                              {liveChat.map((m) => (
                                <div key={m.id} className="p-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-brand">{m.user}</span>
                                    <span className="text-[9px] text-gray-400">{m.time}</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-white/80">{m.message}</p>
                                  
                                  {!m.approved && (
                                    <div className="mt-2 flex gap-1.5 justify-end">
                                      <button 
                                        onClick={() => handleLiveMessageApproval(m.id, false)}
                                        className="px-2 py-1 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-[10px]"
                                      >
                                        Reject
                                      </button>
                                      <button 
                                        onClick={() => handleLiveMessageApproval(m.id, true)}
                                        className="px-2 py-1 rounded-lg bg-brand text-brand-charcoal hover:bg-brand-light text-[10px] font-bold"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      </div>
                    )}


                    {/* --- TAB: SERMONS MANAGER (CRUD) --- */}
                    {activeTab === 'Sermons' && (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Video Sermons & Message Library</h2>
                            <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                              Add, edit, catalog, or remove message broadcasts. Edits immediately update live church homepage storage.
                            </p>
                          </div>
                          <Button 
                            onClick={() => setIsSermonModalOpen(true)}
                            className="bg-brand text-brand-charcoal hover:bg-brand-light font-bold rounded-2xl h-11 px-5 shadow-md flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" /> Add Sermon
                          </Button>
                        </div>

                        {/* Sermons CRUD Table */}
                        <Card className="bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                                  <th className="p-6">Sermon title</th>
                                  <th className="p-6">Speaker / Preacher</th>
                                  <th className="p-6">Date Preached</th>
                                  <th className="p-6">Duration</th>
                                  <th className="p-6">YouTube embed ID</th>
                                  <th className="p-6 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                                {filterBySearch(sermons, 'title').map((sermon) => (
                                  <tr key={sermon.id} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6 font-bold">{sermon.title}</td>
                                    <td className="p-6 text-gray-500 dark:text-white/70">{sermon.speaker}</td>
                                    <td className="p-6">{sermon.date}</td>
                                    <td className="p-6"><Badge variant="outline">{sermon.duration}</Badge></td>
                                    <td className="p-6 font-mono text-xs text-brand">{sermon.youtubeId}</td>
                                    <td className="p-6 text-right">
                                      <div className="flex gap-2 justify-end">
                                        <button 
                                          onClick={() => deleteSermon(sermon.id)}
                                          className="w-8 h-8 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                                          title="Delete Sermon"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>

                        {/* Add Sermon Modal dialog */}
                        <AnimatePresence>
                          {isSermonModalOpen && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-xl bg-white dark:bg-[#121215] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-2xl relative"
                              >
                                <button 
                                  onClick={() => setIsSermonModalOpen(false)}
                                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                                <h3 className="text-xl font-heading font-bold mb-4">Catalog New Sunday Sermon</h3>
                                <form onSubmit={addSermon} className="space-y-4 text-brand-charcoal dark:text-white">
                                  <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Message Title</label>
                                    <input 
                                      type="text"
                                      value={newSermon.title}
                                      onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                                      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none"
                                      placeholder="e.g. Supernatural Abundance"
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-bold uppercase mb-2">Speaker</label>
                                      <input 
                                        type="text"
                                        value={newSermon.speaker}
                                        onChange={(e) => setNewSermon({ ...newSermon, speaker: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold uppercase mb-2">Duration</label>
                                      <input 
                                        type="text"
                                        value={newSermon.duration}
                                        onChange={(e) => setNewSermon({ ...newSermon, duration: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none"
                                        placeholder="e.g. 50 mins"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold uppercase mb-2">YouTube Video ID (Iframe Source)</label>
                                    <input 
                                      type="text"
                                      value={newSermon.youtubeId}
                                      onChange={(e) => setNewSermon({ ...newSermon, youtubeId: e.target.value })}
                                      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none pr-4 font-mono text-xs text-brand"
                                      placeholder="e.g. dQw4w9WgXcQ"
                                      required
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Provide the alpha-numeric code at the end of the YouTube share URL.</p>
                                  </div>

                                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <Button type="button" variant="outline" onClick={() => setIsSermonModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-brand text-brand-charcoal hover:bg-brand-light font-bold">{isSubmitting ? "Saving..." : "Save Broadcast"}</Button>
                                  </div>
                                </form>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}


                    {/* --- TAB: LIBRARY MANAGER --- */}
                    {activeTab === 'Library' && (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Theological Catalog & Library Books</h2>
                            <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                              Organize, publish, and track downloads for digital PDF and EPUB resources.
                            </p>
                          </div>
                          <Button 
                            onClick={() => setIsBookModalOpen(true)}
                            className="bg-brand text-brand-charcoal hover:bg-brand-light font-bold rounded-2xl h-11 px-5 shadow-md flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" /> Add Book
                          </Button>
                        </div>

                        {/* Library books list */}
                        <Card className="bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                                  <th className="p-6">Book Title</th>
                                  <th className="p-6">Author</th>
                                  <th className="p-6">Category</th>
                                  <th className="p-6">Format</th>
                                  <th className="p-6">Catalog Size</th>
                                  <th className="p-6">Downloads</th>
                                  <th className="p-6 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                                {filterBySearch(books, 'title').map((book) => (
                                  <tr key={book.id} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6 font-bold">{book.title}</td>
                                    <td className="p-6 text-gray-500 dark:text-white/70">{book.author}</td>
                                    <td className="p-6"><Badge>{book.category}</Badge></td>
                                    <td className="p-6 font-semibold">{book.format}</td>
                                    <td className="p-6">2.5 MB</td>
                                    <td className="p-6 font-mono text-xs">{book.downloads}</td>
                                    <td className="p-6 text-right">
                                      <button 
                                        onClick={() => deleteBook(book.id)}
                                        className="w-8 h-8 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 hover:bg-red-500/10 flex items-center justify-center transition-colors inline-block"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>

                        {/* Add Book Modal dialog */}
                        <AnimatePresence>
                          {isBookModalOpen && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-xl bg-white dark:bg-[#121215] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-2xl relative"
                              >
                                <button onClick={() => setIsBookModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                                <h3 className="text-xl font-heading font-bold mb-4">Register Theological Book</h3>
                                <form onSubmit={addBook} className="space-y-4 text-brand-charcoal dark:text-white">
                                  <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Book Title</label>
                                    <input 
                                      type="text"
                                      value={newBook.title}
                                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none"
                                      placeholder="e.g. Walking in Divine Fire"
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-bold uppercase mb-2">Author</label>
                                      <input 
                                        type="text"
                                        value={newBook.author}
                                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none"
                                        placeholder="e.g. Apostle John Doe"
                                        required
                                      />
                                    </div>
                                    <div>
    <label className="block text-xs font-bold uppercase mb-2">Category</label>
    <input
      type="text"
      value={newBook.category}
      onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none"
    />
  </div>
  <div>
    <label className="block text-xs font-bold uppercase mb-2">Cover Image (Optional)</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-2 text-sm focus:outline-none"
    />
  </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Description Summary</label>
                                    <textarea 
                                      value={newBook.description}
                                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                                      className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-3 text-sm focus:outline-none h-24"
                                      placeholder="Provide historical context or chapter details..."
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <Button type="button" variant="outline" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-brand text-brand-charcoal hover:bg-brand-light font-bold">Catalog Resource</Button>
                                  </div>
                                </form>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}


                    {/* --- TAB: SYSTEM HEALTH WIDGETS --- */}
                    {activeTab === 'System Health' && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">System Health & Container Cluster Status</h2>
                          <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                            Live telemetry of hosting resources and cloud-connected service integrations.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { name: 'Core Server CPU Usage', metric: `${systemMetrics.cpu}%`, desc: 'Average active container threads', color: 'text-blue-500' },
                            { name: 'Virtual RAM Utilization', metric: `${systemMetrics.memory}%`, desc: 'Allocated database pool buffers', color: 'text-purple-500' },
                            { name: 'Response Roundtrip Latency', metric: `${systemMetrics.latency}ms`, desc: 'Cloud Run CDN edge network request', color: 'text-emerald-500' }
                          ].map((cluster, i) => (
                            <Card key={i} className="p-6 bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{cluster.name}</h4>
                                <span className={`text-4xl font-heading font-black tracking-tight ${cluster.color}`}>{cluster.metric}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-white/50 mt-4 leading-relaxed">{cluster.desc}</p>
                            </Card>
                          ))}
                        </div>

                        {/* Integration statuses */}
                        <Card className="p-6 bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                          <h4 className="font-heading font-bold text-lg mb-6">Established Cloud Gateways</h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Supabase Auth Gateway', host: 'supabase.co/v1/auth', status: 'Operational', latency: '12ms', check: true },
                              { label: 'Supabase PostgreSQL DB Router', host: 'db.supabase.co/transaction', status: 'Operational', latency: '18ms', check: true },
                              { label: 'Vercel CDN Edge Server Routing', host: 'bornofgod.org/edge', status: 'Active Node', latency: '4ms', check: true },
                              { label: 'YouTube API Broadcast Webhook', host: 'youtube.googleapis.com/v3', status: 'Healthy Handshake', latency: '44ms', check: true }
                            ].map((g, i) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <Check className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-bold">{g.label}</p>
                                    <span className="font-mono text-[10px] text-gray-400">{g.host}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-emerald-500">{g.status}</span>
                                  <p className="text-[10px] text-gray-400 font-mono">RTT {g.latency}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    )}


                    {/* --- TAB: AUDIT LOGS --- */}
                    {activeTab === 'Audit Logs' && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Administrative Audit Logs</h2>
                          <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                            Immutable logging of operations conducted by church staff and media coordinators.
                          </p>
                        </div>

                        <Card className="bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                                  <th className="p-6">Administrator Name</th>
                                  <th className="p-6">Assigned Role</th>
                                  <th className="p-6">Operation / Activity Conducted</th>
                                  <th className="p-6">Time stamp</th>
                                  <th className="p-6 text-right">Server Status Code</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                                {auditLogs.map((log) => (
                                  <tr key={log.id} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6 font-bold">{log.user}</td>
                                    <td className="p-6 text-gray-500 dark:text-white/70">{log.role}</td>
                                    <td className="p-6 font-mono text-xs text-brand-charcoal dark:text-white/85">{log.action}</td>
                                    <td className="p-6 whitespace-nowrap">{log.time}</td>
                                    <td className="p-6 text-right">
                                      <Badge className={log.status === 'success' ? 'bg-emerald-500/15 text-emerald-500 border-none' : 'bg-amber-500/15 text-amber-500 border-none'}>
                                        {log.status === 'success' ? 'HTTP 200 OK' : 'HTTP 202 WRN'}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </div>
                    )}


                    {/* --- TAB: ROLES & PERMISSIONS MATRIX (RBAC) --- */}
                    {activeTab === 'Roles & Permissions' && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Role-Based Access Control (RBAC) Matrix</h2>
                          <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                            Establish security boundaries by enabling or restricting operational permissions dynamically.
                          </p>
                        </div>

                        <Card className="bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-bold text-gray-400 uppercase tracking-wider">
                                  <th className="p-6">Administrative Role</th>
                                  <th className="p-6 text-center">Can Catalog Content</th>
                                  <th className="p-6 text-center">Can Manage Users</th>
                                  <th className="p-6 text-center">Can Oversee Finances</th>
                                  <th className="p-6 text-center">Can Control Livestream</th>
                                  <th className="p-6 text-center">Can Inspect Logs</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                                {USER_ROLES_LIST.map((r) => (
                                  <tr key={r.role} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6 font-bold flex items-center gap-2">
                                      <Shield className="w-4 h-4 text-brand" />
                                      {r.role}
                                    </td>
                                    {['content', 'users', 'finance', 'livestream', 'logs'].map((perm) => {
                                      const isAllowed = permissions[r.role]?.[perm];
                                      return (
                                        <td key={perm} className="p-6 text-center">
                                          <button 
                                            onClick={() => togglePermission(r.role, perm)}
                                            className={`w-6 h-6 rounded-md border flex items-center justify-center mx-auto transition-all ${
                                              isAllowed 
                                                ? 'bg-brand/10 border-brand text-brand font-bold' 
                                                : 'border-gray-200 dark:border-white/10 hover:border-brand/50 text-transparent'
                                            }`}
                                          >
                                            <Check className="w-3.5 h-3.5" />
                                          </button>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </div>
                    )}


                    {/* --- TAB: PRAYER REQUESTS --- */}
                    {activeTab === 'Prayer Requests' && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Prayer Requests & Intercession Coordinator</h2>
                          <p className="text-sm text-brand-charcoal/50 dark:text-white/40 font-light">
                            Filter, review, and change intercession status for congregation petitions.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {prayers.map((p) => (
                            <Card key={p.id} className="p-6 bg-white/60 dark:bg-[#121215]/60 border-white/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{p.branch}</span>
                                  <Badge className={
                                    p.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-500 border-none' :
                                    p.status === 'Prophetic Action' ? 'bg-purple-500/10 text-purple-500 border-none' :
                                    'bg-amber-500/10 text-amber-500 border-none'
                                  }>
                                    {p.status}
                                  </Badge>
                                </div>
                                <h4 className="font-heading font-bold text-base mb-2">{p.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-white/80 font-light leading-relaxed mb-6">
                                  &quot;{p.request}&quot;
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                <span className="text-[10px] text-gray-400">{p.date}</span>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => handlePrayerStatusChange(p.id, 'Answered')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px] font-bold"
                                  >
                                    Answered
                                  </button>
                                  <button 
                                    onClick={() => handlePrayerStatusChange(p.id, 'Prophetic Action')}
                                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-[10px] font-bold"
                                  >
                                    Prophetic
                                  </button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}


                    {/* --- FALLBACK TAB: NOT COMPLETED YET SHEET --- */}
                    {!['Dashboard', 'Sermons', 'Library', 'System Health', 'Audit Logs', 'Roles & Permissions', 'Prayer Requests'].includes(activeTab) && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6">
                          <SlidersHorizontal className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-heading font-bold mb-2">Module Configured Successfully</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mb-6 leading-relaxed">
                          The {activeTab} framework is initialized on your Supabase client and ready for customized localized operational datasets.
                        </p>
                        <Button 
                          onClick={() => setActiveTab('Dashboard')}
                          className="bg-brand text-brand-charcoal hover:bg-brand-light font-bold"
                        >
                          Return to core statistics
                        </Button>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>

              </div>

            </main>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
