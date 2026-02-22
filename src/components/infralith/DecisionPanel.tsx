
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, AlertCircle, SlidersHorizontal, Calculator } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';

export default function DecisionPanel() {
    const { handleNavigate, user } = useAppContext();
    const { toast } = useToast();
    const [agreed, setAgreed] = useState({
        compliance: false,
        cost: false,
        manual: false,
    });
    const [schedule, setSchedule] = useState([0]);
    const [quality, setQuality] = useState([100]);
    const [submitting, setSubmitting] = useState(false);

    const baseCost = 2500000;
    const dynamicCost = baseCost + (schedule[0] * -12500) + ((100 - quality[0]) * -5000);
    const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

    const canApprove = agreed.compliance && agreed.cost && agreed.manual;
    const hasPrivilege = user?.role === 'Engineer' || user?.role === 'Admin';

    const handleDecision = async (approved: boolean) => {
        if (!hasPrivilege) {
            toast({
                title: "Permission Required",
                description: "Only Engineers or Administrators can authorize major project progression.",
                variant: "destructive"
            });
            return;
        }

        setSubmitting(true);
        try {
            // Simulated API call
            await new Promise(r => setTimeout(r, 1000));

            setSubmitting(false);
            toast({
                title: approved ? "Project Approved" : "Project Rejected",
                description: `Action recorded for audit trail by ${user?.name}.`,
                variant: approved ? "default" : "destructive",
            });
            if (approved) handleNavigate('report');
        } catch (error) {
            setSubmitting(false);
            toast({
                title: "Error",
                description: "Failed to process decision. Enterprise API is unreachable.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Decision Hub</h1>
                <p className="text-muted-foreground font-medium">Review AI insights and authorize cross-functional project progression.</p>
            </div>

            <Card className="premium-glass premium-glass-hover relative overflow-hidden group">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                    <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-primary" /> Budget "What-If" Sandbox</CardTitle>
                    <CardDescription>Adjust variables to forecast cost and compliance risk impacts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span>Schedule Acceleration Target</span>
                            <Badge variant="outline" className="text-primary tracking-widest bg-primary/10 border-primary/20">{schedule[0]} DAYS</Badge>
                        </div>
                        <Slider value={schedule} onValueChange={setSchedule} max={30} step={1} className="-mt-1" />
                        <p className="text-xs text-muted-foreground font-medium">Accelerating the schedule lowers heavy machinery holding costs but moderately increases logistical collision risk.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span>Material Cost Threshold</span>
                            <Badge variant="outline" className={quality[0] < 85 ? "bg-amber-500/10 text-amber-500 border-amber-500/20 tracking-widest" : "bg-green-500/10 text-green-500 border-green-500/20 tracking-widest"}>{quality[0]}% STANDARD</Badge>
                        </div>
                        <Slider value={quality} onValueChange={setQuality} min={70} max={100} step={5} className="-mt-1" />
                        <p className="text-xs text-muted-foreground font-medium">Targeting cheaper materials (below 90% ISO standard) exponentially increases compliance failure permutations.</p>
                    </div>
                </CardContent>
                <div className="p-6 border-t border-primary/10 bg-primary/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        <Calculator className="h-4 w-4" /> AI Projected Cost
                    </div>
                    <span className="text-3xl font-black text-primary">{formatCurrency(dynamicCost)}</span>
                </div>
            </Card>

            <Card className="premium-glass premium-glass-hover relative overflow-hidden group">
                <CardHeader>
                    <CardTitle>Approval Checklist</CardTitle>
                    <CardDescription>Confirm review of all AI-generated evaluations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="compliance" checked={agreed.compliance} onCheckedChange={(c) => setAgreed(prev => ({ ...prev, compliance: !!c }))} />
                        <Label htmlFor="compliance">I acknowledge the compliance violations found in the report.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="cost" checked={agreed.cost} onCheckedChange={(c) => setAgreed(prev => ({ ...prev, cost: !!c }))} />
                        <Label htmlFor="cost">I accept the projected cost impact and budget timeline.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="manual" checked={agreed.manual} onCheckedChange={(c) => setAgreed(prev => ({ ...prev, manual: !!c }))} />
                        <Label htmlFor="manual">I confirm manual review of critical risk factors.</Label>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-6 border-t border-white/5">
                    <Button variant="ghost" onClick={() => handleDecision(false)} disabled={submitting} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                        Reject Project
                    </Button>
                    <Button onClick={() => handleDecision(true)} disabled={!canApprove || submitting} className="bg-green-600 hover:bg-green-700 font-bold border-2 border-green-500">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Approve & Generate Report
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
