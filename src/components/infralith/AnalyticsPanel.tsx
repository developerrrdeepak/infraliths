'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/app-context';
import { useNotifications } from './NotificationBell';
import {
    BarChart3, Users, Activity, TrendingUp, TrendingDown, ShieldCheck, FileText,
    Clock, Database, Zap, AlertTriangle, CheckCircle, Globe, Server, Cpu, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATS = [
    { label: 'Total Blueprints Processed', value: '1,284', trend: '+12%', up: true, icon: FileText, color: 'text-primary' },
    { label: 'Active Engineers', value: '124', trend: '+3', up: true, icon: Users, color: 'text-blue-400' },
    { label: 'Avg. Compliance Score', value: '89.4%', trend: '-1.2%', up: false, icon: ShieldCheck, color: 'text-green-400' },
    { label: 'AI Cost Savings Generated', value: '₹4.2 Cr', trend: '+18%', up: true, icon: BarChart3, color: 'text-amber-400' },
];

const REGIONAL_HUBS = [
    { city: 'Mumbai', projects: 34, load: 78 },
    { city: 'Bangalore', projects: 28, load: 64 },
    { city: 'Delhi', projects: 19, load: 45 },
    { city: 'Chennai', projects: 11, load: 31 },
    { city: 'Hyderabad', projects: 9, load: 22 },
];

const PIPELINE_METRICS = [
    { label: 'Azure OCR Agent', status: 'Operational', latency: '1.2s', uptime: 99.9 },
    { label: 'Compliance Agent', status: 'Operational', latency: '2.1s', uptime: 99.7 },
    { label: 'Risk Analysis Agent', status: 'Operational', latency: '1.8s', uptime: 100 },
    { label: 'Cost Prediction Agent', status: 'Operational', latency: '1.5s', uptime: 99.8 },
    { label: 'Azure Cosmos DB', status: 'Operational', latency: '0.3s', uptime: 100 },
    { label: 'Azure OpenAI (GPT-4o)', status: 'Degraded', latency: '4.2s', uptime: 96.1 },
];

export default function AnalyticsPanel() {
    const { user } = useAppContext();
    const { addNotification } = useNotifications();
    const { toast } = useToast();
    const [announcement, setAnnouncement] = useState('');

    const isAdmin = user?.role === 'Admin';

    const sendAnnouncement = () => {
        if (!announcement.trim()) return;
        addNotification({
            type: 'info',
            title: `Admin: ${user?.name?.split(' ')[0] || 'Admin'} Announcement`,
            body: announcement,
        });
        toast({ title: 'Announcement Sent', description: 'All users will see this notification.' });
        setAnnouncement('');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    Admin Analytics
                </h1>
                <p className="text-muted-foreground">Live platform telemetry, agent health, and user activity across all regional hubs.</p>
            </div>

            {!isAdmin && (
                <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">You are viewing a read-only version of this panel. Admin access is required to manage settings and push announcements.</p>
                </div>
            )}

            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(stat => (
                    <Card key={stat.label} className="premium-glass premium-glass-hover overflow-hidden relative group">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={cn("h-10 w-10 rounded-xl bg-current/10 flex items-center justify-center", stat.color)}>
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                                <Badge className={cn("text-[10px] font-bold border", stat.up ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20')}>
                                    {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                    {stat.trend}
                                </Badge>
                            </div>
                            <p className="text-2xl font-black">{stat.value}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 leading-tight">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Regional Hub Activity */}
                <Card className="premium-glass">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2 text-base"><Globe className="h-5 w-5 text-primary" /> Regional Hub Activity</CardTitle>
                        <CardDescription>Active projects and AI processing load per city hub.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                        {REGIONAL_HUBS.map(hub => (
                            <div key={hub.city} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold">{hub.city}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground text-xs">{hub.projects} projects</span>
                                        <span className={cn("font-bold text-xs", hub.load > 70 ? 'text-amber-500' : 'text-green-500')}>{hub.load}% load</span>
                                    </div>
                                </div>
                                <Progress value={hub.load} className="h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* AI Agent Pipeline Health */}
                <Card className="premium-glass">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2 text-base"><Cpu className="h-5 w-5 text-primary" /> AI Agent Health</CardTitle>
                        <CardDescription>Real-time status of the Infralith multi-agent pipeline.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {PIPELINE_METRICS.map(m => (
                            <div key={m.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={cn("h-2 w-2 rounded-full shrink-0", m.status === 'Operational' ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse')} />
                                    <span className="text-sm font-medium">{m.label}</span>
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                    <span className="text-xs text-muted-foreground font-mono">{m.latency}</span>
                                    <Badge className={cn("text-[9px] font-bold border", m.status === 'Operational' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20')}>
                                        {m.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Admin-only: Push Announcement */}
            {isAdmin && (
                <Card className="premium-glass border-primary/20">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-5 w-5 text-primary" /> Push Platform Announcement</CardTitle>
                        <CardDescription>Send a system-wide notification to all active users instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-5">
                        <Textarea
                            placeholder="Type your announcement (e.g., 'Scheduled maintenance on Saturday 10PM–12AM IST. Please export your reports beforehand.')"
                            className="bg-muted/30 border-white/10 min-h-[90px] resize-none"
                            value={announcement}
                            onChange={e => setAnnouncement(e.target.value)}
                        />
                        <Button onClick={sendAnnouncement} disabled={!announcement.trim()} className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20">
                            <ArrowUpRight className="h-4 w-4" /> Send to All Users
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Quick Audit Summary */}
            <Card className="premium-glass overflow-hidden">
                <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="flex items-center gap-2 text-base"><Database className="h-5 w-5 text-primary" /> Cosmos DB Audit Ledger (Last 5 Events)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {[
                            { time: 'Just now', action: 'Blueprint Analyzed', actor: 'engineer@infralith.com', hash: 'SHA-a4f…' },
                            { time: '5 min ago', action: 'Report Exported', actor: 'supervisor@infralith.com', hash: 'SHA-b3c…' },
                            { time: '12 min ago', action: 'Project Approved', actor: 'supervisor@infralith.com', hash: 'SHA-e1d…' },
                            { time: '28 min ago', action: 'Blueprint Uploaded', actor: 'engineer@infralith.com', hash: 'SHA-f9a…' },
                            { time: '45 min ago', action: 'User Login', actor: 'admin@infralith.com', hash: 'SHA-c2b…' },
                        ].map((ev, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4 px-5 py-3 text-xs hover:bg-white/5 transition-colors">
                                <span className="text-muted-foreground font-mono">{ev.time}</span>
                                <span className="font-semibold text-foreground">{ev.action}</span>
                                <span className="text-muted-foreground truncate">{ev.actor}</span>
                                <span className="text-emerald-500 font-mono flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> {ev.hash}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
