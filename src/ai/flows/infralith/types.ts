
import { ParsedBlueprint } from './blueprint-parser';
import { CostEstimate } from './cost-prediction';
import { RiskAnalysis } from './risk-analysis';
import { ComplianceReport } from './compliance-check';

export interface DevOpsInsight {
    pipelineStatus: 'Optimized' | 'Issue Detected' | 'Critical Failure';
    automatedActions: {
        action: string;
        target: string;
        priority: 'P0' | 'P1' | 'P2';
    }[];
    gitOpsStatus: string;
}

export interface WorkflowResult {
    blueprint: ParsedBlueprint;
    cost: CostEstimate;
    risk: RiskAnalysis;
    compliance: ComplianceReport;
    devops?: DevOpsInsight;
    timestamp: string;
}
