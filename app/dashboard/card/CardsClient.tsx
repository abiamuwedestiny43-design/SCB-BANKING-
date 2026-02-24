"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, ChevronLeft, ShieldCheck, Zap, Globe } from "lucide-react"
import Link from "next/link"
import CardComponent from "@/components/cards/CardComponent"
import { cn } from "@/lib/utils"

interface CardsClientProps {
    cards: any[]
}

export default function CardsClient({ cards }: CardsClientProps) {
    const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

    const activeCards = cards.filter((card: any) => card.status === "active" || card.status === "pending")

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
                            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">My Cards</h1>
                            <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Manage your payment cards</p>
                        </div>
                    </div>
                    <Button asChild size="sm" className="bg-black hover:bg-black text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all italic h-12 px-6">
                        <Link href="/dashboard/card/apply">
                            <Plus className="h-4 w-4" /> Request Card
                        </Link>
                    </Button>
                </div>

                {/* Feature Pills */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "PIN Protected", sub: "Secure Core", icon: ShieldCheck, color: "text-black", bg: "bg-slate-50" },
                        { label: "Instant Issue", sub: "Fast Delivery", icon: Zap, color: "text-black", bg: "bg-blue-50" },
                        { label: "Global Access", sub: "Worldwide", icon: Globe, color: "text-black", bg: "bg-purple-50" },
                    ].map((item, i) => (
                        <motion.div key={i} {...fadeIn} transition={{ delay: 0.05 * i }}>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", item.bg, item.color)}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-black font-black uppercase tracking-widest opacity-60 mb-0.5">{item.label}</p>
                                    <p className="text-sm md:text-base font-black text-black uppercase tracking-tight italic">{item.sub}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cards Content */}
                {activeCards.length === 0 ? (
                    <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 flex flex-col items-center text-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">No cards yet</h3>
                                <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60 mt-1">Request a card to get started.</p>
                            </div>
                            <Button asChild size="sm" className="bg-black hover:bg-black text-white rounded-lg text-xs border-none h-9 px-4">
                                <Link href="/dashboard/card/apply">Request a Card</Link>
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {activeCards.map((card: any, idx: number) => (
                            <motion.div
                                key={card._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                            >
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-4">
                                        <CardComponent card={card} showDetails={true} />
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50 bg-slate-50/50">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                card.status === 'active' ? 'bg-black' : 'bg-orange-400'
                                            )} />
                                            <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest italic">{card.status}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-black uppercase tracking-widest opacity-60">
                                            <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
                                            PIN Protected
                                        </div>
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
