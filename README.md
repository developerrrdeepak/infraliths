###  Our Inspiration:
Honestly, the idea came from seeing my own friends and seniors struggle during placement season. In our college (and so many others in Tier-2/Tier-3 cities), we have the coding skills, but we mess up because we don't have the right guidance.

We saw so many talented batchmates get rejected by ATS software just because their resume format was wrong, or freeze up during HR rounds because they never practised speaking in English. Career counsellors are super expensive, and most of us just rely on random YouTube videos. We wanted to build something that could be a "Digital Senior" for everyone—a personalised compass (*Disha Darshak*) that levels the playing field. If we have GenAI now, why should any student feel lost about their career?

### What We've Learned:
Building this wasn't just about coding; it was a crash course in how LLMs actually work in production.
*   **Prompt Engineering is Harder than it Looks:** I learned that you can't just treat Gemini like ChatGPT. I had to write specific "system instructions" to make the AI act like a strict recruiter for the "Roast" feature versus a helpful mentor for the "Roadmap" feature.
*   **Handling Files with AI:** I learned how to pass PDF binaries directly to Gemini Pro. Before this, I thought we had to use Python libraries to extract text first (which always broke formatting), but Gemini can actually "read" the document structure, which was a game-changer.
*   **Latency is the Enemy:** For the Mock Interview feature, I realised that even a 3-second delay feels awkward. I learned a lot about optimising API calls and managing asynchronous states so the AI replies fast enough to keep the conversation flowing.
*   **State Management Nightmares:** Building the *CV Forge* (where the AI edits your resume while you watch) taught me *a lot* about React Context and keeping the UI in sync with the backend.

### What did we build:

**Ascend AI** is a comprehensive career guidance platform designed to democratize access to professional coaching. It leverages advanced Generative AI (Google Gemini Models) to provide end-to-end career support—from self-discovery and skill roadmapping to resume creation, optimisation, and interview preparation. The platform specifically targets students and early professionals (particularly in the Indian context, based on localised content and naming conventions) who lack access to expensive career counselors

1.  **TorchMyResume (Resume Analysis):**
    *   **Rank Mode:** Scores the resume (0-100) against a specific job role, identifying strengths, weaknesses, and missing keywords.
    *   **Roast Mode:** A humorous yet insightful critique of the resume to highlight clichés and errors.
    *   **Tech:** Uses Gemini Pro to analyse PDF binaries directly.

2.  **CV Forge (Resume Builder):**
    *   **PDF Import:** Extracts text from existing multi-page PDFs using OCR capabilities.
    *   **Agentic Editor:** A chat interface where users tell the AI ("Make this bullet point punchier," "Tailor this for a Google job") and the AI rewrites the Markdown in real-time.
    *   **Templates:** Exports to "Classic Corporate," "Minimalist Pro," or "Tech Modern" PDF styles.

3.  **Mock Interview Simulator:**
    *   **Voice Interaction:** Uses Browser Speech Recognition for input and Google Cloud Text-to-Speech for realistic AI audio output.
    *   **Context Aware:** Generates questions based on the user's uploaded resume, target role, and chosen difficulty (Easy/Medium/Hard).
    *   **Feedback Report:** Provides a structured evaluation JSON covering soft skills, answer quality, and ideal answers after the session.

4.  **Skill-set Finder (Path Finder):**
    *   **Assessment:** A 15-question quiz covering logic, creativity, work style, and interests.
    *   **Roadmap Generator:** Creates a detailed, step-by-step timeline (e.g., "Months 0-3: Foundation") with specific resources and projects to build.


###  How did We Built It:
We treated this like a proper production app, not just a weekend hack.
#### **The Tech Stack:**

### **1. Frontend Framework & Language**
*   **Framework:** **Next.js 14+** (App Router architecture used in `src/app`).
*   **Language:** **TypeScript** (Strict typing used throughout `.ts` and `.tsx` files).
*   **Library:** **React** (Server and Client Components).

### **2. UI & Styling**
*   **Styling Engine:** **Tailwind CSS** (configured in `tailwind.config.ts` and `globals.css`).
*   **Component Library:** **shadcn/ui** (evidenced by the structure in `src/components/ui/`, utilizing Radix UI primitives).
*   **Icons:** **Lucide React**.
*   **Animations:** **Framer Motion** (used for page transitions, twinkling stars, and UI interactions).
*   **Data Visualization:** **Recharts** (used in `job-trends-chart.tsx`).
*   **Fonts:** **Inter** and **Space Grotesk** (via `next/font/google`).

### **3. Backend & Database (Serverless Architecture)**
*   **Backend Logic:** **Next.js Server Actions** (`'use server'` directives in `src/ai/flows/*` handle API calls securely).
*   **Database:** **Firebase Realtime Database** (used for storing user profiles, chat history, and evaluations; distinct from Firestore).
*   **Authentication:** **Firebase Authentication** (Email/Password and Google Sign-In).

### **4. Artificial Intelligence (The Core)**
*   **LLM Provider:** **Google Gemini** (via `@google/genai` SDK).
    *   **Flash Model (`gemini-3-flash-preview`):** Used for low-latency tasks like chat interactions, skill extraction, and JSON parsing.
    *   **Pro Model (`gemini-3-pro-preview`):** Used for complex reasoning, long-context tasks, and multimodal inputs (PDF analysis).
*   **Text-to-Speech:** **Google Cloud Text-to-Speech API** (via `@google-cloud/text-to-speech`).
*   **Speech-to-Text:** **Web Speech API** (Native browser `window.SpeechRecognition` used in `voice-interview-ui.tsx`).
*   **Agentic Framework:** Custom implementation using **TypeScript functions** as flows (Shimmed Genkit-style architecture in `src/ai/genkit.ts`).

### **5. Utilities & Libraries**
*   **Validation:** **Zod** (Used for defining AI output schemas and form validation).
*   **Forms:** **React Hook Form** + **Hookform Resolvers**.
*   **PDF Handling:**
    *   **jsPDF** & **html2canvas**: Used in `cv-forge.tsx` to generate PDF resumes from the DOM.
*   **External Data:**
    *   **GNews API**: Fetches live career news in `src/app/api/news`.
    *   **Google Looker Studio**: Embedded iframe for job market visualization.

### **6. Deployment & Environment**
*   **Environment Management:** **dotenv** (for loading API keys).
*   **Hosting Configuration:** `apphosting.yaml` and `firebase.json` suggest deployment compatibility with **Firebase App Hosting**.

### The Challenges We Faced:
*   **The "Hallucination" Problem:** At first, the roadmap generator would suggest courses that didn't exist or were 5 years old. I had to spend a lot of time tweaking the prompts to ground the AI and make it stick to general, verifiable topics.
*   **PDF Parsing was a Headache:** Resumes come in weird formats—two columns, icons, tables. The AI used to get confused between the company name and the job title. We had to switch to Gemini’s vision capabilities to fix this.
*   **Voice Loops:** The funniest (and most annoying) bug was during the mock interview—the mic would pick up the AI’s voice, send it back to the AI, and it would start talking to itself! I had to write some strict logic in the frontend to mute the mic the second the AI starts speaking.
*   **Token Limits:** When users uploaded huge 4-page resumes, we hit API limits. I had to write a summarizer function to shrink the text down before sending it to the resume editor.
