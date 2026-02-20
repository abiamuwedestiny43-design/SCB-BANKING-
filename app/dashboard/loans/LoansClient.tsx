"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText, ChevronLeft, CreditCard, PieChart, TrendingUp, CheckCircle2, Clock, Landmark } from "lucide-react"
import Link from "next/link"
import LoanComponent from "@/components/loans/LoanComponent"
import { cn } from "@/lib/utils"

interface LoansClientProps {
    loans: any[]
}

export default function LoansClient({ loans }: LoansClientProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    const activeLoans = loans.filter((loan: any) => ['active', 'approved'].includes(loan.status))
    const pendingLoans = loans.filter((loan: any) => loan.status === 'pending')
    const completedLoans = loans.filter((loan: any) => ['completed', 'defaulted'].includes(loan.status))

    return (
        <div className="min-h-screen bg-black w-full p-6 md:p-12 pt-24 md:pt-32 relative overflow-hidden selection:bg-orange-500/20">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Industrial Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/5">
                            <Landmark className="w-3.5 h-3.5 text-orange-500" /> CREDIT INFRASTRUCTURE
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                            MY <span className="text-orange-600 italic">LOANS</span>
                        </h1>
                        <p className="text-slate-400 font-bold max-w-lg text-base">Manage your active credit facilities and liquidity requests.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" className="h-14 px-8 rounded-2xl bg-slate-900 border border-white/10 font-black text-[10px] uppercase tracking-widest text-white flex items-center gap-3 hover:bg-slate-800 transition-all shadow-sm">
                            <Link href="/dashboard">
                                <ChevronLeft className="h-4 w-4" /> NODE_DASHBOARD
                            </Link>
                        </Button>
                        <Button asChild className="h-14 px-10 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-600/10 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 border-none">
                            <Link href="/dashboard/loans/apply" className="flex items-center gap-3">
                                <Plus className="h-5 w-5" /> REQUEST_CAPITAL
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Status Overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Active Nodes", val: activeLoans.length, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-600/10" },
                        { label: "Pending Analysis", val: pendingLoans.length, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-600/10" },
                        { label: "Archive Trace", val: completedLoans.length, icon: CheckCircle2, color: "text-slate-400", bg: "bg-slate-600/10" },
                    ].map((item, i) => (
                        <motion.div key={i} {...fadeInUp} transition={{ delay: 0.1 * i }}>
                            <Card className="border-none shadow-2xl bg-slate-900/40 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] group hover:scale-105 transition-all duration-500 glass-dark flex items-center gap-6 overflow-hidden relative border border-white/5">
                                <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:scale-150 transition-transform duration-700", item.bg)}></div>
                                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 relative z-10", item.color)}>
                                    <item.icon className="h-8 w-8 transition-transform group-hover:rotate-12" />
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">{item.label}</p>
                                    <h3 className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter italic">{item.val}</h3>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {loans.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden glass">
                            <CardContent className="flex flex-col items-center justify-center py-32 text-center space-y-10">
                                <div className="h-32 w-32 bg-slate-50 border border-slate-100 rounded-[3.5rem] flex items-center justify-center shadow-inner text-slate-200 group relative transition-all duration-700 hover:scale-110">
                                    <FileText className="h-14 w-14" />
                                    <div className="absolute inset-0 bg-orange-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic">No active facilities <span className="text-slate-300">detected</span></h3>
                                    <p className="text-slate-400 font-bold max-w-md mx-auto text-sm uppercase tracking-[0.2em]">Initialize a premium credit facility requested via Sovereign protocols to enable liquidity injection.</p>
                                </div>
                                <Button asChild className="h-20 px-12 bg-slate-900 hover:bg-orange-600 text-white rounded-[2rem] shadow-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 group/btn">
                                    <Link href="/dashboard/loans/apply" className="flex items-center gap-4">
                                        INITIALIZE_SEQUENCE <Plus className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-20">
                        {/* Pending Section */}
                        {pendingLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-1 w-20 bg-yellow-500/20 rounded-full" />
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.3em]">
                                        <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
                                        Pending_Authorization
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {pendingLoans.map((loan, idx) => (
                                        <motion.div
                                            key={loan._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="relative group h-full"
                                        >
                                            <div className="absolute inset-0 bg-yellow-500/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <LoanComponent loan={loan} />
                                            <div className="absolute top-8 right-8 bg-yellow-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                                ANALYZING
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Active Section */}
                        {activeLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-1 w-20 bg-orange-600/20 rounded-full" />
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.3em]">
                                        <TrendingUp className="w-5 h-5 text-orange-600" />
                                        Active_Capital_Nodes
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {activeLoans.map((loan, idx) => (
                                        <motion.div
                                            key={loan._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="group relative"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-10 rounded-[2.6rem] blur transition duration-500" />
                                            <LoanComponent loan={loan} showDetails={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* History Section */}
                        {completedLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-1 w-20 bg-slate-200 rounded-full" />
                                    <h2 className="text-xl font-black text-slate-400 flex items-center gap-4 uppercase tracking-[0.3em]">
                                        <FileText className="w-5 h-5" />
                                        Historical_Archive
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {completedLoans.map((loan, idx) => (
                                        <div key={loan._id} className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                            <LoanComponent loan={loan} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .glass { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
            `}} />
        </div>
    )
}
