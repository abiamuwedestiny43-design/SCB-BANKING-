// app/dashboard/settings/SettingsClient.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle,
    AlertCircle,
    User,
    Lock,
    Camera,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    ShieldAlert,
    Calendar,
    Globe,
    Settings,
    Bell,
    CreditCard,
    ArrowRight,
    Activity,
    Smartphone,
    Zap
} from "lucide-react"
import type { IUser } from "@/models/User"
import { cn } from "@/lib/utils"

interface SettingsPageProps {
    user: IUser
}

export default function SettingsClient({ user }: SettingsPageProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("profile")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: "success" | "error"
        text: string
    } | null>(null)

    // profile state
    const [profileData, setProfileData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        birthdate: "",
        gender: "",
        religion: "",
        location: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
    })

    // hydrate profile
    useEffect(() => {
        if (user) {
            setProfileData({
                firstname: user?.bankInfo?.bio?.firstname || "",
                lastname: user?.bankInfo?.bio?.lastname || "",
                email: user?.email || "",
                phone: user?.bankInfo?.bio?.phone || "",
                birthdate: (() => {
                    if (!user?.bankInfo?.bio?.birthdate) return ""
                    const d = new Date(user.bankInfo.bio.birthdate)
                    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0]
                })(),
                gender: user?.bankInfo?.bio?.gender || "",
                religion: user?.bankInfo?.bio?.religion || "",
                location: user?.bankInfo?.address?.location || "",
                city: user?.bankInfo?.address?.city || "",
                state: user?.bankInfo?.address?.state || "",
                country: user?.bankInfo?.address?.country || "",
                zipcode: user?.bankInfo?.address?.zipcode || "",
            })
        }
    }, [user])

    // password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const changedFields: any = {}
        Object.entries(profileData).forEach(([key, value]) => {
            if (value) changedFields[key] = value
        })

        if (Object.keys(changedFields).length === 0) {
            setMessage({ type: "error", text: "Please fill in at least one field" })
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(changedFields),
            })
            const data = await res.json()
            if (res.ok) {
                setMessage({ type: "success", text: "Profile updated successfully!" })
                router.refresh()
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update profile" })
            }
        } catch {
            setMessage({ type: "error", text: "An error occurred while updating profile" })
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" })
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch("/api/user/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setMessage({ type: "success", text: "Password changed successfully!" })
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
            } else {
                setMessage({ type: "error", text: data.error || "Failed to change password" })
            }
        } catch {
            setMessage({ type: "error", text: "An error occurred while changing password" })
        } finally {
            setIsLoading(false)
        }
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    return (
        <div className="min-h-screen bg-slate-50/20 w-full p-6 md:p-12 pt-24 md:pt-32 relative overflow-hidden selection:bg-orange-500/20">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Industrial Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                            <Settings className="w-3.5 h-3.5 text-orange-500 animate-spin-slow" /> IDENTITY ARCHITECTURE
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                            USER <span className="text-orange-600 italic">GATEWAY</span>
                        </h1>
                        <p className="text-slate-500 font-bold max-w-lg text-base">Modulate identity parameters, encryption sequences, and global security protocols.</p>
                    </div>

                    <div className="p-6 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl glass flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Account Sync</p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-sm font-black text-slate-900 uppercase">System Linked</p>
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200"></div>
                        <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-orange-600 shadow-sm overflow-hidden relative group">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                                <span className="font-black text-xl uppercase italic">{profileData.firstname?.[0]}{profileData.lastname?.[0]}</span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert className={cn(
                            "border-none shadow-2xl rounded-[2.5rem] p-8 glass animate-in slide-in-from-top-4 duration-500",
                            message.type === "success" ? "bg-emerald-50/50 text-emerald-700" : "bg-red-50/50 text-red-700"
                        )}>
                            <div className="flex items-center gap-4">
                                {message.type === "success" ? (
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-6 w-6" /></div>
                                ) : (
                                    <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center"><AlertCircle className="h-6 w-6" /></div>
                                )}
                                <AlertDescription className="font-black uppercase tracking-[0.1em] text-sm">
                                    <span className="opacity-50 mr-2">PROTOCOL STATUS:</span> {message.text}
                                </AlertDescription>
                            </div>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Industrial Sidebar Nav */}
                    <motion.div {...fadeInUp} className="lg:col-span-3">
                        <Card className="border-none bg-white/50 backdrop-blur-2xl shadow-2xl rounded-[3rem] overflow-hidden glass p-4 space-y-2">
                            <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 mt-2">Matrix Hub</p>
                            {[
                                { id: "profile", label: "Identity Node", icon: User },
                                { id: "password", label: "Security Keys", icon: Lock },
                                { id: "notifications", label: "Alert Matrix", icon: Bell },
                                { id: "preferences", label: "Logic Flow", icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-6 py-5 rounded-[1.8rem] transition-all duration-500 group relative overflow-hidden",
                                        activeTab === item.id
                                            ? "bg-slate-900 text-white shadow-2xl font-black"
                                            : "text-slate-500 hover:bg-white hover:text-orange-600 font-bold"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 transition-all duration-500", activeTab === item.id ? "text-orange-500 scale-110" : "text-slate-400 group-hover:text-orange-500")} />
                                    <span className="text-xs uppercase tracking-[0.15em]">{item.label}</span>
                                    {activeTab === item.id && (
                                        <motion.div layoutId="nav-glow" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]"></motion.div>
                                    )}
                                </button>
                            ))}
                        </Card>

                        {/* Node Health Card */}
                        <Card className="mt-8 border-none bg-slate-900 text-white rounded-[3rem] p-8 glass-dark overflow-hidden relative group">
                            <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all duration-700"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-orange-600/20 flex items-center justify-center text-orange-500"><ShieldCheck className="w-4 h-4" /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Node Integrity</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-black tracking-tighter uppercase italic">98.4<span className="text-white/30">%</span></h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global trust score</p>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-600 w-[98.4%] rounded-full shadow-[0_0_10px_#f97316]"></div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Content Matrix Area */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-9 space-y-12">

                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden glass border-t-8 border-t-orange-600">
                                        <div className="relative h-48 bg-slate-900 overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-950/50 to-slate-900"></div>
                                            <div className="absolute top-10 right-10 text-right opacity-20">
                                                <p className="text-[12px] font-black text-white uppercase tracking-[0.5em]">IDENTITY_CORE</p>
                                                <p className="text-2xl md:text-4xl font-black text-white italic tracking-tighter leading-none mt-2">ACTIVE_STATE</p>
                                            </div>

                                            <div className="absolute -bottom-16 left-16 p-2 rounded-[3rem] bg-white border border-slate-100 shadow-2xl z-10 glass">
                                                <div className="h-36 w-36 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer">
                                                    {user?.profileImage ? (
                                                        <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <User className="h-16 w-16 text-slate-300" />
                                                    )}
                                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center backdrop-blur-md">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Camera className="text-orange-500 h-8 w-8" />
                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Update</span>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        accept="image/*"
                                                        title="Upload Profile Picture"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) {
                                                                const formData = new FormData()
                                                                formData.append("file", file)
                                                                const res = await fetch("/api/user/profile-image", { method: "POST", body: formData })
                                                                if (res.ok) {
                                                                    setMessage({ type: "success", text: "Identity credentials synchronized." })
                                                                    router.refresh()
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <CardHeader className="pt-24 md:pt-28 px-8 md:px-16">
                                            <div className="space-y-2">
                                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Identity <span className="text-orange-600">Parameters</span></h3>
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Configure subject identity metadata and contact clearance nodes.</p>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="px-8 md:px-16 pb-12 md:pb-16 pt-8">
                                            <form onSubmit={handleProfileUpdate} className="space-y-12">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                                    {[
                                                        { label: "Given Name", key: "firstname", icon: User },
                                                        { label: "Family Name", key: "lastname", icon: User },
                                                        { label: "Primary Email", key: "email", icon: Mail, type: "email" },
                                                        { label: "Phone Node", key: "phone", icon: Phone },
                                                        { label: "Life Cycle Hub (Birth)", key: "birthdate", icon: Calendar, type: "date" },
                                                        { label: "Residential Node", key: "location", icon: MapPin },
                                                        { label: "Geo Hub (City)", key: "city", icon: Globe },
                                                        { label: "Zip Clearance", key: "zipcode", icon: MapPin },
                                                    ].map((field) => (
                                                        <div key={field.key} className="space-y-4">
                                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                                <div className="h-1 w-4 bg-orange-600/20 rounded-full"></div>
                                                                {field.label}
                                                            </Label>
                                                            <div className="relative group">
                                                                <field.icon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-600 transition-all group-focus-within:scale-110" />
                                                                <Input
                                                                    type={field.type || "text"}
                                                                    value={(profileData as any)[field.key]}
                                                                    onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                                    className="pl-16 h-16 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-black focus:bg-white focus:border-orange-600 focus:ring-orange-600/5 transition-all shadow-inner text-sm tracking-tight"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end pt-8">
                                                    <Button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="bg-slate-900 hover:bg-orange-600 text-white font-black px-16 h-18 rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.3em] group"
                                                    >
                                                        {isLoading ? "Executing..." : (
                                                            <>
                                                                Commit Logic Trace <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {activeTab === "password" && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden glass border-t-8 border-t-slate-900">
                                        <CardHeader className="p-8 md:p-16 border-b border-slate-50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/[0.03] rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
                                            <div className="flex items-center gap-8 relative z-10">
                                                <div className="h-20 w-20 bg-slate-900 rounded-[2rem] shadow-2xl flex items-center justify-center text-orange-500">
                                                    <Lock className="h-10 w-10 animate-pulse" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Security <span className="text-orange-600">Sequences</span></h3>
                                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Update cryptographic access keys to protect your financial ledger.</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 md:p-16">
                                            <form onSubmit={handlePasswordChange} className="max-w-xl space-y-10">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Current Protocol Key</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="h-16 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-black focus:border-orange-600 transition-all text-lg"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">New Cryptographic Sequence</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="h-16 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-black focus:border-orange-600 transition-all text-lg"
                                                    />
                                                    <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                                                        <ShieldCheck className="h-4 w-4 text-orange-600" />
                                                        <p className="text-[9px] text-orange-700 font-black uppercase tracking-tight">Security Rule: High-entropy string required for node access.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Confirm Sequence Sync</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="h-16 bg-slate-50 border-slate-100 rounded-[1.5rem] text-slate-900 font-black focus:border-orange-600 transition-all text-lg"
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black h-20 rounded-[2rem] shadow-2xl text-xs uppercase tracking-[0.4em] transition-all hover:scale-[1.03] active:scale-95"
                                                >
                                                    {isLoading ? "Synchronizing..." : "Execute Sequence Update"}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {activeTab === "notifications" && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden glass border-t-8 border-t-blue-600">
                                        <CardHeader className="p-8 md:p-16 border-b border-slate-50 relative overflow-hidden">
                                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/[0.03] rounded-full -mr-32 -mb-32 blur-[80px] pointer-events-none"></div>
                                            <div className="flex items-center gap-8 relative z-10">
                                                <div className="h-20 w-20 bg-blue-50 rounded-[2rem] shadow-xl flex items-center justify-center text-blue-600 border border-blue-100">
                                                    <Bell className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Alert <span className="text-blue-600">Matrix</span></h3>
                                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Configure real-time telemetry protocols for your account activity.</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 md:p-16 space-y-8">
                                            {[
                                                { title: "Protocol Ledgers (Email)", desc: "Receive automated ledger exports and logic reports.", icon: Mail, enabled: true, color: "orange" },
                                                { title: "Security Breach Alerts", desc: "Instant telemetry for unauthorized access attempts.", icon: ShieldAlert, enabled: true, color: "red" },
                                                { title: "Market Volatility Signal", desc: "Analysis for currency exchange and asset shifts.", icon: Activity, enabled: false, color: "blue" },
                                                { title: "Device Sync (Push)", desc: "Direct logic pings to your authorized handheld nodes.", icon: Smartphone, enabled: true, color: "emerald" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                                    <div className="flex items-center gap-6">
                                                        <div className={cn(
                                                            "h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                                                            item.enabled ? `text-${item.color}-600` : "text-slate-300"
                                                        )}>
                                                            <item.icon className="h-6 w-6" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-black text-slate-900 text-xl tracking-tight uppercase italic">{item.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "h-10 w-18 rounded-full relative cursor-pointer transition-all duration-500 p-1.5 flex items-center shadow-inner",
                                                        item.enabled ? "bg-slate-900" : "bg-slate-200"
                                                    )}>
                                                        <div className={cn(
                                                            "h-7 w-7 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center",
                                                            item.enabled ? "translate-x-8 bg-orange-500" : "translate-x-0 bg-white"
                                                        )}>
                                                            {item.enabled && <Zap className="h-3 w-3 text-white fill-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-10">
                                                <Button className="w-full bg-slate-900 hover:bg-black text-white font-black h-20 rounded-[2rem] shadow-2xl text-xs uppercase tracking-[0.4em] transition-all hover:scale-[1.02]">
                                                    Commit Matrix Configuration
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Secondary System Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card className="border-none bg-white shadow-2xl rounded-[3.5rem] p-10 relative overflow-hidden glass group">
                                <div className="absolute -right-8 -top-8 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"><ShieldCheck className="w-5 h-5" /></div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Clearance</p>
                                        </div>
                                        <Badge className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl",
                                            user?.bankAccount?.verified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
                                        )}>
                                            {user?.bankAccount?.verified ? "Authorized" : "Pending Audit"}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Verification <span className="text-slate-400">State</span></h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Identity verification level for advanced asset movement.</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none bg-white shadow-2xl rounded-[3.5rem] p-10 relative overflow-hidden glass group">
                                <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600"><ShieldAlert className="w-5 h-5" /></div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Migration Rights</p>
                                        </div>
                                        <Badge className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl",
                                            user?.bankAccount?.canTransfer ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-red-50 text-red-600 border-red-100"
                                        )}>
                                            {user?.bankAccount?.canTransfer ? "Full Access" : "Restricted"}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Transfer <span className="text-slate-400">Gate</span></h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Permission level for intra-node and external asset migration.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="hidden">
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .animate-spin-slow {
                            animation: spin 8s linear infinite;
                        }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    ` }} />
            </div>
        </div>
    )
}
