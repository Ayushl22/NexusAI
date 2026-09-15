import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Bot, BrainCircuit, Layers, ListChecks, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ChatInterface from "../../components/common/ChatInterface";
import FlashcardComponent from "../../components/flashcards/FlashcardComponent";
import QuizComponent from "../../components/quizzes/QuizComponent";
import { getDocumentById } from "../../services/documentService";
import { generateFlashcards, generateQuiz, generateSummary, chat, explainConcept, getChatHistory, getAIErrorMessage } from "../../services/aiService";
import { getFlashcards, reviewFlashcard, toggleStarFlashcard } from "../../services/flashcardService";
import { getQuiz, submitQuiz } from "../../services/quizService";

const DocumentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [summary, setSummary] = useState("");
    const [concept, setConcept] = useState("");
    const [conceptResponse, setConceptResponse] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [aiError, setAiError] = useState(null);

    const showAIError = (error, retry) => {
        const message = getAIErrorMessage(error);
        setAiError({ message, retry });
        toast.error(message);
    };

    const fetchDetail = async () => {
        try {
            const response = await getDocumentById(id);
            setDocument(response.document);
            const flashcardResponse = await getFlashcards(id);
            setFlashcards(flashcardResponse.flashcards || []);
            const historyResponse = await getChatHistory(id);
            const history = historyResponse.history || [];
            const normalized = history.map((item) => ({ role: item.role, content: item.content }));
            setChatMessages(normalized);
        } catch (error) {
            toast.error("Unable to load document details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleGenerateSummary = async () => {
        setAiError(null);
        setActionLoading(true);
        try {
            const response = await generateSummary(id);
            setSummary(response.summary || "No summary generated");
            toast.success("Summary generated");
        } catch (error) {
            showAIError(error, handleGenerateSummary);
        } finally {
            setActionLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        setAiError(null);
        setActionLoading(true);
        try {
            const response = await generateFlashcards(id);
            setFlashcards(response.flashcards || []);
            toast.success("Flashcards generated");
        } catch (error) {
            showAIError(error, handleGenerateFlashcards);
        } finally {
            setActionLoading(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setAiError(null);
        setActionLoading(true);
        try {
            const response = await generateQuiz(id);
            setQuiz(response.quiz);
            setAnswers([]);
            setSubmitted(false);
            setResult(null);
            toast.success("Quiz generated");
        } catch (error) {
            showAIError(error, handleGenerateQuiz);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendChat = async (message) => {
        setAiError(null);
        setChatLoading(true);
        try {
            const response = await chat(id, message);
            const history = response.chat?.messages || [];
            setChatMessages(history.map((item) => ({ role: item.role, content: item.content })));
        } catch (error) {
            showAIError(error, () => handleSendChat(message));
        } finally {
            setChatLoading(false);
        }
    };

    const handleExplainConcept = async () => {
        if (!concept.trim()) return;
        setAiError(null);
        setActionLoading(true);
        try {
            const response = await explainConcept(concept, id);
            setConceptResponse(response.explanation || "No explanation available");
            toast.success("Explanation generated");
        } catch (error) {
            showAIError(error, handleExplainConcept);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReview = async (cardId) => {
        try {
            await reviewFlashcard(cardId);
            setFlashcards((prev) => prev.map((card) => card._id === cardId ? { ...card, reviewCount: (card.reviewCount || 0) + 1 } : card));
            toast.success("Flashcard marked as reviewed");
        } catch (error) {
            toast.error("Failed to update flashcard");
        }
    };

    const handleStar = async (cardId) => {
        try {
            const response = await toggleStarFlashcard(cardId);
            setFlashcards((prev) => prev.map((card) => card._id === cardId ? { ...card, starred: response.starred } : card));
        } catch (error) {
            toast.error("Failed to update flashcard");
        }
    };

    const handleAnswerChange = (index, option) => {
        const next = [...answers];
        next[index] = option;
        setAnswers(next);
    };

    const submitCurrentQuiz = async () => {
        if (!quiz) return;
        try {
            const response = await submitQuiz(quiz._id, answers, 120);
            setResult(response);
            setSubmitted(true);
            toast.success("Quiz submitted");
        } catch (error) {
            toast.error("Failed to submit quiz");
        }
    };

    const hasGeneratedContent = useMemo(() => Boolean(summary || flashcards.length || quiz || conceptResponse), [summary, flashcards.length, quiz, conceptResponse]);

    if (loading) return <Loader label="Loading document insights..." />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="rounded-full border border-slate-700 bg-slate-900/70 p-2 text-slate-300">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <p className="text-sm text-orange-400">Document workspace</p>
                    <h1 className="text-2xl font-semibold text-slate-100">{document?.title || "Document"}</h1>
                </div>
            </div>

            {aiError ? (
                <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
                    <span>{aiError.message}</span>
                    <button
                        type="button"
                        onClick={aiError.retry}
                        disabled={actionLoading || chatLoading}
                        className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
                    >
                        Try again
                    </button>
                </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                        <div className="mb-4 flex items-center gap-2 text-orange-400">
                            <BrainCircuit className="h-5 w-5" />
                            <h2 className="text-lg font-semibold text-slate-100">AI study tools</h2>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                            <button onClick={handleGenerateSummary} disabled={actionLoading} className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-orange-400/40 hover:text-orange-300 disabled:opacity-60">
                                Generate summary
                            </button>
                            <button onClick={handleGenerateFlashcards} disabled={actionLoading} className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-orange-400/40 hover:text-orange-300 disabled:opacity-60">
                                Generate flashcards
                            </button>
                            <button onClick={handleGenerateQuiz} disabled={actionLoading} className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-orange-400/40 hover:text-orange-300 disabled:opacity-60">
                                Generate quiz
                            </button>
                        </div>
                    </div>

                    {summary ? (
                        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                            <div className="mb-3 flex items-center gap-2 text-orange-400"><BookOpen className="h-5 w-5" /> <h3 className="text-lg font-semibold text-slate-100">AI summary</h3></div>
                            <p className="text-sm leading-7 text-slate-300">{summary}</p>
                        </div>
                    ) : null}

                    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                        <div className="mb-4 flex items-center gap-2 text-orange-400"><Layers className="h-5 w-5" /> <h3 className="text-lg font-semibold text-slate-100">Flashcards</h3></div>
                        {flashcards.length ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {flashcards.map((card) => <FlashcardComponent key={card._id} flashcard={card} onReview={handleReview} onStar={handleStar} />)}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No flashcards yet. Generate a set from this document.</p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                        <div className="mb-4 flex items-center gap-2 text-orange-400"><ListChecks className="h-5 w-5" /> <h3 className="text-lg font-semibold text-slate-100">Quiz</h3></div>
                        {quiz ? (
                            <div className="space-y-4">
                                <QuizComponent quiz={quiz} answers={answers} onAnswerChange={handleAnswerChange} readOnly={submitted} />
                                {!submitted ? <button onClick={submitCurrentQuiz} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400">Submit quiz</button> : null}
                                {result ? <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">Score: {result.score}/{result.totalQuestions} ({result.percentage}%)</div> : null}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">Generate a quiz to start practicing.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                        <div className="mb-4 flex items-center gap-2 text-orange-400"><Bot className="h-5 w-5" /> <h3 className="text-lg font-semibold text-slate-100">Explain a concept</h3></div>
                        <input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Try: explain neural networks" className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-orange-400" />
                        <button onClick={handleExplainConcept} disabled={actionLoading} className="mt-3 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60">Explain</button>
                        {conceptResponse ? <div className="mt-4 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300">{conceptResponse}</div> : null}
                    </div>

                    <ChatInterface messages={chatMessages} loading={chatLoading} onSend={handleSendChat} />

                    {!hasGeneratedContent ? (
                        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 text-sm text-slate-400 shadow-xl shadow-black/20">
                            <div className="flex items-center gap-2 text-orange-400"><Sparkles className="h-4 w-4" /><span>Start with a summary or quiz to unlock the AI workspace.</span></div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailPage;
