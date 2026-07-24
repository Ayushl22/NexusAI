import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import FlashcardComponent from "../../components/flashcards/FlashcardComponent";
import { getFlashcards, reviewFlashcard, toggleStarFlashcard } from "../../services/flashcardService";

const FlashcardPage = () => {
    const { id } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [documentTitle, setDocumentTitle] = useState("");

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await getFlashcards(id);
                setFlashcards(response.flashcards || []);
                setDocumentTitle(response.document?.title || "Document");
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, [id]);

    const handleReview = async (cardId) => {
        try {
            await reviewFlashcard(cardId);
            setFlashcards((prev) => prev.map((card) => card._id === cardId ? { ...card, reviewCount: (card.reviewCount || 0) + 1 } : card));
        } catch (error) {
            console.error(error);
        }
    };

    const handleStar = async (cardId) => {
        try {
            const response = await toggleStarFlashcard(cardId);
            setFlashcards((prev) => prev.map((card) => card._id === cardId ? { ...card, starred: response.starred } : card));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <Loader label="Loading flashcards..." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-100">{documentTitle}</h1>
                <p className="mt-1 text-sm text-slate-400">Review all cards generated from this document.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {flashcards.map((card) => <FlashcardComponent key={card._id} flashcard={card} onReview={handleReview} onStar={handleStar} />)}
            </div>
        </div>
    );
};

export default FlashcardPage;
