"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Plus, CreditCard, ChevronLeft, ShieldCheck, Zap, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import CardComponent from "@/components/cards/CardComponent"
import { cn } from "@/lib/utils"

interface CardsClientProps {
    cards: any[]
}

export default function CardsClient({ cards }: CardsClientProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    const activeCards = cards.filter((card: any) => card.status === "active" || card.status === "pending")

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
                            <CreditCard className="w-3.5 h-3.5 text-orange-500" /> SECURE ASSET REGISTRY
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                            MY <span className="text-orange-600 italic">CARDS</span>
                        </h1>
                        <p className="text-slate-400 font-bold max-w-lg text-lg">Manage your liquidity nodes and cryptographic payment sequences.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" className="h-14 px-8 rounded-2xl bg-slate-900 border border-white/10 font-black text-[10px] uppercase tracking-widest text-white flex items-center gap-3 hover:bg-slate-800 transition-all shadow-sm">
                            <Link href="/dashboard">
                                <ChevronLeft className="h-4 w-4" /> NODE_DASHBOARD
                            </Link>
                        </Button>
                        <Button asChild className="h-14 px-10 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-xl shadow-orange-600/10 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 border-none">
                            <Link href="/dashboard/card/apply" className="flex items-center gap-3">
                                <Plus className="h-5 w-5" /> GENERATE_NEW
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Technical Telemetry Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Encrypted PIN", title: "Secure Core", icon: ShieldCheck, color: "text-orange-600", bg: "bg-orange-600/10" },
                        { label: "Instant Issue", title: "Zero Latency", icon: Zap, color: "text-blue-500", bg: "bg-blue-600/10" },
                        { label: "Global Access", title: "Worldwide", icon: Globe, color: "text-purple-500", bg: "bg-purple-600/10" },
                    ].map((item, i) => (
                        <motion.div key={i} {...fadeInUp} transition={{ delay: 0.1 * i }}>
                            <UICard className="border-none shadow-2xl bg-slate-900/40 p-8 rounded-[3rem] group hover:scale-105 transition-all duration-500 glass-dark flex items-center gap-6 overflow-hidden relative border border-white/5">
                                <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:scale-150 transition-transform duration-700", item.bg)}></div>
                                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 relative z-10", item.color)}>
                                    <item.icon className="h-8 w-8 transition-transform group-hover:rotate-12" />
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">{item.label}</p>
                                    <p className="text-white font-black text-xl uppercase tracking-tighter italic">{item.title}</p>
                                </div>
                            </UICard>
                        </motion.div>
                    ))}
                </div>

                {/* Asset Matrix */}
                {activeCards.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <UICard className="border-none bg-white shadow-2xl rounded-[4rem] overflow-hidden glass">
                            <CardContent className="flex flex-col items-center justify-center py-32 text-center space-y-10">
                                <div className="h-32 w-32 bg-slate-50 border border-slate-100 rounded-[3.5rem] flex items-center justify-center shadow-inner text-slate-200 group relative transition-all duration-700 hover:scale-110">
                                    <CreditCard className="h-14 w-14" />
                                    <div className="absolute inset-0 bg-orange-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">No active nodes <span className="text-slate-300">detected</span></h3>
                                    <p className="text-slate-400 font-bold max-w-md mx-auto text-sm uppercase tracking-[0.2em]">Initialize a premium cryptographic asset node to enable global liquidity sequences.</p>
                                </div>
                                <Button asChild className="h-20 px-12 bg-slate-900 hover:bg-orange-600 text-white rounded-[2rem] shadow-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 group/btn">
                                    <Link href="/dashboard/card/apply" className="flex items-center gap-4">
                                        INITIALIZE_SEQUENCE <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </UICard>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {activeCards.map((card: any, idx: number) => (
                            <motion.div
                                key={card._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.6 }}
                                className="group relative"
                            >
                                <div className="relative filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-500">
                                    <CardComponent card={card} showDetails={true} />
                                    <div className="absolute top-10 right-10 z-20">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl",
                                            card.status === 'active'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                                : 'bg-orange-500/10 border-orange-500/20 text-orange-600'
                                        )}>
                                            <span className={cn("h-1.5 w-1.5 rounded-full", card.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500')}></span>
                                            {card.status}
                                        </div>
                                    </div>

                                    {/* Subtle Overlay Decoration */}
                                    <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between px-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Protocol</p>
                                        <p className="text-slate-900 font-black text-sm uppercase tracking-tighter">RSA-4096 ENCRYPTED</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl border border-slate-100 bg-white shadow-sm hover:text-orange-600 transition-all">
                                        <ShieldCheck className="w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
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
