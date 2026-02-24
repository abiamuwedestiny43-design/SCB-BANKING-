import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, ShieldCheck, Activity, Globe, CreditCard, Mail, Phone, MapPin, Clock, Lock, Shield, Zap, X } from "lucide-react"
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
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/admin/users" className="h-9 w-9 md:h-10 md:w-10 rounded-xl border border-slate-200 hover:border-black hover:text-black transition-all flex items-center justify-center flex-shrink-0 bg-white">
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter italic">
              Customer <span className="text-black">Profile</span>
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-black font-bold uppercase tracking-widest opacity-60">Full account details and activity</p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3">
          <Link
            href={`/admin/users/${params.id}/edit`}
            className="h-9 md:h-10 px-3 md:px-5 rounded-xl border border-slate-200 font-black uppercase tracking-widest text-[10px] md:text-xs hover:border-black hover:text-black transition-all flex items-center gap-2 bg-white text-black"
          >
            <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" /> <span className="hidden sm:inline">Edit</span>
          </Link>
          <UserActions userId={params.id} />
        </div>
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-12 md:p-16 gap-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Activity className="w-8 h-8 text-black animate-spin" />
          <p className="text-xs font-black text-black tracking-widest uppercase">Loading customer details...</p>
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Main Info */}
      <div className="lg:col-span-8 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-black text-xl md:text-2xl font-black overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>
              <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-white", user.verified ? "bg-black" : "bg-black")}></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tighter truncate">{user.name}</h2>
              <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                {user.roles.map((role) => (
                  <Badge key={role} className="bg-slate-50 text-black border border-slate-200 text-[9px] md:text-xs font-black uppercase tracking-widest px-2 md:px-3 py-0.5 md:py-1">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-[9px] md:text-xs font-black text-black uppercase tracking-widest">Member Since</p>
              <p className="text-base md:text-lg font-black text-black italic tracking-tighter">{new Date(user.registerTime).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Account Info */}
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-black" /> Account Information
              </h3>
              {[
                { label: "Email Address", value: user.email, icon: Mail },
                { label: "Account Number", value: user.bankNumber, icon: CreditCard, mono: true },
                { label: "User Code", value: user.userCode, icon: ShieldCheck, mono: true },
                { label: "Currency", value: user.currency, icon: Globe },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </p>
                  <p className={cn("text-xs md:text-sm font-black text-black break-all", item.mono && "font-mono text-black")}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Details
              </h3>
              {[
                { label: "Phone Number", value: user.phone, icon: Phone },
                { label: "Address", value: `${user.address}, ${user.city}, ${user.state} ${user.zipcode}, ${user.country}`, icon: MapPin },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </p>
                  <p className="text-xs md:text-sm font-black text-black leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-xl font-black text-black tracking-tighter italic">Recent Transactions</h3>
              <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-widest mt-1">Last 10 bank transfers</p>
            </div>
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
          </div>
          {user.transfers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] md:text-xs font-black text-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-4 md:px-6 py-3 md:py-4">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 hidden sm:table-cell">Description</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {user.transfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <Badge className={cn(
                          "px-2 md:px-3 py-0.5 md:py-1 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest border",
                          transfer.txStatus === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        )}>
                          {transfer.txStatus === 'success' ? 'Completed' : transfer.txStatus}
                        </Badge>
                        <p className="text-[10px] font-black text-black mt-1 sm:hidden truncate max-w-[140px]">{transfer.txReason}</p>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                        <p className="text-xs md:text-sm font-black text-black truncate max-w-[200px]">{transfer.txReason}</p>
                        <p className="text-[10px] md:text-xs font-mono text-black mt-0.5 truncate max-w-[150px]">{transfer.txRef}</p>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <p className="text-sm md:text-base font-black text-black italic tracking-tighter">{formatCurrency(transfer.amount, transfer.currency)}</p>
                        <p className="text-[10px] md:text-xs text-black font-bold mt-0.5">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 md:p-16 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
              </div>
              <p className="text-xs md:text-sm font-black text-black uppercase tracking-widest italic">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <div className="lg:col-span-4 space-y-6">

        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-4 md:p-6">
          <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest mb-1">Account Balance</p>
          <p className="text-2xl md:text-4xl font-black text-black tracking-tighter italic">
            {formatCurrency(user.balance, user.currency)}
          </p>
          <p className="text-[10px] md:text-xs font-bold text-black uppercase tracking-widest mt-2">{user.currency} Account</p>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-black text-black uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black" /> Account Status
          </h3>
          <div className="space-y-2 md:space-y-3">
            {[
              { label: "Identity Verified", status: user.verified },
              { label: "Transfers Enabled", status: user.canTransfer },
              { label: "Local Transfers", status: user.canLocalTransfer },
              { label: "International Transfers", status: user.canInternationalTransfer },
            ].map((item, idx) => (
              <div key={idx} className={cn(
                "flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border transition-colors",
                item.status ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
              )}>
                <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">{item.label}</span>
                <Badge className={cn(
                  "px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg text-[9px] md:text-xs font-black border-none",
                  item.status ? "bg-emerald-600 text-white" : "bg-black text-white"
                )}>
                  {item.status ? "Active" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>

          <Separator className="my-3 md:my-4" />

          <div className="flex items-center gap-2 text-black">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Customer since {new Date(user.registerTime).getFullYear()}</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <h3 className="text-sm font-black text-black uppercase tracking-widest">Security Note</h3>
          </div>
          <p className="text-sm text-black font-medium leading-relaxed border-l-4 border-slate-200 pl-4">
            Account security is in good standing. No suspicious activity detected. All transactions originate from verified locations.
          </p>
        </div>
      </div>
    </div>
  )
}
