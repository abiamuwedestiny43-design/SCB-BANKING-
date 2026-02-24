import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, ShieldCheck, Mail, CreditCard, Activity, Lock, Zap, X, ChevronRight } from "lucide-react"
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
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 pb-20 overflow-x-hidden">

      {/* Header Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter italic uppercase leading-tight">
              Client <span className="text-black">Archive</span>
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-black font-bold uppercase tracking-[0.2em] opacity-80">Global Ledger Management Systems</p>
          </div>
          <Link
            href="/admin/users/create"
            className="group relative overflow-hidden bg-black hover:bg-black text-white font-black h-11 md:h-14 px-6 md:px-8 rounded-2xl shadow-xl transition-all flex items-center gap-3 w-fit"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus className="h-4 w-4 md:h-5 md:w-5 relative z-10" />
            <span className="uppercase tracking-widest text-[10px] md:text-xs relative z-10">Deploy New Node</span>
          </Link>
        </div>

        {/* Search Matrix */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl p-3 md:p-5">
          <form method="GET" className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black group-focus-within:text-black transition-colors" />
              <Input
                name="search"
                placeholder="Identify client by name, email or ID..."
                defaultValue={searchParams.search}
                className="pl-11 bg-slate-50 border-slate-200 rounded-xl md:rounded-2xl h-11 md:h-14 text-black focus:border-black transition-all font-bold placeholder:text-black text-xs md:text-sm shadow-inner"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 sm:flex-none h-11 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl bg-black hover:bg-black text-white font-black transition-all uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-orange-200 border-none">
                Execute
              </Button>
              {searchParams.search && (
                <Link
                  href="/admin/users"
                  className="h-11 md:h-14 w-11 md:w-14 rounded-xl md:rounded-2xl bg-slate-100 text-black hover:text-black flex items-center justify-center transition-all hover:bg-red-50 border border-slate-200"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Dynamic Ledger Output */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-20 gap-6 bg-white border border-slate-100 rounded-3xl shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-black animate-pulse">
              <Activity className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-[10px] font-black text-black tracking-[0.3em] uppercase">Initializing Data Streams...</p>
          </div>
        }>
          <UsersTable searchQuery={searchParams.search} />
        </Suspense>
      </div>
    </div>
  )
}

async function UsersTable({ searchQuery }: { searchQuery?: string }) {
  const users = await getUsers(searchQuery)

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="p-4 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter italic uppercase flex items-center gap-3">
            <Users className="h-6 w-6 text-black" />
            {searchQuery ? `Target: "${searchQuery}"` : "Active Ledger"}
          </h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] md:text-[10px] uppercase font-black tracking-widest px-2 py-0.5 animate-pulse">Live</Badge>
            <p className="text-[10px] font-black text-black uppercase tracking-widest">{users.length} Node Identifiers Synced</p>
          </div>
        </div>
      </div>

      {/* Mobile Stream View (Optimized for Small Retinas) */}
      <div className="block lg:hidden divide-y divide-slate-50">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="p-4 space-y-4 hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-black font-black text-lg overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.name[0]
                    )}
                  </div>
                  <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm", user.verified ? "bg-black" : "bg-black")}></div>
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/users/${user.id}`} className="block text-sm font-black text-black hover:text-black transition-colors truncate uppercase tracking-tight">
                    {user.name}
                  </Link>
                  <p className="text-[10px] text-black font-mono tracking-tighter truncate">{user.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-black text-black tracking-tighter italic">
                    {formatCurrency(user.balance, user.currency)}
                  </p>
                  <Badge variant="outline" className="text-[8px] border-slate-200 text-black font-black uppercase tracking-widest mt-1">USD ASSET</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-black font-mono bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 tracking-widest">{user.bankNumber}</span>
                  <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none shadow-sm",
                    user.verified ? "bg-emerald-600 text-white" : "bg-black text-white"
                  )}>
                    {user.verified ? "verified" : "unverified"}
                  </Badge>
                </div>
                <UserActions userId={user.id} />
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-20 text-center">
            <Activity className="w-10 h-10 text-slate-100 mx-auto mb-4" />
            <p className="text-[10px] font-black text-black uppercase tracking-widest italic leading-relaxed">
              No matching client identifiers found in the current sector.
            </p>
          </div>
        )}
      </div>

      {/* Data Grid View (Desktop+) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-black">
              <th className="px-8 py-5">Node Identity</th>
              <th className="px-8 py-5">Network Access</th>
              <th className="px-8 py-5">Asset Balance</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-black font-black text-xl transition-all group-hover:scale-110 group-hover:border-black/50 shadow-sm overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.name[0]
                          )}
                        </div>
                        <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white shadow-md", user.verified ? "bg-black" : "bg-black")}></div>
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/users/${user.id}`} className="block text-base font-black text-black hover:text-black transition-colors truncate uppercase tracking-tighter">
                          {user.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {user.roles.map((role) => (
                            <Badge key={role} className="bg-black text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 italic">
                              {role}
                            </Badge>
                          ))}
                          <span className="text-[10px] text-black font-mono tracking-tighter truncate max-w-[120px]">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-black text-black uppercase tracking-[0.1em]">
                        <CreditCard className="w-3.5 h-3.5" /> {user.bankNumber}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-black">
                        <Activity className="w-3 h-3" /> Reg: {new Date(user.registerTime).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-xl font-black text-black tracking-tighter italic">
                        {formatCurrency(user.balance, user.currency)}
                      </p>
                      <span className="text-[8px] font-black uppercase text-black tracking-[0.2em]">{user.currency} ASSET VALUE</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                        user.verified ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                      )}>
                        {user.verified ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {user.verified ? "Verified" : "Restricted"}
                      </div>
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        user.canTransfer ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-slate-100 border-slate-200 text-black"
                      )}>
                        {user.canTransfer ? <Zap className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {user.canTransfer ? "Active Nodes" : "Locked Nodes"}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end pr-2">
                      <UserActions userId={user.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-32 text-center">
                  <Activity className="w-12 h-12 text-slate-100 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-black text-black uppercase tracking-widest italic">Node Query Returned Null</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
