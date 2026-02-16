import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, ShieldCheck, Mail, CreditCard, ChevronRight } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { formatCurrency } from "@/lib/utils/banking"
import UserActions from "@/components/admin/user-actions"

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
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-orange-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest">
            <Users className="w-3 h-3" /> User Management
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">
            User <span className="text-slate-500 italic">Management</span>
          </h1>
          <p className="text-slate-900 font-bold max-w-md">Manage and view the global FIRST STATE BANK user base.</p>
        </div>

        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-black h-12 px-8 rounded-xl shadow-xl shadow-orange-600/10 transition-all hover:scale-105 active:scale-95">
          <Link href="/admin/users/create" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Account
          </Link>
        </Button>
      </div>

      {/* Search Card */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-[2.5rem] p-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-orange-50 rounded-full blur-3xl"></div>
        <form method="GET" className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-600/30" />
            <Input
              name="search"
              placeholder="Search by name, email, or account number..."
              defaultValue={searchParams.search}
              className="pl-12 bg-white border-slate-200 rounded-2xl h-14 text-slate-900 focus:border-orange-600 focus:ring-orange-600/20 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
          <Button type="submit" className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold shadow-lg shadow-black/10 transition-all">
            Execute Search
          </Button>
          {searchParams.search && (
            <Button variant="ghost" asChild className="h-14 px-6 rounded-2xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 font-bold">
              <Link href="/admin/users">Reset</Link>
            </Button>
          )}
        </form>
      </Card>

      {/* Users Table */}
      <Suspense fallback={<div className="flex items-center gap-2 text-orange-600 font-black animate-pulse">
        <Users className="w-5 h-5 animate-bounce" /> LOADING REGISTERED ENTITIES...
      </div>}>
        <UsersTable searchQuery={searchParams.search} />
      </Suspense>
    </div>
  )
}

async function UsersTable({ searchQuery }: { searchQuery?: string }) {
  const users = await getUsers(searchQuery)

  return (
    <Card className="bg-white border-slate-200 shadow-xl rounded-[3rem] overflow-hidden relative z-10">
      <CardHeader className="p-8 border-b border-slate-100 bg-white/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-black text-black italic tracking-tight uppercase">
              {searchQuery ? `Query Results (${users.length})` : "User Directory"}
            </CardTitle>
            <CardDescription className="text-slate-900 font-black uppercase text-[10px] tracking-widest mt-1">
              {searchQuery ? `Filtering for "${searchQuery}"` : "Global register of First State Bank users."}
            </CardDescription>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Accounts</p>
              <p className="text-xl font-black text-orange-600">{users.length}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                <th className="px-8 py-6">User Identity</th>
                <th className="px-8 py-6">Banking Details</th>
                <th className="px-8 py-6">Liquid Balance</th>
                <th className="px-8 py-6">Asset Status</th>
                <th className="px-8 py-6 text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-white/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black text-lg overflow-hidden shadow-inner">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user.name[0]
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/users/${user.id}`} className="block text-sm font-black text-black hover:text-orange-700 transition-colors uppercase tracking-tight">
                            {user.name}
                          </Link>
                          <div className="flex gap-2 mt-1">
                            {user.roles.map((role) => (
                              <Badge key={role} className="bg-slate-100 border-none text-[9px] font-black uppercase tracking-tighter text-slate-500 px-1.5 py-0 group-hover:text-orange-600 group-hover:bg-orange-50 transition-colors">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                          <Mail className="w-3 h-3 text-slate-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <CreditCard className="w-3 h-3" /> {user.bankNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-lg font-black text-black tracking-tighter">
                        {formatCurrency(user.balance, user.currency)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.verified ? 'bg-orange-600' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.verified ? 'text-orange-700' : 'text-red-700'}`}>
                            {user.verified ? "Verified" : "Pending Vetting"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.canTransfer ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.2)]' : 'bg-slate-300'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.canTransfer ? 'text-blue-600' : 'text-slate-400'}`}>
                            {user.canTransfer ? "Active Access" : "Locked"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end scale-110 group-hover:translate-x-[-4px] transition-transform">
                        <UserActions userId={user.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic font-bold">
                    {searchQuery ? `No entities matching "${searchQuery}" found in the directory.` : "The global user directory is currently empty."}
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
