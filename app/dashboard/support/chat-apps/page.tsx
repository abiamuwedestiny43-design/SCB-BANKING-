"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MessageCircle,
    Shield,
    Zap,
    Lock,
    ExternalLink,
    HelpCircle,
    ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const chatApps = [
    {
        name: "YES ROBOT",
        description: "24/7 AI-powered chat assistant for immediate banking services.",
        category: "AI Powered",
        status: "Recommended",
        features: ["24/7 Availability", "Secure Authentication"],
        color: "orange"
    },
    {
        name: "tawk.to",
        description: "Real-time monitoring and engagement with support teams.",
        category: "Monitoring",
        features: ["Real-time Chat", "Ticketing System"],
        color: "emerald"
    },
    {
        name: "LiveChat",
        description: "Secure platform designed specifically for financial services.",
        category: "Enterprise",
        features: ["End-to-End Encryption", "Compliance Ready"],
        color: "blue"
    },
    {
        name: "Signal",
        description: "State-of-the-art encryption for private conversations.",
        category: "Privacy focus",
        features: ["Zero-knowledge", "Private"],
        color: "blue"
    },
    {
        name: "LiveAgent",
        description: "Comprehensive helpdesk including live chat and email ticketing.",
        category: "Helpdesk",
        features: ["Email Ticketing", "Knowledge Base"],
        color: "orange"
    }
]

export default function ChatAppsPage() {
    const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

    return (
        <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
            <div className="max-w-4xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white">
                        <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-base font-bold text-slate-900">Support Channels</h1>
                        <p className="text-xs text-slate-400">Connect with our support team</p>
                    </div>
                </div>

                {/* Hero Card */}
                <motion.div {...fadeIn}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-orange-600 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                            <div className="relative z-10 space-y-2">
                                <h2 className="text-lg font-bold">How can we help?</h2>
                                <p className="text-xs text-orange-100 max-w-md">Our support team is available through various secure channels to assist you with your banking needs.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50/50 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Shield className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] font-semibold text-orange-800 uppercase tracking-wider">Secure Support</span>
                            </div>
                            <div className="h-4 w-px bg-orange-200" />
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Zap className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-[10px] font-semibold text-orange-800 uppercase tracking-wider">Fast Response</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Apps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chatApps.map((app, i) => (
                        <motion.div key={i} {...fadeIn} transition={{ delay: 0.1 * i }}>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:border-orange-200 transition-all group h-full flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                    {app.status && (
                                        <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100 border-none px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                            {app.status}
                                        </Badge>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{app.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{app.category}</p>
                                </div>

                                <p className="text-xs text-slate-500 mb-4 flex-grow">{app.description}</p>

                                <div className="space-y-1.5 mb-4">
                                    {app.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                            <div className="h-1 w-1 rounded-full bg-orange-400" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <Button size="sm" className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-lg font-semibold text-xs h-9 transition-all">
                                    Launch Channel <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Notice */}
                <motion.div {...fadeIn} transition={{ delay: 0.6 }}>
                    <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Lock className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-6 w-6 text-orange-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold uppercase tracking-wider">Security Advisory</h4>
                                <p className="text-xs text-slate-400 max-w-xl">Never share your password, OTP, or PIN on any support channel. Official Danamon Bank staff will never ask for these details.</p>
                            </div>
                            <Button variant="outline" size="sm" className="md:ml-auto bg-transparent border-white/20 text-white hover:bg-white/10 rounded-lg text-xs h-9 px-4">
                                View Security Tips
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center pb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                        <HelpCircle className="h-3.5 w-3.5" />
                        Need immediate assistance?
                        <Link href="/dashboard/support" className="text-orange-600 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
