import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import QuizComponent from "../../components/quizzes/QuizComponent";
import { getQuiz, submitQuiz } from "../../services/quizService";

const QuizTakePage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuiz(quizId);
                setQuiz(response.quiz);
            } catch (error) {
                toast.error("Unable to load quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (index, option) => {
        const next = [...answers];
        next[index] = option;
        setAnswers(next);
    };

    const handleSubmit = async () => {
        try {
            const response = await submitQuiz(quizId, answers, 180);
            navigate(`/quizzes/${quizId}/results`, { state: response });
        } catch (error) {
            toast.error("Failed to submit quiz");
        }
    };

    if (loading) return <Loader label="Loading quiz..." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-100">{quiz?.title || "Quiz"}</h1>
                <p className="mt-1 text-sm text-slate-400">Answer each question and submit your result.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <QuizComponent quiz={quiz} answers={answers} onAnswerChange={handleAnswerChange} />
                <button onClick={handleSubmit} className="mt-6 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400">Submit answers</button>
            </div>
        </div>
    );
};

export default QuizTakePage;
 