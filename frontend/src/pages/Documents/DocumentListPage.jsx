import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Upload,
    Trash2,
    Layers,
    ClipboardList,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    getDocuments,
    uploadDocument,
    deleteDocument,
} from "../../services/documentService";

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentListPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState("");
    const fileRef = useRef(null);

    const fetchDocuments = async () => {
        try {
            const response = await getDocuments();
            setDocuments(response.documents || []);
        } catch (error) {
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) {
            toast.error("Please select a file");
            return;
        }

        setUploading(true);
        try {
            await uploadDocument(file, title || undefined);
            toast.success("Document uploaded successfully");
            setTitle("");
            if (fileRef.current) fileRef.current.value = "";
            await fetchDocuments();
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Upload failed"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this document and all related data?")) return;

        try {
            await deleteDocument(id);
            toast.success("Document deleted");
            setDocuments((prev) => prev.filter((d) => d._id !== id));
        } catch (error) {
            toast.error("Failed to delete document");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-500 mt-1">
                    Upload study materials and generate AI-powered learning tools
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Upload Document
                </h2>
                <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Document title (optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium"
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-60"
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading documents...</div>
            ) : documents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc._id}
                            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <Link
                                            to={`/documents/${doc._id}`}
                                            className="font-semibold text-gray-900 hover:text-primary transition line-clamp-1"
                                        >
                                            {doc.title}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatFileSize(doc.fileSize)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                <span className={`px-2 py-0.5 rounded-full ${
                                    doc.status === "processed"
                                        ? "bg-green-50 text-green-600"
                                        : doc.status === "failed"
                                            ? "bg-red-50 text-red-600"
                                            : "bg-yellow-50 text-yellow-600"
                                }`}>
                                    {doc.status}
                                </span>
                                {doc.pageCount > 0 && (
                                    <span>{doc.pageCount} pages</span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to={`/documents/${doc._id}/flashcards`}
                                    className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition"
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    {doc.flashcardCount || 0} cards
                                </Link>
                                <Link
                                    to={`/documents/${doc._id}`}
                                    className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
                                >
                                    <ClipboardList className="w-3.5 h-3.5" />
                                    {doc.quizCount || 0} quizzes
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentListPage;
