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
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
            Customer <span className="text-orange-600">Directory</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">Manage all registered bank customers and their accounts.</p>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-black h-12 px-6 rounded-2xl shadow-sm transition-all gap-2">
          <Link href="/admin/users/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="uppercase tracking-widest text-xs">Add Customer</span>
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <form method="GET" className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              name="search"
              placeholder="Search by name, email, or account number..."
              defaultValue={searchParams.search}
              className="pl-10 bg-slate-50 border-slate-200 rounded-xl h-11 text-slate-900 focus:border-orange-500 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
          <Button type="submit" className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-black transition-all uppercase tracking-widest text-xs">
            Search
          </Button>
          {searchParams.search && (
            <Button variant="ghost" asChild className="h-11 px-4 rounded-xl text-slate-500 hover:text-slate-900 font-black uppercase tracking-widest text-xs">
              <Link href="/admin/users">Clear</Link>
            </Button>
          )}
        </form>
      </div>

      {/* Customers Table */}
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-16 gap-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Activity className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 tracking-widest uppercase">Loading customers...</p>
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter italic">
            {searchQuery ? `Results for "${searchQuery}"` : "All Customers"}
          </h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{users.length} {users.length === 1 ? 'customer' : 'customers'} found</p>
        </div>
        <div className="px-4 py-2 bg-orange-50 border-2 border-orange-200 rounded-2xl">
          <p className="text-xs font-black text-orange-600 uppercase tracking-widest">{users.length} Total</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact & Account</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-900 font-black text-lg overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user.name[0]
                          )}
                        </div>
                        <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white", user.verified ? "bg-emerald-500" : "bg-red-500")}></div>
                      </div>
                      <div>
                        <Link href={`/admin/users/${user.id}`} className="block text-sm font-black text-slate-900 hover:text-orange-600 transition-colors">
                          {user.name}
                        </Link>
                        <div className="flex gap-1.5 mt-1">
                          {user.roles.map((role) => (
                            <Badge key={role} className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest">
                        <CreditCard className="w-3.5 h-3.5" /> {user.bankNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-black text-slate-900 tracking-tighter italic">
                      {formatCurrency(user.balance, user.currency)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-widest border w-fit",
                        user.verified
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      )}>
                        {user.verified ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {user.verified ? "Verified" : "Unverified"}
                      </div>
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-widest border w-fit",
                        user.canTransfer
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      )}>
                        {user.canTransfer ? <Zap className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {user.canTransfer ? "Transfers On" : "Transfers Off"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActions userId={user.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-black uppercase tracking-widest text-sm italic">
                  {searchQuery ? `No customers found matching "${searchQuery}"` : "No customers found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
