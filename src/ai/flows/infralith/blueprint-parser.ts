'use server';

import { analyzeBlueprintDocument, generateAzureObject } from '@/ai/azure-ai';

/**
 * Blueprint Parsing Agent — uses Azure Document Intelligence and GPT-4o
 */
export async function parseBlueprint(file: string | File) {
    // 1. OCR Step
    const ocrText = await analyzeBlueprintDocument(file);

    // 2. Structured Extraction Step
    const prompt = `
        Analyze this blueprint OCR text and extract the structural parameters.
        OCR TEXT:
        ${ocrText}
        
        Extract:
        - projectScope: Full name of the project
        - totalFloors: number
        - height: number (in meters)
        - totalArea: number (in sqm)
        - seismicZone: string (II, III, IV, or V)
        - materials: array of objects { item, quantity, unit, spec }
        
        Respond only in JSON.
    `;

    try {
        const result = await generateAzureObject<any>(prompt);
        return {
            projectScope: result?.projectScope || result?.projectName || "Construction Project",
            totalFloors: result?.totalFloors || result?.floors || 0,
            height: result?.height || 0,
            totalArea: result?.totalArea || result?.area || 0,
            seismicZone: result?.seismicZone || result?.zone || "Undefined",
            materials: (result?.materials || []).map((m: any) => ({
                item: m?.item || m?.name || m?.material || 'Unknown Material',
                quantity: m?.quantity || m?.amount || 0,
                unit: m?.unit || m?.measurement || '',
                spec: m?.spec || m?.specification || m?.standard || ''
            }))
        };
    } catch (error) {
        console.error("Blueprint Parser Error:", error);
        throw error;
    }
}
