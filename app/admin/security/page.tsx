"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Shield, ShieldAlert, Key, UserCheck, AlertTriangle, Lock, Zap, Search, Activity, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">
                        Bank <span className="text-black">Security</span>
                    </h1>
                    <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">
                        Manage security settings, access controls, and fraud prevention.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-black animate-pulse shadow-lg shadow-black/50"></div>
                    <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">All Systems Secure</p>
                </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: "Security Status", value: "All Clear", icon: ShieldAlert, accent: "text-emerald-600", border: "border-emerald-200", iconBg: "bg-emerald-50", desc: "No threats detected" },
                    { label: "Policy Compliance", value: "94.8%", icon: Key, accent: "text-black", border: "border-slate-200", iconBg: "bg-slate-50", desc: "Meets all security policies" },
                    { label: "Active Admin Sessions", value: "12", icon: UserCheck, accent: "text-blue-600", border: "border-blue-200", iconBg: "bg-blue-50", desc: "Currently logged in admins" },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border-2 flex flex-col gap-3 hover:shadow-md transition-shadow ${stat.border}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-black uppercase tracking-widest">{stat.label}</p>
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.accent}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className={`text-3xl md:text-4xl font-black tracking-tighter italic ${stat.accent}`}>{stat.value}</p>
                        <p className="text-xs text-black font-bold uppercase tracking-widest opacity-70">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="audit" className="w-full">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl gap-1 h-auto shadow-sm mb-6">
                    <TabsTrigger value="audit" className="rounded-xl px-6 h-10 text-xs font-black uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                        Audit Log
                    </TabsTrigger>
                    <TabsTrigger value="policies" className="rounded-xl px-6 h-10 text-xs font-black uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                        Security Policies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="mt-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-black tracking-tighter italic">Activity Log</h3>
                                <p className="text-xs text-black font-bold uppercase tracking-widest mt-1">Recent account and admin activity</p>
                            </div>
                            <Button variant="outline" className="rounded-xl border-slate-200 font-black text-xs uppercase tracking-widest hover:border-black hover:text-black h-10 px-4 transition-all gap-2">
                                <Search className="w-4 h-4" /> Filter
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-100">
                                        <TableHead className="px-6 py-4 text-xs font-black text-black uppercase tracking-widest">Event ID</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-black text-black uppercase tracking-widest">Action</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-black text-black uppercase tracking-widest">User</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-black text-black uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="px-6 py-4 text-right text-xs font-black text-black uppercase tracking-widest">Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { id: "EVT-8921", action: "Login", user: "admin@scbbankiing.com", status: "Success", time: "2 min ago", statusColor: "emerald" },
                                        { id: "EVT-8920", action: "Password Change", user: "user_492", status: "Success", time: "15 min ago", statusColor: "emerald" },
                                        { id: "EVT-8919", action: "Large Transfer", user: "user_gate_9", status: "Blocked", time: "1 hr ago", statusColor: "red" },
                                        { id: "EVT-8918", action: "API Key Generated", user: "dev_node", status: "Success", time: "3 hr ago", statusColor: "blue" },
                                        { id: "EVT-8917", action: "Failed Login", user: "unknown", status: "Flagged", time: "5 hr ago", statusColor: "orange" },
                                    ].map((log) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                                            <TableCell className="px-6 py-4 font-mono text-xs font-black text-black uppercase">{log.id}</TableCell>
                                            <TableCell className="px-6 py-4 text-black font-black text-sm">{log.action}</TableCell>
                                            <TableCell className="px-6 py-4 text-black font-bold text-sm">{log.user}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge className={cn(
                                                    "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest",
                                                    log.statusColor === 'emerald' && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                                                    log.statusColor === 'red' && "bg-red-50 text-red-700 border border-red-200",
                                                    log.statusColor === 'blue' && "bg-blue-50 text-blue-700 border border-blue-200",
                                                    log.statusColor === 'orange' && "bg-slate-50 text-black border border-slate-200",
                                                )}>
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right text-black text-xs font-bold">{log.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="policies" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-black">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-black tracking-tighter italic">Security Policies</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { name: "Two-Factor Authentication", desc: "Require 2FA for all admin accounts.", active: true },
                                    { name: "Strong Password Policy", desc: "Require 12+ character passwords for all users.", active: true },
                                    { name: "Auto Session Timeout", desc: "Automatically log out inactive sessions after 15 min.", active: false },
                                    { name: "IP Whitelist Only", desc: "Restrict admin access to known IP addresses.", active: false },
                                ].map((policy, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4">
                                        <div className="space-y-0.5">
                                            <p className="font-black text-black text-sm uppercase tracking-tight">{policy.name}</p>
                                            <p className="text-xs text-black font-bold">{policy.desc}</p>
                                        </div>
                                        <Switch defaultChecked={policy.active} className="data-[state=checked]:bg-black" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-black tracking-tighter italic">Emergency Lockdown</h3>
                                        <p className="text-xs font-black text-red-600 uppercase tracking-widest">Use with caution</p>
                                    </div>
                                </div>
                                <p className="text-sm text-black font-bold leading-relaxed mb-4">
                                    Immediately suspend all active user sessions and lock the bank system. Manual admin re-authorization will be required to resume operations.
                                </p>
                                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all">
                                    Activate Emergency Lockdown
                                </Button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-lg font-black text-black tracking-tighter italic mb-4">Security Health</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Data Encryption", val: 100 },
                                        { label: "System Isolation", val: 85 },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                <span className="text-black">{item.label}</span>
                                                <span className="text-emerald-600">{item.val}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <Progress value={item.val} className="h-full bg-black rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
