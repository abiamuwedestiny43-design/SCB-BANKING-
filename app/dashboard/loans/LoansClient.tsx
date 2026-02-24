"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, FileText, ChevronLeft, TrendingUp, CheckCircle2, Clock, Landmark } from "lucide-react"
import Link from "next/link"
import LoanComponent from "@/components/loans/LoanComponent"
import { cn } from "@/lib/utils"

interface LoansClientProps {
    loans: any[]
}

export default function LoansClient({ loans }: LoansClientProps) {
    const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

    const activeLoans = loans.filter((loan: any) => ['active', 'approved'].includes(loan.status))
    const pendingLoans = loans.filter((loan: any) => loan.status === 'pending')
    const completedLoans = loans.filter((loan: any) => ['completed', 'defaulted'].includes(loan.status))

    return (
        <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
            <div className="max-w-4xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-black hover:bg-white">
                            <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">Loan Services</h1>
                            <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Manage your financing options</p>
                        </div>
                    </div>
                    <Button asChild size="sm" className="bg-black hover:bg-black text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all italic h-12 px-6">
                        <Link href="/dashboard/loans/apply">
                            <Plus className="h-4 w-4" /> Apply for Loan
                        </Link>
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Active Loans", val: activeLoans.length, icon: TrendingUp, color: "text-black", bg: "bg-slate-50" },
                        { label: "Processing", val: pendingLoans.length, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
                        { label: "Completed", val: completedLoans.length, icon: CheckCircle2, color: "text-black", bg: "bg-slate-50" },
                    ].map((item, i) => (
                        <motion.div key={i} {...fadeIn} transition={{ delay: 0.05 * i }}>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", item.bg, item.color)}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-black font-black uppercase tracking-widest mb-0.5">{item.label}</p>
                                    <p className="text-xl md:text-2xl font-black text-black italic tracking-tighter">{item.val}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Loan Content */}
                {loans.length === 0 ? (
                    <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 flex flex-col items-center text-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">No active loans</h3>
                                <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60 mt-1">Apply for a loan to get started.</p>
                            </div>
                            <Button asChild size="sm" className="bg-black hover:bg-black text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest italic h-12 px-8">
                                <Link href="/dashboard/loans/apply">Apply Now</Link>
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-6">

                        {/* Pending */}
                        {pendingLoans.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <Clock className="h-4 w-4 text-black" />
                                    <h2 className="text-sm md:text-base font-black text-black uppercase tracking-widest italic">Pending Approval</h2>
                                    <span className="ml-auto bg-yellow-50 text-yellow-700 text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase italic">{pendingLoans.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pendingLoans.map((loan, idx) => (
                                        <div key={loan._id} className="relative">
                                            <LoanComponent loan={loan} />
                                            <span className="absolute top-3 right-3 bg-black text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">Reviewing</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active */}
                        {activeLoans.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingUp className="h-4 w-4 text-black" />
                                    <h2 className="text-sm md:text-base font-black text-black uppercase tracking-widest italic">Active Loans</h2>
                                    <span className="ml-auto bg-slate-50 text-black text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase italic">{activeLoans.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeLoans.map((loan, idx) => (
                                        <LoanComponent key={loan._id} loan={loan} showDetails={true} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* History */}
                        {completedLoans.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <CheckCircle2 className="h-4 w-4 text-black" />
                                    <h2 className="text-sm md:text-base font-black text-black uppercase tracking-widest italic">Loan History</h2>
                                    <span className="ml-auto bg-slate-50 text-black text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase italic">{completedLoans.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {completedLoans.map((loan) => (
                                        <div key={loan._id} className="opacity-70 hover:opacity-100 transition-opacity">
                                            <LoanComponent loan={loan} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
