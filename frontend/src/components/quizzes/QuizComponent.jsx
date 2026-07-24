import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

const QuizComponent = ({ quiz, answers, onAnswerChange, readOnly = false }) => {
    if (!quiz) return null;

    return (
        <div className="space-y-4">
            {quiz.questions?.map((question, index) => {
                const selected = answers?.[index];
                return (
                    <div key={`${question.question}-${index}`} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-100">{index + 1}. {question.question}</p>
                            {readOnly && selected === question.correctAnswer ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-400" />
                            ) : null}
                        </div>
                        <div className="grid gap-2">
                            {question.options?.map((option) => {
                                const isSelected = selected === option;
                                const isCorrect = readOnly && option === question.correctAnswer;
                                return (
                                    <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${isSelected ? "border-orange-400 bg-orange-500/10 text-orange-300" : isCorrect ? "border-green-500/40 bg-green-500/10 text-green-300" : "border-slate-700 bg-slate-950/70 text-slate-300 hover:border-slate-600"}`}>
                                        {readOnly ? <CheckCircle2 className={`h-4 w-4 ${isCorrect ? "text-green-400" : "text-slate-500"}`} /> : <Circle className={`h-4 w-4 ${isSelected ? "text-orange-400" : "text-slate-500"}`} />}
                                        <input type="radio" name={`question-${index}`} value={option} checked={isSelected} disabled={readOnly} onChange={() => onAnswerChange(index, option)} className="sr-only" />
                                        <span>{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default QuizComponent;
