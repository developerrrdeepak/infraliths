
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, Database, ShieldAlert, Cpu } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';

const stages = [
    { title: 'Intelligence OCR', icon: Database, desc: 'Azure AI Document Intelligence extracting data from blueprints...', duration: 2500 },
    { title: 'Regulatory Scan', icon: ShieldAlert, desc: 'Azure OpenAI (GPT-4o) verifying IS/IBC building code compliance...', duration: 3500 },
    { title: 'Project Estimator', icon: Cpu, desc: 'Azure Machine Learning predictive cost and materials modeling...', duration: 2500 },
    { title: 'Agentic DevOps Review', icon: Activity, desc: 'Reliability Agent suggesting CI/CD & maintenance automations...', duration: 4000 },
];

export default function PipelineStatus() {
    const { handleNavigate, infralithResult } = useAppContext();
    const [completed, setCompleted] = useState<number[]>([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (current >= stages.length) return;
        const timeout = setTimeout(() => {
            setCompleted((prev) => [...prev, current]);
            setCurrent((prev) => prev + 1);
        }, stages[current].duration);
        return () => clearTimeout(timeout);
    }, [current]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Cpu className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">AI FOUNDRY PIPELINE</h1>
                </div>
                <p className="text-muted-foreground font-mono text-sm tracking-widest">STOCKED STATUS: [ AZURE REVENUE ENGINE ACTIVE ]</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {stages.map((stage, idx) => {
                    const isDone = completed.includes(idx);
                    const isCurrent = current === idx;
                    const Icon = stage.icon;

                    return (
                        <Card key={idx} className={`relative overflow-hidden transition-all duration-500 bg-card/40 backdrop-blur-md border-2 ${isCurrent ? 'border-primary ring-4 ring-primary/10 scale-[1.02] shadow-2xl' : 'border-white/5 opacity-70'}`}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${isDone ? 'bg-green-500/20 text-green-500' : isCurrent ? 'bg-primary/20 text-primary animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <Badge variant={isDone ? 'default' : isCurrent ? 'outline' : 'secondary'} className={`uppercase font-black px-4 ${isCurrent ? 'animate-pulse bg-primary text-primary-foreground' : ''}`}>
                                        {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING' : 'QUEUE'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-black tracking-tighter uppercase">{stage.title}</CardTitle>
                                <CardDescription className="text-sm leading-relaxed">{stage.desc}</CardDescription>
                            </CardHeader>
                            <CardContent />
                            {isCurrent && (
                                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary/20 overflow-hidden">
                                    <div className="h-full w-full bg-primary origin-left animate-progress" />
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {current >= stages.length && (
                <div className="flex flex-col items-center justify-center p-12 bg-primary/5 rounded-3xl border-2 border-primary/20 border-dashed animate-in fade-in zoom-in duration-700">
                    <div className="p-6 bg-green-500/20 rounded-full mb-6">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter text-center">INTELLIGENCE SYNC SUCCESS</h3>
                    <p className="text-muted-foreground text-center max-w-sm mb-8 font-medium">
                        Deployment review and structural validation stored in Azure Cosmos DB. Reliability agents have prepared maintenance hooks.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" className="h-14 px-10 bg-primary font-black uppercase tracking-widest shadow-xl shadow-primary/30" onClick={() => handleNavigate('compliance')}>
                            SCAN RESULTS
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-10 font-black uppercase tracking-widest border-2" onClick={() => handleNavigate('report')}>
                            DOSSIER
                        </Button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes progress {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
                .animate-progress {
                    animation: progress 4s linear infinite;
                }
            `}</style>
        </div>
    );
}
