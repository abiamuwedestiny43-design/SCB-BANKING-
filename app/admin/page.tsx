import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, ArrowLeftRight, DollarSign, Zap, Activity, ShieldCheck, Globe, ArrowUpRight, Cpu, Layers, Radio, RefreshCw, Fingerprint } from "lucide-react"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import CardModel from "@/models/Card"
import Link from "next/link"
import { cn } from "@/lib/utils"

async function getDashboardStats() {
  await dbConnect()

  const [totalUsers, totalTransfers, totalCards, pendingApprovals] = await Promise.all([
    User.countDocuments(),
    Transfer.countDocuments(),
    CardModel.countDocuments(),
    User.countDocuments({ "bankAccount.verified": false }),
  ])

  return {
    totalUsers,
    totalTransfers,
    totalCards,
    pendingApprovals,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Live Telemetry System
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            COMMAND <span className="text-orange-600 italic">CENTER</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-lg text-lg uppercase tracking-tight">Central hub for monitoring global financial equilibrium and administrative clearances.</p>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/50 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 shadow-2xl glass-dark">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Grid Security</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <p className="text-sm font-black text-white uppercase tracking-widest">Authorized</p>
            </div>
          </div>
          <div className="h-12 w-[1px] bg-white/5"></div>
          <div className="h-16 w-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl relative overflow-hidden group">
            <Activity className="w-8 h-8 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Core Matrix Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {[
          {
            title: "Identity Registry",
            value: stats.totalUsers,
            icon: Users,
            color: "text-orange-600",
            bg: "bg-orange-500/5",
            desc: "Active Account Sequences",
            link: "/admin/users"
          },
          {
            title: "Remittance Log",
            value: stats.totalTransfers,
            icon: ArrowLeftRight,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
            desc: "Verified Transactions",
            link: "/admin/transactions"
          },
          {
            title: "Asset Distribution",
            value: stats.totalCards,
            icon: CreditCard,
            color: "text-purple-500",
            bg: "bg-purple-500/5",
            desc: "Issued Liquid Cards",
            link: "/admin/cards"
          },
          {
            title: "Security Queue",
            value: stats.pendingApprovals,
            icon: ShieldCheck,
            color: "text-red-500",
            bg: "bg-red-500/5",
            desc: "Awaiting Vetting",
            link: "/admin/users?filter=pending"
          },
        ].map((stat, i) => (
          <Link key={i} href={stat.link}>
            <Card className="bg-slate-900/40 border-white/5 hover:border-orange-600/50 hover:shadow-3xl transition-all duration-500 group cursor-pointer overflow-hidden relative rounded-[3rem] p-4 glass-dark">
              <div className={`absolute -right-8 -top-8 w-32 h-32 ${stat.bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-6 relative z-10">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">{stat.title}</CardTitle>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 bg-black border border-white/5 shadow-2xl group-hover:bg-white group-hover:text-slate-950", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2">
                <div className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 origin-left transition-transform italic">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{stat.desc}</p>
                  <ArrowUpRight className="w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Primary Operational Grid */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Rapid Execution Matrix */}
            <Card className="bg-slate-900/60 rounded-[3.5rem] p-10 overflow-hidden relative border border-white/5 shadow-3xl glass-dark">
              <div className="absolute top-0 right-0 h-40 w-40 bg-orange-600/10 rounded-full blur-[80px]"></div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase italic">
                <Zap className="w-6 h-6 text-orange-500" /> Rapid Ops
              </h3>
              <div className="space-y-4">
                <Link href="/admin/transfer-codes" className="block group">
                  <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:bg-orange-600/10 hover:border-orange-600/40 transition-all flex items-center justify-between shadow-inner">
                    <div className="space-y-1">
                      <p className="font-black text-white text-sm uppercase">Security Protocols</p>
                      <p className="text-[9px] text-slate-500 font-black tracking-[0.2em]">Synchronize COT / TAC Sequences</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform border-none">
                      <Cpu className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
                <Link href="/admin/settings" className="block group">
                  <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:bg-blue-600/10 hover:border-blue-600/40 transition-all flex items-center justify-between shadow-inner">
                    <div className="space-y-1">
                      <p className="font-black text-white text-sm uppercase">Grid Configuration</p>
                      <p className="text-[9px] text-slate-500 font-black tracking-[0.2em]">Modify System Architecture</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform border-none">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Live Audit Log */}
            <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[3.5rem] p-10 group overflow-hidden relative glass-dark">
              <div className="absolute top-0 right-0 h-40 w-40 bg-blue-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4 relative z-10 uppercase italic">
                <Activity className="w-6 h-6 text-blue-500" /> Live Audit
              </h3>
              <div className="space-y-4 relative z-10">
                {[
                  { color: "text-orange-500", label: "CLEARANCE", text: "Admin Access Granted", time: "02m ago", icon: ShieldCheck },
                  { color: "text-blue-500", label: "REMITTANCE", text: "Global Asset Sync", time: "14m ago", icon: RefreshCw },
                  { color: "text-orange-500", label: "IDENTITY", text: "KYC Sequence Initiated", time: "28m ago", icon: Fingerprint },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black border border-white/5 group hover:bg-slate-900 hover:border-white/20 transition-all duration-300 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center shadow-xl", item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-600 tracking-[0.3em] mb-0.5 uppercase">{item.label}</p>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{item.text}</p>
                      </div>
                    </div>
                    <p className="text-[9px] font-black text-slate-700 italic">{item.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Global Connectivity Placeholder */}
          <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] p-12 h-[340px] relative overflow-hidden group glass-dark">
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase leading-none">Global Ledger <span className="text-orange-600">Sync</span></h3>
              <p className="text-slate-500 text-lg font-bold uppercase tracking-tight">Synchronizing real-time assets across 12 Sovereign regions.</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 scale-150 group-hover:scale-100 blur-sm group-hover:blur-none pointer-events-none">
              <Globe className="w-[800px] h-[800px] text-orange-600" />
            </div>
            <div className="absolute bottom-12 left-12 flex gap-12 z-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Active Nodes</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-orange-600 italic">12</p>
                  <p className="text-sm font-black text-slate-800 mb-1 tracking-widest">/ 12</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Latency</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-blue-500 italic">14</p>
                  <p className="text-sm font-black text-slate-800 mb-1 tracking-widest">MS</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic Security Integrity */}
        <div className="space-y-10">
          <Card className="bg-slate-950 border border-white/5 rounded-[3.5rem] p-10 shadow-3xl relative overflow-hidden h-full flex flex-col glass-dark">
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="space-y-2 mb-10 relative z-10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Integrity Level</p>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Sovereign <span className="text-white/30">Shield</span></h3>
            </div>
            <div className="space-y-8 relative z-10 flex-1">
              {[
                { label: "Core Oracle", status: "Secure", health: 100, color: "bg-emerald-500" },
                { label: "Clearing Matrix", status: "Operational", health: 98, color: "bg-orange-500" },
                { label: "Vault Auth", status: "Secure", health: 100, color: "bg-emerald-500" },
                { label: "Regional Bridge", status: "Nominal", health: 94, color: "bg-blue-500" },
              ].map((service, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">{service.label}</span>
                    <span className="text-[10px] text-white font-black uppercase tracking-widest italic">{service.status}</span>
                  </div>
                  <div className="h-2 w-full bg-black rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-1000 relative",
                      service.color,
                      service.health === 100 && "w-full",
                      service.health === 98 && "w-[98%]",
                      service.health === 94 && "w-[94%]"
                    )}>
                      <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-10 border-t border-white/5 relative z-10">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-6">Security Bulletin</p>
              <div className="p-6 rounded-[2rem] bg-black border border-white/5 shadow-inner">
                <p className="text-xs text-orange-100/40 leading-relaxed italic font-bold">
                  "System entropy remains within standard deviations. Encryption tunnels report 100% data integrity for the latest transfer block."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
