import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {string|Buffer|Uint8Array} source - PDF path or in-memory content
 * @returns {Promise<{text: string, numPages: number}>}
 */
export const extractTextFromPDF = async (source) => {
    try {
        const dataBuffer = typeof source === "string"
            ? await fs.readFile(source)
            : source;

        if (!dataBuffer) {
            throw new Error("No PDF data was provided");
        }

        // pdf-parse expects a Uint8Array, not a Buffer
        const parser = new PDFParse(new Uint8Array(dataBuffer));

        const data = await parser.getText();

        const result = {
            text: data.text,
            numPages: data.numpages,
            info: data.info,
        };

        await parser.destroy();
        return result;

    } catch (error) {
        console.error("PDF parsing error:", error);

        throw new Error(
            `Failed to extract text from PDF: ${error.message}`
        );
    }
};
