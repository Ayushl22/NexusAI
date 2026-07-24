import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ label = "Loading...", className = "" }) => (
    <div className={`flex items-center justify-center gap-2 py-8 text-sm text-slate-500 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{label}</span>
    </div>
);

export default Loader;
