import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini client using your environment configurations
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-3.1-flash-lite";

/**
 * Generate Flashcards matching FlashCard Schema
 */
export const generateFlashcards = async (text) => {
    const prompt = `Analyze the following study text and extract key concepts, rules, terms, or historical events. 
Create clear educational flashcards consisting of focused questions and thorough explanations as answers.
Text:
${text}`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        answer: { type: Type.STRING },
                        // Matches your exact Mongoose Schema enum values
                        difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
                    },
                    required: ["question", "answer", "difficulty"]
                }
            }
        }
    });

    return JSON.parse(response.text);
};

/**
 * Generate Quiz matching Quiz and Question Schema
 */
export const generateQuiz = async (text) => {
    const prompt = `Based directly on the following text, extract core concepts and create a comprehensive multiple choice quiz. 
Every generated question must have exactly 4 unique options, and one unambiguous correct answer matching one of those options exactly.
Text:
${text}`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                // Strictly enforces your validator array rule of 4 options
                                options: { 
                                    type: Type.ARRAY, 
                                    items: { type: Type.STRING }
                                },
                                correctAnswer: { type: Type.STRING },
                                explanation: { type: Type.STRING }
                            },
                            required: ["question", "options", "correctAnswer", "explanation"]
                        }
                    }
                },
                required: ["questions"]
            }
        }
    });

    return JSON.parse(response.text);
};

/**
 * Generate Summary
 */
export const generateSummary = async (text) => {
    const prompt = `Provide a comprehensive, clear, and well-structured study summary of the following document. 
Organize key points logically using clean markdown headings, bullet points, and bold definitions.
Text:
${text}`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });

    return response.text;
};

/**
 * Chat with Document matching ChatHistory Model
 */
export const chatWithDocument = async (message, context, chatHistoryInstance) => {
    const contents = [];

    // Map your ChatHistory message subdocuments into Gemini api's structure
    // Mongoose schema roles: "user" | "assistant" -> Gemini API roles: "user" | "model"
    if (chatHistoryInstance && chatHistoryInstance.messages) {
        chatHistoryInstance.messages.forEach(msg => {
            contents.push({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            });
        });
    }

    // Append our system instructions context instructions combined with user input
    const systemAndQueryPrompt = `You are a dedicated AI Learning Assistant. Answer the user's question accurately using ONLY the provided text context extracted from their document. 
If the answer cannot be confidently derived from the context, rely gracefully on your general academic knowledge, but clearly state that the information was not present in their document.

Context Reference:
${context}

User Question: ${message}`;

    contents.push({ role: "user", parts: [{ text: systemAndQueryPrompt }] });

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: contents
    });

    return response.text;
};

/**
 * Explain Concept
 */
export const explainConcept = async (concept, context) => {
    let prompt = `Act as an expert academic tutor. Explain the following concept clearly, breaking down complex terms into simple, intuitive analogies:\n\nConcept: "${concept}"`;

    if (context) {
        prompt += `\n\nTo align your explanations perfectly with their school/course work framework, prioritize context elements from this source text snippet:\n${context}`;
    }

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });

    return response.text;
};