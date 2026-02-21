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
      <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
        {/* High-Tech Background Decor */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

        {/* Industrial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
              <Activity className="w-3.5 h-3.5 text-orange-500" /> Remittance Matrix
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
              GLOBAL <span className="text-orange-600">LOG</span>
            </h1>
            <p className="text-sm md:text-lg text-slate-400 font-bold max-w-lg uppercase tracking-widest opacity-60">Synchronized audit trail of all asset movements across Sovereign nodes.</p>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="h-16 px-8 rounded-[2rem] bg-slate-900 border border-white/5 text-white font-bold hover:bg-white hover:text-slate-900 shadow-sm uppercase tracking-[0.2em] text-[10px] gap-3 group transition-all duration-500">
              <Link href="/admin">
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" /> COMMAND CENTER
              </Link>
            </Button>
            <div className="h-16 w-16 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center text-orange-500 shadow-xl group hover:scale-110 transition-all duration-500">
              <RefreshCw className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Operation Stats Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { label: "Aggregate Volume", value: total, icon: Database, color: "text-white", bg: "bg-slate-950", border: "border-white/5" },
            { label: "Verified Sequence", value: successCount, icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
            { label: "Clearing Queue", value: pendingCount, icon: Clock, color: "text-slate-400", bg: "bg-slate-900", border: "border-white/5" },
            { label: "Failed Protocol", value: failedCount, icon: Lock, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
          ].map((stat, i) => (
            <Card key={i} className={`bg-slate-900/40 border ${stat.border} rounded-[2.5rem] md:rounded-[3.0rem] p-6 md:p-8 group hover:border-orange-500/40 transition-all duration-700 relative overflow-hidden shadow-2xl glass-dark`}>
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-15 transition-opacity duration-700">
                <stat.icon className={`w-24 h-24 ${stat.color}`} />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-white transition-colors">{stat.label}</p>
                <div className={`text-4xl md:text-6xl font-black ${stat.color} tracking-tighter transition-all duration-500 group-hover:scale-1 w-fit origin-left italic`}>{stat.value}</div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden p-0.5">
                  <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text-', 'bg-'), "w-2/3 shadow-[0_0_15px_rgba(234,88,12,0.3)]")}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Intelligence Grid */}
        <div className="space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/30">
                <BarChart className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Telemetry <span className="text-orange-600">Streams</span></h2>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/5 shadow-2xl">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Node Synchronization</span>
            </div>
          </div>

          <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[4rem] overflow-hidden glass-dark">
            <TransactionsList
              initialTransactions={transactions}
              users={users}
              total={total}
              currentPage={page}
              totalPages={totalPages}
              currentFilters={{ status, type, search, user: userFilter }}
              isAdmin={true}
            />
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in AdminTransactionsPage:", error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-8 max-w-lg p-16 bg-white rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          <div className="h-24 w-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-600 mx-auto group">
            <Lock className="w-12 h-12 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Core Fault Detected</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] leading-relaxed">
              An unexpected exception occurred during data synchronization in the remittance matrix.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="h-16 px-12 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-600 transition-all duration-500 shadow-xl">
            Retry Initialization
          </Button>
        </div>
      </div>
    )
  }
}
