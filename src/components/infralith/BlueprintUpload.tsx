
'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/app-context';

export default function BlueprintUpload() {
    const { handleNavigate, user, runInfralithEvaluation } = useAppContext();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const isEngineer = user?.role === 'Engineer' || user?.role === 'Admin';

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!isEngineer) {
            toast({
                title: "Access Denied",
                description: "Only site engineers can upload new blueprints.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        setUploaded(false);
        setProgress(0);

        // Simulate progress UI for the upload part
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            if (p <= 95) setProgress(p);
        }, 100);

        try {
            // In a real production app, we would upload to Azure Blob Storage here
            // await azureStorageService.upload(file);

            await new Promise(r => setTimeout(r, 1500)); // Simulated network latency

            clearInterval(interval);
            setProgress(100);

            // Now trigger the actual AI Workflow with the real File object
            await runInfralithEvaluation(file);

            setIsUploading(false);
            setUploaded(true);
            toast({
                title: "Processing Complete",
                description: `AI Pipeline finished. Intelligence report is ready for ${user?.name}.`,
            });

            // Navigate to the pipeline status to see the "Foundry Pipeline" animation
            setTimeout(() => handleNavigate('pipeline'), 1000);
        } catch (error) {
            clearInterval(interval);
            setIsUploading(false);
            setProgress(0);
            console.error("Upload/Processing error:", error);
            toast({
                title: "Processing Failed",
                description: "The AI agent orchestration encountered an error.",
                variant: "destructive"
            });
        }
    };

    const triggerFileSelect = () => {
        if (!isEngineer) {
            toast({
                title: "Access Denied",
                description: "Only site engineers can upload new blueprints.",
                variant: "destructive"
            });
            return;
        }
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Blueprint Upload</h1>
                <p className="text-muted-foreground font-medium">Upload your construction blueprints for intelligent structural analysis.</p>
            </div>

            <Card className="border-dashed border-2 bg-card/40 backdrop-blur-md border-primary/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Project Documents</CardTitle>
                    <CardDescription>Select a PDF file to begin the multi-agent evaluation workflow.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={handleFileChange}
                    />

                    {!uploaded ? (
                        <>
                            <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500 ${isUploading ? 'bg-primary/20 animate-pulse' : 'bg-primary/10'}`}>
                                {isUploading ? (
                                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                ) : (
                                    <Upload className="h-12 w-12 text-primary" />
                                )}
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="font-semibold text-2xl">
                                    {isUploading ? 'Analyzing Document...' : 'Select Structural Blueprint'}
                                </h3>
                                <p className="text-sm text-muted-foreground">Supported formats: PDF (Max 50MB)</p>
                            </div>

                            {isUploading ? (
                                <div className="w-full max-w-sm space-y-4">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-xs text-center font-bold text-primary uppercase tracking-wider">
                                        Processing Analysis: {progress}%
                                    </p>
                                </div>
                            ) : (
                                <Button onClick={triggerFileSelect} size="lg" className="h-14 px-10 font-bold shadow-lg shadow-primary/20">
                                    <FileText className="mr-2 h-5 w-5" /> Select PDF
                                </Button>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center space-y-6 animate-in zoom-in duration-500">
                            <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-2xl text-green-500">Analysis Complete</h3>
                                <p className="text-sm text-muted-foreground mt-1">Foundry Pipeline has finalized structural results.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" size="lg" className="font-bold h-12 border-2" onClick={() => setUploaded(false)}>
                                    Upload Another
                                </Button>
                                <Button size="lg" className="font-bold h-12 bg-primary" onClick={() => handleNavigate('compliance')}>
                                    View Report
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
