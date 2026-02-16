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
    CreditCard
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
        <div className="min-h-screen bg-white w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-indigo-50 border border-indigo-100 w-fit rounded-full">
                            <Settings className="h-3 w-3" />
                            Account Settings
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
                            User <span className="text-slate-400 italic">Profile</span>
                        </h1>
                        <p className="text-slate-600 font-medium">Manage your personal information and security settings.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{profileData.firstname} {profileData.lastname}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Verified Member</p>
                        </div>
                        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 text-2xl font-black shadow-sm relative group cursor-pointer overflow-hidden">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover transition-opacity" />
                            ) : (
                                <span className="uppercase">{profileData.firstname?.[0]}{profileData.lastname?.[0]}</span>
                            )}
                            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                </motion.div>

                {message && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert className={cn(
                            "border-none shadow-xl bg-white rounded-2xl p-6",
                            message.type === "success" ? "border-l-4 border-indigo-600" : "border-l-4 border-red-600"
                        )}>
                            {message.type === "success" ? <CheckCircle className="h-6 w-6 text-indigo-600" /> : <AlertCircle className="h-6 w-6 text-red-600" />}
                            <AlertDescription className={cn(
                                "font-black uppercase text-lg ml-3",
                                message.type === "success" ? "text-indigo-600" : "text-red-600"
                            )}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Navigation Sidebar */}
                    <motion.div {...fadeInUp} className="lg:col-span-3">
                        <Card className="border border-slate-200 shadow-sm bg-white sticky top-32 rounded-[2.5rem] overflow-hidden">
                            <CardContent className="p-3">
                                <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                                    {[
                                        { id: "profile", label: "Profile", icon: User },
                                        { id: "password", label: "Security", icon: Lock },
                                        { id: "preferences", label: "Preferences", icon: Settings },
                                        { id: "notifications", label: "Notifications", icon: Bell },
                                        { id: "billing", label: "Billing", icon: CreditCard },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={cn(
                                                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 whitespace-nowrap group",
                                                activeTab === item.id
                                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 font-black"
                                                    : "text-slate-500 hover:bg-white hover:text-indigo-600 font-bold"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", activeTab === item.id ? "text-white" : "text-slate-400")} />
                                            <span className="text-sm uppercase tracking-tighter">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-9 space-y-10">

                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <Card className="border border-slate-200 shadow-xl overflow-hidden bg-white rounded-[3rem]">
                                        <div className="relative">
                                            <div className="h-40 bg-gradient-to-r from-slate-900 to-indigo-900 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                                                {/* Decorative Label */}
                                                <div className="absolute top-8 right-8 text-right hidden md:block">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] leading-none mb-1">Account System</p>
                                                    <p className="text-white/20 font-black text-2xl tracking-tighter opacity-30 italic leading-none uppercase">active_state</p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-16 left-12 p-1.5 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl z-10">
                                                <div className="h-32 w-32 rounded-[2rem] bg-white flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer">
                                                    {user?.profileImage ? (
                                                        <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <User className="h-12 w-12 text-slate-300" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                        <Camera className="text-white h-8 w-8" />
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

                                        <CardHeader className="pt-24 px-10">
                                            <div className="flex justify-between items-center">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Personal <span className="text-slate-400 italic">Information</span></CardTitle>
                                                    <CardDescription className="text-slate-500 font-bold">Update your personal identity details and contact information.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-10 pt-6">
                                            <form onSubmit={handleProfileUpdate} className="space-y-10">

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                                    {[
                                                        { label: "Given Name", key: "firstname", icon: User },
                                                        { label: "Family Name", key: "lastname", icon: User },
                                                        { label: "Primary Email", key: "email", icon: Mail, type: "email" },
                                                        { label: "Phone Number", key: "phone", icon: Phone },
                                                        { label: "Date of Birth", key: "birthdate", icon: Calendar, type: "date" },
                                                        { label: "Residential Address", key: "location", icon: MapPin },
                                                        { label: "City", key: "city", icon: Globe },
                                                        { label: "Zip Code", key: "zipcode", icon: MapPin },
                                                    ].map((field) => (
                                                        <div key={field.key} className="space-y-3">
                                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</Label>
                                                            <div className="relative group">
                                                                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                                <Input
                                                                    type={field.type || "text"}
                                                                    value={(profileData as any)[field.key]}
                                                                    onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                                    className="pl-12 h-14 bg-white border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-indigo-600/10 text-slate-900 font-bold transition-all rounded-2xl shadow-inner placeholder:text-slate-300"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end pt-6">
                                                    <Button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-12 h-14 rounded-2xl shadow-xl shadow-indigo-600/10 transition-all hover:-translate-y-1 active:scale-95 text-lg uppercase tracking-tight"
                                                    >
                                                        {isLoading ? "Saving..." : "Commit Changes"}
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card className="border border-slate-200 shadow-xl overflow-hidden bg-white rounded-[3rem]">
                                        <CardHeader className="bg-white p-12 border-b border-slate-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/[0.03] rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-center text-indigo-600">
                                                    <Lock className="h-8 w-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Security <span className="text-slate-400 italic">Settings</span></CardTitle>
                                                    <CardDescription className="text-slate-500 font-bold">Update your access credentials to safeguard your financial profile.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-12">
                                            <form onSubmit={handlePasswordChange} className="max-w-md space-y-8">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Key</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="h-14 bg-white border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 focus:ring-indigo-600/10 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Sequence</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="h-14 bg-white border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 focus:ring-indigo-600/10 transition-all"
                                                    />
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight ml-1">Complexity Rule: Enhanced cryptographic requirements apply.</p>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Sequence</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="h-14 bg-white border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 focus:ring-indigo-600/10 transition-all"
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-slate-900 hover:bg-black text-white font-black h-16 rounded-2xl shadow-xl shadow-black/10 text-lg uppercase tracking-tight transition-all hover:scale-[1.02]"
                                                >
                                                    {isLoading ? "Updating..." : "Update Credentials"}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {activeTab === "notifications" && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card className="border border-slate-200 shadow-xl overflow-hidden bg-white rounded-[3rem]">
                                        <CardHeader className="bg-white p-12 border-b border-slate-100 relative overflow-hidden">
                                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/[0.03] rounded-full -mr-32 -mb-32 blur-3xl pointer-events-none"></div>
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-center text-indigo-600">
                                                    <Bell className="h-8 w-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Alert <span className="text-slate-400 italic">Protocols</span></CardTitle>
                                                    <CardDescription className="text-slate-500 font-bold">Configure how you receive real-time financial updates.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-12 space-y-6">
                                            {[
                                                { title: "Email Notifications", desc: "Receive automated ledgers and transaction reports.", icon: Mail, enabled: true },
                                                { title: "Security Alerts", desc: "Real-time alerts for system security auditing.", icon: ShieldAlert, enabled: true },
                                                { title: "Financial Forecasts", desc: "Periodic analysis regarding market movements.", icon: Settings, enabled: false },
                                                { title: "Mobile Push", desc: "Direct alerts to your registered devices.", icon: Phone, enabled: true },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 group hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-500">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 border border-slate-200 shadow-sm transition-colors">
                                                            <item.icon className="h-5 w-5" />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-black text-slate-900 text-lg tracking-tight uppercase">{item.title}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "h-8 w-14 rounded-full relative cursor-pointer transition-all duration-500 p-1 flex items-center shadow-inner",
                                                        item.enabled ? "bg-indigo-600" : "bg-slate-200"
                                                    )}>
                                                        <div className={cn(
                                                            "h-6 w-6 rounded-full transition-all duration-500 shadow-md flex items-center justify-center",
                                                            item.enabled ? "translate-x-6 bg-white" : "translate-x-0 bg-white"
                                                        )} />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-8">
                                                <Button className="w-full bg-slate-900 hover:bg-black text-white font-black h-16 rounded-2xl transition-all uppercase tracking-widest text-xs">
                                                    Commit Protocol Config
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Account Security Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border border-slate-200 shadow-xl bg-white overflow-hidden rounded-[2.5rem] group hover:bg-white transition-all">
                                <CardHeader className="pb-4 px-8 pt-8">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <div className="h-8 w-8 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        Verification Audit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-8 pb-8">
                                    <div className="p-6 rounded-3xl bg-white flex items-center justify-between border border-slate-100 relative overflow-hidden">
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-2xl flex items-center justify-center shadow-sm",
                                                user?.bankAccount?.verified ? "bg-indigo-600 text-white" : "bg-yellow-500 text-white"
                                            )}>
                                                {user?.bankAccount?.verified ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                            </div>
                                            <span className="font-black text-slate-900 text-lg uppercase tracking-tighter">Identity State</span>
                                        </div>
                                        <span className={cn(
                                            "relative z-10 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                            user?.bankAccount?.verified
                                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                : "bg-yellow-50 text-yellow-600 border-yellow-100"
                                        )}>
                                            {user?.bankAccount?.verified ? "Verified" : "Pending Audit"}
                                        </span>
                                        {/* Background Trace */}
                                        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-x-10 translate-y-10">
                                            <ShieldCheck className="h-24 w-24 text-indigo-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200 shadow-xl bg-white overflow-hidden rounded-[2.5rem] group hover:bg-white transition-all">
                                <CardHeader className="pb-4 px-8 pt-8">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-slate-400 group-hover:text-red-600 transition-colors">
                                        <div className="h-8 w-8 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 group-hover:scale-110 transition-transform">
                                            <ShieldAlert className="h-4 w-4" />
                                        </div>
                                        Execution Rights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-8 pb-8">
                                    <div className="p-6 rounded-3xl bg-white flex items-center justify-between border border-slate-100 relative overflow-hidden">
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-2xl flex items-center justify-center shadow-sm",
                                                user?.bankAccount?.canTransfer ? "bg-indigo-600 text-white" : "bg-red-600 text-white"
                                            )}>
                                                {user?.bankAccount?.canTransfer ? <CheckCircle className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                                            </div>
                                            <span className="font-black text-slate-900 text-lg uppercase tracking-tighter">Transfer Rights</span>
                                        </div>
                                        <span className={cn(
                                            "relative z-10 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                            user?.bankAccount?.canTransfer
                                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                : "bg-red-50 text-red-600 border-red-100"
                                        )}>
                                            {user?.bankAccount?.canTransfer ? "Authorized" : "Restricted"}
                                        </span>
                                        {/* Background Trace */}
                                        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-x-10 translate-y-10">
                                            <ShieldAlert className="h-24 w-24 text-red-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
