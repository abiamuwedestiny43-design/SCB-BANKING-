import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, User as UserIcon, ShieldCheck, Activity, Globe, CreditCard, Mail, Phone, MapPin, Clock, Fingerprint, Lock, Shield, Zap, Database, Radio } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import { formatCurrency } from "@/lib/utils/banking"
import { Separator } from "@/components/ui/separator"
import UserActions from "@/components/admin/user-actions"
import { cn } from "@/lib/utils"

async function getUserDetails(id: string) {
  await dbConnect()
  const user = await User.findById(id)
  if (!user) return null

  const transfers = await Transfer.find({
    $or: [{ bankAccount: user.bankNumber }, { senderAccount: user.bankNumber }],
  })
    .sort({ createdAt: -1 })
    .limit(10)

  return {
    id: user._id.toString(),
    email: user.email,
    name: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
    bankNumber: user.bankNumber,
    userCode: user.usercode,
    phone: user.bankInfo.bio.phone,
    address: user.bankInfo.address.location,
    city: user.bankInfo.address.city,
    state: user.bankInfo.address.state,
    country: user.bankInfo.address.country,
    zipcode: user.bankInfo.address.zipcode,
    currency: user.bankInfo.system.currency,
    balance: user.bankBalance.get(user.bankInfo.system.currency) || 0,
    verified: user.bankAccount.verified,
    canTransfer: user.bankAccount.canTransfer,
    canLocalTransfer: user.bankAccount.canLocalTransfer,
    canInternationalTransfer: user.bankAccount.canInternationalTransfer,
    profileImage: user.profileImage,
    roles: user.roles,
    registerTime: user.registerTime,
    transfers: transfers.map((t) => ({
      id: t._id.toString(),
      amount: t.amount,
      currency: t.currency,
      txRef: t.txRef,
      txReason: t.txReason,
      txStatus: t.txStatus,
      createdAt: t.createdAt,
    })),
  }
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="flex items-center gap-8">
          <Button variant="ghost" asChild className="h-16 w-16 rounded-2xl bg-slate-900 border border-white/5 hover:bg-white hover:text-slate-900 transition-all p-0 shadow-2xl group">
            <Link href="/admin/users">
              <ArrowLeft className="h-8 w-8 group-hover:-translate-x-2 transition-transform" />
            </Link>
          </Button>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
              <Fingerprint className="w-3.5 h-3.5 text-orange-500" /> Identity Logic Trace
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              NODE <span className="text-orange-600 italic">PROFILE</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl glass-dark">
          <Button asChild className="h-14 px-8 rounded-2xl bg-white hover:bg-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] border-none transition-all shadow-xl">
            <Link href={`/admin/users/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-3" />
              Modify Logic
            </Link>
          </Button>
          <UserActions userId={params.id} />
        </div>
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="h-20 w-20 rounded-[2.5rem] bg-slate-900 border border-white/5 text-orange-600 shadow-3xl flex items-center justify-center animate-spin">
            <Zap className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Initializing Neural Link...</p>
        </div>
      }>
        <UserDetailsContent userId={params.id} />
      </Suspense>
    </div>
  )
}

async function UserDetailsContent({ userId }: { userId: string }) {
  const user = await getUserDetails(userId)
  if (!user) notFound()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
      {/* Primary Data Hub */}
      <div className="lg:col-span-8 space-y-12">
        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark group transition-all duration-500">
          <CardHeader className="p-12 md:p-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
              <Fingerprint className="w-48 h-48 text-white" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
              <div className="flex items-center gap-10">
                <div className="w-28 h-28 rounded-[3rem] bg-slate-950 border-4 border-white shadow-2xl flex items-center justify-center text-white text-5xl font-black overflow-hidden group-hover:scale-110 transition-transform duration-500 group-hover:border-orange-600/50">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">{user.name}</h2>
                  <div className="flex gap-3 mt-6">
                    {user.roles.map((role) => (
                      <Badge key={role} className="bg-orange-600 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right bg-black border border-white/5 px-8 py-6 rounded-[2.5rem] shadow-inner">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 leading-none">Register Epoch</p>
                <p className="text-white font-black text-lg tracking-widest italic">{new Date(user.registerTime).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="flex items-center gap-4 p-4 bg-orange-600/10 rounded-2xl w-fit border border-orange-600/20">
                  <Database className="w-5 h-5 text-orange-600 animate-pulse" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node Parameters</h3>
                </div>

                <div className="space-y-10">
                  {[
                    { label: "Matrix Identity", value: user.email, icon: Mail },
                    { label: "Core Node ID", value: user.bankNumber, icon: CreditCard, mono: true },
                    { label: "Security Code", value: user.userCode, icon: ShieldCheck, mono: true },
                    { label: "Currency Protocol", value: user.currency, icon: Globe },
                  ].map((item, i) => (
                    <div key={i} className="group/field">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-orange-600" /> {item.label}
                      </p>
                      <p className={cn("text-lg font-black text-white group-hover/field:text-orange-500 transition-colors uppercase italic tracking-tighter", item.mono && 'font-mono text-orange-500 tracking-widest')}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-center gap-4 p-4 bg-blue-600/10 rounded-2xl w-fit border border-blue-600/20">
                  <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Link Access</h3>
                </div>

                <div className="space-y-10">
                  {[
                    { label: "Comms Channel", value: user.phone, icon: Phone },
                    { label: "Physical Node", value: `${user.address}, ${user.city}, ${user.state} ${user.zipcode}, ${user.country}`, icon: MapPin },
                  ].map((item, i) => (
                    <div key={i} className="group/field">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-blue-600" /> {item.label}
                      </p>
                      <p className="text-lg font-black text-white group-hover/field:text-blue-500 transition-colors uppercase leading-tight italic tracking-tighter">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neural Activity Log */}
        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark">
          <CardHeader className="p-12 md:p-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-4 uppercase">
                <Activity className="w-8 h-8 text-blue-500 animate-pulse" /> Live Pulse Feed
              </CardTitle>
              <CardDescription className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mt-3 italic">Historical node synchronization logs</CardDescription>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white shadow-2xl">
              <Lock className="w-6 h-6 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {user.transfers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="px-12 py-8">State</th>
                      <th className="px-12 py-8">Logic Trace</th>
                      <th className="px-12 py-8 text-right">Value Flux</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {user.transfers.map((transfer) => (
                      <tr key={transfer.id} className="hover:bg-orange-600/5 transition-all group">
                        <td className="px-12 py-8">
                          <Badge className={cn(
                            "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border-none",
                            transfer.txStatus === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          )}>
                            {transfer.txStatus === 'success' ? 'Synchronized' : transfer.txStatus}
                          </Badge>
                        </td>
                        <td className="px-12 py-8">
                          <p className="text-base font-black text-white uppercase tracking-tighter italic group-hover:text-orange-500 transition-colors">{transfer.txReason}</p>
                          <p className="text-[10px] font-mono font-black text-slate-700 tracking-widest mt-1 uppercase">REF_{transfer.txRef}</p>
                        </td>
                        <td className="px-12 py-8 text-right">
                          <p className="text-xl font-black text-white tracking-tighter italic group-hover:scale-110 origin-right transition-transform">{formatCurrency(transfer.amount, transfer.currency)}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-24 text-center space-y-8">
                <div className="w-24 h-24 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center mx-auto shadow-inner">
                  <Activity className="w-12 h-12 text-slate-800" />
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">No active node synchronizations detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Side Integrity Panel */}
      <div className="lg:col-span-4 space-y-12">
        <Card className="bg-slate-900 border-none rounded-[4rem] p-12 overflow-hidden relative shadow-3xl text-white group glass-dark">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 opacity-10 rounded-full blur-[100px] group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] leading-none">Net Liquidity Sum</p>
              <p className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">
                {formatCurrency(user.balance, user.currency)}
              </p>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-orange-500 animate-pulse" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Protocol States</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Identity Verified", status: user.verified, type: 'primary' },
                  { label: "Transfer Perms", status: user.canTransfer, type: 'status' },
                  { label: "Local Sync", status: user.canLocalTransfer, type: 'status' },
                  { label: "Global Sync", status: user.canInternationalTransfer, type: 'status' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:bg-orange-600/10 transition-all border-white/5 group/state">
                    <span className="text-[10px] font-black text-slate-400 group-hover/state:text-white uppercase tracking-widest transition-colors">{item.label}</span>
                    <Badge className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black shadow-xl border-none",
                      item.status ? "bg-orange-600 text-white" : "bg-red-950 text-red-500 border border-red-900/50"
                    )}>
                      {item.status ? "GRANTED" : "REVOKED"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex items-center justify-center">
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <Clock className="w-4 h-4 text-slate-700" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest uppercase">Active Node Since {new Date(user.registerTime).getFullYear()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Matrix Advisory */}
        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[3.5rem] p-12 glass-dark overflow-hidden relative">
          <div className="absolute top-0 right-0 h-40 w-40 bg-orange-600/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-orange-500 shadow-2xl">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrity Advisory</h3>
          </div>
          <p className="text-sm font-bold text-slate-500 leading-relaxed italic border-l-4 border-orange-600/50 pl-6">
            "Node integrity is nominal. No high-risk anomalies detected in neural activity. All sequence originations match verified geolocations."
          </p>
        </Card>
      </div>
    </div>
  )
}
