import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

const UploadArea = ({ onUpload, uploading }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Choose a PDF or document first");
            return;
        }
        await onUpload(file, title);
        setTitle("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row">
                <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-6 text-center transition hover:border-orange-400/60">
                    <UploadCloud className="mb-2 h-7 w-7 text-orange-400" />
                    <span className="text-sm font-medium text-slate-200">{file ? file.name : "Drop a PDF or document here"}</span>
                    <span className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX, or TXT</span>
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
                <div className="flex flex-1 flex-col gap-3">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title (optional)" className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-orange-400" />
                    <button type="submit" disabled={uploading} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60">
                        {uploading ? "Uploading..." : "Upload & process"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default UploadArea;
