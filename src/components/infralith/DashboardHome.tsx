
'use client';

import { Activity, AlertTriangle, ArrowRight, BarChart3, CheckSquare, Coins, FileText, Upload, Zap, MessagesSquare, ShieldAlert, BadgeInfo, FileSearch, Building2, Settings, User as UserIcon, LayoutDashboard, Users, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/app-context';
import { motion } from 'framer-motion';
import LandingHero from './LandingHero';
import { cn } from '@/lib/utils';

function CircularProgress({ value, label, color }: { value: string | number; label: string; color: string }) {
    const numericValue = typeof value === 'number' ? value : parseInt(String(value)) || 0;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (numericValue / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative h-20 w-20">
                <svg className="h-full w-full -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/20"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        className={cn("transition-all duration-1000 ease-out", color)}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {value}{typeof value === 'number' ? '%' : ''}
                </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-center leading-tight h-5 flex items-center">{label}</span>
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
        'Engineer': {
            title: 'Lead Structural Engineer',
            metrics: [
                { value: infralithResult?.compliance.overallStatus === 'Pass' ? 100 : 94, label: 'Compliance', color: 'text-green-500' },
                { value: 100 - (infralithResult?.risk.riskIndex || 32), label: 'Safety Rating', color: 'text-red-500' },
                { value: 85, label: 'Eval Speed', color: 'text-blue-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Evaluation', icon: FileSearch, route: 'upload' },
                { label: 'Compliance', icon: CheckSquare, route: 'compliance' },
                { label: 'Risk Analysis', icon: ShieldAlert, route: 'risk' },
                { label: 'Community', icon: Users, route: 'community' },
            ],
            tasks: [
                "Section B-B missing reinforcement details in evaluation #42.",
                "Identify seismic non-compliance in Ground Floor layout.",
                "Review structural load limits for Phase 2."
            ]
        },
        'Supervisor': {
            title: 'Regional Project Supervisor',
            metrics: [
                { value: 92, label: 'Approval Rate', color: 'text-emerald-500' },
                { value: 82, label: 'Budget Eff.', color: 'text-amber-500' },
                { value: 98, label: 'Pipeline Health', color: 'text-purple-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Costing', icon: Coins, route: 'cost' },
                { label: 'Community', icon: Users, route: 'community' },
                { label: 'Profile', icon: UserIcon, route: 'profile' },
                { label: 'Settings', icon: Settings, route: 'settings' },
            ],
            tasks: [
                "Review 4 pending blueprint approvals for Project A.",
                "Verify 12% cost variance in Mumbai Phase 1 procurement.",
                "Prepare quarterly safety compliance summary."
            ]
        },
        'Admin': {
            title: 'Infrastructure Systems Admin',
            metrics: [
                { value: '99.9', label: 'System Uptime', color: 'text-cyan-500' },
                { value: '124', label: 'Active Users', color: 'text-indigo-500' },
                { value: '100', label: 'Data Sync', color: 'text-green-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Settings', icon: Settings, route: 'settings' },
                { label: 'Profile', icon: UserIcon, route: 'profile' },
                { label: 'Community', icon: Users, route: 'community' },
                { label: 'Dashboard', icon: LayoutDashboard, route: 'home' },
            ],
            tasks: [
                "Update Azure SQL database ruleset to v2024.2.",
                "Review system audit logs for last 24h.",
                "Provision new user accounts for the Bangalore hub."
            ]
        },
        'Guest': {
            title: 'Project Observer',
            metrics: [
                { value: 0, label: 'Access Level', color: 'text-slate-500' },
                { value: 100, label: 'Auth Status', color: 'text-green-500' },
                { value: 0, label: 'Evaluations', color: 'text-slate-500' },
            ],
            actions: [
                { label: 'Chat', icon: MessagesSquare, route: 'chat' },
                { label: 'Community', icon: Users, route: 'community' },
                { label: 'Profile', icon: UserIcon, route: 'profile' },
                { label: 'Support', icon: BadgeInfo, route: 'chat' },
                { label: 'Settings', icon: Settings, route: 'settings' },
            ],
            tasks: [
                "Complete profile setup to unlock full features.",
                "Join the Infralith community to network with peers.",
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
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Just the Gist Section */}
            <motion.div variants={item}>
                <Card className="bg-card/20 backdrop-blur-md border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Building2 className="h-48 w-48 text-primary" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl font-headline opacity-80">Just the Gist</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 py-6">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handleNavigate('profile')}
                                className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/30 hover:border-primary hover:ring-4 hover:ring-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer outline-none"
                                title="View Profile"
                            >
                                {user?.avatar
                                    ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                    : (user?.name?.[0] || 'U')
                                }
                            </button>
                            <div className="space-y-1">
                                <h2 className="text-3xl font-bold tracking-tight">{user?.name || 'Infralith User'}</h2>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <BadgeInfo className="h-4 w-4" /> {config.title}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            {config.metrics.map((m: any, idx: number) => (
                                <CircularProgress key={idx} value={m.value} label={m.label} color={m.color} />
                            ))}

                            <Button
                                variant="outline"
                                className="ml-4 border-white/10 bg-white/5 hover:bg-white/10"
                                onClick={() => handleNavigate('profile')}
                            >
                                View Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="space-y-6">
                {/* Role-Based Quick Actions */}
                <motion.div
                    variants={{
                        show: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="flex flex-wrap items-center justify-around gap-6 py-8 px-4 bg-card/10 backdrop-blur-sm rounded-3xl border border-white/5"
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
                                <div className="absolute inset-x-0 -bottom-2 bg-primary/30 h-10 w-20 mx-auto rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-all duration-500 relative overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <action.icon className="h-9 w-9 md:h-10 md:w-10 relative z-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                                </div>
                            </div>
                            <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all">
                                {action.label}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Trending Insights */}
                <motion.div variants={item}>
                    <Card className="bg-card/20 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Zap className="h-16 w-16 text-amber-500" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-500" /> Trending Construction Insights
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50"><Activity className="h-4 w-4" /></Button>
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
            </div>

            {/* Structural Trends */}
            <motion.div variants={item}>
                <Card className="bg-card/20 border-white/5 overflow-hidden group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" /> Structural Trends & Material Utilization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { label: infralithResult?.blueprint.materials[0].item || 'Reinforcement Steel', val: infralithResult ? 75 : 75, color: 'bg-blue-500', desc: 'Critical Path Material' },
                            { label: infralithResult?.blueprint.materials[1].item || 'Ready-mix Concrete', val: infralithResult ? 45 : 45, color: 'bg-emerald-500', desc: 'Active procurement phase' },
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
                    <div className="bg-primary/5 p-4 border-t border-white/5 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            AI-aggregated data based on {infralithResult ? 'your blueprint' : '124 active regional projects'}.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </motion.div >
    );
}
