import { WorkflowResult } from "@/ai/flows/infralith/types";

// The unified master report (internal representation)
export interface MasterAIReport extends WorkflowResult {
    // Mock telemetry for Admin audits
    pipelineLatencyMs?: number;
    ocrConfidence?: number;
    extractionFailureRate?: number;
}

export interface EngineerReportDTO {
    role: 'Engineer';
    timestamp: string;
    projectScope: string;
    conflicts: Array<{
        location: string;
        measuredValue: string;
        requiredValue: string;
        riskCategory: string;
        confidenceScore: number;
        regulationRef: string;
    }>;
    materials: any[];
}

export interface SupervisorDecisionDTO {
    role: 'Supervisor';
    timestamp: string;
    projectScope: string;
    approvalReadinessScore: number;
    costImpactEstimate: number;
    currency: string;
    delayImpactDays: number;
    approvalBlockerCount: number;
    redesignRequired: boolean;
}

export interface AdminAuditDTO {
    role: 'Admin';
    timestamp: string;
    projectScope: string;
    ocrAccuracy: number;
    extractionFailureRate: number;
    jurisdiction: string;
    aiPipelineLatencyMs: number;
    regulationVersionUsed: string;
}

export type FilteredWorkflowResult = EngineerReportDTO | SupervisorDecisionDTO | AdminAuditDTO;

export class ReportResponseFactory {
    static create(masterReport: MasterAIReport, role: string): FilteredWorkflowResult {
        switch (role) {
            case 'Engineer':
                return this.mapToEngineer(masterReport);
            case 'Supervisor':
                return this.mapToSupervisor(masterReport);
            case 'Admin':
                return this.mapToAdmin(masterReport);
            default:
                // Defaulting to Engineer/Limited view for fail-safe
                return this.mapToEngineer(masterReport);
        }
    }

    private static mapToEngineer(report: MasterAIReport): EngineerReportDTO {
        return {
            role: 'Engineer',
            timestamp: report.timestamp,
            projectScope: report.blueprint?.projectScope || 'Unknown Project Overview',
            // Example mapping internal AI analysis to purely technical engineering findings
            conflicts: report.compliance.rules.filter(r => r.status !== 'pass').map(rule => ({
                location: 'Internal Spec',
                measuredValue: 'Observed Metric',
                requiredValue: rule.comment || 'Required Baseline',
                riskCategory: rule.status === 'fail' ? 'Critical' : 'Warning',
                confidenceScore: 0.95,
                regulationRef: rule.ruleId
            })),
            materials: report.blueprint?.materials || []
        };
    }

    private static mapToSupervisor(report: MasterAIReport): SupervisorDecisionDTO {
        const failures = report.compliance.rules.filter(r => r.status !== 'pass').length;
        const totalCost = report.cost?.totalEstimatedCost || 0;
        return {
            role: 'Supervisor',
            timestamp: report.timestamp,
            projectScope: report.blueprint?.projectScope || 'Unknown Project Overview',
            approvalReadinessScore: Math.max(0, 100 - (failures * 15) - (report.risk.riskIndex / 2)),
            costImpactEstimate: totalCost,
            currency: report.cost?.currency || 'USD',
            delayImpactDays: failures > 0 ? failures * 3 + report.risk.hazards.length * 2 : 0,
            approvalBlockerCount: failures,
            redesignRequired: failures > 2 || report.risk.riskIndex > 60
        };
    }

    private static mapToAdmin(report: MasterAIReport): AdminAuditDTO {
        return {
            role: 'Admin',
            timestamp: report.timestamp,
            projectScope: report.blueprint?.projectScope || 'Unknown Project Overview',
            ocrAccuracy: report.ocrConfidence || 99.2,
            extractionFailureRate: report.extractionFailureRate || 0.003,
            jurisdiction: 'India (IS-456, NBC-4)',
            aiPipelineLatencyMs: report.pipelineLatencyMs || 2450,
            regulationVersionUsed: 'v2024.1 (Azure SQL Sync)'
        };
    }
}
