/**
 * Split text into chunks for embeddings and AI processing
 *
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    // Clean text while preserving paragraph structure
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .trim();

    // Try to split by paragraphs (single or double newlines)
    const paragraphs = cleanedText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = '';
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If single paragraph exceeds chunk size, split it by words
        if (paragraphWordCount > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.trim(),
                    chunkIndex: chunkIndex++,
                    pageNumber: 1
                });

                currentChunk = '';
                currentWordCount = 0;
            }

            for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
                const chunkWords = paragraphWords.slice(
                    i,
                    i + chunkSize
                );

                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 1
                });
            }

            continue;
        }

        // Add paragraph if it fits
        if (currentWordCount + paragraphWordCount <= chunkSize) {
            currentChunk +=
                (currentChunk ? '\n\n' : '') + paragraph;

            currentWordCount += paragraphWordCount;
        } else {
            // Save current chunk
            chunks.push({
                content: currentChunk.trim(),
                chunkIndex: chunkIndex++,
                pageNumber: 1
            });

            // Create overlap from previous chunk
            const overlapWords = currentChunk
                .split(/\s+/)
                .slice(-overlap)
                .join(' ');

            currentChunk =
                overlapWords +
                '\n\n' +
                paragraph;

            currentWordCount =
                overlapWords.split(/\s+/).length +
                paragraphWordCount;
        }
    }

    // Push remaining chunk
    if (currentChunk.trim().length > 0) {
        chunks.push({
            content: currentChunk.trim(),
            chunkIndex: chunkIndex++,
            pageNumber: 1
        });
    }

    return chunks;
};