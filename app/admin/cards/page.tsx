"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Activity,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminCardsPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/admin/cards")
      if (response.ok) {
        const data = await response.json()
        setCards(data.cards || [])
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCardStatus = async (cardId: string, currentStatus: string) => {
    setIsProcessing(cardId)
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    try {
      const response = await fetch(`/api/admin/cards/${cardId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchCards()
      }
    } catch (error) {
      console.error("Failed to update card status:", error)
    } finally {
      setIsProcessing(null)
    }
  }

  const filteredCards = cards.filter((card) => {
    const applicantName = `${card.userId.bankInfo.bio.firstname} ${card.userId.bankInfo.bio.lastname}`.toLowerCase()
    const matchesSearch =
      applicantName.includes(searchTerm.toLowerCase()) ||
      card.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.includes(searchTerm) ||
      card.cardType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || card.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "blocked":
        return "bg-red-50 text-red-700 border-red-200"
      case "expired":
        return "bg-slate-50 text-black border-slate-200"
      default:
        return "bg-slate-50 text-black border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "blocked":
        return <XCircle className="w-3 h-3" />
      case "expired":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter italic uppercase">
            Card <span className="text-black">Inventory</span>
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-bold uppercase tracking-widest opacity-60">Manage physical and virtual card assets.</p>
        </div>
        <Link
          href="/admin"
          className="h-10 md:h-12 px-4 md:px-6 rounded-xl border border-slate-200 bg-white font-black gap-2 text-black hover:border-black hover:text-black transition-all uppercase tracking-widest text-[10px] flex items-center w-fit shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Admin Home
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Cards Issued", value: cards.length, accent: "text-black", borderColor: "border-slate-200", bg: "bg-white" },
          { label: "Active Nodes", value: cards.filter(c => c.status === 'active').length, accent: "text-emerald-600", borderColor: "border-emerald-200", bg: "bg-emerald-50/30" },
          { label: "Pending Auth", value: cards.filter(c => c.status === 'pending').length, accent: "text-yellow-600", borderColor: "border-yellow-200", bg: "bg-yellow-50/30" },
          { label: "Security Blocks", value: cards.filter(c => c.status === 'blocked').length, accent: "text-black", borderColor: "border-red-200", bg: "bg-red-50/30" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-4 md:p-6 shadow-sm border-2 flex flex-col gap-1 hover:shadow-md transition-all", stat.borderColor, stat.bg)}>
            <p className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest">{stat.label}</p>
            <p className={cn("text-xl md:text-3xl lg:text-4xl font-black tracking-tighter italic", stat.accent)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 md:p-4">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            <Input
              placeholder="Search by holder, card number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 rounded-xl h-10 md:h-12 text-black focus:border-black transition-all font-medium placeholder:text-black text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 md:h-12 w-full sm:w-[180px] md:w-[220px] bg-slate-50 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-black">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest focus:bg-slate-50">All Assets</SelectItem>
              <SelectItem value="active" className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-50">Active</SelectItem>
              <SelectItem value="pending" className="text-[10px] font-black uppercase tracking-widest focus:bg-yellow-50">Pending</SelectItem>
              <SelectItem value="blocked" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50">Blocked</SelectItem>
              <SelectItem value="expired" className="text-[10px] font-black uppercase tracking-widest focus:bg-slate-50">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Ledger */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-black text-black tracking-tighter italic uppercase">Vault Ledger</h2>
            <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest mt-1">{filteredCards.length} assets indexed</p>
          </div>
          <div className="px-3 md:px-4 py-1.5 md:py-2 bg-black rounded-xl md:rounded-2xl flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-black" />
            <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Live Inventory Monitoring</p>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div key={card._id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black shadow-sm shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-black uppercase truncate">
                        {card.userId.bankInfo.bio.firstname} {card.userId.bankInfo.bio.lastname}
                      </p>
                      <p className="text-[10px] font-mono text-black tracking-wider">•••• •••• •••• {card.cardNumber.slice(-4)}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                    getStatusStyles(card.status)
                  )}>
                    {card.status}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-black uppercase tracking-widest">Node Type</span>
                    <span className="text-[10px] font-black text-black uppercase">{card.cardType}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => toggleCardStatus(card._id, card.status)}
                      className={cn(
                        "h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all border-none",
                        card.status === 'active' ? "bg-black hover:bg-red-600 text-white shadow-lg shadow-red-100" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                      )}
                    >
                      {card.status === 'active' ? 'Revoke Node' : 'Authorize Node'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <AlertCircle className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-[10px] font-black text-black uppercase tracking-widest italic">No assets located</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] md:text-xs font-black uppercase tracking-widest text-black">
                <th className="px-6 py-4">Cardholder Node</th>
                <th className="px-6 py-4">Identification</th>
                <th className="px-6 py-4 hidden lg:table-cell">Asset Type</th>
                <th className="px-6 py-4">Network Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCards.map((card) => (
                <tr key={card._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black shadow-sm flex-shrink-0">
                        <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-black text-black uppercase tracking-tight group-hover:text-black transition-colors truncate">
                          {card.userId.bankInfo.bio.firstname} {card.userId.bankInfo.bio.lastname}
                        </p>
                        <p className="text-[10px] md:text-xs text-black truncate max-w-[180px]">{card.userId.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm md:text-base font-black text-black font-mono tracking-widest">•••• •••• {card.cardNumber.slice(-4)}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-black uppercase tracking-widest">Expires {card.expiryDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <Badge className="bg-black text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg italic">
                      {card.cardType}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      getStatusStyles(card.status)
                    )}>
                      {getStatusIcon(card.status)}
                      {card.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => toggleCardStatus(card._id, card.status)}
                        disabled={isProcessing === card._id}
                        className={cn(
                          "h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border-none relative",
                          card.status === 'active' ? "bg-black hover:bg-red-600 text-white shadow-lg shadow-red-100" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                        )}
                      >
                        {isProcessing === card._id ? (
                          <Activity className="w-4 h-4 animate-spin" />
                        ) : (
                          card.status === 'active' ? (
                            <><Lock className="w-3.5 h-3.5 mr-1.5" /> Revoke</>
                          ) : (
                            <><Unlock className="w-3.5 h-3.5 mr-1.5" /> Authorize</>
                          )
                        )}
                      </Button>
                      <Button size="sm" variant="outline" className="h-9 px-4 rounded-lg border-slate-200 text-black hover:text-black hover:border-slate-200 font-black text-[10px] uppercase tracking-widest transition-all bg-white shadow-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-200" />
                      <p className="text-[10px] font-black text-black uppercase tracking-widest italic">No asset identifiers matched the query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
