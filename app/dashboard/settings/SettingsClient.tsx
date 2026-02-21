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
        <div className="min-h-screen bg-[#F4F6FA] w-full p-4 md:p-8 pt-20 lg:pt-10">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Account Settings</h1>
                        <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">Manage your profile & security</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100 w-fit">
                        <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 overflow-hidden shrink-0">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span className="font-bold text-base">{profileData.firstname?.[0]?.toUpperCase()}{profileData.lastname?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">{profileData.firstname} {profileData.lastname}</p>
                            <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Current Status: Active
                            </p>
                        </div>
                    </div>
                </motion.div>

                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert className={cn(
                            "border-none shadow-xl rounded-3xl p-6 md:p-8 bg-white",
                            message.type === "success" ? "text-emerald-700" : "text-red-700"
                        )}>
                            <div className="flex items-center gap-5">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                                    message.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                                )}>
                                    {message.type === "success" ? <CheckCircle className="h-7 w-7" /> : <AlertCircle className="h-7 w-7" />}
                                </div>
                                <AlertDescription className="font-bold uppercase tracking-wider text-base md:text-lg">
                                    <span className="opacity-40 mr-2 font-black italic">SYSTEM:</span> {message.text}
                                </AlertDescription>
                            </div>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Nav Tabs */}
                    <motion.div {...fadeInUp} className="lg:col-span-3 space-y-4">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-3 space-y-1">
                            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 mt-2">Section Menu</p>
                            {[
                                { id: "profile", label: "Personal Details", icon: User },
                                { id: "password", label: "Password & Security", icon: Lock },
                                { id: "notifications", label: "Alerts & Notifications", icon: Bell },
                                { id: "preferences", label: "General Settings", icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm md:text-base font-bold group",
                                        activeTab === item.id
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", activeTab === item.id ? "text-orange-400" : "text-slate-400 group-hover:text-slate-600")} />
                                    <span>{item.label}</span>
                                    {activeTab === item.id && <div className="ml-auto h-2 w-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50" />}
                                </button>
                            ))}
                        </div>

                        {/* Account Security Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Security Score</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">98.4<span className="text-lg font-bold text-slate-300 ml-1">%</span></p>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]" style={{ width: "98.4%" }} />
                                </div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest pt-1">Account standing: High</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-9 space-y-6">

                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="relative h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden p-6">
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent"></div>

                                            <div className="relative z-10 flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Account <span className="text-orange-500">Profile</span></h2>
                                                    <p className="text-[10px] md:text-xs text-white/50 font-bold uppercase tracking-widest">Account Number: {user.bankNumber}</p>
                                                </div>
                                            </div>

                                            <div className="absolute -bottom-6 left-8 h-20 w-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative group/avatar cursor-pointer bg-white">
                                                {user?.profileImage ? (
                                                    <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-300">
                                                        <User className="h-10 w-10" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center">
                                                    <Camera className="text-white h-5 w-5" />
                                                </div>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    title="Update Profile Picture"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const formData = new FormData()
                                                            formData.append("file", file)
                                                            const res = await fetch("/api/user/profile-image", { method: "POST", body: formData })
                                                            if (res.ok) {
                                                                setMessage({ type: "success", text: "Profile image updated." })
                                                                router.refresh()
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="px-8 pt-12 pb-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                                <div>
                                                    <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight italic">Personal <span className="text-orange-600">Information</span></h3>
                                                    <p className="text-sm md:text-base text-slate-400 font-bold mt-1 uppercase tracking-widest opacity-60">Update your primary account details for your profile.</p>
                                                </div>
                                            </div>

                                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {[
                                                        { label: "First Name", key: "firstname", icon: User },
                                                        { label: "Last Name", key: "lastname", icon: User },
                                                        { label: "Email Address", key: "email", icon: Mail, type: "email" },
                                                        { label: "Phone Number", key: "phone", icon: Phone },
                                                        { label: "Date of Birth", key: "birthdate", icon: Calendar, type: "date" },
                                                        { label: "Home Address", key: "location", icon: MapPin },
                                                        { label: "City", key: "city", icon: Globe },
                                                        { label: "Zip Code", key: "zipcode", icon: MapPin },
                                                    ].map((field) => (
                                                        <div key={field.key} className="space-y-2">
                                                            <Label className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest">{field.label}</Label>
                                                            <div className="relative group">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                                                    <field.icon className="h-full w-full" />
                                                                </div>
                                                                <Input
                                                                    type={field.type || "text"}
                                                                    value={(profileData as any)[field.key]}
                                                                    onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                                    className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="bg-slate-900 hover:bg-orange-600 text-white rounded-2xl text-sm md:text-base font-black border-none h-14 px-10 shadow-lg shadow-slate-900/10 transition-all uppercase tracking-widest"
                                                    >
                                                        {isLoading ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "password" && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="flex items-center gap-5 p-8 border-b border-slate-50 bg-slate-50/50">
                                            <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl shadow-slate-900/20">
                                                <Lock className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight italic">Security <span className="text-orange-600">Settings Matrix</span></h3>
                                                <p className="text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest opacity-60">Manage your account password and security keys.</p>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <form onSubmit={handlePasswordChange} className="max-w-xl space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest">Active Access Key</Label>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter current password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl text-sm md:text-base font-bold focus:border-orange-400 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest">New Protocol Key</Label>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter new strong password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl text-sm md:text-base font-bold focus:border-orange-400 transition-all"
                                                    />
                                                    <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 rounded-2xl border border-orange-100 mt-2">
                                                        <ShieldCheck className="h-5 w-5 text-orange-500" />
                                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-tighter">Requirement: Minimum 12 characters, complex symbols.</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest">Confirm Sequence</Label>
                                                    <Input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl text-sm md:text-base font-bold focus:border-orange-400 transition-all"
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-2xl text-sm md:text-base font-black border-none h-14 shadow-xl transition-all uppercase tracking-widest"
                                                >
                                                    {isLoading ? "Updating..." : "Update Password"}
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "notifications" && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-8">
                                            <div className="h-16 w-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-900 border border-slate-100 shrink-0">
                                                <Bell className="h-8 w-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Account <span className="text-orange-600">Alert Protocols</span></h3>
                                                <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">How would you like to receive account notifications?</p>
                                            </div>
                                        </div>
                                        <div className="p-8 md:p-12 space-y-6">
                                            {[
                                                { title: "Account Activity", desc: "Automated statement exports and balance reports.", icon: Mail, enabled: true, color: "orange" },
                                                { title: "Security Alerts", desc: "Instant alerts for unauthorized access attempts.", icon: ShieldAlert, enabled: true, color: "red" },
                                                { title: "Market Updates", desc: "Analysis for currency and asset volatility.", icon: Activity, enabled: false, color: "blue" },
                                                { title: "Push Notification", desc: "Direct pings to your authorized mobile devices.", icon: Smartphone, enabled: true, color: "emerald" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-center gap-6">
                                                        <div className={cn(
                                                            "h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm",
                                                            item.enabled ? "text-slate-900" : "text-slate-300"
                                                        )}>
                                                            <item.icon className="h-6 w-6" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight">{item.title}</p>
                                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "h-8 w-14 rounded-full relative cursor-pointer transition-all duration-300 p-1 flex items-center",
                                                        item.enabled ? "bg-slate-900" : "bg-slate-200"
                                                    )}>
                                                        <div className={cn(
                                                            "h-6 w-6 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                                                            item.enabled ? "translate-x-6 bg-orange-500" : "translate-x-0 bg-white"
                                                        )}>
                                                            {item.enabled && <Zap className="h-3 w-3 text-white fill-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-6">
                                                <Button className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black h-16 rounded-2xl shadow-xl text-sm md:text-base uppercase tracking-widest transition-all italic">
                                                    Save Notification Settings
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Secondary System Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none bg-white shadow-sm border border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100"><ShieldCheck className="w-5 h-5" /></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Status</p>
                                        </div>
                                        <Badge className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                                            user?.bankAccount?.verified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
                                        )}>
                                            {user?.bankAccount?.verified ? "Authorized" : "Pending Audit"}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Identity <span className="text-slate-400">Status</span></h4>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Verification of your identity for secure banking.</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none bg-white shadow-sm border border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100"><ShieldAlert className="w-5 h-5" /></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Channel Access</p>
                                        </div>
                                        <Badge className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                                            user?.bankAccount?.canTransfer ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-red-50 text-red-600 border-red-100"
                                        )}>
                                            {user?.bankAccount?.canTransfer ? "Active" : "Locked"}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Transfer <span className="text-slate-400">Status</span></h4>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Your current permission level for sending funds.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
