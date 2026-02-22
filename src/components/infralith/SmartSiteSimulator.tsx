'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Activity, Wind, Thermometer, ShieldCheck, Play, Pause, RefreshCw, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartSiteSimulator() {
    const [isSimulating, setIsSimulating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        let interval: any;
        if (isSimulating) {
            interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 0.5;
                    if (next >= 100) {
                        setIsSimulating(false);
                        addLog("Simulation successfully completed. Structural integrity: 98.4%");
                        return 100;
                    }
                    if (Math.floor(next) % 10 === 0 && Math.floor(next) !== Math.floor(prev)) {
                        addLog(`Analyzing load distribution at ${Math.floor(next)}%...`);
                    }
                    return next;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isSimulating]);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
    };

    const startSim = () => {
        setIsSimulating(true);
        setProgress(0);
        setLogs([]);
        addLog("Initializing High-Fidelity Physics Engine...");
        addLog("Loading BIM Twin coordinates into Azure Compute Cluster...");
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                        <Zap className="h-10 w-10 text-primary" />
                        Smart Site <span className="text-primary italic">Simulator</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Stress-test your architectural twins against environmental and structural variables.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={startSim}
                        disabled={isSimulating}
                        className="bg-primary text-slate-900 hover:bg-primary/90 font-black px-8 h-12 rounded-xl shadow-lg shadow-primary/20 transition-all"
                    >
                        {isSimulating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        {isSimulating ? "Running Logic" : "Launch Simulation"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Simulation Parameters */}
                <Card className="premium-glass border-white/5 bg-white/50 dark:bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Activity className="h-4 w-4" /> Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <Wind className="h-4 w-4 text-blue-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Wind Velocity</span>
                                </div>
                                <Badge className="bg-blue-500 text-white border-none">120 km/h</Badge>
                            </div>
                            <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-red-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Seismic Scale</span>
                                </div>
                                <Badge className="bg-red-500 text-white border-none">7.2 Richter</Badge>
                            </div>
                            <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <Thermometer className="h-4 w-4 text-orange-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Thermal Expansion</span>
                                </div>
                                <Badge className="bg-orange-500 text-white border-none">+45°C</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress & Visualizer */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card className="premium-glass border-white/5 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-center items-center h-full min-h-[300px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        {/* Simulation Visual Feedback */}
                        {isSimulating ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative h-32 w-32">
                                    <div className="absolute inset-0 border-b-4 border-primary rounded-xl animate-bounce" />
                                    <div className="absolute inset-4 border-2 border-primary/20 rounded-lg animate-pulse" />
                                    <Zap className="absolute inset-0 m-auto h-12 w-12 text-primary animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{Math.floor(progress)}%</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Computing Stress Points</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-40 group-hover:opacity-60 transition-opacity">
                                <ShieldCheck className="h-20 w-20 mx-auto text-slate-400 dark:text-white mb-6" />
                                <h4 className="text-2xl font-black text-slate-600 dark:text-white">Ready for Simulation</h4>
                                <p className="text-xs uppercase tracking-widest font-bold mt-2">Azure Foundry Compute available</p>
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-white/5">
                            <motion.div
                                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </Card>

                    <Card className="premium-glass border-white/5 bg-black/5 dark:bg-black/20">
                        <CardHeader className="py-3 px-6 border-b border-white/5">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <BarChart3 className="h-3 w-3" /> Technical Log Stream
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-1 h-32 overflow-y-auto font-mono text-[10px]">
                                <AnimatePresence initial={false}>
                                    {logs.length === 0 ? (
                                        <p className="text-muted-foreground italic">No simulation data currently available.</p>
                                    ) : (
                                        logs.map((log, i) => (
                                            <motion.p
                                                key={log}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={log.includes("completed") ? "text-green-500 font-bold" : "text-slate-400 dark:text-slate-500"}
                                            >
                                                {log}
                                            </motion.p>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
