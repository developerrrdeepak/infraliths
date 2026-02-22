'use server';

import { generateAzureObject } from '@/ai/azure-ai';

/**
 * Compliance Agent — verifies blueprint against Indian building codes
 */
export async function checkCompliance(inputData: string) {
    const prompt = `
        As a Senior Structural Auditor, evaluate this construction project for compliance with:
        1. Indian Standard 456:2000 (Plain and Reinforced Concrete)
        2. National Building Code of India 2016 (NBC)
        3. IS 13920 (Ductile Detailing for Seismic Zones)

        PROJECT CONTEXT:
        ${inputData}

        Perform a deep audit. Identify specific non-compliance issues regarding:
        - Structural integrity and load paths
        - Fire safety and occupancy limits
        - Material specifications and seismic detailing

        Return a precisely structured JSON:
        {
           "overallStatus": "Pass" | "Warning" | "Fail",
           "violations": [
             { "ruleId": "Standard Ref", "description": "Specific finding", "comment": "Engineer recommendation" }
           ]
        }
    `;

    try {
        const result = await generateAzureObject<any>(prompt);
        return {
            overallStatus: result?.overallStatus || 'Warning',
            violations: (result?.violations || []).map((v: any) => ({
                ruleId: v?.ruleId || 'IS-GENERAL',
                description: v?.description || 'Structural check required',
                comment: v?.comment || 'Audit pending final review'
            }))
        };
    } catch (error) {
        console.error("Compliance Check Error:", error);
        throw error;
    }
}
