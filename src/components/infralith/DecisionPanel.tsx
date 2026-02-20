
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';

export default function DecisionPanel() {
    const { handleNavigate, user } = useAppContext();
    const { toast } = useToast();
    const [agreed, setAgreed] = useState({
        compliance: false,
        cost: false,
        manual: false,
    });
    const [submitting, setSubmitting] = useState(false);

    const canApprove = agreed.compliance && agreed.cost && agreed.manual;
    const isSupervisor = user?.role === 'Supervisor' || user?.role === 'Admin';

    const handleDecision = async (approved: boolean) => {
        if (!isSupervisor) {
            toast({
                title: "Permission Required",
                description: "Only supervisors or administrators can authorize project progression.",
                variant: "destructive"
            });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/infralith/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved, projectId: 'INFRA-001' })
            });

            if (!response.ok) throw new Error('Action failed');

            const result = await response.json();
            setSubmitting(false);
            toast({
                title: approved ? "Project Approved" : "Project Rejected",
                description: `Action recorded for audit trail by ${result.audit.actionBy}.`,
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
                <h1 className="text-3xl font-bold tracking-tight">Supervisor Decision</h1>
                <p className="text-muted-foreground">Review AI insights and authorize project progression.</p>
            </div>

            <Card>
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
                <CardFooter className="flex justify-between pt-6 border-t">
                    <Button variant="ghost" onClick={() => handleDecision(false)} disabled={submitting} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                        Reject Project
                    </Button>
                    <Button onClick={() => handleDecision(true)} disabled={!canApprove || submitting} className="bg-green-600 hover:bg-green-700">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Approve & Generate Report
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
