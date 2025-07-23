const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleCodeInstruction = async (req, res) => {
  const { html, css, js, instruction } = req.body;

  const prompt = `
You are an AI code assistant. ONLY reply with valid JSON in the format below. Do not include any extra explanation, markdown, or text.

Instruction: "${instruction}"

Respond ONLY in this JSON format:
{
  "html": "...",
  "css": "...",
  "js": "..."
}

HTML:
${html}

CSS:
${css}

JS:
${js}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from Gemini's response
    const updatedCode = JSON.parse(text);
    res.json(updatedCode);
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to process the code change." });
  }
};
