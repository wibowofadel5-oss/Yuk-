
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Level, Subject } from "../types";

export const generateQuizQuestions = async (level: Level, subject: Subject): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Generate 10 challenging and educational multiple choice questions for ${level} students in the subject of ${subject}. 
  Ensure the difficulty level is appropriate for ${level} curriculum in Indonesia.
  Include 4 options for each question.
  Return the output as a JSON array of objects.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 options"
              },
              correctAnswer: { 
                type: Type.INTEGER, 
                description: "Index of the correct answer (0-3)" 
              },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        },
        systemInstruction: "You are an expert educator in Indonesia specializing in school curriculum for SD, SMP, and SMA levels, covering both general and religious subjects like Kemuhammadiyahan, Ke-NU-an, and Fikih."
      }
    });

    const result = JSON.parse(response.text || "[]");
    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
