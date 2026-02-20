// app/dashboard/DashboardClient.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight,
    ArrowDownLeft,
    Eye,
    ChevronRight,
    Plus,
    Wallet,
    CreditCard,
    Zap,
    Activity,
    Bell,
    Users,
    ShieldCheck,
    ShieldAlert,
    ArrowRight,
    ArrowRightLeft,
    History,
    Landmark,
    CheckCircle2,
    Clock,
    FileText as Receipt
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import CardComponent from "@/components/cards/CardComponent"
import { cn } from "@/lib/utils"
import useSWR from "swr"
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

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    return (
        <div className="min-h-screen bg-slate-950 w-full p-6 md:p-12 pt-24 md:pt-32 relative overflow-hidden selection:bg-orange-500/20">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Industrial Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/5">
                            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> SECURE NODE SESSION
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                            HELLO, <span className="text-orange-600 italic">{firstName}</span>
                        </h1>
                        <p className="text-slate-400 font-bold max-w-lg text-base">Your financial ecosystem synchronized via Sovereign protocols.</p>
                    </div>

                    <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-xl glass-dark flex items-center gap-6">
                        <DropdownMenu onOpenChange={(open) => open && handleMarkAsRead()}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-slate-900 border border-white/10 text-white shadow-sm relative hover:bg-slate-800 transition-all group">
                                    <Bell className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-3 right-3 h-3 w-3 bg-orange-600 border-2 border-slate-900 rounded-full"></span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-96 p-4 rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl text-white overflow-hidden">
                                <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                                    <span className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Telemetry Stream</span>
                                    {unreadCount > 0 && <span className="bg-orange-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tight">{unreadCount} Alerts</span>}
                                </DropdownMenuLabel>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar mt-2">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                            Signal Trace Zero.
                                        </div>
                                    ) : (
                                        notifications.slice(0, 5).map((n: any) => (
                                            <DropdownMenuItem key={n._id} asChild className="p-0 focus:bg-transparent">
                                                <Link href={n.redirect || "/dashboard/notifications"} className="p-4 flex items-start gap-4 rounded-2xl transition-all hover:bg-white/5 group mb-1">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/10 bg-slate-900 group-hover:scale-110 transition-transform",
                                                        n.message.toLowerCase().includes("debited") ? "text-red-600" : "text-orange-600"
                                                    )}>
                                                        {n.viewed ? <CheckCircle2 className="h-6 w-6 opacity-30" /> : <Clock className="h-6 w-6" />}
                                                    </div>
                                                    <div className="space-y-1.5 overflow-hidden">
                                                        <p className="text-xs font-black text-white line-clamp-2 leading-relaxed uppercase tracking-tight">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                                                            PST_TRACE: {new Date(n.period).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                                <DropdownMenuItem asChild className="focus:bg-transparent p-0 mt-2">
                                    <Link
                                        href="/dashboard/notifications"
                                        className="w-full py-4 text-center text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] hover:bg-orange-50 rounded-2xl transition-colors"
                                    >
                                        Full Matrix Log
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-10 w-[1px] bg-slate-200"></div>

                        <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl bg-slate-900 border border-white/10 text-white shadow-sm hover:bg-slate-800 transition-all">
                            <Link href="/dashboard/settings">
                                <Activity className="h-6 w-6" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Economic Interface Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Primary Ledger Card */}
                    <motion.div {...fadeInUp} className="lg:col-span-8 group">
                        <Card className="h-full border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative rounded-[4rem] group glass-dark">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div className="absolute -top-24 -right-24 h-96 w-96 bg-orange-600/10 rounded-full blur-[100px] group-hover:bg-orange-600/20 transition-all duration-700"></div>

                            <CardHeader className="relative z-10 p-8 md:p-16">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                                            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">Ledger Balance</p>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">
                                            {formatCurrency(balance, currency)}
                                        </h2>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-16 w-16 text-white/20 hover:text-white hover:bg-white/5 bg-white/5 border border-white/5 rounded-2xl transition-all">
                                        <Eye className="h-7 w-7" />
                                    </Button>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-8 border-t border-white/10 pt-10">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Registry Node</p>
                                        <p className="text-xl font-mono font-black text-white group-hover:text-orange-500 transition-colors uppercase tracking-widest">{bankNumber.match(/.{1,4}/g)?.join(' ')}</p>
                                    </div>
                                    <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Verification Level</p>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                            <span className="text-sm font-black uppercase tracking-tight">Sovereign Master</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="px-8 md:px-16 pb-12 md:pb-16 relative z-10">
                                <div className="flex flex-wrap gap-6">
                                    <Button asChild className="bg-orange-600 hover:bg-orange-500 text-white font-black px-12 h-20 rounded-[2rem] shadow-[0_0_50px_rgba(234,88,12,0.3)] transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.3em] group/btn border-none">
                                        <Link href="/dashboard/transfer" className="flex items-center gap-4">
                                            Execute Migration <ArrowUpRight className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-black px-12 h-20 rounded-[2rem] backdrop-blur-xl transition-all text-xs uppercase tracking-[0.3em]">
                                        <Link href="/dashboard/transactions" className="flex items-center gap-4">
                                            Matrix History <History className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Secondary Analytics Pulse */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-4 space-y-8">
                        <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 relative overflow-hidden glass group h-full">
                            <div className="absolute -right-8 -top-8 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="space-y-10 relative z-10 h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform"><Activity className="w-7 h-7" /></div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Node Score</p>
                                            <p className="text-xl font-black text-slate-900">98.4<span className="text-slate-300">%</span></p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Identity <span className="text-slate-400 italic">Parameters</span></h3>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-600 w-[98.4%] rounded-full shadow-[0_0_10px_#f97316]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between group/status">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                            <p className="text-base font-black text-slate-900 uppercase tracking-tight italic">{user.bankAccount?.verified ? "Verified" : "Pending"}</p>
                                        </div>
                                        <ShieldCheck className={cn("h-8 w-8 transition-all duration-500", user.bankAccount?.verified ? "text-emerald-500" : "text-yellow-500")} />
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between group/status">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Access</p>
                                            <p className="text-base font-black text-slate-900 uppercase tracking-tight italic">{user.bankAccount?.canTransfer ? "Operational" : "Restricted"}</p>
                                        </div>
                                        <ArrowRightLeft className={cn("h-8 w-8 transition-all duration-500", user.bankAccount?.canTransfer ? "text-orange-500" : "text-red-500")} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Sub-Matrix Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Flow: Assets & Cards */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-8 space-y-10">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                                    <CreditCard className="w-6 h-6 text-orange-500" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Asset <span className="text-slate-300">Portfolio</span></h2>
                            </div>
                            <Button variant="ghost" asChild className="text-orange-600 font-black hover:bg-orange-50 rounded-2xl h-14 px-8 text-[10px] uppercase tracking-widest transition-all">
                                <Link href="/dashboard/card" className="flex items-center gap-3">
                                    Registry <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {activeCards.length > 0 ? (
                                activeCards.slice(0, 2).map((card: any, i: number) => (
                                    <motion.div key={card._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.1) }} className="hover:scale-[1.02] transition-all duration-500 filter drop-shadow-2xl">
                                        <CardComponent card={card} showDetails={true} />
                                    </motion.div>
                                ))
                            ) : (
                                <Card className="md:col-span-2 border-2 border-dashed border-slate-200 bg-white/50 rounded-[4rem] p-24 flex flex-col items-center justify-center text-center space-y-8 glass transition-all hover:bg-white hover:border-orange-200 group">
                                    <div className="h-24 w-24 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:text-orange-600 group-hover:scale-110 shadow-inner overflow-hidden relative transition-all duration-700">
                                        <Plus className="h-12 w-12" />
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none italic">Initialize <span className="text-orange-600">Card Node</span></h3>
                                        <p className="text-slate-400 font-bold max-w-sm mx-auto text-sm uppercase tracking-widest">Generate virtual or physical payment units for global liquidity.</p>
                                    </div>
                                    <Button asChild className="bg-slate-900 hover:bg-orange-600 text-white font-black px-12 h-18 rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.3em] group/apply">
                                        <Link href="/dashboard/card/apply" className="flex items-center gap-4">
                                            Apply for Auth <ArrowRight className="h-5 w-5 group-hover/apply:translate-x-2 transition-transform" />
                                        </Link>
                                    </Button>
                                </Card>
                            )}
                        </div>

                        {loansSection && (
                            <div className="pt-8">
                                {loansSection}
                            </div>
                        )}
                    </motion.div>

                    {/* Right Flow: Quick Logic & Activity */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-4 space-y-10">
                        <div className="flex items-center gap-6 px-4">
                            <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/10">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Quick <span className="text-slate-300">Logic</span></h2>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            {[
                                { href: "/dashboard/transfer", label: "Send Assets", sub: "Intra-node migration", icon: ArrowUpRight, color: "text-orange-600", bg: "bg-orange-50" },
                                { href: "/dashboard/transactions", label: "Analytics", sub: "Protocol history", icon: History, color: "text-blue-600", bg: "bg-blue-50" },
                                { href: "/dashboard/loans", label: "Credit", sub: "Asset leverage", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50" },
                                { href: "/dashboard/beneficiaries", label: "Registry", sub: "Trusted entities", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                            ].map((action, i) => (
                                <Link key={i} href={action.href} className="group">
                                    <Card className="bg-white border-slate-100 hover:bg-slate-950 p-6 flex items-center gap-6 transition-all group-hover:-translate-x-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:text-white group-hover:border-slate-800">
                                        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", action.bg, action.color)}>
                                            <action.icon className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900 group-hover:text-white transition-colors uppercase tracking-tight text-lg italic">{action.label}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{action.sub}</p>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Recent Activity Mini-Matrix */}
                        <Card className="border-none bg-slate-900 text-white rounded-[3.5rem] p-10 mt-10 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Recent <span className="text-orange-500 italic">Logs</span></h3>
                                    <History className="h-5 w-5 text-orange-500" />
                                </div>

                                <div className="space-y-6">
                                    {recentTransfers.slice(0, 3).map((transfer: any) => (
                                        <div key={transfer._id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center border",
                                                    transfer.txType === "credit" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                                )}>
                                                    {transfer.txType === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-tight">{transfer.txType === "credit" ? "Inflow" : "Outflow"}</p>
                                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className={cn("text-base font-black tracking-tighter italic", transfer.txType === "credit" ? "text-emerald-500" : "text-white")}>
                                                {transfer.txType === "credit" ? "+" : "−"}{formatCurrency(transfer.amount, transfer.currency || currency)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Button asChild variant="ghost" className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white hover:text-orange-500 font-black uppercase tracking-widest text-[9px] gap-3">
                                    <Link href="/dashboard/transactions">View All Operations <ChevronRight className="h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .glass { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .glass-dark { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
            `}} />
        </div>
    )
}
