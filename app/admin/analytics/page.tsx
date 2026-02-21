import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowUpRight, TrendingUp, Users, DollarSign, Radio, Globe, Zap, Cpu, BarChart3 } from "lucide-react"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import AnalyticsCharts from "@/components/admin/analytics-charts"
import { cn } from "@/lib/utils"

async function getAnalytics() {
    await dbConnect()

    const [totalUsers, totalTransfers, totalVolume] = await Promise.all([
        User.countDocuments(),
        Transfer.countDocuments(),
        Transfer.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
    ])

    // Mock time-series data for demonstration
    const dailyVolume = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.floor(Math.random() * 5000) + 1000
    }))

    const userGrowth = Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
        users: 100 + i * 50 + Math.floor(Math.random() * 20)
    }))

    const statusDistribution = [
        { name: "Server Uptime", value: 99.9 },
        { name: "Transaction Success Rate", value: 98.5 },
        { name: "API Response Time (<200ms)", value: 95 }
    ]

    return {
        totalUsers,
        totalTransfers,
        volume: totalVolume[0]?.total || 0,
        dailyVolume,
        userGrowth,
        statusDistribution
    }
}

export default async function AnalyticsPage() {
    const data = await getAnalytics()

    return (
        <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
            {/* High-Tech Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

            {/* Industrial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                        <BarChart3 className="w-3.5 h-3.5 text-orange-500" /> Intelligence Console
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
                        SYSTEM <span className="text-orange-600">ANALYTICS</span>
                    </h1>
                    <p className="text-sm md:text-lg text-slate-500 font-bold max-w-lg uppercase tracking-widest opacity-60">Real-time telemetry and deep-layer data intelligence from the Sovereign node.</p>
                </div>

                <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Update Frequency</p>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">Live Updates Active</p>
                        </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5"></div>
                    <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
                        <Cpu className="w-6 h-6 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                {[
                    { label: "Total Users", value: data.totalUsers, change: "+12.4%", icon: Users, color: "text-orange-600", bg: "bg-orange-600/10" },
                    { label: "Total Transfers", value: data.totalTransfers, change: "+5.2%", icon: Activity, color: "text-blue-500", bg: "bg-blue-600/10" },
                    { label: "Total Volume", value: `$${data.volume.toLocaleString()}`, change: "+8.9%", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-600/10" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 relative overflow-hidden glass-dark group transition-all duration-500 hover:-translate-y-2">
                        <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700", stat.bg)}></div>
                        <CardHeader className="flex flex-row items-center justify-between pb-8 p-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">{stat.label}</CardTitle>
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-3xl border border-white/5 bg-black", stat.color)}>
                                <stat.icon className="h-7 w-7" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 italic">{stat.value}</div>
                            <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full w-fit uppercase tracking-widest shadow-2xl">
                                <TrendingUp className="w-3.5 h-3.5" /> {stat.change} <span className="text-slate-600 ml-1">v. previous cycle</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="relative z-10">
                <AnalyticsCharts data={data} />
            </div>
        </div>
    )
}
