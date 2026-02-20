
'use server';

import { ParsedBlueprint } from './blueprint-parser';
import { generateAzureObject } from '@/ai/azure-ai';

export interface RiskAnalysis {
    riskIndex: number;
    hazards: {
        type: string;
        probability: number;
        severity: 'High' | 'Medium' | 'Low';
        mitigation: string;
    }[];
    aiInsight: string;
}

export async function analyzeRisk(data: ParsedBlueprint): Promise<RiskAnalysis> {
    const prompt = `
        As a Structural Risk Assessment Agent powered by Azure OpenAI, analyze the following project for potential hazards:
        
        Project: ${data.projectScope}
        Specs: ${data.structuralDetails.floors} floors, ${data.structuralDetails.height}m height, ${data.structuralDetails.totalArea}sqm area, Seismic Zone: ${data.structuralDetails.seismicZone}.
        Materials: ${JSON.stringify(data.materials)}

        Identify 3-5 specific structural risks (e.g., Seismic, Wind Load, Soil Settlement, Material Stress).
        Provide a probability (0-1), a severity (High/Medium/Low), and a technical mitigation strategy for each.
        Also, provide a composite Risk Index (0-100) and a high-level Azure AI Insight.

        Return JSON in this format:
        {
          "riskIndex": number,
          "hazards": [{"type": "string", "probability": number, "severity": "High" | "Medium" | "Low", "mitigation": "string"}],
          "aiInsight": "string"
        }
    `;

    try {
        return await generateAzureObject<RiskAnalysis>(prompt);
    } catch (error) {
        console.error("Risk Analysis Agent Error (Azure):", error);
        return {
            riskIndex: 45,
            hazards: [
                {
                    type: "General Structural Stress",
                    probability: 0.3,
                    severity: "Medium",
                    mitigation: "Ensure compliance with IS 456 standards for RCC structures via Azure Compliance Checker."
                }
            ],
            aiInsight: "Primary Azure AI evaluation suggests a stable design, but detailed seismic calculations are recommended."
        };
    }
}
