
'use server';

import { parseBlueprint, ParsedBlueprint } from './blueprint-parser';
import { predictCost, CostEstimate } from './cost-prediction';
import { analyzeRisk, RiskAnalysis } from './risk-analysis';
import { checkCompliance, ComplianceReport } from './compliance-check';
import { runDevOpsAgent } from './devops-agent';
import { WorkflowResult } from './types';

export async function runInfralithWorkflow(input: string | File): Promise<WorkflowResult> {
    console.log("Starting Infralith Intelligence Workflow via Azure...");

    // 1. Initial Intelligence Step: Blueprint Parsing (OCR + LLM)
    const blueprint = await parseBlueprint(input);

    // 2. Parallel Specialized Agent Processing
    const [cost, risk, compliance] = await Promise.all([
        predictCost(blueprint).catch(e => { console.error("Cost prediction failed", e); return null; }),
        analyzeRisk(blueprint).catch(e => { console.error("Risk analysis failed", e); return null; }),
        checkCompliance(blueprint).catch(e => { console.error("Compliance check failed", e); return null; })
    ]);

    const resultWithoutDevOps: WorkflowResult = {
        blueprint,
        cost: cost as CostEstimate,
        risk: risk as RiskAnalysis,
        compliance: compliance as ComplianceReport,
        timestamp: new Date().toISOString()
    };

    // 3. Post-Processing: Agentic DevOps Review
    // This agent reviews the outputs of other agents to suggest CI/CD/Reliability actions.
    const devops = await runDevOpsAgent(resultWithoutDevOps).catch(e => {
        console.error("DevOps Agent failed", e);
        return undefined;
    });

    return {
        ...resultWithoutDevOps,
        devops
    };
}
