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
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-xl border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all">
            <Link href="/admin/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
              Customer <span className="text-orange-600">Profile</span>
            </h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest opacity-60">Full account details and activity</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="h-10 px-5 rounded-xl border-slate-200 font-black uppercase tracking-widest text-xs hover:border-orange-500 hover:text-orange-600 transition-all gap-2">
            <Link href={`/admin/users/${params.id}/edit`}>
              <Edit className="h-4 w-4" /> Edit Customer
            </Link>
          </Button>
          <UserActions userId={params.id} />
        </div>
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-16 gap-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Activity className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 tracking-widest uppercase">Loading customer details...</p>
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
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-900 text-2xl font-black overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>
              <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white", user.verified ? "bg-emerald-500" : "bg-red-500")}></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.roles.map((role) => (
                  <Badge key={role} className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-black uppercase tracking-widest px-3 py-1">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Member Since</p>
              <p className="text-lg font-black text-slate-900 italic tracking-tighter">{new Date(user.registerTime).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Info */}
            <div className="space-y-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-orange-600" /> Account Information
              </h3>
              {[
                { label: "Email Address", value: user.email, icon: Mail },
                { label: "Account Number", value: user.bankNumber, icon: CreditCard, mono: true },
                { label: "User Code", value: user.userCode, icon: ShieldCheck, mono: true },
                { label: "Currency", value: user.currency, icon: Globe },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </p>
                  <p className={cn("text-sm font-black text-slate-900", item.mono && "font-mono text-orange-600")}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Details
              </h3>
              {[
                { label: "Phone Number", value: user.phone, icon: Phone },
                { label: "Address", value: `${user.address}, ${user.city}, ${user.state} ${user.zipcode}, ${user.country}`, icon: MapPin },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </p>
                  <p className="text-sm font-black text-slate-900 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tighter italic">Recent Transactions</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Last 10 bank transfers</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
          </div>
          {user.transfers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {user.transfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest border",
                          transfer.txStatus === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        )}>
                          {transfer.txStatus === 'success' ? 'Completed' : transfer.txStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900">{transfer.txReason}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{transfer.txRef}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-base font-black text-slate-900 italic tracking-tighter">{formatCurrency(transfer.amount, transfer.currency)}</p>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <div className="lg:col-span-4 space-y-6">

        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-200 p-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account Balance</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
            {formatCurrency(user.balance, user.currency)}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{user.currency} Account</p>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-600" /> Account Status
          </h3>
          <div className="space-y-3">
            {[
              { label: "Identity Verified", status: user.verified },
              { label: "Transfers Enabled", status: user.canTransfer },
              { label: "Local Transfers", status: user.canLocalTransfer },
              { label: "International Transfers", status: user.canInternationalTransfer },
            ].map((item, idx) => (
              <div key={idx} className={cn(
                "flex items-center justify-between p-3 rounded-xl border transition-colors",
                item.status ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
              )}>
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.label}</span>
                <Badge className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-black border-none",
                  item.status ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
                )}>
                  {item.status ? "Active" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Customer since {new Date(user.registerTime).getFullYear()}</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Security Note</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-orange-200 pl-4">
            Account security is in good standing. No suspicious activity detected. All transactions originate from verified locations.
          </p>
        </div>
      </div>
    </div>
  )
}
