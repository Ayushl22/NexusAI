import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Sparkles } from "lucide-react";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getAllFlashcards } from "../../services/flashcardService";

const FlashcardListPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await getAllFlashcards();
                setFlashcards(response.flashcards || []);
            } finally {
                setLoading(false);
            }
        };
        fetchFlashcards();
    }, []);

    if (loading) return <Loader label="Loading flashcards..." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-100">Flashcards</h1>
                <p className="mt-1 text-sm text-slate-400">Review your AI-generated flashcards and keep learning moving.</p>
            </div>

            {flashcards.length === 0 ? (
                <EmptyState title="No flashcards yet" description="Generate flashcards from a document to begin spaced repetition." action={<Link to="/documents" className="mt-4 inline-flex rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400">Open documents</Link>} />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {flashcards.map((card) => (
                        <div key={card._id} className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-orange-400">
                                    <Layers className="h-4 w-4" />
                                    <span className="text-sm font-semibold">{card.documentId?.title || "Document"}</span>
                                </div>
                                {card.starred ? <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-semibold text-yellow-400">Starred</span> : null}
                            </div>
                            <p className="text-sm font-medium text-slate-100">{card.question}</p>
                            <p className="mt-3 text-sm text-slate-400">{card.answer}</p>
                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>{card.reviewCount || 0} reviews</span>
                                <span>{card.difficulty || "medium"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardListPage;
