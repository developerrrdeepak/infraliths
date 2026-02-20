
'use server';

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Support both Vertex AI (GCP) and standard Google AI (API Key)
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

export interface TTSResult {
    audio: string | null;
    raw: unknown;
}

/**
 * TTS Function
 * Moves this to a standalone server file to prevent client-side build errors
 * regarding Node.js core modules like 'child_process'.
 */
export async function generateTTS(text: string): Promise<TTSResult> {
    const ttsClient = new TextToSpeechClient();

    const request = {
        input: { text: text },
        voice: { languageCode: 'en-IN', name: 'en-IN-Wavenet-D' },
        audioConfig: { audioEncoding: 'MP3' as const },
    };

    try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        const audioContent = response.audioContent;

        if (audioContent instanceof Uint8Array) {
            const audioBase64 = Buffer.from(audioContent).toString('base64');
            return {
                audio: audioBase64,
                raw: response,
            };
        }
        throw new Error('Invalid audio content received from the API.');

    } catch (error) {
        console.error("Error calling Google Cloud Text-to-Speech API:", error);
        throw new Error("Failed to generate speech. Ensure the API is enabled.");
    }
}
