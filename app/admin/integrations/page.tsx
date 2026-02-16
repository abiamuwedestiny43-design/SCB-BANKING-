"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Check, ExternalLink, RefreshCw } from "lucide-react"

const integrations = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Process payments and manage subscriptions.",
        connected: true,
        category: "Payment",
        icon: (
            <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
            </div>
        )
    },
    {
        id: "plaid",
        name: "Plaid",
        description: "Connect user bank accounts securely.",
        connected: true,
        category: "Banking",
        icon: (
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
                P
            </div>
        )
    },
    {
        id: "sendgrid",
        name: "SendGrid",
        description: "Email delivery service for transactional emails.",
        connected: false,
        category: "Communication",
        icon: (
            <div className="w-10 h-10 bg-[#1A82E2] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                SG
            </div>
        )
    },
    {
        id: "twilio",
        name: "Twilio",
        description: "SMS and voice communication API.",
        connected: false,
        category: "Communication",
        icon: (
            <div className="w-10 h-10 bg-[#F22F46] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                Tw
            </div>
        )
    },
    {
        id: "quickbooks",
        name: "QuickBooks",
        description: "Accounting software integration.",
        connected: false,
        category: "Accounting",
        icon: (
            <div className="w-10 h-10 bg-[#2CA01C] rounded-lg flex items-center justify-center text-white font-bold text-xl">
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
        <div className="p-4 md:p-10 space-y-8 min-h-screen bg-slate-50/50">
            <div className="flex flex-col gap-2 relative z-10">
                <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-3">
                    <Plug className="w-8 h-8 text-orange-700" />
                    System <span className="text-orange-700">Integrations</span>
                </h1>
                <p className="text-slate-900 font-bold max-w-2xl uppercase text-[10px] tracking-widest mt-1">
                    Connect third-party tools to extend the functionality of your banking platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className={`border-slate-200 shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300 ${item.connected ? 'bg-white ring-2 ring-orange-500/10' : 'bg-slate-50 opacity-80 hover:opacity-100 hover:bg-white'}`}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                            <div className="flex gap-4">
                                {item.icon}
                                <div>
                                    <CardTitle className="text-lg font-black text-black uppercase tracking-tighter italic">{item.name}</CardTitle>
                                    <Badge variant={item.connected ? "default" : "outline"} className={`mt-1 text-[9px] font-black uppercase tracking-widest ${item.connected ? 'bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-100' : 'text-slate-500'}`}>
                                        {item.connected ? 'Active Connection' : 'System Offline'}
                                    </Badge>
                                </div>
                            </div>
                            <Switch
                                checked={item.connected}
                                onCheckedChange={() => toggleIntegration(item.id)}
                                disabled={loading === item.id}
                            />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-black font-black mb-6 min-h-[40px] leading-relaxed italic">{item.description}</p>

                            {item.connected ? (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-slate-400">Status</span>
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Operational
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-slate-400">Last Sync</span>
                                        <span className="text-black font-black">{item.connected ? 'Operational' : 'Node Offline'}</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-2 rounded-xl text-xs font-bold border-orange-100 text-orange-600 hover:bg-orange-50">
                                        Configure <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-slate-200/50">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                                        onClick={() => toggleIntegration(item.id)}
                                        disabled={loading === item.id}
                                    >
                                        {loading === item.id ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : 'Connect'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
