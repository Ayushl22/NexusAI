import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";

const QuizResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state;

    if (!result) {
        return (
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-8 text-center text-slate-400 shadow-xl shadow-black/20">
                No quiz result available.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-8 text-center shadow-xl shadow-black/20">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                    <Trophy className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-100">Quiz complete</h1>
                <p className="mt-2 text-sm text-slate-400">You scored {result.percentage}%</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                        <p className="text-sm text-slate-400">Correct</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{result.score}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                        <p className="text-sm text-slate-400">Total</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{result.totalQuestions}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                        <p className="text-sm text-slate-400">Accuracy</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-100">{result.percentage}%</p>
                    </div>
                </div>
                <button onClick={() => navigate("/dashboard")} className="mt-6 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400">Return to dashboard</button>
            </div>
        </div>
    );
};

export default QuizResultPage;
