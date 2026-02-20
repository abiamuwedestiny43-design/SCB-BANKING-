import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, ShieldCheck, Mail, CreditCard, ChevronRight, Activity, Fingerprint, Lock, Zap, X } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { formatCurrency } from "@/lib/utils/banking"
import UserActions from "@/components/admin/user-actions"
import { cn } from "@/lib/utils"

async function getUsers(searchQuery?: string) {
  await dbConnect()

  let query = {}
  if (searchQuery) {
    query = {
      $or: [
        { email: { $regex: searchQuery, $options: "i" } },
        { "bankInfo.bio.firstname": { $regex: searchQuery, $options: "i" } },
        { "bankInfo.bio.lastname": { $regex: searchQuery, $options: "i" } },
        { bankNumber: { $regex: searchQuery, $options: "i" } },
      ],
    }
  }

  const users = await User.find(query)
    .select("email bankInfo bankBalance bankNumber bankAccount roles registerTime profileImage")
    .sort({ registerTime: -1 })
    .limit(100)

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    name: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
    bankNumber: user.bankNumber,
    balance: user.bankBalance.get("USD") || 0,
    currency: user.bankInfo.system.currency,
    verified: user.bankAccount.verified,
    canTransfer: user.bankAccount.canTransfer,
    profileImage: user.profileImage,
    roles: user.roles,
    registerTime: user.registerTime,
  }))
}

export default async function UsersPage({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Fingerprint className="w-3.5 h-3.5 text-orange-500" /> Identity Matrix
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
            ENTITY <span className="text-orange-600 italic">DIRECTORY</span>
          </h1>
          <p className="text-slate-400 font-bold max-w-lg text-base uppercase tracking-tight">Central registry for global account sequences and verification clearance.</p>
        </div>

        <Button asChild className="bg-slate-900 hover:bg-orange-600 text-white font-black h-16 px-10 rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 group border border-white/5">
          <Link href="/admin/users/create" className="flex items-center gap-3">
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
            <span className="uppercase tracking-[0.2em] text-[10px]">Initialize Account</span>
          </Link>
        </Button>
      </div>

      {/* Execution Matrix / Search */}
      <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 relative z-10 overflow-hidden glass-dark">
        <div className="absolute top-0 right-0 h-40 w-40 bg-orange-500/5 rounded-full blur-3xl opacity-50"></div>
        <form method="GET" className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-orange-600 transition-colors" />
            <Input
              name="search"
              placeholder="QUERY_BY_IDENTITY_HASH..."
              defaultValue={searchParams.search}
              className="pl-16 bg-slate-950 border-white/5 rounded-[2rem] h-16 text-white focus:border-orange-500 focus:ring-orange-500/10 transition-all font-bold placeholder:text-slate-700 text-base shadow-inner uppercase tracking-tight"
            />
          </div>
          <Button type="submit" className="h-16 px-12 rounded-[2rem] bg-orange-600 hover:bg-white hover:text-slate-900 text-white font-black shadow-xl shadow-orange-600/20 transition-all uppercase tracking-widest text-[10px] border-none">
            Filter Registry
          </Button>
          {searchParams.search && (
            <Button variant="ghost" asChild className="h-16 px-8 rounded-[2rem] text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">
              <Link href="/admin/users">Clear Logic</Link>
            </Button>
          )}
        </form>
      </Card>

      {/* Registry Matrix */}
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-slate-900/40 border border-white/5 rounded-[4rem] shadow-2xl glass-dark">
          <Activity className="w-16 h-16 text-orange-600 animate-spin" />
          <p className="text-[10px] font-black text-slate-500 tracking-[0.5em] animate-pulse uppercase">SYNCHRONIZING INFRASTRUCTURE...</p>
        </div>
      }>
        <UsersTable searchQuery={searchParams.search} />
      </Suspense>
    </div>
  )
}

async function UsersTable({ searchQuery }: { searchQuery?: string }) {
  const users = await getUsers(searchQuery)

  return (
    <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[4rem] overflow-hidden relative z-10 glass-dark">
      <CardHeader className="p-8 md:p-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">
              {searchQuery ? `Telemetry Results` : "Infrastructure Nodes"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
              {searchQuery ? `Scanning Matrix For: ${searchQuery}` : "Authorized Access Register"}
            </CardDescription>
          </div>
          <div className="p-6 bg-black border border-white/5 rounded-[2rem] flex flex-col items-end min-w-[200px] shadow-2xl">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Authenticated Nodes</p>
            <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{users.length}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/40 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
                <th className="px-6 md:px-12 py-6 md:py-8">Entity Identifier</th>
                <th className="px-6 md:px-12 py-6 md:py-8">Banking Sequence</th>
                <th className="px-6 md:px-12 py-6 md:py-8">Asset Liquidity</th>
                <th className="px-6 md:px-12 py-6 md:py-8">Clearance Status</th>
                <th className="px-6 md:px-12 py-6 md:py-8 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-orange-600/5 transition-all duration-500"
                  >
                    <td className="px-6 md:px-12 py-8 md:py-10">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 border-2 border-white/5 flex items-center justify-center text-white font-black text-xl overflow-hidden shadow-2xl group-hover:scale-110 group-hover:border-orange-600/50 transition-all duration-500">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              user.name[0]
                            )}
                          </div>
                          <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-slate-900 group-hover:scale-125 transition-transform", user.verified ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "bg-red-500 shadow-lg shadow-red-500/20")}></div>
                        </div>
                        <div className="space-y-1">
                          <Link href={`/admin/users/${user.id}`} className="block text-base md:text-lg font-black text-white hover:text-orange-500 transition-colors uppercase tracking-tight">
                            {user.name}
                          </Link>
                          <div className="flex gap-2">
                            {user.roles.map((role) => (
                              <Badge key={role} className="bg-slate-950 group-hover:bg-orange-600 text-slate-500 group-hover:text-white border border-white/5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 transition-all duration-500">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-12 py-8 md:py-10 text-slate-400 font-bold group-hover:text-white transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs tracking-tight">
                          <Mail className="w-3.5 h-3.5 text-slate-700" /> {user.email}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">
                          <CreditCard className="w-3.5 h-3.5" /> {user.bankNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-12 py-8 md:py-10">
                      <div className="text-xl md:text-2xl font-black text-white tracking-tighter group-hover:scale-110 origin-left transition-transform duration-500 italic">
                        {formatCurrency(user.balance, user.currency)}
                      </div>
                    </td>
                    <td className="px-6 md:px-12 py-8 md:py-10">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-4 w-4 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-all", user.verified ? "bg-orange-500/10 border-orange-500/30 text-orange-500" : "bg-red-500/10 border-red-500/30 text-red-500")}>
                            {user.verified ? <ShieldCheck className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          </div>
                          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", user.verified ? "text-orange-500" : "text-red-500")}>
                            {user.verified ? "Verified_Protocol" : "Security_Locked"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={cn("h-4 w-4 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-all", user.canTransfer ? "bg-blue-500/10 border-blue-500/30 text-blue-500" : "bg-slate-800 border-white/5 text-slate-600")}>
                            {user.canTransfer ? <Zap className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                          </div>
                          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", user.canTransfer ? "text-blue-400" : "text-slate-600")}>
                            {user.canTransfer ? "Active_Matrix" : "Access_Restricted"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-12 py-8 md:py-10 text-right">
                      <div className="flex justify-end group-hover:translate-x-[-8px] transition-transform duration-500">
                        <UserActions userId={user.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-12 py-32 text-center text-slate-700 font-black uppercase tracking-[0.5em] italic">
                    {searchQuery ? `No telemetry matches for "${searchQuery}"` : "The registry matrix is currently offline."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
