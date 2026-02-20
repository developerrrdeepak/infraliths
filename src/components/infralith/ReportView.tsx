
'use client';

import { Download, FileText, Share2, Printer, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/app-context';

export default function ReportView() {
    const { infralithResult } = useAppContext();

    if (!infralithResult) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-semibold">No Report Available</h2>
                <p className="text-muted-foreground">Please upload and analyze a blueprint to generate an evaluation report.</p>
            </div>
        );
    }

    const { blueprint, cost, risk, compliance, timestamp } = infralithResult;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Project Intelligence Report</h1>
                <p className="text-muted-foreground">Comprehensive multi-agent structural evaluation results.</p>
            </div>

            <Card className="border-2 border-primary/20 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <div className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" /> AI VERIFIED
                    </div>
                </div>

                <CardHeader className="bg-muted/30 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black uppercase text-primary">
                                {blueprint.projectScope.split(' ').slice(0, 3).join(' ')} ...
                            </CardTitle>
                            <CardDescription className="font-mono text-xs">
                                GENERATED: {new Date(timestamp).toLocaleString()} | REF: INFRA-{timestamp.slice(0, 8)}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 p-8">
                    {/* Top Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Compliance Status</span>
                            <span className={`text-xl font-black ${compliance.overallStatus === 'Pass' ? 'text-green-500' : 'text-orange-500'}`}>
                                {compliance.overallStatus}
                            </span>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Risk Index</span>
                            <span className={`text-xl font-black ${risk.riskIndex > 60 ? 'text-red-500' : 'text-orange-500'}`}>
                                {risk.riskIndex}/100
                            </span>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Est. Total Budget</span>
                            <span className="text-xl font-black text-primary">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: cost.currency }).format(cost.totalEstimatedCost)}
                            </span>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Build Confidence</span>
                            <span className="text-xl font-black italic">
                                {Math.round(cost.confidenceScore * 100)}%
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" /> Structural Insights
                            </h3>
                            <div className="text-sm leading-relaxed text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
                                {risk.aiInsight}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Compliance Summary</h3>
                            <ul className="space-y-3">
                                {compliance.rules.slice(0, 3).map((rule: any, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`h-2 w-2 rounded-full ${rule.status === 'pass' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                        <span className="font-bold min-w-[100px]">{rule.ruleId}</span>
                                        <span className="text-muted-foreground truncate">{rule.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Material Requirement Analysis</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {blueprint.materials.slice(0, 6).map((m: any, i: number) => (
                                <div key={i} className="text-xs p-3 glass-morphism rounded-lg flex flex-col gap-1">
                                    <span className="font-black text-primary uppercase line-clamp-1">{m.item}</span>
                                    <span className="text-muted-foreground font-mono">{m.quantity} {m.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {infralithResult.devops && (
                        <div className="pt-8 border-t-2 border-primary/10">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                                <div className="h-1.5 w-6 bg-primary" /> Agentic DevOps Insights
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                                        <p className="text-xs font-mono font-bold text-primary mb-2 uppercase">Automated CI/CD Actions</p>
                                        <div className="space-y-3">
                                            {infralithResult.devops.automatedActions.map((action: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold">{action.action}</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-muted-foreground">{action.target}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-muted/30 rounded-xl p-5 border border-white/5 h-full">
                                        <p className="text-xs font-mono font-bold text-muted-foreground mb-3 uppercase tracking-tighter">System Reliability</p>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-[10px] text-muted-foreground block mb-1 uppercase">Pipeline Cluster</span>
                                                <span className={`text-sm font-black ${infralithResult.devops.pipelineStatus === 'Optimized' ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {infralithResult.devops.pipelineStatus}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-muted-foreground block mb-1 uppercase">GitOps Sync</span>
                                                <span className="text-[11px] leading-relaxed text-muted-foreground font-mono">
                                                    {infralithResult.devops.gitOpsStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-8 bg-muted/20 border-t border-white/5">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-10">
                            <Share2 className="mr-2 h-4 w-4 text-primary" /> Share Result
                        </Button>
                        <Button variant="outline" size="sm" className="h-10">
                            <Printer className="mr-2 h-4 w-4 text-primary" /> Print Board
                        </Button>
                    </div>
                    <Button className="h-10 bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/20">
                        <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" /> EXPORT FULL DOSSIER
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

const ShieldCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);
