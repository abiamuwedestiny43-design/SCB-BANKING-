import { Activity, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react"
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
        <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">
                    Bank <span className="text-black">Analytics</span>
                </h1>
                <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">
                    Overview of all transactions, customers, and bank performance.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                    { label: "Total Customers", value: data.totalUsers, change: "+12.4%", icon: Users, accent: "text-black", border: "border-slate-200", iconBg: "bg-slate-50" },
                    { label: "Total Transfers", value: data.totalTransfers, change: "+5.2%", icon: Activity, accent: "text-blue-600", border: "border-blue-200", iconBg: "bg-blue-50" },
                    { label: "Total Volume", value: `$${data.volume.toLocaleString()}`, change: "+8.9%", icon: DollarSign, accent: "text-emerald-600", border: "border-emerald-200", iconBg: "bg-emerald-50" },
                ].map((stat, i) => (
                    <div key={i} className={cn("bg-white rounded-2xl p-6 shadow-sm border-2 flex flex-col gap-4 hover:shadow-md transition-shadow", stat.border)}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-black uppercase tracking-widest">{stat.label}</p>
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.iconBg, stat.accent)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-4xl md:text-5xl font-black text-black tracking-tighter italic">{stat.value}</p>
                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-black bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full w-fit uppercase tracking-widest">
                            <TrendingUp className="w-3.5 h-3.5" /> {stat.change} vs. last month
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl md:text-3xl font-black text-black tracking-tighter italic mb-6">
                    Transaction <span className="text-black">Charts</span>
                </h2>
                <AnalyticsCharts data={data} />
            </div>
        </div>
    )
}
