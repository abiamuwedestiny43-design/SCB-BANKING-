"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Check, ExternalLink, RefreshCw, Zap, Cpu, Activity, Globe, Shield, Terminal, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const integrations = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Process payments and manage global liquidity sequences.",
        connected: true,
        category: "Payment",
        icon: (
            <div className="w-12 h-12 bg-[#635BFF] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#635BFF]/20">
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
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
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
            <div className="w-12 h-12 bg-[#1A82E2] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#1A82E2]/20">
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
            <div className="w-12 h-12 bg-[#F22F46] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#F22F46]/20">
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
            <div className="w-12 h-12 bg-[#2CA01C] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#2CA01C]/20">
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
        <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
                        Bank <span className="text-orange-600">Integrations</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">
                        Connect external services and financial protocols
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                    <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">API Links Secure</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className={cn(
                        "bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 group",
                        !item.connected && "opacity-80"
                    )}>
                        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg font-black text-slate-900 tracking-tighter italic uppercase leading-none">{item.name}</CardTitle>
                                        {item.connected && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.category}</p>
                                </div>
                            </div>
                            <Switch
                                checked={item.connected}
                                onCheckedChange={() => toggleIntegration(item.id)}
                                disabled={loading === item.id}
                                className="data-[state=checked]:bg-orange-600"
                            />
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <p className="text-sm text-slate-500 font-bold leading-relaxed">
                                {item.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className={cn("text-[10px] font-black uppercase tracking-widest", item.connected ? "text-emerald-600" : "text-slate-400")}>
                                        {item.connected ? "Connected" : "Disabled"}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Latency</p>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{item.connected ? "12ms" : "—"}</p>
                                </div>
                            </div>

                            <Button
                                variant={item.connected ? "outline" : "default"}
                                className={cn(
                                    "w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2",
                                    item.connected
                                        ? "border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-500"
                                        : "bg-slate-900 text-white hover:bg-orange-600"
                                )}
                                onClick={() => !item.connected && toggleIntegration(item.id)}
                                disabled={loading === item.id}
                            >
                                {loading === item.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : item.connected ? (
                                    <>Configure Service <ChevronRight className="w-4 h-4" /></>
                                ) : (
                                    <>Setup Connection <Plug className="w-4 h-4" /></>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Integration Placeholder */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all">
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-300 group-hover:text-orange-500 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                        <Cpu className="w-8 h-8" />
                    </div>
                    <div className="mt-6 space-y-2">
                        <p className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">New Service</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[180px]">
                            Connect a custom financial protocol or API
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
