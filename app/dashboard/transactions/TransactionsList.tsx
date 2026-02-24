"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TransactionsListProps {
  initialTransactions: any[]
  total: number
  currentPage: number
  totalPages: number
  currentFilters: {
    status: string
    type: string
    search: string
  }
}

export default function TransactionsList({
  initialTransactions,
  total,
  currentPage,
  totalPages,
  currentFilters
}: TransactionsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(currentFilters.search)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    if (name !== 'page') {
      params.set('page', '1') // Reset to page 1 on filter change
    }
    return params.toString()
  }

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilterChange('search', searchTerm)
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle2 className="h-3.5 w-3.5 text-black" />
      case 'pending':
      case 'processing':
        return <Clock className="h-3.5 w-3.5 text-orange-400" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-3.5 w-3.5 text-black" />
      default:
        return <AlertCircle className="h-3.5 w-3.5 text-black" />
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return "bg-emerald-50 text-emerald-700 border-emerald-100"
      case 'pending':
      case 'processing':
        return "bg-slate-50 text-black border-slate-100"
      case 'failed':
      case 'cancelled':
        return "bg-red-50 text-red-700 border-red-100"
      default:
        return "bg-slate-50 text-black border-slate-200"
    }
  }

  const fadeIn = { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-black hover:bg-white flex-shrink-0">
            <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">Transactions</h1>
            <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">View and manage your recent activity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black" />
            <Input
              placeholder="Search reference, recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 bg-white border-slate-200 rounded-lg text-xs focus:border-orange-400"
            />
          </form>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "h-9 rounded-lg border-slate-200 text-xs font-semibold gap-1.5",
              (currentFilters.status !== 'all' || currentFilters.type !== 'all' || isFilterOpen) && "bg-slate-50 border-slate-200 text-black"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>

          <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 text-xs font-semibold gap-1.5 hidden md:flex">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm mb-2 mt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-black tracking-wider">Status</label>
                <Select value={currentFilters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                  <SelectTrigger className="h-8 text-xs rounded-lg bg-slate-50 border-none shadow-none focus:ring-1 focus:ring-orange-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-black tracking-wider">Type</label>
                <Select value={currentFilters.type} onValueChange={(v) => handleFilterChange('type', v)}>
                  <SelectTrigger className="h-8 text-xs rounded-lg bg-slate-50 border-none shadow-none focus:ring-1 focus:ring-orange-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Income (+)</SelectItem>
                    <SelectItem value="debit">Expense (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    router.push(pathname)
                  }}
                  className="h-8 text-[10px] font-bold text-black hover:text-black uppercase tracking-wider"
                >
                  Reset Defaults
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-5 py-4 text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Transaction</th>
                <th className="px-5 py-4 text-[10px] md:text-xs font-black text-black uppercase tracking-widest hidden md:table-cell">Details</th>
                <th className="px-5 py-4 text-[10px] md:text-xs font-black text-black uppercase tracking-widest hidden sm:table-cell">Status</th>
                <th className="px-5 py-4 text-[10px] md:text-xs font-black text-black uppercase tracking-widest text-right">Amount</th>
                <th className="px-5 py-4 text-[10px] md:text-xs font-black text-black uppercase tracking-widest w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {initialTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <History className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-black">No transactions found</p>
                    <p className="text-[10px] text-black mt-0.5">Try adjusting your filters or search term</p>
                  </td>
                </tr>
              ) : (
                initialTransactions.map((tx, idx) => (
                  <motion.tr
                    key={tx._id}
                    {...fadeIn}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          tx.txType === 'credit' ? "bg-emerald-50 text-black" : "bg-slate-50 text-black"
                        )}>
                          {tx.txType === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm md:text-base font-black text-black uppercase tracking-tight italic">
                            {tx.recipient || tx.description || 'Transaction'}
                          </p>
                          <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-widest mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3 w-3 text-slate-300" />
                        <span className="text-[10px] text-black font-medium font-mono uppercase truncate max-w-[120px]">
                          {tx.txRef}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] md:text-[10px] font-black uppercase tracking-widest italic",
                        getStatusStyles(tx.status)
                      )}>
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className={cn(
                        "text-sm md:text-base font-black italic tracking-tighter",
                        tx.txType === 'credit' ? "text-black" : "text-black"
                      )}>
                        {tx.txType === 'credit' ? '+' : '−'}{formatCurrency(tx.amount, tx.currency)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-black group-hover:text-black">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-medium text-black">
              Showing <span className="text-black">{initialTransactions.length}</span> of <span className="text-black">{total}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => router.push(pathname + '?' + createQueryString('page', (currentPage - 1).toString()))}
                className="h-7 w-7 rounded-lg border-slate-200 disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <div className="flex items-center px-2">
                <span className="text-[10px] font-bold text-black">{currentPage}</span>
                <span className="text-[10px] font-medium text-slate-300 mx-1">/</span>
                <span className="text-[10px] font-medium text-black">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() => router.push(pathname + '?' + createQueryString('page', (currentPage + 1).toString()))}
                className="h-7 w-7 rounded-lg border-slate-200 disabled:opacity-30"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Helper utility for icons used but maybe not imported elsewhere */}
      <div className="hidden">
        <History className="h-0 w-0" />
      </div>
    </div>
  )
}
