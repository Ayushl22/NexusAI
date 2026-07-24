import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,147,36,0.22),_transparent_30%),linear-gradient(135deg,_#050816_0%,_#0f172a_100%)] px-2 py-2 text-slate-100 md:px-4 lg:px-6 lg:py-4">
            <div className="flex gap-4">
                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
                <div className="flex-1">
                    <Navbar title="NexusAI Workspace" subtitle="AI-powered learning studio" onMenuClick={() => setMobileOpen(true)} />
                    <main className="mt-4 rounded-[28px] border border-slate-800/70 bg-slate-950/35 p-4 shadow-2xl shadow-black/20 backdrop-blur md:p-6 lg:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
