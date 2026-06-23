import { logger } from "../utils/logger.js";

// Gemini is optional. Without a key we return deterministic simulated output
// in EXACTLY the shapes the frontend reads.
let ai = null;

const getKey = () => process.env.GEMINI_API_KEY;
const getModel = () => process.env.GEMINI_MODEL || "gemini-2.0-flash";

export const initializeAI = async () => {
  if (ai) return;

  const KEY = getKey();
  const MODEL = getModel();

  if (KEY && KEY !== "MY_GEMINI_API_KEY") {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      ai = new GoogleGenAI({ apiKey: KEY });
      logger.info(`Gemini ready (${MODEL}).`);
    } catch (e) {
      logger.warn(`Gemini init skipped: ${e.message}`);
    }
  } else {
    logger.warn("GEMINI_API_KEY not set — AI runs in simulation mode.");
  }
};

export const summarize = async (transcript) => {
  await initializeAI();
  if (!transcript || !transcript.trim()) return { summary: "No transcript provided.", actionItems: [] };
  if (!ai) {
    return {
      summary: `Summary: discussed ${transcript.split("\n").length} points; key decisions captured and follow-ups assigned.`,
      actionItems: [
        { task: "Share meeting notes with the team", assignee: "Team", priority: "medium" },
        { task: "Follow up on open questions", assignee: "Team", priority: "low" },
      ],
    };
  }
  try {
    const { Type } = await import("@google/genai");
    const r = await ai.models.generateContent({
      model: getModel(),
      contents: `Summarize and extract action items:\n\n${transcript}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT, required: ["summary", "actionItems"],
          properties: {
            summary: { type: Type.STRING },
            actionItems: {
              type: Type.ARRAY, items: {
                type: Type.OBJECT, required: ["task", "assignee"],
                properties: { task: { type: Type.STRING }, assignee: { type: Type.STRING }, priority: { type: Type.STRING } }
              }
            },
          },
        },
      },
    });
    return JSON.parse(r.text);
  } catch (e) { logger.error(`AI summarize failed: ${e.message}`); return { summary: "AI temporarily unavailable.", actionItems: [] }; }
};

export const chat = async (message, context = "") => {
  await initializeAI();
  if (!ai) return { response: `(Simulated) Regarding "${message}" — connect a Gemini key for full answers.` };
  try {
    const r = await ai.models.generateContent({ model: getModel(), contents: context ? `Context:\n${context}\n\nQ: ${message}` : message });
    return { response: r.text?.trim() || "" };
  } catch (e) { logger.error(`AI chat failed: ${e.message}`); return { response: "AI temporarily unavailable." }; }
};

export const templates = () => [
  { id: "summary", name: "Summarize meeting", prompt: "Summarize the key points and decisions." },
  { id: "actions", name: "Extract action items", prompt: "List action items with owners." },
  { id: "followup", name: "Draft follow-up email", prompt: "Write a follow-up email recapping the meeting." },
];
