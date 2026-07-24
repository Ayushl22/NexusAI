import React, { useEffect, useRef, useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";

const ChatInterface = ({ messages = [], loading, onSend, placeholder = "Ask about this document..." }) => {
    const [draft, setDraft] = useState("");
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!draft.trim()) return;
        onSend(draft.trim());
        setDraft("");
    };

    return (
        <div className="flex h-105 flex-col overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60 shadow-xl shadow-black/20">
            <div className="border-b border-slate-800/70 bg-slate-950/60 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    AI chat
                </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.length === 0 && !loading ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-400">
                        Ask the AI to explain any part of the document.
                    </div>
                ) : null}
                {messages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm ${message.role === "user" ? "bg-orange-500/90 text-white" : "border border-slate-700 bg-slate-950/70 text-slate-200"}`}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {loading ? (
                    <div className="flex justify-start">
                        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-400">Thinking...</div>
                    </div>
                ) : null}
                <div ref={endRef} />
            </div>
            <form onSubmit={handleSubmit} className="border-t border-slate-800/70 bg-slate-950/60 p-3">
                <div className="flex gap-2">
                    <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-orange-400" />
                    <button type="submit" className="rounded-xl bg-orange-500 p-2.5 text-white transition hover:bg-orange-400">
                        <SendHorizonal className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
