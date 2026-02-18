import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Activity,
    ShieldCheck,
    Globe,
    CreditCard,
    Clock,
    Zap,
    User as UserIcon,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Lock,
    Database,
    Cpu,
    Radio,
    Terminal,
    Fingerprint,
    MapPin
} from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import User from "@/models/User"
import { formatCurrency } from "@/lib/utils/banking"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

async function getTransactionDetails(id: string) {
    await dbConnect()
    try {
        const transfer = await Transfer.findById(id).populate('userId', 'bankInfo.bio email')
        if (!transfer) return null
        return transfer
    } catch (error) {
        console.error("Error fetching transaction details:", error)
        return null
    }
}

export default async function AdminTransactionDetailsPage({ params }: { params: { id: string } }) {
    return (
        <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="flex items-center gap-8">
                    <Button variant="ghost" asChild className="h-16 w-16 rounded-2xl bg-slate-900 border border-white/5 hover:bg-white hover:text-slate-900 transition-all p-0 shadow-2xl group">
                        <Link href="/admin/transactions">
                            <ArrowLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                            <Activity className="w-3.5 h-3.5 text-orange-500" /> Advanced Audit Analysis
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">
                            FLUX <span className="text-orange-600 uppercase">DECODER</span>
                        </h1>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Audit Reference</p>
                        <p className="text-sm font-black text-orange-600 uppercase tracking-tighter italic">{params.id.slice(-12).toUpperCase()}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5"></div>
                    <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
                        <Fingerprint className="w-6 h-6 animate-pulse" />
                    </div>
                </div>
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20 gap-8">
                    <div className="h-24 w-24 rounded-[3rem] bg-black border border-white/5 text-orange-600 shadow-3xl flex items-center justify-center animate-spin">
                        <Zap className="w-12 h-12" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] animate-pulse italic">Initializing Data Decryption Matrix...</p>
                </div>
            }>
                <TransactionContent id={params.id} />
            </Suspense>
        </div>
    )
}

async function TransactionContent({ id }: { id: string }) {
    const tx = await getTransactionDetails(id)
    if (!tx) notFound()

    const isCredit = tx.txType === "credit"
    const statusMap = {
        success: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2, label: "Operational" },
        pending: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock, label: "Synchronizing" },
        failed: { color: "text-red-500", bg: "bg-red-500/10", icon: XCircle, label: "Aborted" },
        cancelled: { color: "text-slate-500", bg: "bg-slate-800", icon: AlertTriangle, label: "Terminated" },
    }
    const currentStatus = (statusMap[tx.txStatus as keyof typeof statusMap] || statusMap.pending)

    const user = tx.userId as any

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 font-sans">
            {/* Primary Audit Hub */}
            <div className="lg:col-span-8 space-y-12">
                <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark group transition-all duration-500">
                    <CardHeader className="p-12 md:p-16 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                            <div className="flex items-center gap-10">
                                <div className={cn(
                                    "w-24 h-24 rounded-[2.5rem] border border-white/5 shadow-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500",
                                    isCredit ? 'bg-orange-600/10 text-orange-600' : 'bg-black text-white'
                                )}>
                                    {isCredit ? <ArrowDownLeft className="w-12 h-12" /> : <ArrowUpRight className="w-12 h-12" />}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-5">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                                            {isCredit ? "Internal Inflow" : "Outbound Pulse"}
                                        </h2>
                                        <Badge className={cn("px-5 py-2 rounded-xl border-none text-[9px] font-black uppercase tracking-[0.3em] shadow-3xl italic", currentStatus.bg, currentStatus.color)}>
                                            <currentStatus.icon className="w-3.5 h-3.5 mr-2" /> {currentStatus.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-slate-600 font-black text-[10px] uppercase tracking-widest leading-none">Logic Trace Ref:</p>
                                        <p className="text-orange-600 font-black text-sm uppercase tracking-widest italic">{tx.txRef}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left md:text-right bg-black border border-white/5 px-10 py-7 rounded-[2.5rem] shadow-inner group/val">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3 leading-none italic">Net Liquidity Value</p>
                                <p className={cn("text-5xl font-black tracking-tighter group-hover/val:scale-105 transition-transform duration-500 italic", isCredit ? 'text-emerald-500' : 'text-white')}>
                                    {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-12 md:p-16 space-y-16 bg-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            {/* Source Grid */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 p-4 bg-black border border-white/5 rounded-2xl w-fit">
                                    <Database className="w-5 h-5 text-orange-600 animate-pulse" />
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Origin Parameters</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="relative group/field">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                            <UserIcon className="w-3 h-3 text-orange-600" /> Identified Authority
                                        </p>
                                        {user ? (
                                            <Link href={`/admin/users/${user._id}`} className="block group/user">
                                                <div className="p-8 rounded-[2rem] bg-black border border-white/5 group-hover/user:border-orange-600/50 group-hover/user:bg-white/5 transition-all duration-300 shadow-inner">
                                                    <p className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                                        {user.bankInfo?.bio?.firstname} {user.bankInfo?.bio?.lastname}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2 italic">{user.email}</p>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/20 shadow-inner">
                                                <p className="text-xs font-black text-red-500 italic uppercase tracking-widest">ORPHAN_NODE [Identity Redacted]</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Ledger Account</p>
                                            <p className="text-sm font-black text-white font-mono tracking-widest uppercase">{tx.senderAccount || "SYSTEM_CORE"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Service Charge</p>
                                            <p className="text-sm font-black text-orange-600 italic uppercase">{formatCurrency(tx.txCharge, tx.currency)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Regional Logic</p>
                                            <div className="flex items-center gap-4">
                                                <Globe className="w-4 h-4 text-blue-500" />
                                                <p className="text-sm font-black text-white uppercase tracking-tighter italic">{tx.txRegion} / {tx.bankCountry || tx.country || "Global Hub"}</p>
                                            </div>
                                        </div>
                                        {tx.chargesType && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Fee Allocation</p>
                                                <div className="flex items-center gap-3">
                                                    <Zap className="w-4 h-4 text-orange-600" />
                                                    <p className="text-sm font-black text-white uppercase tracking-tighter italic">{tx.chargesType} MODE</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Target Grid */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 p-4 bg-black border border-white/5 rounded-2xl w-fit">
                                    <Globe className="w-5 h-5 text-orange-600" />
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Target Destination</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="p-8 rounded-[2rem] bg-orange-600/5 border border-orange-600/20 relative overflow-hidden group/target shadow-inner">
                                        <div className="absolute top-0 right-0 h-24 w-24 bg-orange-600/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover/target:scale-150 transition-transform"></div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Beneficiary Entity</p>
                                        <p className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{tx.accountHolder}</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-3 py-1 bg-orange-600/10 w-fit rounded-lg shadow-xl italic">{tx.bankName}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Node Account ID</p>
                                            <p className="text-2xl font-black text-orange-600 font-mono tracking-[0.2em]">{tx.bankAccount}</p>
                                        </div>
                                        {tx.accountType && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Account Category</p>
                                                <p className="text-xl font-black text-white italic uppercase">{tx.accountType}</p>
                                            </div>
                                        )}
                                    </div>

                                    {tx.branchName && (
                                        <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Branch Identifier</p>
                                            <div className="flex items-center gap-4">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                <p className="text-sm font-black text-white uppercase tracking-tighter italic">{tx.branchName}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-5">
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Routing Sequences (IFSC / SWIFT / IBAN)</p>
                                        <div className="flex flex-wrap gap-4">
                                            {[tx.routingCode, tx.identifierCode || tx.identifier].filter(Boolean).map((code, idx) => (
                                                <div key={idx} className="px-6 py-3.5 rounded-2xl bg-black border border-white/5 text-white font-mono text-[10px] font-black tracking-[0.2em] shadow-3xl uppercase italic flex items-center gap-3">
                                                    <Fingerprint className="w-3.5 h-3.5 text-orange-500" />
                                                    {code}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 border-t border-white/5 space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-600 shadow-xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic leading-none">Logic Description</h3>
                            </div>
                            <div className="p-12 rounded-[3.5rem] bg-black border border-white/5 shadow-inner relative italic text-slate-400 font-black leading-relaxed text-xl uppercase tracking-tight group/desc overflow-hidden">
                                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                                    <Terminal className="w-32 h-32 text-orange-600" />
                                </div>
                                "{tx.description || tx.txReason || "No encrypted log description provided for this sequence."}"
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Matrix */}
                <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4.5rem] p-16 glass-dark overflow-hidden relative">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/[0.05] rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <CardHeader className="p-0 pb-16 border-b border-white/5 mb-16">
                        <div className="flex items-center gap-8">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center text-orange-600 shadow-3xl">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <div>
                                <CardTitle className="text-4xl font-black text-white tracking-tighter uppercase italic">Verification Matrix</CardTitle>
                                <CardDescription className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] mt-3 italic">Multi-layer regulatory compliance sequences</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                            {[
                                { name: "COT", status: tx.verificationSteps?.cotVerified, label: "Core Origination" },
                                { name: "IMF", status: tx.verificationSteps?.imfVerified, label: "Intl Monetary" },
                                { name: "ESI", status: tx.verificationSteps?.esiVerified, label: "Ext Signature" },
                                { name: "DCO", status: tx.verificationSteps?.dcoVerified, label: "Digital Compliance" },
                                { name: "TAX", status: tx.verificationSteps?.taxVerified, label: "Revenue Audit" },
                                { name: "TAC", status: tx.verificationSteps?.tacVerified, label: "Trans Auth" },
                            ].map((protocol, i) => (
                                <div key={i} className={cn(
                                    "p-10 rounded-[3rem] border flex flex-col justify-between h-48 transition-all duration-500 group relative overflow-hidden shadow-2xl",
                                    protocol.status ? "bg-black/60 border-emerald-500/20 shadow-emerald-500/5 group-hover:border-emerald-500/40" : "bg-black/20 border-white/5 grayscale opacity-50"
                                )}>
                                    {protocol.status && (
                                        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                                    )}
                                    <div className="flex justify-between items-start">
                                        <span className={cn("text-xs font-black uppercase tracking-[0.4em] italic", protocol.status ? "text-slate-500" : "text-slate-700")}>{protocol.name}</span>
                                        {protocol.status ? (
                                            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-slate-800">
                                                <Lock className="w-5 h-5 text-red-900/50" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2 italic">{protocol.label}</p>
                                        <p className={cn("text-[11px] font-black mt-1 italic tracking-widest leading-none", protocol.status ? 'text-emerald-500 underline decoration-2 underline-offset-4' : 'text-slate-800')}>
                                            {protocol.status ? "AUTH_VERIFIED" : "PENDING_INPUT"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Side Metadata Panel */}
            <div className="lg:col-span-4 space-y-12">
                <Card className="bg-slate-900/60 border-white/5 rounded-[4rem] p-12 overflow-hidden relative shadow-3xl text-white group glass-dark">
                    <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-orange-600 opacity-10 rounded-full blur-[100px] group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10 space-y-12">
                        <div className="space-y-10">
                            <div className="flex items-center gap-5 border-b border-white/5 pb-10">
                                <Radio className="w-6 h-6 text-orange-600 animate-pulse" />
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic leading-none">Temporal Logs</h3>
                            </div>

                            <div className="space-y-10">
                                {[
                                    { label: "Initiation Epoch", value: tx.createdAt, icon: Clock },
                                    { label: "Execution Target", value: tx.txDate, icon: Zap },
                                    { label: "Finalization Sync", value: tx.completedAt || "Awaiting Update...", icon: CheckCircle2 },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-8 items-center group/log">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-black border border-white/5 flex items-center justify-center shrink-0 shadow-2xl group-hover/log:bg-orange-600 group-hover/log:text-white transition-all duration-500 text-orange-600">
                                            <log.icon className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] leading-none italic">{log.label}</p>
                                            <p className="text-sm font-black text-white italic tracking-widest leading-none uppercase">
                                                {log.value instanceof Date
                                                    ? `${log.value.toLocaleDateString()} @ ${log.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                    : typeof log.value === 'string' ? (log.value === "Awaiting Update..." ? <span className="text-orange-600 animate-pulse">{log.value}</span> : log.value) : "QUEUED"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-white/5 h-[1px]" />

                        <div className="space-y-10">
                            <div className="flex items-center gap-5">
                                <Cpu className="w-6 h-6 text-orange-600" />
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic leading-none">Execution Overrides</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <Button className="w-full bg-orange-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-[0.3em] text-[10px] h-18 rounded-[1.5rem] shadow-3xl shadow-orange-600/20 group/btn transition-all active:scale-95 border-none">
                                    <Zap className="w-4 h-4 mr-4" /> Force Success Sync
                                </Button>
                                <Button variant="ghost" className="w-full bg-black border border-white/5 text-slate-600 hover:bg-red-600 hover:text-white hover:border-none font-black uppercase tracking-[0.3em] text-[10px] h-18 rounded-[1.5rem] transition-all active:scale-95 shadow-inner">
                                    <XCircle className="w-4 h-4 mr-4" /> Terminate Flow
                                </Button>
                            </div>
                        </div>

                        <div className="pt-10 text-center flex items-center justify-center">
                            <div className="inline-flex items-center gap-5 px-8 py-4 rounded-2xl bg-black border border-white/5 shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700">
                                <Lock className="w-5 h-5 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono leading-none">NODE_IMMUTABLE: RECORD_LOCKED</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Regional Security Context */}
                {tx.txRegion === "international" && (
                    <Card className="bg-orange-600/5 border border-orange-600/20 shadow-3xl rounded-[4rem] p-12 space-y-8 glass-dark overflow-hidden relative group/sec">
                        <div className="absolute -right-8 -top-8 h-48 w-48 bg-orange-600/10 rounded-full blur-3xl group-hover/sec:scale-150 transition-transform duration-1000"></div>
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-black border border-orange-600/20 flex items-center justify-center text-orange-600 shadow-2xl">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Cross-Border Protocol</h3>
                        </div>
                        <p className="text-base font-black text-slate-500 leading-relaxed italic border-l-4 border-orange-600/50 pl-8 uppercase tracking-tight">
                            "This transfer spans international zones. Global COT and IMF clearance sequences are legally mandatory for final ledger settlement."
                        </p>
                    </Card>
                )}
            </div>
        </div>
    )
}
