import fs from "fs/promises";

let PDFParseClass;

const loadPDFParser = async () => {
    if (!PDFParseClass) {
        const canvas = await import("@napi-rs/canvas");

        // pdfjs-dist expects these browser geometry globals in Node. Loading
        // them explicitly also makes Vercel include the native canvas package.
        globalThis.DOMMatrix ??= canvas.DOMMatrix;
        globalThis.ImageData ??= canvas.ImageData;
        globalThis.Path2D ??= canvas.Path2D;

        ({ PDFParse: PDFParseClass } = await import("pdf-parse"));
    }

    return PDFParseClass;
};

/**
 * Extract text from PDF file
 * @param {string|Buffer|Uint8Array} source - PDF path or in-memory content
 * @returns {Promise<{text: string, numPages: number}>}
 */
export const extractTextFromPDF = async (source) => {
    let parser;

    try {
        const dataBuffer = typeof source === "string"
            ? await fs.readFile(source)
            : source;

        if (!dataBuffer) {
            throw new Error("No PDF data was provided");
        }

        // pdf-parse expects a Uint8Array, not a Buffer
        const PDFParse = await loadPDFParser();
        parser = new PDFParse(new Uint8Array(dataBuffer));

        const data = await parser.getText();

        const result = {
            text: data.text,
            numPages: data.numpages,
            info: data.info,
        };

        return result;

    } catch (error) {
        console.error("PDF parsing error:", error);

        throw new Error(
            `Failed to extract text from PDF: ${error.message}`
        );
    } finally {
        await parser?.destroy();
    }
};
