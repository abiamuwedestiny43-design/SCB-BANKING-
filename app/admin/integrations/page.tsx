"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Check, ExternalLink, RefreshCw, Zap, Cpu, Activity, Globe, Shield, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

const integrations = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Process payments and manage global liquidity sequences.",
        connected: true,
        category: "Payment",
        icon: (
            <div className="w-14 h-14 bg-[#635BFF] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#635BFF]/20">
                S
            </div>
        )
    },
    {
        id: "plaid",
        name: "Plaid",
        description: "Secure node connection to external institutional ledgers.",
        connected: true,
        category: "Banking",
        icon: (
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-slate-900/20 shadow-orange-500/10">
                P
            </div>
        )
    },
    {
        id: "sendgrid",
        name: "SendGrid",
        description: "Authorized communication protocols for transaction alerts.",
        connected: false,
        category: "Communication",
        icon: (
            <div className="w-14 h-14 bg-[#1A82E2] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#1A82E2]/20">
                SG
            </div>
        )
    },
    {
        id: "twilio",
        name: "Twilio",
        description: "Multi-factor authentication and SMS dispatch units.",
        connected: false,
        category: "Communication",
        icon: (
            <div className="w-14 h-14 bg-[#F22F46] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#F22F46]/20">
                Tw
            </div>
        )
    },
    {
        id: "quickbooks",
        name: "QuickBooks",
        description: "Institutional accounting and balance sheet synchronization.",
        connected: false,
        category: "Accounting",
        icon: (
            <div className="w-14 h-14 bg-[#2CA01C] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#2CA01C]/20">
                QB
            </div>
        )
    }
]

export default function IntegrationsPage() {
    const [items, setItems] = useState(integrations)
    const [loading, setLoading] = useState<string | null>(null)

    const toggleIntegration = (id: string) => {
        setLoading(id)
        // Simulate API call
        setTimeout(() => {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, connected: !item.connected } : item
            ))
            setLoading(null)
        }, 800)
    }

    return (
        <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

            {/* Industrial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                        <Plug className="w-3.5 h-3.5 text-orange-500" /> External Node Matrix
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                        SYSTEM <span className="text-orange-600 italic">INTEGRATIONS</span>
                    </h1>
                    <p className="text-slate-500 font-bold max-w-2xl text-lg uppercase tracking-tight">Extend Sovereign node capabilities by authorizing external protocol synchronization.</p>
                </div>

                <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Pulse Monitor</p>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">API Link Secure</p>
                        </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5"></div>
                    <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
                        <Zap className="w-6 h-6 animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 relative z-10">
                {items.map((item) => (
                    <Card key={item.id} className={cn(
                        "border-white/5 shadow-3xl rounded-[3.5rem] overflow-hidden transition-all duration-500 glass-dark group relative",
                        item.connected ? "bg-slate-900/40 translate-y-0" : "bg-black/40 opacity-80 hover:opacity-100 grayscale hover:grayscale-0 shadow-inner"
                    )}>
                        {item.connected && (
                            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-orange-600 to-orange-400"></div>
                        )}
                        <CardHeader className="p-10 flex flex-row items-start justify-between space-y-0 border-b border-white/5 bg-black/40">
                            <div className="flex gap-6">
                                <div className="group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-2xl font-black text-white tracking-tighter italic uppercase leading-none">{item.name}</CardTitle>
                                        <div className={cn("h-3 w-3 rounded-full shadow-2xl", item.connected ? "bg-emerald-500 animate-pulse shadow-emerald-500/50" : "bg-slate-800")}></div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 italic">{item.category} Module</p>
                                </div>
                            </div>
                            <div className="scale-125 pt-2">
                                <Switch
                                    checked={item.connected}
                                    onCheckedChange={() => toggleIntegration(item.id)}
                                    disabled={loading === item.id}
                                    className="data-[state=checked]:bg-orange-600 border-white/5 bg-slate-950"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8 bg-transparent">
                            <p className="text-base text-slate-400 font-black leading-relaxed italic h-14 overflow-hidden uppercase tracking-tight">
                                {item.description}
                            </p>

                            <div className="space-y-6">
                                {item.connected ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-black border border-white/5 text-center space-y-2 shadow-inner border-l-emerald-500/50">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Sync Status</p>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Synchronized</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-black border border-white/5 text-center space-y-2 shadow-inner">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Latency</p>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">12ms</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-[1.5rem] bg-black border border-white/5 text-center flex items-center justify-center gap-4 grayscale opacity-50 shadow-inner">
                                        <Shield className="w-5 h-5 text-slate-500" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none italic">Protocol Authorization Required</p>
                                    </div>
                                )}

                                <div className="pt-2">
                                    {item.connected ? (
                                        <Button variant="ghost" className="w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-orange-600/20 bg-orange-600/5 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-3xl group/btn">
                                            Configure Protocol <ExternalLink className="w-4 h-4 ml-4 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-900 border border-white/5 text-white hover:bg-orange-600 hover:border-none transition-all shadow-3xl group/btn"
                                            onClick={() => toggleIntegration(item.id)}
                                            disabled={loading === item.id}
                                        >
                                            {loading === item.id ? (
                                                <RefreshCw className="w-5 h-5 animate-spin text-orange-600" />
                                            ) : (
                                                <span className="flex items-center gap-4">
                                                    <Terminal className="w-4 h-4 text-orange-600 group-hover:text-white transition-colors" /> Initialize Link
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Developer Card - For future expansion */}
                <Card className="border-4 border-dashed border-white/5 rounded-[3.5rem] bg-slate-950/40 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-orange-600/30 hover:bg-slate-900/40 transition-all duration-500 glass-dark">
                    <div className="h-24 w-24 rounded-[2.5rem] bg-black border border-white/5 text-slate-700 group-hover:text-orange-600 group-hover:scale-110 shadow-3xl flex items-center justify-center transition-all duration-500">
                        <Cpu className="w-12 h-12" />
                    </div>
                    <div className="mt-10 space-y-6">
                        <p className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Develop Integration</p>
                        <p className="text-[11px] text-slate-600 font-bold leading-relaxed max-w-[240px] mx-auto uppercase tracking-widest">
                            Extend the matrix with your own custom protocol units.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
