'use server';

import { generateAzureVisionObject } from '@/ai/azure-ai';

export interface BIMElement {
    type: 'wall' | 'door' | 'window' | 'furniture' | 'plant';
    x: number;
    z: number;
    width: number;
    length: number;
    height?: number; // Added for furniture
    color?: string; // Added for customized styles
    rotation?: number;
    metadata?: Record<string, any>;
}

/**
 * Advanced AI 2D to 3D Conversion Agent.
 * Leveraging the logic of Azure Maps Creator and Digital Twins 3D Scenes.
 */
export async function processBlueprintTo3D(base64Image: string): Promise<BIMElement[]> {
    console.log("Infralith Digital Twins: Initiating spatial conversion via Azure Vision...");

    const prompt = `
        Act as an Advanced AI Spatial Designer engine (similar to Planner 5D). 
        Analyze the provided 2D blueprint, floor plan, or sketch image and convert it into a structured 3D BIM data array.
        
        TASKS:
        1. Identify primary exterior boundaries and interior load-bearing walls.
        2. Detect key egress points (doors) and openings (windows).
        3. Extract recognized furniture (desks, sofas, beds, tables) and indoor plants to furnish the space.
        4. Normalize all coordinates onto a central grid from X: -5 to +5 and Z: -5 to +5.
        
        OUTPUT FORMAT:
        Return a JSON object with an "elements" array.
        Each element: { "type": "wall"|"door"|"window"|"furniture"|"plant", "x": number, "z": number, "width": number, "length": number, "height": number, "color": string }
        
        Design Rules:
        - Walls use thickness 0.2 to 0.4.
        - Doors typically have a length of 0.8 to 1.0.
        - Furniture should have realistic proportional width, length, and height.
        - Assign logical, aesthetic hex colors (e.g. #fb923c for sofas) to the "color" property.
        - Normalize the layout centrally around [0,0].
    `;

    try {
        const result = await generateAzureVisionObject<{ elements: BIMElement[] }>(prompt, base64Image);

        if (!result || !result.elements || !Array.isArray(result.elements)) {
            console.warn("Maps Creator simulation: No structured elements found. Generating default shell.");
            return generateSafeShell();
        }

        return result.elements;
    } catch (e) {
        console.error("Spatial Conversion Pipeline Error:", e);
        throw e;
    }
}

function generateSafeShell(): BIMElement[] {
    return [
        // Outer Shell
        { type: 'wall', x: 0, z: -4, width: 8.5, length: 0.3, color: '#475569' },
        { type: 'wall', x: 0, z: 4, width: 8.5, length: 0.3, color: '#475569' },
        { type: 'wall', x: -4, z: 0, width: 0.3, length: 8.5, color: '#475569' },
        { type: 'wall', x: 4, z: 0, width: 0.3, length: 8.5, color: '#475569' },
        // Interior Walls separating living room and office
        { type: 'wall', x: 0, z: -1, width: 0.3, length: 6, color: '#64748b' },
        // Doors
        { type: 'door', x: 0, z: 1.5, width: 0.3, length: 1.2, color: '#3b82f6' },
        { type: 'door', x: 4, z: 0, width: 0.3, length: 1.2, color: '#3b82f6' },
        // Windows
        { type: 'window', x: -4, z: -2, width: 0.4, length: 2, color: '#93c5fd' },
        { type: 'window', x: -4, z: 2, width: 0.4, length: 2, color: '#93c5fd' },

        // --- 🛋️ AI Planner 5D Furniture Generation Mock ---
        // Living Room Setup
        { type: 'furniture', x: -2, z: 1, width: 2.5, length: 1, height: 0.5, color: '#fb923c', rotation: 0 }, // Sofa
        { type: 'furniture', x: -2, z: -0.5, width: 1.5, length: 0.8, height: 0.3, color: '#e2e8f0', rotation: 0 }, // Coffee Table
        { type: 'furniture', x: -3.5, z: -2, width: 0.6, length: 2, height: 0.8, color: '#1e293b', rotation: 0 }, // TV Unit

        // Office Setup
        { type: 'furniture', x: 2, z: -2, width: 1.8, length: 0.8, height: 0.75, color: '#cbd5e1', rotation: 0 }, // Desk
        { type: 'furniture', x: 2, z: -1, width: 0.6, length: 0.6, height: 0.5, color: '#0f172a', rotation: 0 }, // Chair

        // Decor
        { type: 'plant', x: -3.5, z: 3.5, width: 0.5, length: 0.5, height: 1.2, color: '#22c55e', rotation: 0 }, // Potted Plant
        { type: 'plant', x: 3.5, z: -3.5, width: 0.4, length: 0.4, height: 0.8, color: '#22c55e', rotation: 0 }
    ];
}
