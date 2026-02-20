
'use server';

import { ParsedBlueprint } from './blueprint-parser';
import { generateAzureObject } from '@/ai/azure-ai';

export interface CostEstimate {
    totalEstimatedCost: number;
    currency: string;
    breakdown: {
        category: string;
        cost: number;
        percentage: number;
    }[];
    confidenceScore: number;
}

export async function predictCost(data: ParsedBlueprint): Promise<CostEstimate> {
    const prompt = `
        As a Construction Cost Estimation Agent powered by Microsoft Azure OpenAI, predict the total cost and breakdown for the following project:
        
        Project: ${data.projectScope}
        Specs: ${data.structuralDetails.floors} floors, ${data.structuralDetails.height}m height, ${data.structuralDetails.totalArea}sqm area.
        Materials List: ${JSON.stringify(data.materials)}

        Apply current market rates (use INR as currency). 
        Provide a total estimated cost and a breakdown by category (Materials, Labor, Machinery, Logistics, Contingency).
        
        Ensure the sum of breakdown costs equals the totalEstimatedCost.
        
        Return JSON in this format:
        {
          "totalEstimatedCost": number,
          "currency": "INR",
          "breakdown": [{"category": "string", "cost": number, "percentage": number}],
          "confidenceScore": number (0 to 1)
        }
    `;

    try {
        return await generateAzureObject<CostEstimate>(prompt);
    } catch (error) {
        console.error("Cost Prediction Agent Error (Azure):", error);
        // Fallback
        const materialCost = data.materials.reduce((acc, m) => {
            let pricePerUnit = m.item.includes("Steel") ? 68000 : 5000;
            return acc + (m.quantity * pricePerUnit);
        }, 0);
        const total = materialCost * 1.6;
        return {
            totalEstimatedCost: Math.round(total),
            currency: "INR",
            breakdown: [
                { category: "Materials", cost: Math.round(materialCost), percentage: 60 },
                { category: "Labor", cost: Math.round(materialCost * 0.4), percentage: 25 },
                { category: "Others", cost: Math.round(total - (materialCost * 1.4)), percentage: 15 }
            ],
            confidenceScore: 0.5
        };
    }
}
