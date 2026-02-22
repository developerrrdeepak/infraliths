'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertTriangle, Clock, Eye, Trash2, RefreshCw, Database, UploadCloud } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

type BlueprintRecord = {
    id: string;
    fileName: string;
    projectScope: string;
    role: string;
    timestamp: string;
    overallStatus: 'Warning' | 'Pass' | 'Fail';
    riskIndex: number;
    totalCost: number;
    currency: string;
    conflictCount: number;
};

import { infralithService } from '@/lib/services';

export default function BlueprintHistory() {
    const { user, handleNavigate } = useAppContext();
    const { toast } = useToast();
    const [history, setHistory] = useState<BlueprintRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            if (!user?.uid) return;
            setIsLoading(true);
            try {
                const data = await infralithService.getEvaluations(user.uid);
                const mapped: BlueprintRecord[] = data.map((res: any) => ({
                    id: res.id,
                    fileName: 'blueprint_analysis.pdf',
                    projectScope: res.projectScope || 'Unnamed Project',
                    role: res.role,
                    timestamp: res.timestamp,
                    overallStatus: res.complianceReport?.overallStatus === 'Pass' ? 'Pass' : res.complianceReport?.overallStatus === 'Fail' ? 'Fail' : 'Warning',
                    riskIndex: res.riskReport?.riskIndex || 40,
                    totalCost: res.costEstimate?.total || 0,
                    currency: res.costEstimate?.currency || 'INR',
                    conflictCount: res.conflicts?.length || 0,
                }));
                setHistory(mapped);
            } catch (e) {
                console.error("Failed to load history:", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadHistory();
    }, [user?.uid]);

    const deleteRecord = async (id: string) => {
        if (!user?.uid) return;
        // Optimization: For this hackathon, we skip the formal service delete and just update local state if needed
        // but real service would be called here.
        const updated = history.filter(b => b.id !== id);
        setHistory(updated);

        // Update the underlying store (Centralized)
        const currentEvals = await infralithService.getEvaluations(user.uid);
        const filtered = currentEvals.filter((e: any) => e.id !== id);
        localStorage.setItem(`evaluations_${user.uid}`, JSON.stringify(filtered));

        toast({ title: 'Record Deleted', description: 'Blueprint record removed from history.' });
    };

    const statusConfig = {
        Pass: { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <CheckCircle className="h-3.5 w-3.5" /> },
        Warning: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
        Fail: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Database className="h-8 w-8 text-primary" />
                        Blueprint History
                    </h1>
                    <p className="text-muted-foreground">All past AI analysis records stored in your Azure Cosmos DB workspace.</p>
                </div>
                <Button onClick={() => handleNavigate('upload')} className="bg-primary font-bold gap-2 shadow-lg shadow-primary/20">
                    <UploadCloud className="h-4 w-4" /> Upload New Blueprint
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Analyses', value: history.length, color: 'text-primary' },
                    { label: 'Passed', value: history.filter(b => b.overallStatus === 'Pass').length, color: 'text-green-500' },
                    { label: 'Warnings', value: history.filter(b => b.overallStatus === 'Warning').length, color: 'text-amber-500' },
                    { label: 'Failed', value: history.filter(b => b.overallStatus === 'Fail').length, color: 'text-red-500' },
                ].map(stat => (
                    <Card key={stat.label} className="premium-glass text-center p-4">
                        <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Blueprint list */}
            <div className="space-y-4">
                <AnimatePresence>
                    {history.map((bp, i) => {
                        const sc = statusConfig[bp.overallStatus];
                        return (
                            <motion.div
                                key={bp.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="premium-glass premium-glass-hover overflow-hidden group">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5">
                                            {/* File Icon */}
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-base truncate">{bp.projectScope}</h3>
                                                    <Badge className={cn("text-[10px] border font-bold px-2 py-0.5 flex items-center gap-1", sc.color)}>
                                                        {sc.icon} {bp.overallStatus}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-mono truncate">{bp.fileName}</p>
                                                <div className="flex flex-wrap gap-4 mt-2">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(bp.timestamp), { addSuffix: true })}
                                                    </span>
                                                    <span className="text-xs font-bold text-primary">
                                                        {bp.currency} {(bp.totalCost / 1e7).toFixed(1)} Cr
                                                    </span>
                                                    <span className={cn("text-xs font-bold", bp.riskIndex > 60 ? 'text-red-500' : bp.riskIndex > 30 ? 'text-amber-500' : 'text-green-500')}>
                                                        Risk: {bp.riskIndex}/100
                                                    </span>
                                                    {bp.conflictCount > 0 && (
                                                        <span className="text-xs font-bold text-red-400">
                                                            {bp.conflictCount} conflict{bp.conflictCount > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1 border-primary/30 text-primary hover:bg-primary/10 h-8 text-xs"
                                                    onClick={() => handleNavigate('report')}
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> View Report
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => deleteRecord(bp.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {history.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto opacity-20 mb-4" />
                        <p className="font-semibold">No blueprints analyzed yet</p>
                        <p className="text-sm mt-1">Upload and analyze a blueprint to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
