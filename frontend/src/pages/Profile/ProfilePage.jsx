import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserCircle2, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const [form, setForm] = useState({ username: "", email: "" });
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

    useEffect(() => {
        if (user) {
            setForm({ username: user.username || "", email: user.email || "" });
        }
    }, [user]);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(form);
            toast.success("Profile updated");
        } catch (error) {
            toast.error("Unable to update profile");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwords.currentPassword, passwords.newPassword);
            toast.success("Password changed");
            setPasswords({ currentPassword: "", newPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Password update failed");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-100">Profile</h1>
                <p className="mt-1 text-sm text-slate-400">Keep your account details and security settings up to date.</p>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/15 p-3 text-orange-400">
                            <UserCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Personal details</h2>
                            <p className="text-sm text-slate-400">Update your public profile information.</p>
                        </div>
                    </div>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-orange-400" placeholder="Username" />
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-orange-400" placeholder="Email" />
                        <button type="submit" className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400">Save profile</button>
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/15 p-3 text-orange-400">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Security</h2>
                            <p className="text-sm text-slate-400">Change your password anytime.</p>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-orange-400" placeholder="Current password" />
                        <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-orange-400" placeholder="New password" />
                        <button type="submit" className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-orange-400/40 hover:text-orange-300">Update password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
