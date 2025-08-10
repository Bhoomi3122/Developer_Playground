import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function handleCodeInstruction(req, res) {
  console.log("STEP 1: `handleCodeInstruction` function initiated.");
  try {
    const { html, css, js, instruction } = req.body;
    console.log("STEP 2: Request body destructured. Instruction received:", instruction);

    if (!instruction || typeof instruction !== "string" || !instruction.trim()) {
      console.error("DEBUG FAIL: Instruction is missing or invalid.");
      return res.status(400).json({ error: "Instruction is required" });
    }

    const prompt = `
You are an AI code assistant. Your task is to modify the provided code based on a user's instruction.
ONLY reply with a valid JSON object in the exact format specified below.
Do NOT add any explanations, markdown, comments, or any text outside of the JSON structure.

Instruction:
"${instruction}"

Here is the current code. Update it according to the instruction.
If a language (html, css, or js) is not provided or does not need changes, return its original content or an empty string.

Current HTML:
\`\`\`html
${html || ""}
\`\`\`

Current CSS:
\`\`\`css
${css || ""}
\`\`\`

Current JavaScript:
\`\`\`javascript
${js || ""}
\`\`\`

Respond ONLY with this JSON format:
{
  "html": "...",
  "css": "...",
  "js": "..."
}
`;
    console.log("STEP 3: Prompt constructed. Sending request to Gemini API.");

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log("STEP 4: Received raw response from Gemini API:", rawText);

    const cleanText = rawText.replace(/```json|```/g, "").trim();
    console.log("STEP 5: Sanitized AI response for parsing:", cleanText);

    const updatedCode = JSON.parse(cleanText);
    console.log("STEP 6: Successfully parsed JSON from AI response.");

    if (
      typeof updatedCode.html !== "string" ||
      typeof updatedCode.css !== "string" ||
      typeof updatedCode.js !== "string"
    ) {
      console.error("DEBUG FAIL: Parsed JSON object has an invalid structure.", updatedCode);
      return res.status(500).json({ error: "Invalid response format from AI." });
    }

    console.log("STEP 7: Validation successful. Sending final code to client.");
    res.json(updatedCode);

  } catch (error) {
    console.error("DEBUG FAIL: An error occurred in the try-catch block.", error);
    res.status(500).json({ error: "Failed to process the code change." });
  }
}