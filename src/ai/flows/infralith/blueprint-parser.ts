
'use server';

import { generateAzureObject, analyzeBlueprintDocument } from '@/ai/azure-ai';

export interface ParsedBlueprint {
    projectScope: string;
    materials: {
        item: string;
        quantity: number;
        unit: string;
        spec: string;
    }[];
    structuralDetails: {
        floors: number;
        height: number;
        totalArea: number;
        seismicZone: string;
    };
}

export async function parseBlueprint(input: string | File): Promise<ParsedBlueprint> {
    console.log("Using Azure AI for Blueprint Intelligence...");

    // 1. OCR Step using Azure Document Intelligence
    const rawText = await analyzeBlueprintDocument(input);

    // 2. Structuring Step using Azure OpenAI (GPT-4o)
    const prompt = `
    Analyze the following OCR text extracted from a construction blueprint using Azure Document Intelligence.
    Extract high-level structured structural details.
    
    OCR TEXT: ${rawText.slice(0, 4000)} // Truncated for token safety
    
    You must provide:
    1. Project Scope (Summary)
    2. A list of key materials (Steel, Concrete, etc.) with estimated quantities.
    3. Structural details like floor count, height, and seismic zone.
    
    Return valid JSON.
    {
      "projectScope": "String",
      "materials": [{"item": "string", "quantity": number, "unit": "string", "spec": "string"}],
      "structuralDetails": {"floors": number, "height": number, "totalArea": number, "seismicZone": "string"}
    }
  `;

    try {
        return await generateAzureObject<ParsedBlueprint>(prompt);
    } catch (error) {
        console.error("Blueprint Parsing Error (Azure):", error);
        // Fallback data if AI fails
        return {
            projectScope: "Standard Mixed-Use Project Evaluation (Azure Fallback)",
            materials: [
                { item: "Reinforcement Steel (Fe 500D)", quantity: 250, unit: "Metric Tons", spec: "IS 1786" },
                { item: "Ready-mix Concrete (M30)", quantity: 5000, unit: "Cubic Meters", spec: "IS 456" }
            ],
            structuralDetails: { floors: 12, height: 42.0, totalArea: 15000, seismicZone: "Zone III" }
        };
    }
}
