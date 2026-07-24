import React, { useState } from "react";
import { RotateCcw, Star, CheckCircle2 } from "lucide-react";

const FlashcardComponent = ({ flashcard, onReview, onStar }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-xl shadow-black/10">
            <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-orange-400">
                    {flashcard.difficulty || "medium"}
                </span>
                <button onClick={() => onStar(flashcard._id)} className={`rounded-full p-2 transition ${flashcard.starred ? "bg-yellow-500/15 text-yellow-400" : "bg-slate-800/70 text-slate-400 hover:text-yellow-400"}`}>
                    <Star className="h-4 w-4" />
                </button>
            </div>

            <div className="flex min-h-45 items-center justify-center rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 text-center">
                <p className="text-sm text-slate-200">{flipped ? flashcard.answer : flashcard.question}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <button onClick={() => setFlipped((prev) => !prev)} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-orange-400/40 hover:text-orange-300">
                    <RotateCcw className="h-4 w-4" />
                    {flipped ? "Show question" : "Show answer"}
                </button>
                <button onClick={() => onReview(flashcard._id)} className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Mark reviewed
                </button>
            </div>
        </div>
    );
};

export default FlashcardComponent;
