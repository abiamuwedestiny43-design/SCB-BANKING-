"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, ShieldAlert, Key, UserCheck, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
    return (
        <div className="p-4 md:p-10 space-y-8 min-h-screen bg-slate-50/50">
            <div className="flex flex-col gap-2 relative z-10">
                <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-3">
                    <Shield className="w-8 h-8 text-orange-700" />
                    Security <span className="text-orange-700">Center</span>
                </h1>
                <p className="text-slate-900 font-black uppercase text-[10px] tracking-widest mt-1">
                    Monitor threats, enforce policies, and audit system integrity.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white border-green-200 shadow-sm shadow-green-100 rounded-[2rem] p-6 lg:col-span-1 border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-green-700" /> System Threat Level
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-green-600 mb-2">LOW</div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            No critical vulnerabilities detected. Regular scans active.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <Key className="w-4 h-4 text-orange-700" /> Password Strength
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-black mb-2">94%</div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Users compliant with complexity rules.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6 lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-blue-700" /> Active Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-black mb-2">14</div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Authenticated administrators.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="audit" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 inline-flex h-12">
                    <TabsTrigger value="audit" className="rounded-lg px-6 h-10 text-xs font-bold uppercase tracking-wide">Audit Log</TabsTrigger>
                    <TabsTrigger value="policies" className="rounded-lg px-6 h-10 text-xs font-bold uppercase tracking-wide">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="space-y-4">
                    <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-100">
                                    <TableHead className="w-[100px] text-xs font-black text-slate-700 uppercase tracking-widest">Event ID</TableHead>
                                    <TableHead className="text-right text-xs font-black text-slate-700 uppercase tracking-widest">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { id: "EVT-8921", action: "Login Attempt", user: "admin@novabank.com", status: "Success", time: "2 mins ago", statusColor: "green" },
                                    { id: "EVT-8920", action: "Password Change", user: "user_492@gmail.com", status: "Success", time: "15 mins ago", statusColor: "green" },
                                    { id: "EVT-8919", action: "Bulk Transfer", user: "finance_lead@novabank.com", status: "Failed (Limit Exceeded)", time: "1 hour ago", statusColor: "red" },
                                    { id: "EVT-8918", action: "API Key Generated", user: "dev_team", status: "Success", time: "3 hours ago", statusColor: "blue" },
                                    { id: "EVT-8917", action: "Login Attempt", user: "unknown_ip_82.11...", status: "Blocked", time: "5 hours ago", statusColor: "orange" },
                                ].map((log) => (
                                    <TableRow key={log.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                        <TableCell className="font-mono text-xs text-slate-500">{log.id}</TableCell>
                                        <TableCell className="font-bold text-black font-black uppercase text-xs tracking-tight">{log.action}</TableCell>
                                        <TableCell className="text-slate-900 font-bold text-xs">{log.user}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`
                        ${log.statusColor === 'green' ? 'bg-green-50 text-green-700' : ''}
                        ${log.statusColor === 'red' ? 'bg-red-50 text-red-700' : ''}
                        ${log.statusColor === 'blue' ? 'bg-blue-50 text-blue-700' : ''}
                        ${log.statusColor === 'orange' ? 'bg-orange-50 text-orange-700' : ''}
                      `}>
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-400 text-xs font-medium">{log.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="policies" className="space-y-4">
                    <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Enforce 2FA for Admins", desc: "Require Two-Factor Authentication for all administrative accounts.", active: true },
                                { name: "Password Complexity", desc: "Require minimal 12 characters with symbols and numbers.", active: true },
                                { name: "Session Timeout (15m)", desc: "Automatically logout inactive users after 15 minutes.", active: false },
                                { name: "IP Whitelisting", desc: "Only allow admin access from approved IP ranges.", active: false },
                            ].map((policy, i) => (
                                <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-black text-black uppercase tracking-tight italic">{policy.name}</p>
                                        <p className="text-sm text-slate-900 font-bold">{policy.desc}</p>
                                    </div>
                                    <Switch defaultChecked={policy.active} />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-red-50 border-red-100 shadow-sm rounded-[2rem] p-6 mt-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 rounded-full text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-lg font-bold text-red-900">Emergency Lockdown</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        This will immediately terminate all active sessions and prevent new logins except for root administrators.
                                    </p>
                                </div>
                                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">
                                    Initiate Lockdown Protocol
                                </Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
