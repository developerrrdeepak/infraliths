
'use client';

import { Activity, AlertTriangle, ArrowRight, BarChart3, CheckSquare, Coins, FileText, Upload, Zap, MessagesSquare, ShieldAlert, BadgeInfo, FileSearch, Building2, Settings, User as UserIcon, LayoutDashboard, Users, ClipboardList, Map, Database, RefreshCw, CheckCircle, Bot, Search, Send, ShieldCheck, Box, Video, Layers, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/app-context';
import { motion } from 'framer-motion';
import LandingHero from './LandingHero';
import { cn } from '@/lib/utils';

function CircularProgress({ value, label, color }: { value: string | number; label: string; color: string }) {
    const numericValue = typeof value === 'number' ? value : parseInt(String(value)) || 0;
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (numericValue / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2 group/metric">
            <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.1)] dark:drop-shadow-none">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-200 dark:text-white/5 transition-colors"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", color)}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm md:text-lg font-black tracking-tighter text-slate-900 dark:text-white">
                        {value}{typeof value === 'number' ? '%' : ''}
                    </span>
                </div>
                {/* Glow ring - only in dark mode or with specific accent */}
                <div className={cn("absolute inset-0 rounded-full opacity-0 group-hover/metric:opacity-20 transition-opacity blur-md", color.replace('text-', 'bg-'))} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 group-hover/metric:text-primary transition-colors text-center leading-none">
                {label}
            </span>
        </div>
    );
}

export default function DashboardHome() {
    const { user, handleNavigate, authed, infralithResult } = useAppContext();

    if (!authed) {
        return <LandingHero />;
    }

    const role = user?.role || 'Engineer';

    const roleConfigs: Record<string, any> = {
        'Supervisor': {
            title: 'Junior Site Observer',
            metrics: [
                { value: 100, label: 'Safety Induction', color: 'text-green-500' },
                { value: 65, label: 'Site Knowledge', color: 'text-blue-500' },
                { value: 10, label: 'Protocols Read', color: 'text-purple-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Community', icon: Users, route: 'community' },
                { label: 'History', icon: History, route: 'history' },
                { label: 'Profile', icon: UserIcon, route: 'profile' },
            ],
            tasks: [
                "Complete the high-altitude safety training module.",
                "Review historical logs for Mumbai Phase 1.",
                "Join the monthly engineering sync as an observer."
            ]
        },
        'Engineer': {
            title: 'Sr. Structural Engineer',
            metrics: [
                { value: infralithResult?.complianceReport?.overallStatus === 'Pass' ? 100 : 94, label: 'Compliance', color: 'text-green-500' },
                { value: 100 - (infralithResult?.riskReport?.riskIndex || 32), label: 'Safety Rating', color: 'text-red-500' },
                { value: 85, label: 'Eval Speed', color: 'text-blue-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: '3D Simulation', icon: Zap, route: 'simulation' },
                { label: '2D to 3D', icon: Layers, route: 'blueprint3d' },
                { label: 'Document Upload', icon: Upload, route: 'upload' },
                { label: 'Decisions', icon: CheckSquare, route: 'decision' },
            ],
            tasks: [
                "Section B-B missing reinforcement details in evaluation #42.",
                "Identify seismic non-compliance in Ground Floor layout.",
                "Approve calculated structural load limits for Phase 2."
            ]
        },
        'Admin': {
            title: 'Chief Systems Admin',
            metrics: [
                { value: '99.9', label: 'System Uptime', color: 'text-cyan-500' },
                { value: '124', label: 'Active Users', color: 'text-indigo-500' },
                { value: '100', label: 'Data Sync', color: 'text-green-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Simulation', icon: Zap, route: 'simulation' },
                { label: 'Settings', icon: Settings, route: 'settings' },
                { label: 'Analytics', icon: BarChart3, route: 'analytics' },
                { label: 'Profile', icon: UserIcon, route: 'profile' },
            ],
            tasks: [
                "Update master compliance ruleset to v2024.2.",
                "Review system audit logs for last 24h.",
                "Optimize Azure OpenAI token distribution among hubs."
            ]
        },
        'Guest': {
            title: 'External Guest',
            metrics: [
                { value: 0, label: 'Access Level', color: 'text-slate-500' },
                { value: 100, label: 'Auth Status', color: 'text-green-500' },
                { value: 0, label: 'Evaluations', color: 'text-slate-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Support', icon: BadgeInfo, route: 'chat' },
                { label: 'Profile', icon: UserIcon, route: 'profile' },
            ],
            tasks: [
                "Request upgrade to Junior Site Observer for more features.",
                "Explore the community feed items."
            ]
        }
    };

    const config = roleConfigs[role] || roleConfigs['Engineer'];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-8 pb-20 relative px-4 md:px-0"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Background Decoration for Dashboard */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] opacity-30" />
            </div>
            {/* Just the Gist Section - Redesigned for Premium Look */}
            <motion.div variants={item}>
                <Card className="premium-glass relative overflow-hidden group border-none shadow-2xl">
                    {/* Dynamic Ambient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-accent/5 transition-opacity duration-1000 group-hover:opacity-100" />
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity" />

                    {/* Aesthetic Grid Mask */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>

                    <CardContent className="flex flex-col lg:flex-row items-center justify-between gap-10 p-8 lg:p-10 relative z-10 transition-colors">
                        <div className="flex items-center gap-8 flex-1 w-full lg:w-auto">
                            <div className="relative shrink-0">
                                {/* Decorative Ring */}
                                <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-orange-500 to-yellow-400 rounded-full opacity-20 group-hover:opacity-40 blur-sm transition-opacity" />
                                <button
                                    onClick={() => handleNavigate('profile')}
                                    className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-4xl font-black text-primary border-4 border-white dark:border-slate-800 shadow-xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden z-20 relative outline-none"
                                    title="View Profile"
                                >
                                    {user?.avatar
                                        ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                        : (user?.name?.[0] || 'U')
                                    }
                                </button>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary border-4 border-white dark:border-slate-900 flex items-center justify-center text-white z-30 shadow-lg animate-in fade-in zoom-in duration-700">
                                    <CheckCircle className="h-4 w-4 animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">{user?.name || 'Infralith User'}</h2>
                                    <div className="flex items-center gap-3 pt-2">
                                        <Badge variant="secondary" className="px-4 py-1.5 bg-slate-900 dark:bg-primary/10 hover:bg-black dark:hover:bg-primary/20 border-none text-[11px] font-black tracking-widest uppercase text-white dark:text-primary transition-all shadow-lg shadow-black/10">
                                            {config.title}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 pt-10 lg:pt-0 lg:pl-14 w-full lg:w-auto">
                            {config.metrics.map((m: any, idx: number) => (
                                <CircularProgress key={idx} value={m.value} label={m.label} color={m.color} />
                            ))}

                            <div className="flex flex-col gap-3 shrink-0">
                                <Button
                                    className="bg-primary text-slate-900 hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest h-11 px-8 rounded-xl shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)] transition-all hover:scale-105"
                                    onClick={() => handleNavigate('profile')}
                                >
                                    Intel Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>

                    {/* Subtle Scanline effect for that high-tech feel */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                </Card>
            </motion.div>

            <div className="space-y-6">
                {/* Role-Based Quick Actions */}
                <motion.div
                    variants={{
                        show: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="flex flex-wrap items-center justify-around gap-4 md:gap-8 py-8 px-6 bg-slate-100/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)]"
                >
                    {config.actions.map((action: any, idx: number) => (
                        <motion.button
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, scale: 0.8 },
                                show: { opacity: 1, scale: 1 }
                            }}
                            whileHover={{ y: -8, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigate(action.route)}
                            className="flex flex-col items-center gap-4 group outline-none"
                        >
                            <div className="relative">
                                {/* Hover Glow */}
                                <div className="absolute inset-x-0 -bottom-3 bg-primary/40 h-10 w-20 mx-auto rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150" />

                                <div className="h-20 w-20 md:h-24 md:w-24 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:border-primary/50 transition-all duration-500 relative overflow-hidden shadow-sm group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <action.icon className="h-9 w-9 md:h-11 md:w-11 relative z-10 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110" />

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 h-4 w-4 bg-primary/0 group-hover:bg-primary/20 transition-colors rounded-bl-xl border-b border-l border-primary/30" />
                                </div>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 group-hover:text-slate-900 dark:group-hover:text-white transition-all">
                                {action.label}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {role === 'Supervisor' && (
                    <motion.div variants={item}>
                        <Card className="premium-glass premium-glass-hover relative overflow-hidden group border-primary/20">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                            <CardHeader className="flex flex-row items-center justify-between relative z-10 border-b border-primary/10 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <Map className="h-6 w-6 text-primary" /> Regional Portfolio Map
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium text-foreground/70">
                                        Live geographic telemetry and risk orchestration across all active regional sites.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-xs tracking-wider font-bold bg-primary/10 text-primary border-primary/30 py-1.5 px-3">
                                    Live Telemetry
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-0 relative z-10 h-[400px] bg-slate-950/80 flex items-center justify-center overflow-hidden border-t border-white/5">
                                {/* Simulated Azure Map Texture / Grid */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')] opacity-10 mix-blend-overlay"></div>
                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                                {/* Topographic/Geographic Mock Lines */}
                                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 100 Q 200 150 400 50 T 800 200 T 1200 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                                    <path d="M0 200 Q 300 300 500 150 T 900 300 T 1200 200" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
                                    <path d="M0 300 Q 400 200 600 350 T 1000 250 T 1200 350" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/10" />
                                </svg>

                                {/* Project Alpha - Safe */}
                                <div className="absolute top-[35%] left-[45%] flex flex-col items-center group/pin cursor-pointer z-20">
                                    <div className="h-5 w-5 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.9)] animate-pulse border-2 border-white/20" />
                                    <div className="absolute top-6 bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl flex flex-col gap-1 translate-y-2 group-hover/pin:translate-y-0">
                                        <p className="text-xs font-bold text-white flex items-center gap-2">Project Alpha (Mumbai) <span className="h-2 w-2 rounded-full bg-green-500"></span></p>
                                        <p className="text-[10px] text-muted-foreground font-semibold">Phase: Foundation Execution</p>
                                        <div className="h-px w-full bg-white/10 my-0.5" />
                                        <p className="text-[10px] font-bold text-green-400">Oracle Risk Index: 12 (Optimal)</p>
                                    </div>
                                </div>

                                {/* Project Beta - Critical */}
                                <div className="absolute top-[60%] left-[30%] flex flex-col items-center group/pin cursor-pointer z-20">
                                    <div className="h-5 w-5 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse border-2 border-white/20" />
                                    <div className="absolute top-6 bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl flex flex-col gap-1 translate-y-2 group-hover/pin:translate-y-0">
                                        <p className="text-xs font-bold text-white flex items-center gap-2">Project Beta (Bangalore) <span className="h-2 w-2 rounded-full bg-red-500"></span></p>
                                        <p className="text-[10px] text-muted-foreground font-semibold">Phase: Structural Framing</p>
                                        <div className="h-px w-full bg-white/10 my-0.5" />
                                        <p className="text-[10px] font-bold text-red-500">Oracle Risk Index: 85 (Action Required)</p>
                                    </div>
                                </div>

                                {/* Project Gamma - Warning */}
                                <div className="absolute top-[40%] left-[70%] flex flex-col items-center group/pin cursor-pointer z-20">
                                    <div className="h-5 w-5 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse border-2 border-white/20" />
                                    <div className="absolute top-6 bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl flex flex-col gap-1 translate-y-2 group-hover/pin:translate-y-0">
                                        <p className="text-xs font-bold text-white flex items-center gap-2">Project Gamma (Kolkata) <span className="h-2 w-2 rounded-full bg-amber-500"></span></p>
                                        <p className="text-[10px] text-muted-foreground font-semibold">Phase: Site Preparation</p>
                                        <div className="h-px w-full bg-white/10 my-0.5" />
                                        <p className="text-[10px] font-bold text-amber-500">Oracle Risk Index: 45 (Review Alert)</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-80 mb-1">Regional Health Summary</p>
                                        <div className="flex gap-4">
                                            <span className="text-xs font-semibold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500"></span> 1 Optimal</span>
                                            <span className="text-xs font-semibold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span> 1 Review</span>
                                            <span className="text-xs font-semibold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500"></span> 1 Critical</span>
                                        </div>
                                    </div>
                                    <div className="bg-primary/20 backdrop-blur-md border border-primary/30 p-2 rounded-full animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                        <Activity className="h-5 w-5 text-primary" />
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </motion.div>
                )}



                {role === 'Admin' && (
                    <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                        {/* Workspace Members Card */}
                        <Card className="premium-glass premium-glass-hover relative overflow-hidden group border-indigo-500/20 h-full flex flex-col">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                            <CardHeader className="flex flex-row items-center justify-between relative z-10 border-b border-indigo-500/10 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <Users className="h-6 w-6 text-indigo-500" /> Workspace Members
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium text-foreground/70">
                                        Manage your enterprise organization's seats and role assignments.
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300">
                                    Manage Directory
                                </Button>
                            </CardHeader>
                            <CardContent className="p-6 relative z-10 space-y-4 flex-1">
                                {[
                                    { n: "Dr. Sarah Chen", r: "Lead Engineer", s: "Active" },
                                    { n: "Marcus Thorne", r: "Regional Supervisor", s: "Online" },
                                    { n: "David Lin", r: "Engineer", s: "Away" },
                                ].map((mem, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-lg hover:border-indigo-500/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs shadow-sm">
                                                {mem.n[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground lead-none">{mem.n}</p>
                                                <p className="text-[10px] text-muted-foreground">{mem.r}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest px-2 py-0.5", mem.s === 'Active' ? 'text-green-500 border-green-500/30 bg-green-500/10' : mem.s === 'Online' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' : 'text-slate-400 border-slate-500/30 bg-slate-500/10')}>{mem.s}</Badge>
                                    </div>
                                ))}
                                <div className="pt-2 text-center">
                                    <p className="text-xs text-muted-foreground">121 other active members in network.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Config Toggles */}
                        <Card className="premium-glass premium-glass-hover relative overflow-hidden group border-cyan-500/20 h-full flex flex-col">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                            <CardHeader className="flex flex-row items-center justify-between relative z-10 border-b border-cyan-500/10 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <Settings className="h-6 w-6 text-cyan-500" /> Platform Configuration
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium text-foreground/70">
                                        Toggle AI capabilities exposed to your organization. Backend engines are managed automatically.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 relative z-10 space-y-4 flex-1">
                                {[
                                    { label: "Enable 6th Agent (Predictive Schedule)", on: true },
                                    { label: "Auto-Draft AI RFIs for Engineers", on: true },
                                    { label: "Allow Dynamic Material Substitution", on: true },
                                    { label: "Enforce Multi-Factor Auth (Admin Only)", on: false },
                                ].map((tog, i) => (
                                    <div key={i} className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors">
                                        <span className="text-sm font-semibold">{tog.label}</span>
                                        <button className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2", tog.on ? "bg-cyan-500" : "bg-slate-700")}>
                                            <span aria-hidden="true" className={cn("pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", tog.on ? "translate-x-2" : "-translate-x-2")} />
                                        </button>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="p-4 border-t border-white/5 bg-black/40 flex justify-between items-center mt-auto">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-cyan-500" /> Master regulations synced via Azure
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Trending Insights */}
                    <motion.div variants={item} className="h-full">
                        <Card className="premium-glass premium-glass-hover h-full flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-amber-500/10 rounded-full blur-[40px] group-hover:bg-amber-500/20 transition-all pointer-events-none"></div>
                            <CardHeader className="flex flex-row items-center justify-between relative z-10">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <Zap className="h-5 w-5 text-amber-500" /> Trending Construction Insights
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 hover:bg-white/10"><Activity className="h-4 w-4" /></Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        title: "New BIS standards for high-rise residential projects",
                                        desc: "The Bureau of Indian Standards has updated seismic requirements for projects exceeding 70m in height.",
                                        time: "2h ago"
                                    },
                                    {
                                        title: "AI-driven cost optimization in infrastructure",
                                        desc: "How structural engineers are leveraging predictive modeling to reduce material waste by 15%.",
                                        time: "5h ago"
                                    }
                                ].map((news, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">{news.title}</h4>
                                            <span className="text-[10px] opacity-40 uppercase font-bold">{news.time}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{news.desc}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Structural Trends */}
                    <motion.div variants={item} className="h-full">
                        <Card className="premium-glass premium-glass-hover h-full flex flex-col group relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 -mr-8 -mb-8 w-56 h-56 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <BarChart3 className="h-5 w-5 text-blue-500" /> Structural Trends & Material Utilization
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {[
                                    { label: infralithResult?.parsedBlueprint?.materials?.[0]?.item || 'Reinforcement Steel', val: infralithResult ? 75 : 75, color: 'bg-blue-500', desc: 'Critical Path Material' },
                                    { label: infralithResult?.parsedBlueprint?.materials?.[1]?.item || 'Ready-mix Concrete', val: infralithResult ? 45 : 45, color: 'bg-emerald-500', desc: 'Active procurement phase' },
                                    { label: 'Structural Timber', val: 25, color: 'bg-amber-500', desc: 'Low priority inventory' },
                                ].map((trend, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-60">
                                            <span className="truncate">{trend.label}</span>
                                            <span>{trend.val}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${trend.val}%` }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className={cn("h-full rounded-full", trend.color)}
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">{trend.desc}</p>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="bg-primary/5 p-4 border-t border-white/5 text-center mt-auto">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                    AI-aggregated data based on {infralithResult ? 'your blueprint' : '124 active regional projects'}.
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
