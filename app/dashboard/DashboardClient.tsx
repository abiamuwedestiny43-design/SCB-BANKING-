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
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                            <Wallet className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <span className="text-base md:text-xl font-black text-slate-900 tracking-tighter italic">Danamon <span className="text-orange-600">Bank</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu onOpenChange={(open) => open && handleMarkAsRead()}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl relative text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-all">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-white" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-96 p-2 rounded-2xl shadow-2xl border border-slate-100 bg-white text-slate-900 overflow-hidden mt-2">
                                <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                    <span className="font-bold text-sm text-slate-800 uppercase tracking-widest">Notifications</span>
                                    {unreadCount > 0 && <span className="bg-orange-600 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{unreadCount} New</span>}
                                </DropdownMenuLabel>
                                <div className="max-h-80 overflow-y-auto mt-1 custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">No active alerts</div>
                                    ) : (
                                        notifications.slice(0, 5).map((n: any) => (
                                            <DropdownMenuItem key={n._id} asChild className="p-0 focus:bg-transparent">
                                                <Link href={n.redirect || "/dashboard/notifications"} className="px-4 py-4 flex items-start gap-4 rounded-xl transition-all hover:bg-slate-50 group mb-1 mx-1">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                        n.message.toLowerCase().includes("debited") ? "bg-red-50 text-red-500 border border-red-100" : "bg-orange-50 text-orange-500 border border-orange-100"
                                                    )}>
                                                        {n.viewed ? <CheckCircle2 className="h-4 w-4 opacity-50" /> : <Clock className="h-4 w-4" />}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">{n.message}</p>
                                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mt-1.5 opacity-60">
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
                                    <Link href="/dashboard/notifications" className="w-full py-3 text-center text-xs font-black text-orange-600 hover:bg-orange-50 rounded-xl transition-colors block uppercase tracking-[0.2em] italic">
                                        View All Notifications
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 md:h-12 md:w-12 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
                            <Link href="/dashboard/settings">
                                <Activity className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm md:text-base font-black shadow-lg shadow-slate-900/10 ml-1">
                            {firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">

                {/* Welcome Row */}
                <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest opacity-60">Welcome Back,</p>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">{firstName}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm border",
                            user.bankAccount?.verified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        )}>
                            <span className={cn("h-2 w-2 rounded-full shadow-[0_0_8px]", user.bankAccount?.verified ? "bg-emerald-500 shadow-emerald-500/50" : "bg-yellow-500 shadow-yellow-500/50")} />
                            {user.bankAccount?.verified ? "Identity Verified" : "Awaiting Verification"}
                        </span>
                    </div>
                </motion.div>

                {/* Global Asset Matrix (Main Balance) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                    {/* Asset Card */}
                    <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="lg:col-span-2">
                        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-orange-600/20 transition-all duration-1000" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                            <div className="relative z-10 space-y-8 md:space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-2xl shadow-orange-600/40">
                                            <Wallet className="h-5 w-5 md:h-7 md:w-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] md:text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-1">Savings Account</p>
                                            <p className="text-xs md:text-sm font-bold font-mono text-white/80 tracking-widest">{bankNumber.match(/.{1,4}/g)?.join(' ')}</p>
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
                                        <span className="text-lg md:text-xl font-black text-orange-500 opacity-80 uppercase italic">{currency}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-6 md:pt-10 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                                        <span className="text-xs md:text-sm text-white/60 font-black uppercase tracking-widest italic">Premium Member</span>
                                    </div>
                                    <div className="hidden md:block w-px h-6 bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_8px]", user.bankAccount?.canTransfer ? "bg-emerald-400 shadow-emerald-400/50" : "bg-red-400 shadow-red-400/50")} />
                                        <span className="text-xs md:text-sm text-white/60 font-black uppercase tracking-widest italic">{user.bankAccount?.canTransfer ? "Active Account" : "Restricted Account"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Telemetry Column */}
                    <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Credit Score</p>
                                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">98.4<span className="text-lg font-bold text-slate-300 ml-1">%</span></p>
                                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" style={{ width: "98.4%" }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                                    <ShieldCheck className={cn("h-4 w-4 md:h-5 md:w-5", user.bankAccount?.verified ? "text-emerald-500" : "text-yellow-500")} />
                                </div>
                                <p className="text-lg md:text-xl font-black text-slate-900 uppercase italic tracking-tight">{user.bankAccount?.verified ? "Verified" : "Pending Verification"}</p>
                                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70">Access: {user.bankAccount?.canTransfer ? "Full Access" : "Restricted"}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Settlement Portal (Action Buttons) */}
                <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                    <Button asChild size="lg" className="bg-slate-900 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 border-none text-sm md:text-base px-8 h-12 md:h-16 gap-3 transition-all hover:-translate-y-1 uppercase tracking-widest italic group">
                        <Link href="/dashboard/transfer">
                            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Transfer Money
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white text-slate-700 font-black rounded-2xl shadow-sm md:text-base px-6 md:px-8 h-12 md:h-16 gap-3 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest italic">
                        <Link href="/dashboard/transactions">
                            <History className="h-5 w-5 md:h-6 md:w-6" />
                            Transaction History
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white text-slate-700 font-black rounded-2xl shadow-sm md:text-base px-6 md:px-8 h-12 md:h-16 gap-3 border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest italic hidden sm:flex">
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
                                    <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight italic">My <span className="text-orange-500">Cards</span></h2>
                                </div>
                                <Button variant="ghost" asChild className="h-10 px-4 text-orange-600 font-black text-xs md:text-sm hover:bg-orange-50 rounded-xl uppercase tracking-widest transition-all">
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
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-[2rem] opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
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
                                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">No Active Cards</h3>
                                            <p className="text-sm text-slate-400 font-bold mt-1">Add a digital or physical card to start making payments.</p>
                                        </div>
                                        <Button asChild size="lg" className="bg-slate-900 hover:bg-orange-600 text-white text-xs md:text-sm font-black rounded-xl h-12 px-8 transition-all uppercase tracking-widest">
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
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                                        <History className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight italic">Recent <span className="text-blue-500">Activity</span></h2>
                                </div>
                                <Button variant="ghost" asChild className="h-10 px-4 text-blue-600 font-black text-xs md:text-sm hover:bg-blue-50 rounded-xl uppercase tracking-widest transition-all">
                                    <Link href="/dashboard/transactions" className="flex items-center gap-2">
                                        View History <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {recentTransfers.length === 0 ? (
                                    <div className="py-16 text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">No transaction history found</div>
                                ) : (
                                    recentTransfers.slice(0, 5).map((transfer: any) => (
                                        <div key={transfer._id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/80 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                                    transfer.txType === "credit" ? "bg-emerald-50 text-emerald-500 border border-emerald-100" : "bg-orange-50 text-orange-500 border border-orange-100"
                                                )}>
                                                    {transfer.txType === "credit"
                                                        ? <ArrowDownLeft className="h-5 w-5 md:h-6 md:w-6" />
                                                        : <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight">
                                                        {transfer.txType === "credit" ? "Funds Received" : "Funds Sent"}
                                                    </p>
                                                    <p className="text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">
                                                        {new Date(transfer.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · REF: {transfer.txRef?.slice(0, 8).toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={cn("text-base md:text-xl font-black italic", transfer.txType === "credit" ? "text-emerald-600" : "text-slate-900")}>
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
                                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm">
                                    <Zap className="h-4 w-4" />
                                </div>
                                <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight italic">Quick <span className="text-emerald-500">Actions</span></h2>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { href: "/dashboard/transfer", label: "Transfer Money", sub: "Send funds globally", icon: ArrowUpRight, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
                                    { href: "/dashboard/transactions", label: "Transaction History", sub: "Review your activity", icon: History, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
                                    { href: "/dashboard/loans", label: "Loans & Credit", sub: "Borrowing services", icon: Landmark, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
                                    { href: "/dashboard/beneficiaries", label: "Saved Beneficiaries", sub: "Manage recipients", icon: Users, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
                                    { href: "/dashboard/card", label: "Card Settings", sub: "Manage your cards", icon: CreditCard, iconBg: "bg-slate-50", iconColor: "text-slate-500" },
                                ].map((action, i) => (
                                    <Link key={i} href={action.href} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 transition-all group">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", action.iconBg, action.iconColor)}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm md:text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{action.label}</p>
                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5 opacity-60">{action.sub}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-400 transition-all translate-x-0 group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Account Overview */}
                        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-white space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-6">Account Overview</h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center group/item cursor-default">
                                    <span className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest">Account Number</span>
                                    <span className="text-xs md:text-sm font-mono font-bold text-white group-hover/item:text-orange-400 transition-colors">{bankNumber.match(/.{1,4}/g)?.join(' ')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest">Account Type</span>
                                    <span className="text-xs md:text-sm font-black text-orange-500 uppercase italic">User</span>
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
