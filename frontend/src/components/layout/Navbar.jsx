import React from "react";
import { Menu, Search, Bell } from "lucide-react";

const Navbar = ({ title, subtitle, onMenuClick }) => (
    <header className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/70 px-4 py-4 shadow-xl shadow-black/20 backdrop-blur sm:px-6">
        <div>
            <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-slate-700 bg-slate-800/70 p-2 text-slate-300 sm:inline-flex">
                <Search className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-800/70 p-2 text-slate-300">
                <Bell className="h-4 w-4" />
            </button>
            <button onClick={onMenuClick} className="rounded-full border border-slate-700 bg-slate-800/70 p-2 text-slate-300 sm:hidden">
                <Menu className="h-4 w-4" />
            </button>
        </div>
    </header>
);

export default Navbar;
