import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Layers, User, LogOut, Brain } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/documents", label: "Documents", icon: FileText },
    { to: "/flashcards", label: "Flashcards", icon: Layers },
    { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = ({ mobileOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800/70 bg-slate-950/95 p-5 backdrop-blur transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:w-72 lg:rounded-3xl lg:border lg:shadow-2xl lg:shadow-black/20`}>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                        <Brain className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-slate-100">NexusAI</p>
                        <p className="text-sm text-slate-400">Learning copilot</p>
                    </div>
                </div>

                <nav className="mt-8 space-y-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-orange-500/15 text-orange-400" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-8 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-sm font-semibold text-orange-400">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-100">{user?.username}</p>
                            <p className="truncate text-xs text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:text-red-400">
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </button>
                </div>
            </aside>
            {mobileOpen ? <button type="button" aria-label="Close sidebar" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden" /> : null}
        </>
    );
};

export default Sidebar;
