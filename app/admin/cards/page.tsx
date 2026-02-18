// app/admin/cards/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, XCircle, Clock, Search, CreditCard, ShieldCheck, Activity, RefreshCw, Cpu, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CardWithUser {
  _id: string
  cardType: string
  vendor: string
  cardNumber: string
  status: string
  appliedDate: string
  approvedDate?: string
  cardHolderName: string
  userId: {
    bankInfo: {
      bio: {
        firstname: string
        lastname: string
      }
    }
    bankNumber: string
    email: string
  }
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardWithUser[]>([])
  const [filteredCards, setFilteredCards] = useState<CardWithUser[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    let filtered = cards

    if (statusFilter !== "all") {
      filtered = filtered.filter(card => card.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.cardHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userId.bankNumber.includes(searchTerm) ||
        card.cardNumber.includes(searchTerm.replace(/\s/g, ''))
      )
    }

    setFilteredCards(filtered)
  }, [cards, statusFilter, searchTerm])

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/cards')
      const data = await response.json()
      if (response.ok) {
        setCards(data.cards)
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCardStatus = async (cardId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/cards', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, status }),
      })

      if (response.ok) {
        fetchCards() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating card status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-50 border-emerald-100'
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-100'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100'
      case 'blocked': return 'text-slate-400 bg-slate-100 border-slate-200'
      default: return 'text-slate-400 bg-slate-100 border-slate-200'
    }
  }

  if (loading) {
    return (
      <div className="p-12 min-h-screen bg-black flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/[0.03] animate-pulse"></div>
        <div className="relative">
          <Cpu className="w-16 h-16 text-orange-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-orange-600/20 blur-xl animate-pulse"></div>
        </div>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.6em] animate-pulse uppercase relative z-10">Syncing Card Infrastructure...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <CreditCard className="w-3.5 h-3.5 text-orange-500" /> Asset Issuance
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            CARD <span className="text-orange-600 italic">REGISTRY</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-lg text-lg uppercase tracking-tight">Central hub for provisioning and auditing physical and digital payment tokens.</p>
        </div>

        <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Provisioning Status</p>
            <p className="text-sm font-black text-white uppercase tracking-widest">Synchronized</p>
          </div>
          <div className="h-10 w-[1px] bg-white/5"></div>
          <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
            <RefreshCw className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
          </div>
        </div>
      </div>

      {/* Execution Logic / Filters */}
      <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[3.5rem] p-10 relative z-10 overflow-hidden glass-dark shadow-inner">
        <div className="absolute top-0 right-0 h-40 w-40 bg-orange-600/5 rounded-full blur-3xl opacity-50"></div>
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
            <Input
              placeholder="Filter by account hash, identity, or sequence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 bg-black/60 border-white/5 rounded-[2rem] h-18 text-white focus:border-orange-600 focus:ring-orange-600/10 transition-all font-black placeholder:text-slate-800 text-lg shadow-inner uppercase tracking-tighter"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-18 w-full md:w-[280px] bg-black/60 border-white/5 rounded-[2rem] text-white font-black uppercase text-xs tracking-[0.2em] shadow-inner hover:border-orange-600 transition-all px-8">
              <div className="flex items-center gap-4">
                <Layers className="w-4 h-4 text-orange-600" />
                <SelectValue placeholder="Protocol State" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 rounded-3xl p-3 shadow-3xl">
              <SelectItem value="all" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-white hover:bg-white/5">Global Registry</SelectItem>
              <SelectItem value="pending" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-orange-600 hover:bg-orange-600/5">Review Required</SelectItem>
              <SelectItem value="active" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-emerald-500 hover:bg-emerald-600/5">Active Nodes</SelectItem>
              <SelectItem value="rejected" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-red-500 hover:bg-red-600/5">Denied Requests</SelectItem>
              <SelectItem value="blocked" className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 text-slate-500 hover:bg-white/5">Locked Assets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Registry Matrix */}
      <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden relative z-10 glass-dark">
        <CardHeader className="p-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Active Provisioning</CardTitle>
              <CardDescription className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] mt-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-2xl shadow-emerald-500/50"></div>
                {filteredCards.length} Tokens Registered in Matrix
              </CardDescription>
            </div>
            <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex flex-col items-end min-w-[240px] shadow-3xl font-black border-l-orange-600/50 border-l-2">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] leading-none mb-3">Authenticated Assets</p>
              <p className="text-5xl text-orange-600 tracking-tighter italic">{cards.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/40 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
                  <th className="px-12 py-10">Applicant Entity</th>
                  <th className="px-12 py-10">Token Identity</th>
                  <th className="px-12 py-10">Node Sequence</th>
                  <th className="px-12 py-10">Protocol State</th>
                  <th className="px-12 py-10 text-right">Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {filteredCards.map((card) => (
                  <tr key={card._id} className="group hover:bg-white/[0.02] transition-all duration-500">
                    <td className="px-12 py-12">
                      <div className="flex items-center gap-6">
                        <div className="w-18 h-18 rounded-[1.5rem] bg-slate-900 border border-white/5 flex items-center justify-center text-white font-black text-2xl overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-500 italic">
                          {card?.cardHolderName?.[0]}
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-black text-white uppercase tracking-widest group-hover:text-orange-600 transition-colors italic">{card?.cardHolderName}</p>
                          <p className="text-[10px] font-black text-slate-600 italic truncate max-w-[160px] uppercase tracking-tighter">{card?.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-12">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5 w-fit px-3 py-1.5 rounded-lg bg-black shadow-inner">
                            {card.vendor} • {card.cardType}
                          </p>
                        </div>
                        <p className="text-xl font-black font-mono text-white tracking-[0.2em] italic">**** {card.cardNumber.slice(-4)}</p>
                      </div>
                    </td>
                    <td className="px-12 py-12">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-slate-700" />
                        <span className="text-lg font-black font-mono text-white tracking-widest">{card?.userId?.bankNumber}</span>
                      </div>
                    </td>
                    <td className="px-12 py-12">
                      <Badge className={cn(
                        "px-5 py-2.5 rounded-xl border flex w-fit items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] shadow-3xl transform group-hover:scale-105 transition-all duration-500",
                        card.status === 'active' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                          card.status === 'pending' ? 'text-orange-600 bg-orange-600/10 border-orange-600/20' :
                            card.status === 'rejected' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                              'text-slate-500 bg-white/5 border-white/10'
                      )}>
                        {getStatusIcon(card.status)}
                        {card.status}
                      </Badge>
                    </td>
                    <td className="px-12 py-12 text-right">
                      <div className="flex justify-end gap-3 group-hover:-translate-x-4 transition-transform duration-500">
                        {card.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateCardStatus(card._id, 'active')}
                              className="h-12 px-8 rounded-xl bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-3xl border-none"
                            >
                              Provision
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateCardStatus(card._id, 'rejected')}
                              className="h-12 px-8 rounded-xl text-red-500 hover:bg-red-500 hover:text-white font-black text-[9px] uppercase tracking-widest border border-white/5"
                            >
                              Deny
                            </Button>
                          </>
                        )}
                        {card.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateCardStatus(card._id, 'blocked')}
                            className="h-12 px-10 rounded-xl text-slate-600 hover:bg-red-500 hover:text-white font-black text-[9px] uppercase tracking-widest border border-white/5 transition-all"
                          >
                            Revoke Access
                          </Button>
                        )}
                        {(card.status === 'rejected' || card.status === 'blocked') && (
                          <Button
                            size="sm"
                            onClick={() => updateCardStatus(card._id, 'active')}
                            className="h-12 px-8 rounded-xl bg-slate-900 border border-white/5 text-white font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 hover:border-none transition-all shadow-3xl"
                          >
                            Re-Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCards.length === 0 && (
              <div className="flex flex-col items-center justify-center py-48 gap-8 grayscale opacity-20 animate-pulse">
                <CreditCard className="h-28 w-28 text-orange-600" />
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">No Asset Sequences Found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
