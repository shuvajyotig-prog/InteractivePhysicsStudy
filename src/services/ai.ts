import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

const quizSchema: Schema = {
  type: Type.ARRAY,
  description: "A list of exactly 5 multiple choice questions.",
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The multiple choice question text." },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Exactly four options for the multiple choice question."
      },
      correctOptionIndex: { type: Type.INTEGER, description: "The zero-based index (0-3) of the correct option in the options array." },
      explanation: { type: Type.STRING, description: "A detailed explanation of why the answer is correct, clearing up common misconceptions." }
    },
    required: ["question", "options", "correctOptionIndex", "explanation"]
  }
};

export async function generatePressureTest(grade: string, topic: string): Promise<QuizQuestion[]> {
  const prompt = `You are an expert CBSE Physics examiner.
Generate 5 challenging, conceptual multiple-choice questions for Class ${grade} Physics on the topic: ${topic}.
The questions should test a student's core understanding and ability to apply concepts, rather than simple rote memorization.
Ensure the difficulty is appropriate for the CBSE curriculum for class ${grade}.
For each question, provide 4 plausible options, where 1 is correct and 3 are common misconceptions.
Provide a clear, educational explanation for the correct answer. Returns exactly 5 questions.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: quizSchema,
      temperature: 0.7,
    }
  });

  const text = response.text;
  if (!text) {
     throw new Error("Failed to generate questions.");
  }
  return JSON.parse(text) as QuizQuestion[];
}

export async function explainFormula(formulaContent: string): Promise<string> {
  const prompt = `You are an expert Physics teacher. Break down the following physics formula/concept block for a student:
${formulaContent}

Provide a rich, markdown-formatted explanation.
Explain what each term means intuitively, the history or derived logic behind it, and a simple real-world analogy. Keep it under 3 paragraphs. Use LaTeX formatting where appropriate.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "I ran into an issue breaking down this formula.";
}

export async function generateDeepDive(grade: string, topic: string, subTopic: string): Promise<string> {
  const prompt = `You are a friendly, rigorous expert CBSE Class ${grade} Physics tutor.
A student is studying "${topic}" and wants to deeply understand the specific concept/technique: "${subTopic}".

Provide a comprehensive, engaging deep dive that goes significantly beyond the basics. Include:
1. **The Core Intuition:** Why does this make sense? Use a striking real-world analogy.
2. **Graphical/Visual Analysis:** (Crucial!) If this relates to graphs (like velocity-time) or vectors, explicitly describe what different curves, slopes (up/down/steep/shallow), or directions mean physically. E.g., what does a parabolic curve vs a straight line imply about force?
3. **Edge Cases & Variations:** Walk through 2-3 specific scenarios where this concept plays out differently (e.g., throwing a ball up vs dropping it, or moving with vs against friction).
4. ** Mathematical Underpinnings:** Briefly show how the math connects to the concept without getting bogged down in algebra.

Keep the tone encouraging. Format beautifully using Markdown. Use bolding and bullet points to make it highly readable. Use LaTeX notation ($...$) for math.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Failed to load deep dive. Please try again.";
}

export async function solveProblem(problemText: string): Promise<string> {
  const prompt = `You are an expert Physics tutor. Help the user solve the following problem step-by-step explicitly following Polya's Problem Solving techniques:
1. Understand the problem (State knowns and unknowns).
2. Devise a plan (Identify the formula/concepts).
3. Carry out the plan (Show the math).
4. Look back (Check the answer conceptually).

Problem:
${problemText}

Use markdown formatting and clearly label the steps. Use LaTeX formatting in your math blocks.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
  });

  return response.text || "Failed to solve problem.";
}

