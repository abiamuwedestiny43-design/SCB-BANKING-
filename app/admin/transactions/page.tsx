// app/admin/transactions/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Activity, ShieldCheck, Zap, Database, Globe, Lock, Clock, RefreshCw, BarChart } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import TransactionsList from "./TransactionsList"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import User from "@/models/User"
import { cn } from "@/lib/utils"

async function getAllTransactionsData(page: number = 1, limit: number = 10, filters: any = {}) {
  await dbConnect()

  const query: any = {}

  if (filters.status && filters.status !== "all") {
    query.txStatus = filters.status
  }

  if (filters.type && filters.type !== "all") {
    query.txType = filters.type
  }

  if (filters.user && filters.user !== "all") {
    query.userId = filters.user
  }

  if (filters.search) {
    query.$or = [
      { txRef: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { "accountHolder": { $regex: filters.search, $options: "i" } }
    ]
  }

  try {
    const skip = (page - 1) * limit
    const transfers = await Transfer.find(query)
      .populate('userId', 'bankInfo.bio email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Transfer.countDocuments(query)

    const transactions = transfers.map(transfer => ({
      _id: transfer._id.toString(),
      txRef: transfer.txRef,
      txType: (transfer.txType || "debit") as "debit" | "credit",
      amount: transfer.amount,
      currency: transfer.currency,
      createdAt: transfer.completedAt || transfer.txDate || new Date(),
      status: transfer.txStatus,
      recipient: transfer.accountHolder,
      bankName: transfer.bankName,
      branchName: transfer.branchName,
      bankAccount: transfer.bankAccount,
      accountType: transfer.accountType,
      routingCode: transfer.routingCode,
      identifierCode: transfer.identifierCode,
      chargesType: transfer.chargesType || "SHA",
      description: transfer.description || transfer.txReason,
      userId: (transfer.userId as any)?._id?.toString(),
      userName: (transfer.userId as any)?.bankInfo?.bio
        ? `${(transfer.userId as any).bankInfo.bio.firstname} ${(transfer.userId as any).bankInfo.bio.lastname}`
        : 'Unknown User',
      userEmail: (transfer.userId as any)?.email || 'No Email'
    }))

    return { transactions, total, page, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { transactions: [], total: 0, page: 1, totalPages: 0 }
  }
}

async function getAllUsers() {
  await dbConnect()
  try {
    const users = await User.find({})
      .select('_id bankInfo.bio email')
      .lean()

    return users.map((user: any) => ({
      id: user._id.toString(),
      name: user.bankInfo?.bio
        ? `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`
        : 'Unknown User',
      email: user.email
    }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="space-y-6 max-w-md w-full p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            <div className="h-20 w-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Access Denied</h1>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">Authorized personnel only</p>
            </div>
            <Button asChild className="w-full bg-slate-900 text-white font-black h-14 rounded-2xl shadow-xl shadow-slate-900/10">
              <Link href="/login">Re-authenticate</Link>
            </Button>
          </div>
        </div>
      )
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1
    const status = (searchParams.status as string) || "all"
    const type = (searchParams.type as string) || "all"
    const search = (searchParams.search as string) || ""
    const userFilter = (searchParams.user as string) || "all"

    const { transactions, total, totalPages } = await getAllTransactionsData(
      page,
      10,
      { status, type, search, user: userFilter }
    )

    const users = await getAllUsers()

    // Get stats for current view
    const successCount = transactions.filter(t => t.status === 'success').length
    const pendingCount = transactions.filter(t => t.status === 'pending').length
    const failedCount = transactions.filter(t => t.status === 'failed').length

    return (
      <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
              All <span className="text-orange-600">Transactions</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">
              Complete history of all bank transfers and payments.
            </p>
          </div>
          <Button asChild variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-black gap-2 text-slate-700 hover:border-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest text-xs">
            <Link href="/admin">
              <ChevronLeft className="h-4 w-4" /> Admin Home
            </Link>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Transactions", value: total, accent: "text-slate-900", iconBg: "bg-slate-100", border: "border-slate-200" },
            { label: "Completed", value: successCount, accent: "text-emerald-600", iconBg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Pending", value: pendingCount, accent: "text-yellow-600", iconBg: "bg-yellow-50", border: "border-yellow-200" },
            { label: "Failed", value: failedCount, accent: "text-red-600", iconBg: "bg-red-50", border: "border-red-200" },
          ].map((stat, i) => (
            <div key={i} className={cn("bg-white rounded-2xl p-5 shadow-sm border-2 flex flex-col gap-2 hover:shadow-md transition-shadow", stat.border)}>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className={cn("text-3xl md:text-4xl font-black tracking-tighter italic", stat.accent)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <TransactionsList
            initialTransactions={transactions}
            users={users}
            total={total}
            currentPage={page}
            totalPages={totalPages}
            currentFilters={{ status, type, search, user: userFilter }}
            isAdmin={true}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in AdminTransactionsPage:", error)
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center p-6 text-center">
        <div className="space-y-6 max-w-md w-full p-10 bg-white rounded-2xl shadow-sm border-2 border-red-200">
          <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto border-2 border-red-100">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">Something Went Wrong</h1>
            <p className="text-slate-400 font-bold text-sm">We couldn&apos;t load the transaction data. Please try again.</p>
          </div>
          <Button asChild className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black h-12 rounded-2xl transition-all uppercase tracking-widest text-xs">
            <Link href="/admin/transactions">Reload Page</Link>
          </Button>
        </div>
      </div>
    )
  }
}
