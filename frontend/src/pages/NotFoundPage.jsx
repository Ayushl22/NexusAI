import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

const NotFoundPage = () => (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,147,36,0.15),_transparent_25%),linear-gradient(135deg,_#050816_0%,_#0f172a_100%)] px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-800/70 bg-slate-950/80 p-8 text-center shadow-2xl shadow-black/30">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                <Compass className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-100">Page not found</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">The page you are looking for does not exist or may have moved.</p>
            <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400">
                <Home className="h-4 w-4" />
                Back to dashboard
            </Link>
        </div>
    </div>
);

export default NotFoundPage;
