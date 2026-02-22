'use server';

export interface DevOpsInsight {
    agentId: string;
    status: 'Optimized' | 'Warning' | 'Issue';
    message: string;
    actionRequired: boolean;
}

export interface WorkflowResult {
    id: string;
    timestamp: string;
    projectScope: string;
    role: 'Engineer' | 'Supervisor' | 'Admin';

    // Parsed Blueprint Data
    parsedBlueprint?: {
        totalFloors: number;
        height: number;
        totalArea: number;
        seismicZone: string;
        materials: Array<{ item: string; quantity: number | string; unit: string; spec: string }>;
    };

    // Agent Reports
    complianceReport?: {
        overallStatus: 'Pass' | 'Warning' | 'Fail';
        violations: Array<{ ruleId: string; description: string; comment: string }>;
    };

    riskReport?: {
        riskIndex: number;
        level: 'Low' | 'Medium' | 'High';
        hazards: Array<{ type: string; severity: string; description: string; mitigation: string }>;
    };

    costEstimate?: {
        total: number;
        currency: string;
        breakdown: Array<{ category: string; amount: number; percentage: number }>;
        duration: string;
    };

    // DevOps / Pipeline Info
    devOpsInsights: DevOpsInsight[];
    approvalBlockerCount: number;
    conflicts: Array<{
        riskCategory: string;
        regulationRef: string;
        location: string;
        requiredValue: string;
        measuredValue: string;
    }>;

    // UI Helper fields (sometimes used in different views)
    costImpactEstimate?: number;
    currency?: string;
    complianceScore?: number;
}
