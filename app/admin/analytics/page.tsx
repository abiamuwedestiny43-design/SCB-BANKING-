import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import AnalyticsCharts from "@/components/admin/analytics-charts"

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
        <div className="p-4 md:p-10 space-y-8 relative min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight">
                        Analytics <span className="text-indigo-700">Console</span>
                    </h1>
                    <p className="text-slate-900 font-black uppercase text-[10px] tracking-widest mt-1">Real-time insights into platform performance.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-black text-black uppercase tracking-widest">Live Updates Active</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-indigo-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-widest">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-black mb-2">{data.totalUsers}</div>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg w-fit">
                            <TrendingUp className="w-3 h-3" /> +12% this month
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24 text-blue-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-widest">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-black mb-2">{data.totalTransfers}</div>
                        <div className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg w-fit">
                            <TrendingUp className="w-3 h-3" /> +5% today
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-lg shadow-indigo-200 rounded-[2rem] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <DollarSign className="w-24 h-24 text-white" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-indigo-200 uppercase tracking-widest">Total Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-white mb-2">
                            ${data.volume.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-white/80 text-xs font-bold bg-white/10 px-2 py-1 rounded-lg w-fit">
                            Lifetime Volume
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <AnalyticsCharts data={data} />
        </div>
    )
}
