// app/dashboard/DashboardClient.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight,
    ArrowDownLeft,
    Eye,
    EyeOff,
    ChevronRight,
    Plus,
    Wallet,
    CreditCard,
    Zap,
    Activity,
    Bell,
    Users,
    ShieldCheck,
    ArrowRight,
    ArrowRightLeft,
    History,
    Landmark,
    CheckCircle2,
    Clock,
    TrendingUp,
    MoreHorizontal,
    FileText as Receipt
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import CardComponent from "@/components/cards/CardComponent"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface DashboardClientProps {
    user: any
    balance: number
    currency: string
    firstName: string
    bankNumber: string
    recentTransfers: any[]
    recentTransactions: any[]
    activeCards: any[]
    loansSection?: React.ReactNode
}

export default function DashboardClient({
    user,
    balance,
    currency,
    firstName,
    bankNumber,
    recentTransfers,
    activeCards,
    loansSection
}: DashboardClientProps) {

    const [balanceVisible, setBalanceVisible] = useState(true)
    const { data: notificationData, mutate } = useSWR("/api/user/notifications", fetcher)
    const notifications = notificationData?.notifications || []
    const unreadCount = notifications.filter((n: any) => !n.viewed).length

    const handleMarkAsRead = async () => {
        if (unreadCount > 0) {
            try {
                await fetch("/api/user/notifications", { method: "PATCH" })
                mutate()
            } catch (error) {
                console.error("Failed to mark notifications as read", error)
            }
        }
    }

    const fadeIn = {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    }

    return (
        <div className="min-h-screen bg-[#F4F6FA] w-full relative">
            {/* Top Header Bar */}
            <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/20">
                            <Wallet className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <span className="text-base md:text-xl font-black text-black tracking-tighter italic">SCB <span className="text-black">Bank</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu onOpenChange={(open) => open && handleMarkAsRead()}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl relative text-black hover:text-black hover:bg-slate-50 transition-all">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-black rounded-full border-2 border-white" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-96 p-2 rounded-2xl shadow-2xl border border-slate-100 bg-white text-black overflow-hidden mt-2">
                                <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                    <span className="font-bold text-sm text-black uppercase tracking-widest">Notifications</span>
                                    {unreadCount > 0 && <span className="bg-black text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{unreadCount} New</span>}
                                </DropdownMenuLabel>
                                <div className="max-h-80 overflow-y-auto mt-1 custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 text-center text-black text-sm font-bold uppercase tracking-widest">No active alerts</div>
                                    ) : (
                                        notifications.slice(0, 5).map((n: any) => (
                                            <DropdownMenuItem key={n._id} asChild className="p-0 focus:bg-transparent">
                                                <Link href={n.redirect || "/dashboard/notifications"} className="px-4 py-4 flex items-start gap-4 rounded-xl transition-all hover:bg-slate-50 group mb-1 mx-1">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                        n.message.toLowerCase().includes("debited") ? "bg-red-50 text-black border border-red-100" : "bg-slate-50 text-black border border-slate-100"
                                                    )}>
                                                        {n.viewed ? <CheckCircle2 className="h-4 w-4 opacity-50" /> : <Clock className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold text-black line-clamp-2 leading-tight">{n.message}</p>
                                                        <p className="text-[11px] font-black text-black uppercase tracking-wider mt-1.5 opacity-60">
                                                            {new Date(n.period).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                <DropdownMenuItem asChild className="focus:bg-transparent p-0">
                                    <Link href="/dashboard/notifications" className="w-full py-3 text-center text-xs font-black text-black hover:bg-slate-50 rounded-xl transition-colors block uppercase tracking-[0.2em] italic">
                                        View All Notifications
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 md:h-12 md:w-12 rounded-xl text-black hover:text-black hover:bg-slate-100 transition-all">
                            <Link href="/dashboard/settings">
                                <Activity className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-black flex items-center justify-center text-white text-sm md:text-base font-black shadow-lg shadow-black/10 ml-1">
                            {firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">

                {/* Welcome Row */}
                <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Welcome Back,</p>
                        <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">{firstName}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm border",
                            user.bankAccount?.verified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        )}>
                            <span className={cn("h-2 w-2 rounded-full shadow-[0_0_8px]", user.bankAccount?.verified ? "bg-black shadow-black/50" : "bg-black shadow-black/50")} />
                            {user.bankAccount?.verified ? "Identity Verified" : "Awaiting Verification"}
                        </span>
                    </div>
                </motion.div>

                {/* Global Asset Matrix (Main Balance) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                    {/* Asset Card (Matching user-provided mobile design) */}
                    <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="lg:col-span-2">
                        <div className="rounded-[2.5rem] bg-[#1E568F] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl border border-white/10 group">
                            {/* Animated Wavy Background patterns */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                                    <motion.path
                                        animate={{ d: ["M0 80 Q 100 40, 200 80 T 400 80", "M0 100 Q 100 60, 200 100 T 400 100", "M0 80 Q 100 40, 200 80 T 400 80"] }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                        d="M0 80 Q 100 40, 200 80 T 400 80" stroke="white" fill="none" strokeWidth="1"
                                    />
                                    <motion.path
                                        animate={{ d: ["M0 120 Q 100 80, 200 120 T 400 120", "M0 140 Q 100 100, 200 140 T 400 140", "M0 120 Q 100 80, 200 120 T 400 120"] }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        d="M0 120 Q 100 80, 200 120 T 400 120" stroke="white" fill="none" strokeWidth="1"
                                    />
                                </svg>
                            </div>

                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/10 transition-all duration-1000" />

                            <div className="relative z-10 space-y-8 md:space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                                            <Wallet className="h-5 w-5 md:h-7 md:w-7 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs md:text-sm font-black italic tracking-widest opacity-80">VISA</span>
                                                <span className="h-1 rounded-full bg-white/40"></span>
                                                <p className="text-[10px] md:text-xs font-black text-white/50 uppercase tracking-[0.3em]">Savings</p>
                                            </div>
                                            <p className="text-xs md:text-sm font-bold font-mono text-white/80 tracking-widest mt-0.5">{bankNumber.match(/.{1,4}/g)?.join(' ')}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setBalanceVisible(!balanceVisible)} className="h-10 w-10 md:h-12 md:w-12 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all">
                                        {balanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] md:text-xs text-white/40 font-black uppercase tracking-[0.4em]">Available Balance</p>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-4xl md:text-7xl font-black tracking-tighter italic">
                                            {balanceVisible ? formatCurrency(balance, currency) : "••••••••"}
                                        </p>
                                        <span className="text-lg md:text-xl font-black text-white/60 uppercase italic">{currency}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-6 md:pt-10 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                                        <span className="text-xs md:text-sm text-white/60 font-black uppercase tracking-widest italic">Cardholder:</span>
                                        <span className="text-xs md:text-sm text-white font-black uppercase tracking-widest italic">{firstName}</span>
                                    </div>
                                    <div className="hidden md:block w-px h-6 bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_8px]", user.bankAccount?.canTransfer ? "bg-emerald-400 shadow-emerald-400/50" : "bg-red-400 shadow-red-400/50")} />
                                        <span className="text-xs md:text-sm text-white/60 font-black uppercase tracking-widest italic">{user.bankAccount?.canTransfer ? "Active" : "Restricted"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Telemetry Column */}
                    <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-slate-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Credit Score</p>
                                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-black" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-black tracking-tighter">98.4<span className="text-lg font-bold text-slate-300 ml-1">%</span></p>
                                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-black rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" style={{ width: "98.4%" }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Account Status</p>
                                    <ShieldCheck className={cn("h-4 w-4 md:h-5 md:w-5", user.bankAccount?.verified ? "text-black" : "text-black")} />
                                </div>
                                <p className="text-lg md:text-xl font-black text-black uppercase italic tracking-tight">{user.bankAccount?.verified ? "Verified" : "Pending Verification"}</p>
                                <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-widest mt-1 opacity-70">Access: {user.bankAccount?.canTransfer ? "Full Access" : "Restricted"}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Settlement Portal (Action Buttons) */}
                <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                    <Button asChild size="lg" className="bg-black hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-black/10 border-none text-sm md:text-base px-8 h-12 md:h-16 gap-3 transition-all hover:-translate-y-1 uppercase tracking-widest italic group">
                        <Link href="/dashboard/transfer">
                            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Transfer Money
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white text-black font-black rounded-2xl shadow-sm md:text-base px-6 md:px-8 h-12 md:h-16 gap-3 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest italic">
                        <Link href="/dashboard/transactions">
                            <History className="h-5 w-5 md:h-6 md:w-6" />
                            Transaction History
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white text-black font-black rounded-2xl shadow-sm md:text-base px-6 md:px-8 h-12 md:h-16 gap-3 border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest italic hidden sm:flex">
                        <Link href="/dashboard/loans">
                            <Landmark className="h-5 w-5 md:h-6 md:w-6" />
                            Loans & Credit
                        </Link>
                    </Button>
                </motion.div>

                {/* Data Matrix Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Cards & History */}
                    <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-8">

                        {/* Card Assets */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-black border border-slate-100 shadow-sm">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">My <span className="text-black">Cards</span></h2>
                                </div>
                                <Button variant="ghost" asChild className="h-10 px-4 text-black font-black text-xs md:text-sm hover:bg-slate-50 rounded-xl uppercase tracking-widest transition-all">
                                    <Link href="/dashboard/card" className="flex items-center gap-2">
                                        Manage Cards <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="p-6 md:p-8">
                                {activeCards.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                        {activeCards.slice(0, 2).map((card: any, i: number) => (
                                            <motion.div key={card._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.1) }} className="hover:scale-[1.03] transition-transform duration-500 group">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-black rounded-[2rem] opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
                                                    <CardComponent card={card} showDetails={true} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center text-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner">
                                            <Plus className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-black uppercase tracking-tight">No Active Cards</h3>
                                            <p className="text-sm text-black font-bold mt-1">Add a digital or physical card to start making payments.</p>
                                        </div>
                                        <Button asChild size="lg" className="bg-black hover:bg-black text-white text-xs md:text-sm font-black rounded-xl h-12 px-8 transition-all uppercase tracking-widest">
                                            <Link href="/dashboard/card/apply">Add New Card</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Ledger Entries */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-black border border-blue-100 shadow-sm">
                                        <History className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">Recent <span className="text-black">Activity</span></h2>
                                </div>
                                <Button variant="ghost" asChild className="h-10 px-4 text-blue-600 font-black text-xs md:text-sm hover:bg-blue-50 rounded-xl uppercase tracking-widest transition-all">
                                    <Link href="/dashboard/transactions" className="flex items-center gap-2">
                                        View History <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {recentTransfers.length === 0 ? (
                                    <div className="py-16 text-center text-sm font-bold text-black uppercase tracking-[0.2em] italic">No transaction history found</div>
                                ) : (
                                    recentTransfers.slice(0, 5).map((transfer: any) => (
                                        <div key={transfer._id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/80 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                                    transfer.txType === "credit" ? "bg-emerald-50 text-black border border-emerald-100" : "bg-slate-50 text-black border border-slate-100"
                                                )}>
                                                    {transfer.txType === "credit"
                                                        ? <ArrowDownLeft className="h-5 w-5 md:h-6 md:w-6" />
                                                        : <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-sm md:text-base font-black text-black uppercase tracking-tight">
                                                        {transfer.txType === "credit" ? "Funds Received" : "Funds Sent"}
                                                    </p>
                                                    <p className="text-[11px] md:text-xs text-black font-bold uppercase tracking-widest mt-1 opacity-60">
                                                        {new Date(transfer.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · REF: {transfer.txRef?.slice(0, 8).toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={cn("text-base md:text-xl font-black italic", transfer.txType === "credit" ? "text-emerald-600" : "text-black")}>
                                                {transfer.txType === "credit" ? "+" : "−"}{formatCurrency(transfer.amount, transfer.currency || currency)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Core Services Portal */}
                    <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-black border border-emerald-100 shadow-sm">
                                    <Zap className="h-4 w-4" />
                                </div>
                                <h2 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">Quick <span className="text-black">Actions</span></h2>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { href: "/dashboard/transfer", label: "Transfer Money", sub: "Send funds globally", icon: ArrowUpRight, iconBg: "bg-slate-50", iconColor: "text-black" },
                                    { href: "/dashboard/transactions", label: "Transaction History", sub: "Review your activity", icon: History, iconBg: "bg-blue-50", iconColor: "text-black" },
                                    { href: "/dashboard/loans", label: "Loans & Credit", sub: "Borrowing services", icon: Landmark, iconBg: "bg-purple-50", iconColor: "text-black" },
                                    { href: "/dashboard/beneficiaries", label: "Saved Beneficiaries", sub: "Manage recipients", icon: Users, iconBg: "bg-emerald-50", iconColor: "text-black" },
                                    { href: "/dashboard/card", label: "Card Settings", sub: "Manage your cards", icon: CreditCard, iconBg: "bg-slate-50", iconColor: "text-black" },
                                ].map((action, i) => (
                                    <Link key={i} href={action.href} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 transition-all group">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", action.iconBg, action.iconColor)}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm md:text-base font-black text-black group-hover:text-black transition-colors uppercase tracking-tight">{action.label}</p>
                                            <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-widest mt-0.5 opacity-60">{action.sub}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-400 transition-all translate-x-0 group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* My Favourites (Matching user image) */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-black border border-orange-100 shadow-sm">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">My <span className="text-black">Favourites</span></h2>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-black/20 hover:text-black hover:bg-slate-50">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {[
                                        { name: 'Bernice', alias: 'berni_clise' },
                                        { name: 'Maxine', alias: 'max.stone' },
                                        { name: 'Anna', alias: 'gladelina' },
                                        { name: 'Franci', alias: 'makro' }
                                    ].map((fav, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 group shrink-0">
                                            <div className="h-14 w-14 rounded-full bg-slate-100 ring-2 ring-slate-50 group-hover:ring-orange-400/30 transition-all overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/150?u=${fav.name}`} alt={fav.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-black uppercase tracking-tighter">{fav.name}</p>
                                                <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">{fav.alias}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="flex flex-col items-center gap-2 shrink-0 group">
                                        <div className="h-14 w-14 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-black group-hover:text-black transition-all">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <p className="text-[10px] font-black text-black/30 uppercase tracking-tighter group-hover:text-black">Add New</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Overview */}
                        <div className="bg-black rounded-[2.5rem] shadow-2xl p-8 text-white space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-black/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-6">Account Overview</h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center group/item cursor-default">
                                    <span className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest">Account Number</span>
                                    <span className="text-xs md:text-sm font-mono font-bold text-white group-hover/item:text-orange-400 transition-colors">{bankNumber.match(/.{1,4}/g)?.join(' ')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest">Account Type</span>
                                    <span className="text-xs md:text-sm font-black text-black uppercase italic">User</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest">Verification Status</span>
                                    <span className={cn("text-xs md:text-sm font-black uppercase tracking-widest italic", user.bankAccount?.verified ? "text-emerald-400" : "text-yellow-400")}>
                                        {user.bankAccount?.verified ? "Verified" : "Pending Verification"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest">Transfer Status</span>
                                    <span className={cn("text-xs md:text-sm font-black uppercase tracking-widest italic", user.bankAccount?.canTransfer ? "text-emerald-400" : "text-red-400")}>
                                        {user.bankAccount?.canTransfer ? "Active" : "Restricted"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
            `}} />
        </div>
    )
}
