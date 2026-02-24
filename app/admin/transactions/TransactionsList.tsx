"use client"

import { useState, useMemo } from "react"
import { formatCurrency } from "@/lib/utils/banking"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  User,
  CreditCard,
  Calendar,
  Zap,
  Download,
  Printer
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Transaction {
  _id: string
  amount: number
  txType: "credit" | "debit"
  txStatus: string
  txReason: string
  txRef: string
  createdAt: string
  userName?: string
  recipient?: string
  currency: string
  bankAccount?: string
  senderAccount?: string
}

interface TransactionsListProps {
  initialTransactions: Transaction[]
  users: any[]
}

export default function TransactionsList({ initialTransactions, users }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((tx) => {
      const searchStr = `${tx.userName || ""} ${tx.recipient || ""} ${tx.txRef} ${tx.txReason}`.toLowerCase()
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || tx.txType === typeFilter
      const matchesStatus = statusFilter === "all" || tx.txStatus === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [initialTransactions, searchTerm, typeFilter, statusFilter])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending":
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "failed":
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-black border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            <Input
              placeholder="Search by name, reference, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-black transition-all font-medium placeholder:text-black"
            />
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setTypeFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  typeFilter === "all" ? "bg-white text-black shadow-sm" : "text-black hover:text-black"
                )}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("credit")}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  typeFilter === "credit" ? "bg-white text-emerald-600 shadow-sm" : "text-black hover:text-black"
                )}
              >
                Credits
              </button>
              <button
                onClick={() => setTypeFilter("debit")}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  typeFilter === "debit" ? "bg-white text-red-600 shadow-sm" : "text-black hover:text-black"
                )}
              >
                Debits
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              title="Filter by status"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 text-[10px] font-black uppercase tracking-widest text-black outline-none focus:border-black transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-black text-black tracking-tighter italic uppercase">Master Settlement Ledger</h2>
            <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest mt-1">Live feed of global financial sequences</p>
          </div>
          <div className="flex gap-2">
            <button className="h-9 px-4 rounded-xl border border-slate-200 text-black hover:text-black font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 bg-white">
              <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span>
            </button>
            <button className="h-9 px-4 rounded-xl border border-slate-200 text-black hover:text-black font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 bg-white">
              <Printer className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Print Batch</span>
            </button>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((tx) => (
              <div key={tx._id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      tx.txType === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    )}>
                      {tx.txType === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-black uppercase truncate max-w-[150px]">
                        {tx.userName || tx.recipient || "Global Ledger"}
                      </p>
                      <p className="text-[10px] text-black font-bold uppercase tracking-widest truncate max-w-[150px]">{tx.txReason || "Asset Sequence"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-base font-black tracking-tighter italic truncate",
                      tx.txType === 'credit' ? 'text-emerald-600' : 'text-black'
                    )}>
                      {tx.txType === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border mt-1",
                      getStatusStyles(tx.txStatus)
                    )}>
                      {tx.txStatus}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-black uppercase tracking-widest pt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-mono text-slate-300">
                    {tx.txRef.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <Activity className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-[10px] font-black text-black uppercase tracking-widest italic">No matching sequences in ledger</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] md:text-xs font-black uppercase tracking-widest text-black">
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4 hidden lg:table-cell">Asset Sequence</th>
                <th className="px-6 py-4">Capital Flow</th>
                <th className="px-6 py-4 hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={cn(
                        "h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                        tx.txType === 'credit' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100 shadow-lg' : 'bg-red-50 text-red-600 shadow-red-100 shadow-lg'
                      )}>
                        {tx.txType === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-black text-black uppercase tracking-tight group-hover:text-black transition-colors truncate">
                          {tx.userName || tx.recipient || "External Node"}
                        </p>
                        <p className="text-[10px] md:text-xs text-black truncate max-w-[180px] font-bold uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()} @ {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="space-y-1">
                      <p className="text-xs md:text-sm font-black text-black truncate max-w-[200px] uppercase">{tx.txReason || "Settlement Transfer"}</p>
                      <p className="text-[10px] text-black font-mono tracking-tighter truncate max-w-[150px]">{tx.recipient || tx.senderAccount || "System Core"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className={cn(
                        "text-base md:text-lg font-black tracking-tighter italic",
                        tx.txType === 'credit' ? 'text-emerald-600' : 'text-black'
                      )}>
                        {tx.txType === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                      </p>
                      <span className="text-[8px] md:text-[9px] font-black uppercase text-black tracking-[0.2em]">{tx.currency} UNIT</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border",
                      getStatusStyles(tx.txStatus)
                    )}>
                      {tx.txStatus === 'success' || tx.txStatus === 'completed' ? <CheckCircle className="h-3 w-3" /> : (tx.txStatus === 'pending' ? <Clock className="h-3 w-3" /> : <XCircle className="h-3 w-3" />)}
                      {tx.txStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] md:text-xs font-mono font-black text-black group-hover:text-black transition-colors uppercase tracking-widest">{tx.txRef.slice(0, 10)}</p>
                      <Link href={`/admin/transactions/${tx._id}`} className="mt-1 text-[8px] font-black text-slate-300 hover:text-black uppercase tracking-widest group-hover:text-black transition-all">View Trace &rarr;</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-black uppercase tracking-widest">
            Showing <span className="text-black">{Math.min(filteredTransactions.length, itemsPerPage)}</span> of <span className="text-black">{filteredTransactions.length}</span> sequences
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="h-10 px-4 rounded-xl border-slate-200 text-black font-black uppercase tracking-widest text-[10px] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <div className="flex items-center px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-black">
              {currentPage} / {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-10 px-4 rounded-xl border-slate-200 text-black font-black uppercase tracking-widest text-[10px] disabled:opacity-30"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
