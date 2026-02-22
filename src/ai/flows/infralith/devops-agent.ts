
'use server';

import { generateAzureObject } from '@/ai/azure-ai';
import { WorkflowResult, DevOpsInsight } from './types';

/**
 * Agentic DevOps Agent
 * This agent monitors the evaluation workflow and generates automated maintenance
 * tasks or infrastructure-as-code updates in a simulated GitHub/Azure DevOps environment.
 */
export async function runDevOpsAgent(data: WorkflowResult): Promise<DevOpsInsight> {
    const prompt = `
        As a Site Reliability Engineer (SRE) and Structural DevOps Agent powered by Azure, 
        review the following AI analysis results for a construction project:
        
        Project: ${data.blueprint.projectScope}
        Risk Index: ${data.risk.riskIndex}
        Compliance: ${data.compliance.overallStatus}
        
        Your goal is to provide "Agentic DevOps" insights:
        1. Determine the status of the "Build Pipeline" for this structure.
        2. Propose automated technical actions (e.g., 'Trigger Seismic Re-calculation', 'Update Structural Specs in GitHub', 'Alert Onboarding Supervisor').
        3. Provide a status for the "GitOps" mirror of this project.

        Return JSON:
        {
          "pipelineStatus": "Optimized" | "Issue Detected" | "Critical Failure",
          "automatedActions": [{"action": "string", "target": "string", "priority": "P0" | "P1" | "P2"}],
          "gitOpsStatus": "string"
        }
    `;

    try {
        return await generateAzureObject<DevOpsInsight>(prompt);
    } catch (error) {
        console.error("DevOps Agent Error:", error);
        throw new Error("Azure OpenAI DevOps Agent failed. Verify API configurations.");
    }
}
