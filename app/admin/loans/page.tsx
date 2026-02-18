// app/admin/loans/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, XCircle, Clock, Search, Eye, Banknote, ShieldCheck, Zap, Activity, RefreshCw, Cpu, Layers, Radio, Terminal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface LoanWithUser {
  _id: string
  loanType: string
  amount: number
  duration: number
  status: string
  appliedDate: string
  approvedDate?: string
  purpose: string
  monthlyPayment: number
  interestRate: number
  rejectionReason?: string
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

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<LoanWithUser[]>([])
  const [filteredLoans, setFilteredLoans] = useState<LoanWithUser[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedLoan, setSelectedLoan] = useState<LoanWithUser | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    let filtered = loans

    if (statusFilter !== "all") {
      filtered = filtered.filter(loan => loan.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.userId.bankInfo.bio.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.userId.bankNumber.includes(searchTerm) ||
        loan.loanType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLoans(filtered)
  }, [loans, statusFilter, searchTerm])

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/admin/loans')
      const data = await response.json()
      if (response.ok) {
        setLoans(data.loans)
      }
    } catch (error) {
      console.error('Error fetching loans:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLoanStatus = async (loanId: string, status: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/loans', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId, status, rejectionReason: reason }),
      })

      if (response.ok) {
        fetchLoans()
        setIsDialogOpen(false)
        setRejectionReason("")
        setSelectedLoan(null)
      }
    } catch (error) {
      console.error('Error updating loan status:', error)
    }
  }

  const handleReject = (loan: LoanWithUser) => {
    setSelectedLoan(loan)
    setIsDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'active': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-orange-600 bg-orange-50 border-orange-100'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100'
      case 'active': return 'text-emerald-600 bg-emerald-50 border-emerald-100'
      case 'completed': return 'text-slate-400 bg-slate-50 border-slate-200'
      default: return 'text-slate-400 bg-slate-50 border-slate-200'
    }
  }

  if (loading) {
    return (
      <div className="p-12 min-h-screen bg-black flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/[0.03] animate-pulse"></div>
        <Cpu className="w-16 h-16 text-orange-600 animate-spin relative z-10" />
        <p className="text-[10px] font-black text-slate-500 tracking-[0.6em] animate-pulse uppercase relative z-10">Syncing Loan Protocols...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Banknote className="w-3.5 h-3.5 text-orange-500" /> Asset Distribution
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            CREDIT <span className="text-orange-600 italic">MATRIX</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-lg text-lg uppercase tracking-tight">Authorized vetting and execution of institutional credit frameworks across the Sovereign node.</p>
        </div>

        <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Exposure Sync</p>
            <p className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">Synchronized</p>
          </div>
          <div className="h-10 w-[1px] bg-white/5"></div>
          <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Execution Logic / Filters */}
      <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[3.5rem] p-10 relative z-10 overflow-hidden glass-dark">
        <div className="absolute top-0 right-0 h-40 w-40 bg-orange-600/5 rounded-full blur-3xl opacity-50"></div>
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-orange-600 transition-colors" />
            <Input
              placeholder="Query by applicant identity, account hash, or protocol type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 bg-black/60 border-white/5 rounded-[2rem] h-18 text-white focus:border-orange-600 focus:ring-orange-600/10 transition-all font-black placeholder:text-slate-800 text-lg shadow-inner uppercase tracking-tight"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-18 w-full md:w-[280px] bg-black/60 border-white/5 rounded-[2rem] text-white font-black uppercase text-xs tracking-[0.4em] shadow-inner hover:border-orange-600 transition-all px-8">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-orange-600" />
                <SelectValue placeholder="Protocol State" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/5 rounded-3xl p-3 glass-dark">
              <SelectItem value="all" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-4 focus:bg-white focus:text-black">Global Registry</SelectItem>
              <SelectItem value="pending" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-4 text-yellow-500 focus:bg-yellow-500 focus:text-black">Review Required</SelectItem>
              <SelectItem value="approved" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-4 text-orange-500 focus:bg-orange-500 focus:text-black">Authorized Nodes</SelectItem>
              <SelectItem value="active" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-4 text-emerald-500 focus:bg-emerald-500 focus:text-black">Active Sequences</SelectItem>
              <SelectItem value="rejected" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-4 text-red-500 focus:bg-red-500 focus:text-black">Denied protocols</SelectItem>
              <SelectItem value="completed" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-4 text-slate-500 focus:bg-slate-500 focus:text-black">Terminated Assets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Registry Matrix */}
      <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden relative z-10 glass-dark">
        <CardHeader className="p-12 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Asset Applications</CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                {filteredLoans.length} Protocols Detected in Current Cycle
              </CardDescription>
            </div>
            <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex flex-col items-end min-w-[260px] shadow-2xl">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-3">Aggregate Exposure</p>
              <p className="text-4xl font-black text-white tracking-tighter italic">
                ${loans.filter(l => l.status === 'active' || l.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/40 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
                  <th className="px-12 py-8">Applicant Entity</th>
                  <th className="px-12 py-8">Credit Framework</th>
                  <th className="px-12 py-8">Capital Assets</th>
                  <th className="px-12 py-8">Protocol State</th>
                  <th className="px-12 py-8 text-right">Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLoans.map((loan) => (
                  <tr key={loan._id} className="group hover:bg-orange-600/5 transition-all duration-500">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-18 h-18 rounded-[2rem] bg-black border-2 border-white/5 flex items-center justify-center text-white font-black text-2xl overflow-hidden shadow-3xl group-hover:scale-110 group-hover:border-orange-600/50 transition-all duration-500 italic">
                          {loan.userId.bankInfo.bio.firstname[0]}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-orange-600 transition-colors italic">{loan.userId.bankInfo.bio.firstname} {loan.userId.bankInfo.bio.lastname}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic truncate max-w-[200px]">{loan.userId.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.3em] border border-orange-600/20 w-fit px-3 py-1.5 rounded-xl bg-orange-600/5 shadow-xl italic leading-none">{loan.loanType} Framework</p>
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-tight line-clamp-1 italic max-w-[240px]">"{loan.purpose}"</p>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="text-3xl font-black text-white tracking-tighter group-hover:scale-110 origin-left transition-transform duration-500 italic">${loan.amount.toLocaleString()}</div>
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mt-2 italic">{loan.duration} MOS @ <span className="text-orange-600">{loan.interestRate}% APR</span></div>
                    </td>
                    <td className="px-12 py-10">
                      <Badge className={cn("px-5 py-2 rounded-xl border-none flex w-fit items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] shadow-3xl transform group-hover:scale-110 transition-all duration-500 italic",
                        loan.status === 'approved' && "bg-orange-600/10 text-orange-500",
                        loan.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                        loan.status === 'rejected' && "bg-red-500/10 text-red-500",
                        loan.status === 'active' && "bg-emerald-500/10 text-emerald-500",
                        loan.status === 'completed' && "bg-slate-800 text-slate-500"
                      )}>
                        {getStatusIcon(loan.status)}
                        {loan.status}
                      </Badge>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex justify-end gap-4 group-hover:-translate-x-4 transition-transform duration-500">
                        {loan.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateLoanStatus(loan._id, 'approved')}
                              className="h-14 px-8 rounded-2xl bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-3xl border-none"
                            >
                              Authorize
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(loan)}
                              className="h-14 px-8 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white font-black text-[10px] uppercase tracking-widest border border-red-500/20 transition-all"
                            >
                              Deny
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="h-14 w-14 rounded-2xl bg-black border border-white/5 text-slate-600 hover:text-orange-600 hover:bg-white/5 hover:shadow-3xl transition-all duration-500 group/btn shadow-inner">
                          <Eye className="h-6 w-6 group-hover/btn:scale-125 transition-transform" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLoans.length === 0 && (
              <div className="flex flex-col items-center justify-center py-48 gap-10 opacity-30">
                <div className="w-24 h-24 rounded-[3rem] bg-black border border-white/5 flex items-center justify-center shadow-inner">
                  <Banknote className="h-12 w-12 text-slate-700" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 italic">No Asset Sequences Found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/5 rounded-[4rem] p-12 max-w-xl shadow-3xl overflow-hidden glass-dark text-white">
          <div className="absolute top-0 left-0 w-full h-[8px] bg-red-600 animate-pulse"></div>
          <DialogHeader className="space-y-6">
            <DialogTitle className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Decline Application</DialogTitle>
            <DialogDescription className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] leading-relaxed italic">
              Authorized administrative justification for declination of asset distribution protocol.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-10 pt-10">
            <div className="p-10 rounded-[3rem] bg-black border border-white/5 text-white shadow-3xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <ShieldCheck className="w-32 h-32 text-orange-600" />
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 leading-none">Target Entity</p>
                  <p className="text-2xl font-black uppercase tracking-tighter italic">
                    {selectedLoan?.userId.bankInfo.bio.firstname} {selectedLoan?.userId.bankInfo.bio.lastname}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 leading-none">Asset Value</p>
                  <p className="text-3xl font-black tracking-tighter italic font-mono">
                    ${selectedLoan?.amount.toLocaleString()} <span className="text-xs text-slate-600 not-italic">• {selectedLoan?.loanType} FRAMEWORK</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                <Terminal className="w-4 h-4 text-orange-600" /> Rejection Justification *
              </label>
              <Textarea
                placeholder="Declare the protocol violation or reason for denial sequence..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="bg-black/60 border-white/5 rounded-[2rem] p-8 text-white focus:border-red-600 transition-all resize-none font-black placeholder:text-slate-800 shadow-inner uppercase text-sm tracking-tight"
              />
            </div>
          </div>
          <DialogFooter className="pt-12 gap-6">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-16 px-10 rounded-2xl text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all italic">
              Abort
            </Button>
            <Button
              onClick={() => selectedLoan && updateLoanStatus(selectedLoan._id, 'rejected', rejectionReason)}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-white hover:text-black text-white font-black px-12 h-16 rounded-2xl shadow-3xl uppercase tracking-widest text-[10px] transition-all duration-500 border-none"
            >
              Confirm Denial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
