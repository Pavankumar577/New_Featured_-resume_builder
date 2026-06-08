import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client to prevent startup crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Anti-AI Local scanning list of overused buzzwords/phrases and alternatives
const BuzzwordMapping: Record<string, string> = {
  "spearheaded": "led, directed, guided, managed, drove",
  "delved deep": "analyzed, researched, examined, investigated",
  "delved": "analyzed, researched",
  "testament to": "proof of, evidence of, demonstrated by",
  "rich tapestry": "broad diversity, wide range, variety",
  "tapestry": "diversity, landscape",
  "passion for": "expertise in, dedication to",
  "meticulously": "thoroughly, carefully, systematically",
  "pivotal role": "key role, critical contribution",
  "revolutionized": "transformed, modernized, overhauled",
  "synergy": "collaboration, coordination",
  "synergistic": "collaborative, coordinated",
  "game-changer": "major benefit, significant advancement",
  "pioneered": "initiated, developed, introduced",
  "leverage": "use, utilize, employ",
  "leveraging": "using, utilizing, employing",
  "unwavering": "consistent, steady",
  "foster": "promote, encourage, develop",
  "fostered": "promoted, encouraged, developed",
  "nestled": "situated, placed",
  "beacon": "leader, guide",
  "cutting-edge": "modern, advanced, state-of-the-art",
  "state-of-the-art": "advanced, modern",
  "utilizing": "using, applying, implementing",
  "utilized": "used, applied",
  "exhibits": "shows, demonstrates",
  "innovative": "creative, modern, advanced"
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Status Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 1. Anti-AI Content Detox & Local Validation API
  app.post("/api/detox", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required in body." });
      }

      const lowerText = text.toLowerCase();
      const flaggedPhrases: Array<{ phrase: string; alternative: string; explanation: string }> = [];
      let totalHits = 0;

      // Local Regex Scan
      for (const [key, alt] of Object.entries(BuzzwordMapping)) {
        // Simple word-boundary check for accurate matching
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches && matches.length > 0) {
          totalHits += matches.length;
          flaggedPhrases.push({
            phrase: key,
            alternative: alt,
            explanation: `Overused AI/LLM term. Use active, plain English verbs for higher impact.`
          });
        }
      }

      // Calculate localized AI Likelihood Score
      let scoreMultiplier = 15;
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      let rawScore = Math.min((totalHits * scoreMultiplier) + (wordCount > 30 ? 10 : 0), 95);
      if (wordCount === 0) rawScore = 0;

      // Call Gemini for humanized rewriting and advanced scoring (if API key available)
      let humanizedAlternative = "";
      try {
        const client = getGeminiClient();
        const prompt = `Analyze this resume bullet point or text block for AI/LLM-style overused verbs or passive tone.
  Text: "${text}"
  
  Provide:
  1. A polished, 100% human sounding version that is active, high-impact, professional, and includes concrete action verbs like (led, built, modernized, analyzed).
  2. An advanced AI Likelihood Score from 0 to 100 based on tone, complexity, structure, and cliché index.
  
  Return the output exactly as JSON matching this schema:
  {
    "rewrittenText": "optimized text",
    "aiLikelihood": 45
  }`;

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                rewrittenText: { type: Type.STRING },
                aiLikelihood: { type: Type.INTEGER }
              },
              required: ["rewrittenText", "aiLikelihood"]
            }
          }
        });

        const data = JSON.parse(response.text?.trim() || "{}");
        if (data.rewrittenText) {
          humanizedAlternative = data.rewrittenText;
          rawScore = Math.round((rawScore + data.aiLikelihood) / 2);
        }
      } catch (geminiError) {
        console.warn("Gemini call omitted/failed in detox:", geminiError instanceof Error ? geminiError.message : geminiError);
        // Fallback simple humanizer string if Gemini not configured or fails
        humanizedAlternative = text;
        for (const [key, alt] of Object.entries(BuzzwordMapping)) {
          const regex = new RegExp(`\\b${key}\\b`, 'gi');
          const firstAlt = alt.split(',')[0].trim();
          humanizedAlternative = humanizedAlternative.replace(regex, firstAlt);
        }
      }

      res.json({
        flaggedPhrases,
        aiLikelihoodScore: rawScore,
        humanizedAlternative
      });

    } catch (error: any) {
      console.error("Detox API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // 2. Multi-Agent Recruiter Audit Endpoint
  app.post("/api/audit", async (req, res) => {
    try {
      const { resume } = req.body;
      if (!resume) {
        return res.status(400).json({ error: "Resume object is required." });
      }

      const client = getGeminiClient();
      const resumeString = JSON.stringify(resume);

      const systemPrompt = `You are an elite, multi-agent recruiter panel. Audit the provided resume strictly from these three viewpoints:
1. "The Skeptical Tech Lead": Critiques specific technical details, flags over-generalization/fluff, verifies if technical stack is clear, and looks for business metrics/outcomes.
2. "The HR Manager": Evaluates role alignment, dates/tenure, structural presentation, and credentials for general suitability.
3. "The High-Volume Recruiter": Audits scan-readability. Simulates how they evaluate keywords and impact in a rapid 6-second scan.

Return structural feedback and scores (0-100) exactly as JSON matching this schema:
{
  "techLead": {
    "score": 85,
    "critique": "short concise assessment",
    "suggestions": ["improvement 1", "improvement 2"]
  },
  "hrManager": {
    "score": 90,
    "critique": "short concise assessment",
    "suggestions": ["improvement 1"]
  },
  "highVolume": {
    "score": 75,
    "critique": "short concise assessment",
    "suggestions": ["improvement 1"]
  }
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: systemPrompt },
          { text: `Resume Data to Audit: ${resumeString}` }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              techLead: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  critique: { type: Type.STRING },
                  suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "critique", "suggestions"]
              },
              hrManager: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  critique: { type: Type.STRING },
                  suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "critique", "suggestions"]
              },
              highVolume: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  critique: { type: Type.STRING },
                  suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "critique", "suggestions"]
              }
            },
            required: ["techLead", "hrManager", "highVolume"]
          }
        }
      });

      const auditData = JSON.parse(response.text?.trim() || "{}");
      res.json(auditData);

    } catch (error: any) {
      console.error("Audit API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate recruiter audit." });
    }
  });

  // 3. Dynamic ATS Analysis Endpoint
  app.post("/api/ats-analyze", async (req, res) => {
    try {
      const { resume, atsType } = req.body;
      if (!resume || !atsType) {
        return res.status(400).json({ error: "Resume and atsType are required." });
      }

      // Local logic + AI explanation of simulated ATS behavior by enterprise vendor
      const client = getGeminiClient();
      const prompt = `Simulate how the '${atsType}' platform parses and handles this resume text and structure.
Enterprise vendors parse resumes specifically:
  - Workday: Prefers standard sequential sections under plain headings. Flags nested grids, sidebar text, or layout components.
  - Greenhouse: Parses skills aggressively into tags. Recommends comma-separated values; flags complex formatting.
  - Lever: Highly sensitive to chronology, title mapping, and text-density. Flags formatting discrepancies.

Analyze this resume:
${JSON.stringify(resume)}

Provide a strict JSON report of:
1. An overall parsed ATS readability score (0-100)
2. Readability Level (Excellent, Good, Needs Improvement, Critical)
3. Technical warnings or parsing alerts (e.g. multi-column caution, font density checks)
4. A conceptual "ATS Readability Blueprint View" detailing mapped fields and structural extracted nodes.
5. Specific actionable remedies.

Return exactly JSON format:
{
  "score": 75,
  "readabilityLevel": "Good",
  "warnings": ["Warning 1", "Warning 2"],
  "blueprint": "Extracted Header:... Extracted Experience:...",
  "remedy": ["remedial action 1", "remedial action 2"]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              readabilityLevel: { type: Type.STRING },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              blueprint: { type: Type.STRING },
              remedy: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "readabilityLevel", "warnings", "blueprint", "remedy"]
          }
        }
      });

      const report = JSON.parse(response.text?.trim() || "{}");
      res.json(report);

    } catch (error: any) {
      console.error("ATS Analyzer Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate ATS analysis." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in ${process.env.NODE_ENV || "development"} mode.`);
    console.log(`Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start fullstack server:", error);
});
