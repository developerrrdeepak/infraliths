
'use client';

import { CheckCircle2, AlertTriangle, XCircle, Database, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';

export default function ComplianceView() {
    const { infralithResult } = useAppContext();

    const rules = infralithResult?.compliance.rules.map(r => ({
        title: r.ruleId,
        status: r.status,
        desc: r.description,
        comment: r.comment,
        severity: r.status === 'fail' ? 'critical' : (r.status === 'warn' ? 'high' : 'low')
    })) || [
            { title: 'Zoning Height Limit', status: 'pass', desc: 'Building height within 45m limit (Zone R-4).', severity: 'low', comment: 'Compliant' },
            { title: 'Fire Safety Exits', status: 'fail', desc: 'Ground floor lacks secondary egress path per NFPA 101.', severity: 'critical', comment: 'Improvement needed' },
            { title: 'ADA Accessibility', status: 'pass', desc: 'Ramp slopes comply with 1:12 ratio.', severity: 'medium', comment: 'Compliant' },
            { title: 'Structural load-bearing', status: 'warn', desc: 'Column spacing near maximum allowed span.', severity: 'high', comment: 'Consider bracing' },
            { title: 'Environmental Impact', status: 'pass', desc: 'LEED certification pre-qualifies.', severity: 'low', comment: 'Gold status' },
        ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pass': return 'border-l-green-500/50 shadow-[0_0_15px_-5px_rgba(34,197,94,0.1)]';
            case 'fail': return 'border-l-red-500/50 shadow-[0_0_15px_-5px_rgba(239,68,68,0.1)]';
            case 'warn': return 'border-l-yellow-500/50 shadow-[0_0_15px_-5px_rgba(234,179,8,0.1)]';
            default: return 'border-l-primary/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Compliance Evaluation</h1>
                    <p className="text-muted-foreground text-sm mt-1">Regulatory validation against international and local building codes.</p>
                </div>
                <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary py-1.5 px-4 backdrop-blur-md">
                    <Database className="h-3 w-3 mr-2" /> Azure SQL Ruleset: v2024.1
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                {rules.map((rule, idx) => (
                    <Card key={idx} className={cn(
                        "bg-card/20 backdrop-blur-sm border-white/5 transition-all hover:bg-card/30",
                        "border-l-4", getStatusStyle(rule.status)
                    )}>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    rule.status === 'pass' ? "bg-green-500/10" :
                                        rule.status === 'fail' ? "bg-red-500/10" : "bg-yellow-500/10"
                                )}>
                                    {rule.status === 'pass' && <CheckCircle2 className="text-green-500 h-5 w-5" />}
                                    {rule.status === 'fail' && <XCircle className="text-red-500 h-5 w-5" />}
                                    {rule.status === 'warn' && <AlertTriangle className="text-yellow-500 h-5 w-5" />}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-semibold tracking-tight">
                                            {rule.title}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-[9px] h-4">IS CODE</Badge>
                                    </div>
                                    <CardDescription className="text-xs opacity-70">{rule.desc}</CardDescription>
                                    <p className="text-[10px] text-muted-foreground mt-1 italic">Agent Comment: {rule.comment}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className={cn(
                                    "text-[10px] uppercase font-bold tracking-widest px-2 py-0 border-none",
                                    rule.status === 'pass' ? "text-green-500" :
                                        rule.status === 'fail' ? "text-red-500" : "text-yellow-500"
                                )}>
                                    {rule.status}
                                </Badge>
                                <div className={cn(
                                    "h-8 w-1 rounded-full",
                                    rule.severity === 'critical' ? "bg-red-500" :
                                        rule.severity === 'high' ? "bg-orange-500" :
                                            rule.severity === 'medium' ? "bg-yellow-500" : "bg-green-500"
                                )} title={`Severity: ${rule.severity}`} />
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="h-24 w-24" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <Database className="h-4 w-4 text-primary" /> Data Governance & Validation Source
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        This blueprint is currently validated against the <span className="text-foreground font-medium">"Global Construction Standards 2024"</span> corpus.
                        Records are synchronized in real-time via Azure Data Factory pipelines, ensuring that every evaluation reflects the latest zoning laws and structural safety mandates.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
