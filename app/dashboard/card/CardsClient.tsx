"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Plus, CreditCard, ChevronLeft, ShieldCheck, Zap, Globe } from "lucide-react"
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
        <div className="min-h-screen bg-white w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
            {/* Minimal Background Structure */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-slate-500/[0.01] rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-slate-500/[0.01] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-white border border-slate-200 w-fit rounded-full shadow-sm">
                            <CreditCard className="h-3 w-3" />
                            Secure Payments
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                            My <span className="text-slate-400 italic">Cards</span>
                        </h1>
                        <p className="text-slate-600 font-medium">Manage your cards and payment methods.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" className="h-12 px-6 rounded-xl border border-slate-200 bg-white hover:bg-white font-bold text-slate-900 flex items-center gap-2 transition-all shadow-sm">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xl shadow-orange-600/10 font-black transition-all hover:-translate-y-1">
                            <Link href="/dashboard/card/apply" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                New Card
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                        <UICard className="border border-slate-200 shadow-sm bg-white p-6 rounded-[2rem] group hover:border-orange-300 transition-all duration-500">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm transition-transform group-hover:scale-110">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Encrypted PIN</p>
                                    <p className="text-slate-900 font-black text-lg">Secure Core</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                        <UICard className="border border-slate-200 shadow-sm bg-white p-6 rounded-[2rem] group hover:border-blue-300 transition-all duration-500">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Instant Issue</p>
                                    <p className="text-slate-900 font-black text-lg">Zero Latency</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                    <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                        <UICard className="border border-slate-200 shadow-sm bg-white p-6 rounded-[2rem] group hover:border-purple-300 transition-all duration-500">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm transition-transform group-hover:scale-110">
                                    <Globe className="h-7 w-7" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Access</p>
                                    <p className="text-slate-900 font-black text-lg">Worldwide</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                {activeCards.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <UICard className="border-slate-200 bg-white shadow-xl rounded-[3rem] overflow-hidden">
                            <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-8">
                                <div className="h-24 w-24 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center shadow-inner text-slate-300">
                                    <CreditCard className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">No active cards <span className="text-slate-400 italic">found</span></h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Apply for a premium virtual or physical card to enable secure transactions.</p>
                                </div>
                                <Button asChild className="h-16 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-xl shadow-orange-600/10 font-black text-lg transition-transform hover:scale-105">
                                    <Link href="/dashboard/card/apply">Get Your First Card</Link>
                                </Button>
                            </CardContent>
                        </UICard>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {activeCards.map((card: any, idx: number) => (
                            <motion.div
                                key={card._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.6 }}
                                className="group perspective-1000"
                            >
                                <div className="relative">
                                    <CardComponent card={card} showDetails={true} />
                                    <div className="absolute top-8 right-8 z-20">
                                        <span className={cn(
                                            "text-[8px] font-black uppercase px-4 py-1.5 rounded-full shadow-2xl border backdrop-blur-md tracking-widest",
                                            card.status === 'active'
                                                ? 'bg-orange-600 text-white border-white/20'
                                                : 'bg-yellow-500 text-white border-white/20'
                                        )}>
                                            {card.status} <span className="text-[10px] ml-1">●</span>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
