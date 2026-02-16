"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Shield, Zap, Lock, ExternalLink, HelpCircle } from "lucide-react"
import Link from "next/link"

const chatApps = [
    {
        name: "YES ROBOT (YES Bank)",
        description: "A 24/7 AI-powered chat assistant providing immediate, secure banking services for diverse financial needs.",
        category: "AI Powered",
        status: "Recommended",
        features: ["24/7 Availability", "Secure Authentication", "AI Assistant"],
        color: "orange"
    },
    {
        name: "tawk.to",
        description: "A fully featured, free live chat app that enables real-time monitoring and engagement with support teams.",
        category: "Monitoring",
        features: ["Real-time Monitoring", "Ticketing System", "Unlimited Agents"],
        color: "emerald"
    },
    {
        name: "LiveChat",
        description: "A robust platform designed specifically for financial services, prioritizing end-to-end encryption and compliance.",
        category: "Enterprise",
        features: ["End-to-End Encryption", "Compliance Ready", "Multi-channel"],
        color: "blue"
    },
    {
        name: "Signal",
        description: "State-of-the-art end-to-end encryption keeps your conversations secure and private from prying eyes.",
        category: "Privacy focus",
        features: ["Zero-knowledge encryption", "Open Source", "Private"],
        color: "blue"
    },
    {
        name: "LiveAgent",
        description: "Offers a comprehensive free plan for small teams, including live chat, email ticketing, and a basic knowledge base.",
        category: "Helpdesk",
        features: ["Email Ticketing", "Knowledge Base", "Live Chat"],
        color: "orange"
    }
]

export default function ChatAppsPage() {
    return (
        <div className="p-4 md:p-10 space-y-8 min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-orange-600 p-8 md:p-12 text-white shadow-2xl shadow-orange-200">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase">
                            Secure Bank <br />
                            <span className="not-italic text-orange-100">Support Apps</span>
                        </h1>
                        <p className="text-orange-100/80 font-medium max-w-lg leading-relaxed">
                            Explore trusted communication channels for immediate assistance and secure financial inquiries.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <Shield className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chatApps.map((app, i) => (
                    <Card key={i} className="group border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-4 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-orange-600 group-hover:text-white transition-colors`}>
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                {app.status && (
                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                        {app.status}
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{app.name}</CardTitle>
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">{app.category}</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-sm text-slate-500 font-bold leading-relaxed min-h-[60px]">
                                {app.description}
                            </p>

                            <div className="space-y-3">
                                {app.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-black text-slate-400 border-b border-slate-50 pb-2">
                                        <Zap className="w-3 h-3 text-orange-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-xl py-6 font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-slate-200">
                                Launch Channel <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Official Advisory */}
            <Card className="bg-slate-900 border-none rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Lock className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Shield className="w-3 h-3" /> Enhanced Security Notice
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tight">
                            Protection of your <br />
                            <span className="text-orange-400 not-italic">Identity as Priority</span>
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-bold">
                            For the best experience, using the official app of your specific bank is recommended to ensure security and direct access to personal account information. Avoid sharing sensitive data on third-party platforms unless verified.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h4 className="text-white font-black text-sm uppercase italic mb-2">Direct Access</h4>
                            <p className="text-slate-500 text-xs font-medium">Use official bank portal for account actions.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h4 className="text-white font-black text-sm uppercase italic mb-2">Verified Channels</h4>
                            <p className="text-slate-500 text-xs font-medium">Always look for the verification checkmark.</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Additional Resource */}
            <div className="text-center py-10">
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Need Immediate Assistance? <Link href="/dashboard/support" className="text-orange-600 hover:underline">Contact Internal Support</Link>
                </p>
            </div>
        </div>
    )
}
