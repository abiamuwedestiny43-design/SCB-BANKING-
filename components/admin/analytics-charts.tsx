"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts"
import { Activity, TrendingUp, Zap, Server, ShieldCheck, Cpu } from "lucide-react"

interface AnalyticsData {
    dailyVolume: { date: string; amount: number }[]
    userGrowth: { date: string; users: number }[]
    statusDistribution: { name: string; value: number }[]
}

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Transaction Volume Chart */}
            <Card className="lg:col-span-12 bg-white border-slate-100 shadow-2xl rounded-[4rem] p-12 overflow-hidden relative group glass">
                <div className="absolute top-0 right-0 h-64 w-64 bg-black/[0.03] rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-12 p-0 border-b border-slate-50 mb-12">
                    <div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-black mb-3">
                            <Activity className="w-4 h-4" /> Global Flux
                        </div>
                        <CardTitle className="text-3xl font-black text-black tracking-tighter uppercase italic">Transaction Volume Matrix</CardTitle>
                        <CardDescription className="text-black font-bold uppercase text-[9px] tracking-widest mt-2">Active liquidity throughput across the sovereign node (30-day cycle)</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.dailyVolume}>
                                <defs>
                                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                    tickMargin={20}
                                    stroke="#94a3b8"
                                    fontFamily="Inter, sans-serif"
                                    fontWeight="900"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                    stroke="#94a3b8"
                                    tickMargin={20}
                                    fontFamily="Inter, sans-serif"
                                    fontWeight="900"
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-black border border-black p-6 rounded-[1.5rem] shadow-2xl backdrop-blur-xl">
                                                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-2">{payload[0].payload.date}</p>
                                                    <p className="text-2xl font-black text-white tracking-tighter italic">
                                                        ${payload[0].value?.toLocaleString()}
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 bg-black rounded-full animate-pulse"></div>
                                                        <span className="text-[9px] font-black text-black uppercase tracking-widest">Verified Sequence</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#volumeGradient)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card className="lg:col-span-12 xxl:col-span-8 bg-white border-slate-100 shadow-2xl rounded-[4rem] p-12 overflow-hidden relative group glass">
                <CardHeader className="flex flex-row items-center justify-between pb-12 p-0 border-b border-slate-50 mb-12">
                    <div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-3">
                            <TrendingUp className="w-4 h-4" /> Expansion Vector
                        </div>
                        <CardTitle className="text-3xl font-black text-black tracking-tighter uppercase italic">Identity Registry Growth</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                    tickMargin={20}
                                    stroke="#94a3b8"
                                    fontWeight="900"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={10}
                                    stroke="#94a3b8"
                                    tickMargin={20}
                                    fontWeight="900"
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white border border-slate-100 p-6 rounded-[1.5rem] shadow-2xl">
                                                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
                                                    <p className="text-2xl font-black text-black tracking-tighter">
                                                        {payload[0].value?.toLocaleString()} ENTITIES
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Line
                                    type="stepAfter"
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={{ fill: '#3b82f6', strokeWidth: 4, r: 6, stroke: '#fff' }}
                                    activeDot={{ r: 10, strokeWidth: 0 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* System Efficiency */}
            <Card className="lg:col-span-12 xxl:col-span-4 bg-black border-none shadow-2xl rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Server className="w-48 h-48" />
                </div>
                <CardHeader className="p-0 mb-12 relative z-10">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-black mb-4">
                        <Zap className="w-4 h-4" /> Integrity Sync
                    </div>
                    <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">System Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative z-10 space-y-10">
                    {data.statusDistribution.map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-black uppercase tracking-widest block mb-1">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-black animate-pulse"></div>
                                        <span className="text-sm font-black text-emerald-400 uppercase">Active Protocol</span>
                                    </div>
                                </div>
                                <span className="text-3xl font-black italic tracking-tighter text-white">{item.value}%</span>
                            </div>
                            <div className="h-3 bg-black rounded-full overflow-hidden p-1 shadow-inner border border-black/50">
                                <Progress value={item.value} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000" />
                            </div>
                        </div>
                    ))}

                    <div className="pt-8 border-t border-black">
                        <div className="flex items-center gap-4 p-6 bg-black/50 rounded-[2rem] border border-black">
                            <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center text-black shadow-xl">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-black uppercase tracking-widest">Security Status</p>
                                <p className="text-xs font-black text-white uppercase tracking-tighter">Sovereign Encryption Locked</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
