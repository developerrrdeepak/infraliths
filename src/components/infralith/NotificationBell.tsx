'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { Bell, CheckCircle, FileText, MessageCircle, ShieldCheck, AlertTriangle, X, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export type Notification = {
    id: string;
    type: 'success' | 'warning' | 'info' | 'message';
    title: string;
    body: string;
    timestamp: number;
    read: boolean;
    route?: string;
};

type NotificationContextType = {
    notifications: Notification[];
    addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAllRead: () => void;
    clearAll: () => void;
    unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

const LS_KEY = 'infralith_notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(LS_KEY);
            return stored ? JSON.parse(stored) : getDefaultNotifications();
        } catch { return getDefaultNotifications(); }
    });

    useEffect(() => {
        try { localStorage.setItem(LS_KEY, JSON.stringify(notifications)); }
        catch { /* silent */ }
    }, [notifications]);

    const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newN: Notification = { ...n, id: `notif_${Date.now()}`, timestamp: Date.now(), read: false };
        setNotifications(prev => [newN, ...prev].slice(0, 20)); // Max 20
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => setNotifications([]), []);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAllRead, clearAll, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be within NotificationProvider');
    return ctx;
}

function getDefaultNotifications(): Notification[] {
    return [
        {
            id: 'n1', type: 'warning', title: 'Compliance Alert', read: false, route: 'report',
            body: 'Section B-B egress corridor width is 1.2m — NBC code requires 1.5m. Immediate revision needed.',
            timestamp: Date.now() - 1000 * 60 * 8,
        },
        {
            id: 'n2', type: 'message', title: 'New Message from Dr. Sarah Chen', read: false, route: 'messages',
            body: 'Hey, did you check the seismic reinforcement on Section B-B? The Mumbai Phase 1 blueprint seems thin there.',
            timestamp: Date.now() - 1000 * 60 * 22,
        },
        {
            id: 'n3', type: 'info', title: 'Message from Marcus Thorne', read: true, route: 'messages',
            body: 'Regional audit is on Tuesday. Please ensure all compliance reports are synced to the Azure Foundry gateway.',
            timestamp: Date.now() - 1000 * 60 * 45,
        },
        {
            id: 'n4', type: 'success', title: 'AI Pipeline Completed', read: true, route: 'report',
            body: 'Blueprint v2.0 analysis finished. 94% compliance score. 1 critical conflict detected.',
            timestamp: Date.now() - 1000 * 60 * 90,
        },
    ];
}

const iconMap = {
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    info: <FileText className="h-4 w-4 text-blue-400" />,
    message: <MessageCircle className="h-4 w-4 text-primary" />,
};

export default function NotificationBell() {
    const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-background/95 backdrop-blur-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="font-bold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge className="h-5 px-1.5 text-[10px] font-black bg-primary">{unreadCount} new</Badge>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground px-2" onClick={markAllRead}>
                            <CheckCheck className="h-3 w-3 mr-1" /> Read all
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground px-2" onClick={clearAll}>
                            <X className="h-3 w-3 mr-1" /> Clear
                        </Button>
                    </div>
                </div>

                {/* Notification List */}
                <ScrollArea className="max-h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                            <ShieldCheck className="h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium">All clear — no new alerts</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "flex gap-3 px-4 py-3 transition-colors cursor-default",
                                        !n.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/20"
                                    )}
                                >
                                    <div className="mt-0.5 shrink-0">{iconMap[n.type]}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-sm font-semibold leading-none truncate", !n.read && "text-foreground")}>{n.title}</p>
                                            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{n.body}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                                            {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
