"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  ShieldCheck,
  Activity,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
  Search,
  Filter,
  Zap,
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
        // Fetch stats from multiple endpoints or a single dashboard endpoint if it existed
        // For now, let's simulate or fetch selectively
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
        <Activity className="w-10 h-10 text-orange-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Initializing Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-8 pb-20">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
            Executive <span className="text-orange-600">Oversight</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">
            Real-time operational monitoring and system analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg gap-2">
            <Link href="/admin/users/create">
              <Plus className="h-4 w-4" /> New Customer
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Secure</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Asset Value", value: formatCurrency(stats.totalBalance, "USD"), icon: Wallet, color: "text-orange-600", bg: "bg-orange-50", trend: "+2.4% vs last mo" },
          { label: "Active Customers", value: stats.activeUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: `${stats.totalUsers} total registered` },
          { label: "System Volume", value: stats.totalTransactions, icon: Activity, color: "text-purple-600", bg: "bg-purple-50", trend: `${stats.pendingTransactions} pending auth` },
          { label: "Network Health", value: `${stats.systemHealth}%`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "0 active vulnerabilities" },
        ].map((stat, i) => (
          <Card key={i} className="bg-white border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:rotate-12", stat.bg, stat.color, "border-opacity-20", stat.color.replace('text', 'border'))}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className={cn("text-2xl md:text-3xl font-black tracking-tighter italic", i === 3 ? "text-emerald-600" : "text-slate-900")}>{stat.value}</p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: i === 3 ? '100%' : '65%' }}></div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area - Recent Transactions */}
        <Card className="lg:col-span-8 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Recent Activity</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live feed of global financial sequences</CardDescription>
            </div>
            <Button asChild variant="outline" className="h-10 px-6 rounded-xl border-slate-200 font-black gap-2 text-slate-500 hover:border-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest text-[9px]">
              <Link href="/admin/transactions">
                View All Transactions <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((tx) => (
                  <div key={tx._id} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                        tx.txType === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                      )}>
                        {tx.txType === 'credit' ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                          {tx.recipient || tx.userName || "External Ledger"}
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.description || "System Provision"}</p>
                          <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-xl font-black tracking-tighter italic",
                        tx.txType === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                      )}>
                        {tx.txType === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || 'USD')}
                      </p>
                      <Badge className={cn(
                        "mt-1 text-[8px] font-black uppercase tracking-[0.2em] border-none shadow-sm",
                        tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 px-2' :
                          tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 px-2' :
                            'bg-red-500/10 text-red-500 px-2'
                      )}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4 opacity-30">
                  <Database className="h-10 w-10 mx-auto text-slate-400" />
                  <p className="text-xs font-black uppercase tracking-widest">No recent transactions indexed</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card className="bg-slate-900 border-none shadow-2xl rounded-[2.5rem] overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl"></div>
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black italic tracking-tighter uppercase leading-none">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-6 grid grid-cols-2 gap-4">
              {[
                { label: "New User", icon: UserPlus, href: "/admin/users/create", accent: "bg-orange-600" },
                { label: "Codes", icon: Lock, href: "/admin/transfer-codes", accent: "bg-blue-600" },
                { label: "Settings", icon: Globe, href: "/admin/settings", accent: "bg-purple-600" },
                { label: "Analytics", icon: BarChart3, href: "/admin/analytics", accent: "bg-emerald-600" },
              ].map((action, i) => (
                <Button key={i} asChild variant="ghost" className="h-28 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all flex flex-col items-center justify-center gap-3 group">
                  <Link href={action.href}>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg", action.accent)}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* System Health / Logs */}
          <Card className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900 tracking-tighter italic uppercase leading-none flex items-center gap-3">
                <Activity className="h-5 w-5 text-orange-600" /> Security Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { msg: "Global security protocols updated", time: "12m ago", icon: ShieldCheck, color: "text-emerald-500" },
                { msg: "New admin login detected", time: "1h ago", icon: Lock, color: "text-blue-500" },
                { msg: "Daily backup synchronized", time: "3h ago", icon: Database, color: "text-purple-500" },
                { msg: "External API handshakes secure", time: "5h ago", icon: Globe, color: "text-cyan-500" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-default">
                  <div className={cn("mt-1", log.color)}>
                    <log.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover:text-slate-900 transition-colors">{log.msg}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-all mt-4">
                View System Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
