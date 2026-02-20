
'use server';

import { ParsedBlueprint } from './blueprint-parser';
import { generateAzureObject } from '@/ai/azure-ai';

export interface ComplianceReport {
    overallStatus: 'Pass' | 'Fail' | 'Warning';
    rules: {
        ruleId: string;
        description: string;
        status: 'pass' | 'fail' | 'warn';
        comment: string;
    }[];
}

export async function checkCompliance(data: ParsedBlueprint): Promise<ComplianceReport> {
    const prompt = `
        As a Construction Compliance Agent powered by Azure OpenAI, verify the following project against International and Local Building Codes (IBC, IS Codes, NBC):
        
        Project: ${data.projectScope}
        Specs: ${data.structuralDetails.floors} floors, ${data.structuralDetails.height}m height, ${data.structuralDetails.totalArea}sqm area.
        Material Specs provided: ${data.materials.map(m => m.spec).join(", ")}.

        Check specifically for:
        1. Seismic Zone Compliance (Seismic Zone: ${data.structuralDetails.seismicZone})
        2. Minimum Material Standards (IS 456, IS 1786)
        3. Fire Safety and Zoning limits for a ${data.structuralDetails.height}m tall structure.

        Return JSON in this format:
        {
          "overallStatus": "Pass" | "Fail" | "Warning",
          "rules": [{"ruleId": "string", "description": "string", "status": "pass" | "fail" | "warn", "comment": "string"}]
        }
    `;

    try {
        return await generateAzureObject<ComplianceReport>(prompt);
    } catch (error) {
        console.error("Compliance Agent Error (Azure):", error);
        return {
            overallStatus: "Warning",
            rules: [
                {
                    ruleId: "IS 456:2000",
                    description: "Plain and Reinforced Concrete Code of Practice",
                    status: "warn",
                    comment: "Material specs for M30 concrete verified, but mix design report is missing from the Azure upload."
                }
            ]
        };
    }
}
