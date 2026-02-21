"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Shield, ShieldAlert, Key, UserCheck, AlertTriangle, Fingerprint, Lock, Zap, Search, Activity, Terminal, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SecurityPage() {
    return (
        <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-red-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

            {/* Industrial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                        <Lock className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Security Protocol Hub
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
                        SECURITY <span className="text-orange-600">CORE</span>
                    </h1>
                    <p className="text-sm md:text-lg text-slate-500 font-bold max-w-lg uppercase tracking-widest opacity-60">Central command for threat mitigation, policy enforcement, and integrity audits.</p>
                </div>

                <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Defense Level</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                            <p className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">Alpha-Max Secure</p>
                        </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5"></div>
                    <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
                        <Fingerprint className="w-6 h-6 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Quick Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                {[
                    { label: "Threat Matrix", value: "CLEAN", icon: ShieldAlert, color: "text-emerald-500", bg: "bg-emerald-600/10", desc: "No active breaches detected" },
                    { label: "Complexity Score", value: "94.8%", icon: Key, color: "text-orange-600", bg: "bg-orange-600/10", desc: "Global policy compliance" },
                    { label: "Active Nodes", value: "12", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-600/10", desc: "Authorized admin sessions" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[3.5rem] p-10 relative overflow-hidden glass-dark group h-full transition-all duration-500 hover:-translate-y-2">
                        <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700", stat.bg)}></div>
                        <CardHeader className="p-0 pb-8 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">{stat.label}</CardTitle>
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-3xl bg-black", stat.color)}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 italic uppercase">{stat.value}</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="audit" className="w-full relative z-10">
                <TabsList className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-2 rounded-[2rem] gap-2 mb-12 h-auto glass-dark shadow-3xl">
                    <TabsTrigger value="audit" className="rounded-2xl px-10 h-14 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all shadow-2xl">
                        Audit Log Trace
                    </TabsTrigger>
                    <TabsTrigger value="policies" className="rounded-2xl px-10 h-14 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all shadow-2xl">
                        Global Protocols
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="mt-0">
                    <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
                                    <Activity className="w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Live Sequence Feed</h3>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">Tracing global account activity across all nodes</p>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-2xl border-white/10 bg-black/40 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black h-14 px-8 transition-all">
                                <Search className="w-4 h-4 mr-3" /> Filter Sequences
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-black/40 hover:bg-black/40 border-b border-white/5">
                                        <TableHead className="w-[180px] p-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Sequence ID</TableHead>
                                        <TableHead className="p-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Execution Action</TableHead>
                                        <TableHead className="p-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Authorized Identity</TableHead>
                                        <TableHead className="p-10 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Logic State</TableHead>
                                        <TableHead className="p-10 text-right text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Sync Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { id: "EVT-8921", action: "Login Sequence", user: "admin_alpha@danamonbk.com", status: "Verified", time: "2m Cycle", statusColor: "emerald" },
                                        { id: "EVT-8920", action: "Key Update", user: "identity_node_492", status: "Verified", time: "15m Cycle", statusColor: "emerald" },
                                        { id: "EVT-8919", action: "Bulk Transfer", user: "liquidity_gate_9", status: "Denied (Limit)", time: "1h Cycle", statusColor: "red" },
                                        { id: "EVT-8918", action: "Protocol Gen", user: "dev_core_node", status: "Verified", time: "3h Cycle", statusColor: "blue" },
                                        { id: "EVT-8917", action: "Auth Attempt", user: "unknown_proxy_82", status: "Intercepted", time: "5h Cycle", statusColor: "orange" },
                                    ].map((log) => (
                                        <TableRow key={log.id} className="hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-all duration-500">
                                            <TableCell className="p-10 font-mono text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.id}</TableCell>
                                            <TableCell className="p-10 text-white font-black uppercase text-base tracking-tighter italic">{log.action}</TableCell>
                                            <TableCell className="p-10 text-slate-400 font-black text-[10px] uppercase tracking-tighter italic">{log.user}</TableCell>
                                            <TableCell className="p-10">
                                                <Badge className={cn(
                                                    "px-5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl transform group-hover:scale-105 transition-all",
                                                    log.statusColor === 'emerald' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                                                    log.statusColor === 'red' && "bg-red-500/10 text-red-500 border border-red-500/20",
                                                    log.statusColor === 'blue' && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                                                    log.statusColor === 'orange' && "bg-orange-600/10 text-orange-600 border border-orange-600/20",
                                                )}>
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-10 text-right text-slate-600 text-[9px] font-black uppercase tracking-widest italic">{log.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="policies" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] p-12 glass-dark">
                            <div className="mb-12 flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-3xl">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Active Guard Protocols</h3>
                            </div>
                            <div className="space-y-12">
                                {[
                                    { name: "Mandatory 2FA Interface", desc: "Require dual-layer verification for all executive nodes.", active: true },
                                    { name: "Hard-Shell Logic", desc: "12+ character entropy required for all identity keys.", active: true },
                                    { name: "Session Hyper-Kill", desc: "Automatically terminate stagnant nodes after 15m.", active: false },
                                    { name: "Static Node Only", desc: "Restrict administrative access to authorized IP footprints.", active: false },
                                ].map((policy, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="space-y-3">
                                            <p className="font-black text-white uppercase tracking-widest text-xl leading-none group-hover:text-orange-600 transition-colors italic">{policy.name}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight max-w-sm leading-relaxed">{policy.desc}</p>
                                        </div>
                                        <Switch defaultChecked={policy.active} className="data-[state=checked]:bg-orange-600 scale-125 border-white/5 bg-black" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="space-y-10">
                            <Card className="bg-red-950/20 border border-red-900/20 shadow-3xl rounded-[4rem] p-12 text-white relative overflow-hidden group glass-dark">
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                    <AlertTriangle className="w-48 h-48 text-red-600" />
                                </div>
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-5 text-red-500">
                                        <div className="h-16 w-16 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shadow-3xl animate-pulse">
                                            <Zap className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Emergency Lockdown</h3>
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mt-3">Protocol: OMEGA-ZERO</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-black text-red-200/40 leading-relaxed italic uppercase tracking-widest">
                                        Immediate termination of all active proxy sessions. External node synchronization will be severed. Manual root authorization required for cold boot.
                                    </p>
                                    <Button className="w-full h-18 bg-red-600 hover:bg-white hover:text-red-900 text-white font-black rounded-3xl uppercase tracking-[0.3em] text-[10px] shadow-3xl group/btn border-none transition-all duration-500">
                                        <Terminal className="w-5 h-5 mr-4 group-hover:animate-bounce" /> Initiate Lockdown Sequence
                                    </Button>
                                </div>
                            </Card>

                            <Card className="bg-slate-900/40 border border-white/5 shadow-3xl rounded-[4rem] p-12 text-white relative overflow-hidden group glass-dark">
                                <CardHeader className="p-0 mb-10 border-b border-white/5 pb-10 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Integrity Sync</CardTitle>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-3">Cross-Node Validation</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-3xl animate-[spin_4s_linear_infinite]">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 space-y-10">
                                    {[
                                        { label: "Encryption Mesh", val: 100 },
                                        { label: "Node Isolation", val: 85 },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
                                                <span className="text-slate-500">{item.label}</span>
                                                <span className="text-emerald-500 italic shadow-lg shadow-emerald-500/20">{item.val}% Verified</span>
                                            </div>
                                            <div className="h-2.5 bg-black border border-white/5 rounded-full overflow-hidden p-[1px] shadow-inner">
                                                <Progress value={item.val} className="h-full bg-orange-600 rounded-full transition-all duration-1000" />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
