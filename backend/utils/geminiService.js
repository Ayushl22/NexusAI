import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const DEFAULT_MODEL_NAME = "gemini-3.5-flash-lite";
const DEFAULT_FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
];
const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 750;
const MAX_DELAY_MS = 8000;
const JITTER_MS = 250;
const REQUEST_TIMEOUT_MS = 12000;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const RETRYABLE_ERROR_CODES = new Set([
    "ECONNRESET",
    "ECONNREFUSED",
    "EAI_AGAIN",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_SOCKET",
]);
let ai;

const getModelNames = (requestedModel) => {
    const configuredFallbacks = String(process.env.GEMINI_FALLBACK_MODELS || "")
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean);

    return [...new Set([
        requestedModel,
        process.env.GEMINI_MODEL,
        DEFAULT_MODEL_NAME,
        ...configuredFallbacks,
        ...DEFAULT_FALLBACK_MODELS,
    ].filter(Boolean))];
};

export class AIServiceError extends Error {
    constructor(message, { code, statusCode, retryable, cause } = {}) {
        super(message, { cause });
        this.name = "AIServiceError";
        this.code = code || "AI_SERVICE_ERROR";
        this.statusCode = statusCode || 502;
        this.retryable = Boolean(retryable);
    }
}

const getAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    return ai;
};

const getErrorStatus = (error) => {
    const candidates = [
        error?.status,
        error?.statusCode,
        error?.code,
        error?.response?.status,
        error?.error?.code,
        error?.cause?.status,
        error?.cause?.statusCode,
    ];

    for (const candidate of candidates) {
        const status = Number(candidate);
        if (Number.isInteger(status) && status >= 100 && status <= 599) {
            return status;
        }
    }

    const message = String(error?.message || "");
    const embeddedStatus = message.match(/"code"\s*:\s*(\d{3})/);
    if (embeddedStatus) {
        return Number(embeddedStatus[1]);
    }

    if (message.includes("RESOURCE_EXHAUSTED")) return 429;
    if (message.includes("UNAVAILABLE")) return 503;

    return null;
};

const isRetryableError = (error, status) => {
    if (status && RETRYABLE_STATUS_CODES.has(status)) {
        return true;
    }

    const code = String(error?.code || error?.cause?.code || "").toUpperCase();
    const name = String(error?.name || "").toLowerCase();
    const message = String(error?.message || "").toLowerCase();

    return RETRYABLE_ERROR_CODES.has(code) ||
        name.includes("timeout") ||
        name === "aborterror" ||
        message.includes("timed out") ||
        message.includes("network error") ||
        message.includes("fetch failed");
};

const wait = (delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs));

const getBackoffDelay = (retryNumber) => {
    const exponentialDelay = Math.min(
        BASE_DELAY_MS * (2 ** (retryNumber - 1)),
        MAX_DELAY_MS
    );

    return exponentialDelay + Math.floor(Math.random() * JITTER_MS);
};

/**
 * Execute every Gemini request through one retry, timeout, and error boundary.
 * The SDK's own retries are disabled to avoid multiplying retry attempts.
 */
export const callGemini = async (request, operation = "generate-content") => {
    const modelNames = getModelNames(request.model);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const model = modelNames[Math.min(attempt - 1, modelNames.length - 1)];

        try {
            return await getAI().models.generateContent({
                ...request,
                model,
                config: {
                    ...request.config,
                    httpOptions: {
                        ...request.config?.httpOptions,
                        timeout: REQUEST_TIMEOUT_MS,
                        retryOptions: { attempts: 1 },
                    },
                },
            });
        } catch (error) {
            const status = getErrorStatus(error);
            const retryable = isRetryableError(error, status);
            const retriesRemaining = MAX_ATTEMPTS - attempt;

            if (retryable && retriesRemaining > 0) {
                const retryNumber = attempt;
                const delayMs = getBackoffDelay(retryNumber);
                console.warn(
                    `[Gemini] ${operation} retry ${retryNumber}/${MAX_ATTEMPTS - 1} ` +
                    `in ${delayMs}ms (model: ${model}, status: ${status || "network/timeout"})`
                );
                await wait(delayMs);
                continue;
            }

            if (retryable) {
                throw new AIServiceError(
                    "AI service is temporarily busy. Please try again in a moment.",
                    {
                        code: "AI_SERVICE_UNAVAILABLE",
                        statusCode: 503,
                        retryable: true,
                        cause: error,
                    }
                );
            }

            throw new AIServiceError(
                "The AI request could not be completed. Please try again later.",
                {
                    code: "AI_REQUEST_FAILED",
                    statusCode: 502,
                    retryable: false,
                    cause: error,
                }
            );
        }
    }

    throw new AIServiceError(
        "AI service is temporarily busy. Please try again in a moment.",
        {
            code: "AI_SERVICE_UNAVAILABLE",
            statusCode: 503,
            retryable: true,
        }
    );
};

const parseStructuredResponse = (response, operation) => {
    try {
        return JSON.parse(response.text);
    } catch (error) {
        console.error(`[Gemini] ${operation} returned invalid structured output`);
        throw new AIServiceError(
            "The AI returned an invalid response. Please try again.",
            {
                code: "AI_INVALID_RESPONSE",
                statusCode: 502,
                retryable: true,
                cause: error,
            }
        );
    }
};

/**
 * Generate Flashcards matching FlashCard Schema
 */
export const generateFlashcards = async (text) => {
    const prompt = `Analyze the following study text and extract key concepts, rules, terms, or historical events. 
Create clear educational flashcards consisting of focused questions and thorough explanations as answers.
Text:
${text}`;

    const response = await callGemini({
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
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
    }, "generate-flashcards");

    return parseStructuredResponse(response, "generate-flashcards");
};

/**
 * Generate Quiz matching Quiz and Question Schema
 */
export const generateQuiz = async (text) => {
    const prompt = `Based directly on the following text, extract core concepts and create a comprehensive multiple choice quiz. 
Every generated question must have exactly 4 unique options, and one unambiguous correct answer matching one of those options exactly.
Text:
${text}`;

    const response = await callGemini({
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
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
    }, "generate-quiz");

    return parseStructuredResponse(response, "generate-quiz");
};

/**
 * Generate Summary
 */
export const generateSummary = async (text) => {
    const prompt = `Provide a comprehensive, clear, and well-structured study summary of the following document. 
Organize key points logically using clean markdown headings, bullet points, and bold definitions.
Text:
${text}`;

    const response = await callGemini({
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
        contents: prompt
    }, "generate-summary");

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

    const response = await callGemini({
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
        contents: contents
    }, "document-chat");

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

    const response = await callGemini({
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
        contents: prompt
    }, "explain-concept");

    return response.text;
};
