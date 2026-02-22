'use client';

import { Download, FileText, Share2, Printer, CheckCircle, ShieldCheck, AlertTriangle, Clock, Settings, TrendingDown, Wand2, Smartphone, Plane, Sparkles, Mic, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/app-context';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ReportView() {
    const { infralithResult } = useAppContext();
    const { toast } = useToast();

    // Voice-to-RFI State
    const [isRfiOpen, setIsRfiOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [rfiTranscript, setRfiTranscript] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [draftedRfi, setDraftedRfi] = useState('');
    const [selectedConflict, setSelectedConflict] = useState<any>(null);

    const handleAction = (title: string, desc: string) => {
        toast({ title, description: desc });
    };

    const simulateVoiceRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            setRfiTranscript("The dimension for the egress corridor physically measures 1.2 meters, but the rule requires 1.5 meters. We need the architect to revise the load-bearing pillar placements on grid C4 to widen the path.");
            setIsRecording(false);
        }, 2500);
    };

    const simulateAIGeneration = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setDraftedRfi(`FORMAL REQUEST FOR INFORMATION (RFI)
Date: ${new Date().toLocaleDateString()}
Subject: Egress Corridor Width Discrepancy - Grid C4

Dear Architectural Team,

During the AI-assisted structural evaluation, a compliance conflict was identified regarding the fire egress corridor. The current design specifies a width of 1.2m, whereas regional code requires a minimum of 1.5m.

We request a revision of the load-bearing pillar placements along Grid C4 to accommodate the required clearance without compromising structural integrity.

Please advise on the revised vector coordinates.

Signed,
Infralith AI Assistant (on behalf of Lead Engineer)`);
            setIsGenerating(false);
        }, 2000);
    };

    if (!infralithResult) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-semibold">No Report Available</h2>
                <p className="text-muted-foreground">Please upload and analyze a blueprint to generate an evaluation report.</p>
            </div>
        );
    }

    const { role, timestamp, projectScope } = infralithResult as any;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Project Intelligence Report</h1>
                <p className="text-muted-foreground">Tailored structural evaluation summary for {role} clearance.</p>
            </div>

            <Card className="premium-glass premium-glass-hover relative overflow-hidden group border-2 border-primary/20 bg-card/60 backdrop-blur-xl shadow-2xl">
                <div className="absolute top-0 right-0 p-4">
                    <div className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" /> AI VERIFIED
                    </div>
                </div>

                <CardHeader className="bg-muted/30 pb-8 border-b border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black uppercase text-primary">
                                {projectScope}
                            </CardTitle>
                            <CardDescription className="font-mono text-xs">
                                GENERATED: {new Date(timestamp).toLocaleString()} | REF: INFRA-{timestamp?.slice(0, 8)} | VIEW: {role.toUpperCase()}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    {/* Role-Specific DTO Rendering */}

                    {role === 'Engineer' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold">Engineering Technical Review</h3>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Compliance Conflicts</h4>
                                {(infralithResult as any).conflicts?.length > 0 ? (
                                    <div className="grid gap-3">
                                        {(infralithResult as any).conflicts.map((c: any, i: number) => (
                                            <div key={i} className="flex flex-col sm:flex-row gap-4 justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge variant="outline" className={c.riskCategory === 'Critical' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-orange-500/20 text-orange-500 border-orange-500/30'}>{c.riskCategory}</Badge>
                                                        <span className="font-mono text-xs text-muted-foreground">{c.regulationRef}</span>
                                                    </div>
                                                    <p className="text-sm">Location: <span className="font-bold text-primary">{c.location}</span></p>
                                                </div>
                                                <div className="text-right flex flex-col justify-center items-end gap-2">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Required: {c.requiredValue}</p>
                                                        <p className="text-xs text-muted-foreground font-bold">Measured: {c.measuredValue}</p>
                                                    </div>
                                                    {c.riskCategory === 'Critical' && (
                                                        <Button size="sm" onClick={() => { setSelectedConflict(c); setIsRfiOpen(true); setRfiTranscript(''); setDraftedRfi(''); }} className="h-7 text-[10px] bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/30 font-bold"><Wand2 className="h-3 w-3 mr-1" /> Draft AI RFI</Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-green-500/10 text-green-500 p-4 rounded-lg flex items-center gap-2 border border-green-500/20">
                                        <CheckCircle className="h-5 w-5" /> All primary engineering tolerances are within limits.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Material Extraction Data</h4>
                                    <Button size="sm" onClick={() => handleAction("Alternative Materials Found", "AI suggests switching Reinforcement Steel to Engineered Timber (Cross-Laminated) offering 14% cost reduction with 0% risk increase.")} variant="outline" className="h-8 border-primary/30 text-primary bg-primary/10 hover:bg-primary/20 text-xs"><Sparkles className="h-3 w-3 mr-2" /> AI Material Alternatives</Button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {(infralithResult as any).materials?.slice(0, 8).map((m: any, i: number) => (
                                        <div key={i} className="text-xs p-3 glass-morphism rounded-lg flex flex-col gap-1">
                                            <span className="font-black text-primary uppercase line-clamp-1">{m.item}</span>
                                            <span className="text-muted-foreground font-mono">{m.quantity} {m.unit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {role === 'Supervisor' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                                <TrendingDown className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold">Project Supervisor KPI Summary</h3>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Approval Readiness</span>
                                    <span className={`text-2xl font-black ${(infralithResult as any).approvalReadinessScore > 80 ? 'text-green-500' : 'text-orange-500'}`}>
                                        {(infralithResult as any).approvalReadinessScore}/100
                                    </span>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Total Cost Est.</span>
                                    <span className="text-2xl font-black text-primary">
                                        {(infralithResult as any).costImpactEstimate.toLocaleString()} {(infralithResult as any).currency}
                                    </span>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Est. Delay Risk</span>
                                    <span className={`text-2xl font-black ${(infralithResult as any).delayImpactDays > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        +{(infralithResult as any).delayImpactDays} Days
                                    </span>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Critical Blockers</span>
                                    <span className={`text-2xl font-black ${(infralithResult as any).approvalBlockerCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {(infralithResult as any).approvalBlockerCount}
                                    </span>
                                </div>
                            </div>

                            {(infralithResult as any).delayImpactDays > 0 && (
                                <div className="bg-orange-500/10 p-4 rounded-xl flex items-center justify-between border border-orange-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-orange-500 text-sm">6th Agent Alert: Predictive Schedule Delay</h4>
                                            <p className="text-xs opacity-90 text-orange-500/80">Cost & Risk engines correlate foundation settlement risk causing a projected {(infralithResult as any).delayImpactDays} day delay.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(infralithResult as any).redesignRequired && (
                                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center gap-4 border border-red-500/20">
                                    <AlertTriangle className="h-8 w-8 shrink-0" />
                                    <div>
                                        <h4 className="font-bold">Redesign Required</h4>
                                        <p className="text-sm opacity-90">The algorithmic review indicates that specific zones exceed compliance risk thresholds. The engineering team must review the conflict locations.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {role === 'Admin' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold">Data Integrity & Access Audit</h3>
                            </div>

                            <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                                <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 bg-white/5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                    <div>Timestamp</div>
                                    <div>Action</div>
                                    <div>Actor</div>
                                    <div>Integrity Hash</div>
                                </div>
                                <div className="divide-y divide-white/5">
                                    <div className="grid grid-cols-4 gap-4 p-4 items-center text-sm hover:bg-white/5 transition-colors">
                                        <div className="font-mono text-xs opacity-70">Just now</div>
                                        <div className="font-semibold text-primary">Report Viewed</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">A</div>
                                            You (Admin)
                                        </div>
                                        <div className="font-mono text-[10px] text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Valid</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 p-4 items-center text-sm hover:bg-white/5 transition-colors">
                                        <div className="font-mono text-xs opacity-70">2 mins ago</div>
                                        <div className="font-semibold text-foreground">AI Evaluation Complete</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">S</div>
                                            System Pipeline
                                        </div>
                                        <div className="font-mono text-[10px] text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Valid</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 p-4 items-center text-sm hover:bg-white/5 transition-colors">
                                        <div className="font-mono text-xs opacity-70">5 mins ago</div>
                                        <div className="font-semibold text-foreground">Document Uploaded</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">E</div>
                                            Lead Engineer
                                        </div>
                                        <div className="font-mono text-[10px] text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Valid</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-primary/10 border border-primary/20 p-4 rounded-xl">
                                <div>
                                    <p className="font-bold text-sm text-primary">Cryptographic Verification</p>
                                    <p className="text-xs text-muted-foreground">All data points are securely hashed and immutable.</p>
                                </div>
                                <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/20">
                                    Export Audit Ledger
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-8 bg-muted/20 border-t border-white/5">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-10">
                            <Share2 className="mr-2 h-4 w-4 text-primary" /> Share View
                        </Button>
                        <Button variant="outline" size="sm" className="h-10">
                            <Printer className="mr-2 h-4 w-4 text-primary" /> Print Role Summary
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {role === 'Engineer' && (
                            <Button onClick={() => handleAction("AR Launched", "Sent secure AR tracking matrix to connected mobile device.")} variant="outline" size="sm" className="h-10 border-primary/30 text-primary hover:bg-primary/10">
                                <Smartphone className="mr-2 h-4 w-4" /> AR Field Overlay
                            </Button>
                        )}
                        {role === 'Supervisor' && (
                            <>
                                <Button onClick={() => handleAction("Drone Path Generated", "3D coordinates for KML automated flight path exported to downloads.")} variant="outline" size="sm" className="h-10 border-primary/30 text-primary hover:bg-primary/10 hidden md:flex">
                                    <Plane className="mr-2 h-4 w-4" /> Export Drone Flight Path
                                </Button>
                                <Button onClick={() => handleAction("Audit Dossier Created", "Cryptographically signed dossier including overrides sent to local storage.")} variant="outline" size="sm" className="h-10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Generate Audit Dossier
                                </Button>
                            </>
                        )}
                    </div>
                    {(role === 'Supervisor' || role === 'Engineer') && (
                        <Button className="h-10 bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/20">
                            {role === 'Supervisor' ? (
                                <><CheckCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> APPROVE PROJECT</>
                            ) : (
                                <><Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" /> EXPORT TECHNICAL DOSSIER</>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Voice-to-RFI Modal */}
            <Dialog open={isRfiOpen} onOpenChange={setIsRfiOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Wand2 className="h-5 w-5 text-primary" /> Multi-modal RFI Draft
                        </DialogTitle>
                        <DialogDescription>
                            Speak or type your field observation. The AI will cross-reference the '{selectedConflict?.regulationRef}' conflict and generate a formal architectural query.
                        </DialogDescription>
                    </DialogHeader>

                    {!draftedRfi ? (
                        <div className="space-y-4 pt-4">
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    onClick={simulateVoiceRecording}
                                    className={`h-12 w-12 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                                >
                                    <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : ''}`} />
                                </Button>
                                <Textarea
                                    placeholder="Listening or type here..."
                                    value={rfiTranscript}
                                    onChange={(e) => setRfiTranscript(e.target.value)}
                                    className="resize-none h-20 bg-muted/50"
                                />
                            </div>

                            <Button
                                className="w-full font-bold shadow-md"
                                onClick={simulateAIGeneration}
                                disabled={!rfiTranscript || isGenerating}
                            >
                                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Structuring Output...</> : 'Generate Formal RFI'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4">
                            <div className="bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap h-[200px] overflow-y-auto">
                                {draftedRfi}
                            </div>
                            <DialogFooter className="flex sm:justify-between w-full">
                                <Button variant="ghost" onClick={() => setDraftedRfi('')}>Discard</Button>
                                <Button className="font-bold bg-green-600 hover:bg-green-500 text-white" onClick={() => {
                                    handleAction("RFI Sent Successfully", "Cryptographically signed RFI sent to architectural review board.");
                                    setIsRfiOpen(false);
                                }}>
                                    <Send className="mr-2 h-4 w-4" /> Issue to Architect
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
