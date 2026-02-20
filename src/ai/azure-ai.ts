import { AzureOpenAI } from "openai";
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import * as dotenv from "dotenv";

dotenv.config();

// Azure OpenAI Configuration
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
const azureKey = process.env.AZURE_OPENAI_KEY || "";
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o";

// Azure Document Intelligence Configuration
const docIntelEndpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
const docIntelKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";

/**
 * Azure OpenAI LLM Bridge using the new 'openai' package support for Azure
 */
export async function generateAzureObject<T>(prompt: string, schema?: any): Promise<T> {
    if (!azureEndpoint || !azureKey) {
        throw new Error("Azure OpenAI credentials missing. Please check .env.local");
    }

    // Initialize the Azure OpenAI client
    const client = new AzureOpenAI({
        endpoint: azureEndpoint,
        apiKey: azureKey,
        apiVersion: "2024-05-01-preview", // Latest API version
        deployment: deploymentName,
    });

    try {
        const result = await client.chat.completions.create({
            model: deploymentName,
            messages: [
                { role: "system", content: "You are an expert Construction Intelligence Agent. Respond only in valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = result.choices[0].message?.content || "{}";
        return JSON.parse(content) as T;
    } catch (error) {
        console.error("Azure OpenAI Error:", error);
        throw error;
    }
}

/**
 * Azure Document Intelligence Bridge for Blueprint OCR
 */
export async function analyzeBlueprintDocument(fileUrl: string | File): Promise<string> {
    if (!docIntelEndpoint || !docIntelKey) {
        throw new Error("Azure Document Intelligence credentials missing. Please check .env.local");
    }

    const client = new DocumentAnalysisClient(docIntelEndpoint, new AzureKeyCredential(docIntelKey));

    try {
        let poller;
        if (typeof fileUrl === 'string') {
            poller = await client.beginAnalyzeDocument("prebuilt-layout", fileUrl as any);
        } else {
            // Production Handling: Convert File/Blob to a Uint8Array for the Azure SDK
            const arrayBuffer = await fileUrl.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            poller = await client.beginAnalyzeDocument("prebuilt-layout", buffer);
        }

        const { content } = await poller.pollUntilDone();
        return content || "No content extracted from blueprint.";
    } catch (error) {
        console.error("Azure Doc Intel Error:", error);
        // We throw the error in production so the user knows analysis failed, 
        // leading to the workflow's built-in fallback mechanisms.
        throw error;
    }
}
