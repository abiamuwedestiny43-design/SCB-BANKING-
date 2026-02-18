// app/admin/transactions/TransactionsList.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Download, Activity, User as UserIcon, Calendar, Hash } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils/banking"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  _id: string
  txRef: string
  txType: "debit" | "credit"
  amount: number
  currency: string
  createdAt: Date
  status: string
  recipient?: string
  description?: string
  userId?: string
  userEmail?: string
  userName?: string
}

interface UserSummary {
  id: string
  name: string
  email: string
}

interface TransactionsListProps {
  initialTransactions: Transaction[]
  total: number
  currentPage: number
  totalPages: number
  currentFilters: {
    status: string
    type: string
    search: string
    user?: string
  }
  users?: UserSummary[]
  isAdmin?: boolean
}

export default function TransactionsList({
  initialTransactions,
  total,
  currentPage,
  totalPages,
  currentFilters,
  users = [],
  isAdmin = false
}: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [filters, setFilters] = useState(currentFilters)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters, 1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL(filters, 1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateURL(filters, newPage)
    }
  }

  const updateURL = (newFilters: any, page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newFilters.status !== "all") params.set("status", newFilters.status)
    else params.delete("status")

    if (newFilters.type !== "all") params.set("type", newFilters.type)
    else params.delete("type")

    if (newFilters.search) params.set("search", newFilters.search)
    else params.delete("search")

    if (isAdmin && newFilters.user && newFilters.user !== "all") {
      params.set("user", newFilters.user)
    } else if (isAdmin) {
      params.delete("user")
    }

    if (page > 1) params.set("page", page.toString())
    else params.delete("page")

    const path = isAdmin ? "/admin/transactions" : "/dashboard/transactions"
    router.push(`${path}?${params.toString()}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm">SUCCESS</Badge>
      case "pending":
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm">PENDING</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm">FAILED</Badge>
      case "cancelled":
        return <Badge className="bg-slate-800 text-slate-500 border-white/5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">CANCELLED</Badge>
      default:
        return <Badge className="bg-slate-800 text-slate-400 border-white/5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">{status.toUpperCase()}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Filters Hub */}
      <Card className="bg-slate-900/60 border-white/5 rounded-[2.5rem] p-8 shadow-2xl glass-dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {isAdmin && (
            <div className="lg:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Client Identity</label>
              <Select value={filters.user || "all"} onValueChange={(value) => handleFilterChange("user", value)}>
                <SelectTrigger className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:ring-orange-500/20 capitalize font-black">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-white backdrop-blur-xl rounded-xl">
                  <SelectItem value="all" className="font-black uppercase tracking-widest text-[10px]">All Accounts</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id} className="focus:bg-orange-600 focus:text-white font-black uppercase tracking-widest text-[10px]">
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:ring-orange-500/20 capitalize font-black">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-white/10 text-white backdrop-blur-xl rounded-xl">
                <SelectItem value="all" className="font-black uppercase tracking-widest text-[10px]">All Statuses</SelectItem>
                <SelectItem value="pending" className="font-black uppercase tracking-widest text-[10px]">Pending</SelectItem>
                <SelectItem value="success" className="font-black uppercase tracking-widest text-[10px]">Completed</SelectItem>
                <SelectItem value="failed" className="font-black uppercase tracking-widest text-[10px]">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Protocol Type</label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:ring-orange-500/20 capitalize font-black">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-white/10 text-white backdrop-blur-xl rounded-xl">
                <SelectItem value="all" className="font-black uppercase tracking-widest text-[10px]">All Transactions</SelectItem>
                <SelectItem value="debit" className="font-black uppercase tracking-widest text-[10px]">Debit</SelectItem>
                <SelectItem value="credit" className="font-black uppercase tracking-widest text-[10px]">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${isAdmin ? "lg:col-span-5" : "lg:col-span-8"} space-y-2`}>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Search Records</label>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600/50" />
                <Input
                  placeholder="Reference, name, or transaction details..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-12 bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800 shadow-inner"
                />
              </div>
              <Button type="submit" className="h-12 px-8 rounded-xl bg-orange-600 text-white font-black hover:bg-orange-500 shadow-xl shadow-orange-600/20 uppercase tracking-widest text-[10px] border-none">
                Query
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Results Deck */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="py-24 text-center space-y-6 bg-slate-900/40 border border-white/5 border-dashed rounded-[3rem] glass-dark">
            <Activity className="w-16 h-16 text-slate-800 mx-auto" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] italic">No sequence matches current filter parameters</p>
            <Button
              variant="link"
              className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] hover:text-orange-500 transition-colors"
              onClick={() => {
                const clearFilters = { status: "all", type: "all", search: "" }
                if (isAdmin) (clearFilters as any).user = "all"
                setFilters(clearFilters as any)
                updateURL(clearFilters, 1)
              }}
            >
              Reset Logic Matrix
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {transactions.map((transaction) => (
              <Link
                key={transaction._id}
                href={isAdmin ? `/admin/transactions/${transaction._id}` : `/dashboard/receipt/${transaction.txRef}`}
                className="group block"
              >
                <div className="p-8 rounded-[3rem] bg-slate-900/40 border border-white/5 group-hover:border-orange-600/50 group-hover:shadow-3xl transition-all duration-500 relative overflow-hidden glass-dark">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 group-hover:bg-orange-600/10 rounded-full blur-3xl -mr-16 -mt-16 transition-colors duration-500"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                      {/* Icon Cluster */}
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110 shadow-sm ${transaction.txType === "credit"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-orange-600 text-white shadow-xl shadow-orange-600/20 border-orange-500"
                        }`}>
                        {transaction.txType === "credit" ? (
                          <ArrowDownLeft className="h-7 w-7" />
                        ) : (
                          <ArrowUpRight className="h-7 w-7" />
                        )}
                      </div>

                      {/* Info Cluster */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <p className="font-black text-white uppercase tracking-tighter text-xl italic group-hover:text-orange-500 transition-colors">
                            {transaction.txType === "credit" ? "Remittance Inflow" : "Logic Discharge"}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-slate-500 font-mono tracking-widest text-[11px] font-black uppercase">REF_{transaction.txRef.toUpperCase()}</span>
                          {transaction.recipient && (
                            <>
                              <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                              <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">DEST: {transaction.recipient}</span>
                            </>
                          )}
                          {isAdmin && transaction.userName && (
                            <>
                              <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                              <p className="text-orange-600 font-black uppercase tracking-widest text-[10px] items-center gap-2 flex">
                                <UserIcon className="w-3 h-3" /> {transaction.userName}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Value Cluster */}
                    <div className="flex items-center md:items-end flex-row md:flex-col justify-between md:justify-center gap-1 bg-black/40 md:bg-transparent p-4 md:p-0 rounded-2xl border border-white/5 md:border-none shadow-inner md:shadow-none">
                      <p className={`text-3xl font-black tracking-tighter italic ${transaction.txType === "credit" ? "text-emerald-500" : "text-white"
                        }`}>
                        {transaction.txType === "credit" ? "+" : "-"}{formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Decorative background number/ID */}
                  <div className="absolute right-[2%] bottom-[-10%] text-9xl font-black text-white/[0.02] pointer-events-none select-none italic group-hover:text-orange-600/[0.05] transition-colors duration-500">
                    {transaction.txRef.slice(-4)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Audit Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-8 p-10 rounded-[3.5rem] bg-slate-900/40 border border-white/5 glass-dark">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
              Showing <span className="text-white">{(currentPage - 1) * 10 + 1}</span> — <span className="text-white">{Math.min(currentPage * 10, total)}</span> of <span className="text-white">{total}</span> Records
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-12 px-6 rounded-2xl border border-white/10 bg-black hover:bg-white hover:text-slate-950 text-white font-black uppercase tracking-widest text-[10px] disabled:opacity-20 transition-all shadow-2xl"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) pageNum = i + 1
                  else if (currentPage <= 3) pageNum = i + 1
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                  else pageNum = currentPage - 2 + i

                  return (
                    <Button
                      key={pageNum}
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-12 h-12 rounded-2xl font-black text-[10px] transition-all ${currentPage === pageNum
                        ? "bg-white text-slate-950 shadow-2xl"
                        : "bg-black border border-white/10 text-slate-500 hover:text-white shadow-sm"
                        }`}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-12 px-6 rounded-2xl border border-white/10 bg-black hover:bg-white hover:text-slate-950 text-white font-black uppercase tracking-widest text-[10px] disabled:opacity-20 transition-all shadow-2xl"
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
