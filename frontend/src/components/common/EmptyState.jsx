import React from "react";
import { Sparkles } from "lucide-react";

const EmptyState = ({ title, description, action }) => (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-8 text-center shadow-xl shadow-black/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
            <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
        {action}
    </div>
);

export default EmptyState;
