"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShieldCheck,
  Activity,
  ArrowRight,
  Plus,
  BarChart3,
  Globe,
  Lock,
  Database
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    systemHealth: 98,
    recentActivity: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, txRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/transactions?limit=5")
        ])

        const usersData = await usersRes.json()
        const txData = await txRes.json()

        const users = usersData.users || []
        const totalBalance = users.reduce((acc: number, u: any) => acc + (u.bankAccount?.balance || 0), 0)

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u: any) => u.bankAccount?.verified).length,
          totalBalance: totalBalance,
          totalTransactions: txData.total || 0,
          pendingTransactions: (txData.transactions || []).filter((t: any) => t.status === 'pending').length,
          systemHealth: 100,
          recentActivity: txData.transactions || []
        })
      } catch (error) {
        console.error("Dashboard error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center gap-4">
        <Activity className="w-10 h-10 text-black animate-spin" />
        <p className="text-sm font-black text-black uppercase tracking-widest leading-none">Initializing Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 md:space-y-8 pb-20">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter italic">
            Executive <span className="text-black">Oversight</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">
            Real-time operational monitoring and system analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users/create"
            className="h-10 md:h-12 px-4 md:px-6 rounded-2xl bg-black hover:bg-black text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Customer
          </Link>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="h-2 w-2 rounded-full bg-black animate-pulse"></div>
            <p className="text-[10px] font-black text-black uppercase tracking-widest">Network Secure</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Total Asset Value", value: formatCurrency(stats.totalBalance, "USD"), icon: Wallet, color: "text-black", bg: "bg-slate-50", borderColor: "border-slate-200", trend: "+2.4% vs last mo" },
          { label: "Active Customers", value: stats.activeUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", borderColor: "border-blue-200", trend: `${stats.totalUsers} total registered` },
          { label: "System Volume", value: stats.totalTransactions, icon: Activity, color: "text-purple-600", bg: "bg-purple-50", borderColor: "border-black", trend: `${stats.pendingTransactions} pending auth` },
          { label: "Network Health", value: `${stats.systemHealth}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", borderColor: "border-emerald-200", trend: "0 active vulnerabilities" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className={cn("bg-white border-2 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-shadow p-4 md:p-6 space-y-3 md:space-y-4", stat.borderColor)}>
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center flex-shrink-0", stat.bg, stat.color)}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest truncate">{stat.label}</p>
                  <p className={cn("text-lg md:text-2xl lg:text-3xl font-black tracking-tighter italic", i === 3 ? "text-emerald-600" : "text-black")}>{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: i === 3 ? '100%' : '65%' }}></div>
                </div>
                <p className="text-[8px] md:text-[9px] font-black text-black uppercase tracking-widest whitespace-nowrap hidden sm:block">{stat.trend}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area - Recent Transactions */}
        <div className="lg:col-span-8 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-black text-black tracking-tighter italic uppercase">Recent Activity</h2>
              <p className="text-[10px] md:text-xs font-bold text-black uppercase tracking-widest mt-1">Live feed of financial sequences</p>
            </div>
            <Link
              href="/admin/transactions"
              className="h-9 md:h-10 px-4 md:px-6 rounded-xl border border-slate-200 font-black gap-2 text-black hover:border-black hover:text-black transition-all uppercase tracking-widest text-[9px] flex items-center w-fit"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((tx) => (
                <div key={tx._id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center gap-3 md:gap-6 min-w-0">
                    <div className={cn(
                      "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0",
                      tx.txType === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-black'
                    )}>
                      {tx.txType === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-black text-black uppercase tracking-widest group-hover:text-black transition-colors truncate">
                        {tx.recipient || tx.userName || "External Ledger"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[9px] md:text-[10px] font-bold text-black uppercase tracking-widest truncate">{tx.description || "System Provision"}</p>
                        <div className="h-1 w-1 rounded-full bg-slate-200 hidden sm:block"></div>
                        <p className="text-[9px] md:text-[10px] font-bold text-black uppercase tracking-widest hidden sm:block">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className={cn(
                      "text-sm md:text-lg font-black tracking-tighter italic",
                      tx.txType === 'credit' ? 'text-emerald-600' : 'text-black'
                    )}>
                      {tx.txType === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || 'USD')}
                    </p>
                    <Badge className={cn(
                      "mt-1 text-[8px] font-black uppercase tracking-widest border-none",
                      tx.status === 'success' ? 'bg-black/10 text-black' :
                        tx.status === 'pending' ? 'bg-black/10 text-black' :
                          'bg-black/10 text-black'
                    )}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 md:p-20 text-center space-y-4 opacity-30">
                <Database className="h-10 w-10 mx-auto text-black" />
                <p className="text-xs font-black uppercase tracking-widest">No recent transactions indexed</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-black rounded-2xl text-white relative shadow-xl p-4 md:p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-lg md:text-xl font-black italic tracking-tighter uppercase leading-none mb-4 md:mb-6 relative z-10">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Link href="/admin/users/create" className="block h-24 md:h-28 rounded-xl bg-black/80 border border-black/50 hover:border-black/50 hover:bg-black hover:scale-[1.03] transition-all group shadow-lg">
                <div className="h-full flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center text-white shadow-lg bg-black group-hover:bg-black transition-colors">
                    <UserPlus className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">New User</span>
                </div>
              </Link>

              <Link href="/admin/loans" className="block h-24 md:h-28 rounded-xl bg-black/80 border border-black/50 hover:border-black/50 hover:bg-black hover:scale-[1.03] transition-all group shadow-lg">
                <div className="h-full flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center text-white shadow-lg bg-blue-600 group-hover:bg-black transition-colors">
                    <Database className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">Manage Loans</span>
                </div>
              </Link>

              <Link href="/admin/cards" className="block h-24 md:h-28 rounded-xl bg-black/80 border border-black/50 hover:border-black/50 hover:bg-black hover:scale-[1.03] transition-all group shadow-lg">
                <div className="h-full flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center text-white shadow-lg bg-emerald-600 group-hover:bg-black transition-colors">
                    <Wallet className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">Cards Stock</span>
                </div>
              </Link>
              <Link href="/admin/analytics" className="block h-24 md:h-28 rounded-xl bg-black/80 border border-black/50 hover:border-black/50 hover:bg-black hover:scale-[1.03] transition-all group shadow-lg">
                <div className="h-full flex flex-col items-center justify-center gap-2 md:gap-3">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center text-white shadow-lg bg-black group-hover:bg-black transition-colors">
                    <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">Analytics</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Security Feed */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100">
              <h3 className="text-lg md:text-xl font-black text-black tracking-tighter italic uppercase leading-none flex items-center gap-3">
                <Activity className="h-5 w-5 text-black" /> Security Feed
              </h3>
            </div>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4 group cursor-default">
                <div className="mt-0.5 text-black flex-shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">Global security protocols updated</p>
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">12m ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 group cursor-default">
                <div className="mt-0.5 text-black flex-shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">New admin login detected</p>
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">1h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 group cursor-default">
                <div className="mt-0.5 text-black flex-shrink-0">
                  <Database className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">Daily backup synchronized</p>
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">3h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 group cursor-default">
                <div className="mt-0.5 text-black flex-shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-[11px] font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">External API handshakes secure</p>
                  <p className="text-[9px] font-bold text-black uppercase tracking-widest">5h ago</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-black hover:text-black transition-all mt-2">
                View System Logs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
