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
  Activity,
  ShieldCheck,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  Trash2,
  FileText,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const response = await fetch("/api/admin/loans")
      if (response.ok) {
        const data = await response.json()
        setLoans(data.loans || [])
      }
    } catch (error) {
      console.error("Failed to fetch loans:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateLoanStatus = async (loanId: string, status: string, reason?: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/loans/${loanId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      })

      if (response.ok) {
        fetchLoans()
        setRejectDialogOpen(false)
        setRejectionReason("")
      }
    } catch (error) {
      console.error("Failed to update loan status:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = (loan: any) => {
    setSelectedLoan(loan)
    setRejectDialogOpen(true)
  }

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.userId.bankInfo.bio.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.userId.bankInfo.bio.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || loan.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-slate-50 text-black border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "rejected":
        return <XCircle className="w-3 h-3" />
      case "completed":
        return <Zap className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  const totalExposure = filteredLoans.reduce((sum, loan) => sum + (loan.status === 'active' || loan.status === 'approved' ? loan.amount : 0), 0)

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter italic uppercase">
            Loans & <span className="text-black">Credit</span>
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-black font-bold uppercase tracking-widest opacity-60">Review and manage all customer loan applications.</p>
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
          { label: "Total Applications", value: loans.length, accent: "text-black", borderColor: "border-slate-200", bg: "bg-white" },
          { label: "Active Loans", value: loans.filter(l => l.status === 'active' || l.status === 'approved').length, accent: "text-emerald-600", borderColor: "border-emerald-200", bg: "bg-emerald-50/30" },
          { label: "Pending Review", value: loans.filter(l => l.status === 'pending').length, accent: "text-yellow-600", borderColor: "border-yellow-200", bg: "bg-yellow-50/30" },
          { label: "Total Exposure", value: `$${totalExposure.toLocaleString()}`, accent: "text-black", borderColor: "border-slate-200", bg: "bg-slate-50/30" },
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
              placeholder="Search applicant or type..."
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
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest focus:bg-slate-50">All Statuses</SelectItem>
              <SelectItem value="pending" className="text-[10px] font-black uppercase tracking-widest focus:bg-yellow-50">Pending</SelectItem>
              <SelectItem value="approved" className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-50">Approved</SelectItem>
              <SelectItem value="active" className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-50">Active</SelectItem>
              <SelectItem value="rejected" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50">Rejected</SelectItem>
              <SelectItem value="completed" className="text-[10px] font-black uppercase tracking-widest focus:bg-blue-50">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loans Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-black text-black tracking-tighter italic uppercase">Application Ledger</h2>
            <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest mt-1">{filteredLoans.length} sequences found</p>
          </div>
          <div className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-black" />
            <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">${totalExposure.toLocaleString()} Exposure</p>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <div key={loan._id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-black font-black text-sm">
                      {loan.userId.bankInfo.bio.firstname[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-black uppercase truncate max-w-[150px]">
                        {loan.userId.bankInfo.bio.firstname} {loan.userId.bankInfo.bio.lastname}
                      </p>
                      <p className="text-[10px] text-black uppercase tracking-tight">{loan.loanType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-black tracking-tighter italic">${loan.amount.toLocaleString()}</p>
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border mt-1",
                      getStatusStyles(loan.status)
                    )}>
                      {loan.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-black uppercase tracking-widest">Duration</span>
                    <span className="text-[10px] font-black text-black uppercase">{loan.duration} Months</span>
                  </div>
                  <div className="flex gap-2">
                    {loan.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateLoanStatus(loan._id, 'approved')}
                          className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest transition-all border-none"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(loan)}
                          variant="outline"
                          className="h-8 px-3 rounded-lg border-red-200 text-black font-black text-[9px] uppercase tracking-widest"
                        >
                          Deny
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 bg-slate-50 text-black font-black text-[9px] uppercase tracking-widest">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <AlertCircle className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              <p className="text-[10px] font-black text-black uppercase tracking-widest italic">No matching applications</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] md:text-xs font-black uppercase tracking-widest text-black">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4 hidden lg:table-cell">Loan Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-black font-black text-base md:text-lg flex-shrink-0">
                        {loan.userId.bankInfo.bio.firstname[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-black text-black uppercase tracking-tight group-hover:text-black transition-colors truncate">
                          {loan.userId.bankInfo.bio.firstname} {loan.userId.bankInfo.bio.lastname}
                        </p>
                        <p className="text-[10px] md:text-xs text-black truncate max-w-[180px]">{loan.userId.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="space-y-1.5">
                      <Badge className="bg-slate-50 text-black border border-slate-200 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                        {loan.loanType}
                      </Badge>
                      <p className="text-[10px] text-black font-medium line-clamp-1 max-w-[200px] italic">"{loan.purpose}"</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-base md:text-lg font-black text-black tracking-tighter italic uppercase underline decoration-black/20 underline-offset-4">${loan.amount.toLocaleString()}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-black uppercase tracking-widest mt-0.5">{loan.duration} mos @ {loan.interestRate}% APR</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      getStatusStyles(loan.status)
                    )}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {loan.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateLoanStatus(loan._id, 'approved')}
                            className="h-9 px-4 rounded-lg bg-black hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 transition-all border-none"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(loan)}
                            className="h-9 px-4 rounded-lg border-red-200 text-black hover:bg-red-50 font-black text-[10px] uppercase tracking-widest transition-all"
                          >
                            Deny
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="h-9 px-4 rounded-lg border-slate-200 text-black hover:text-black hover:border-slate-200 font-black text-[10px] uppercase tracking-widest transition-all bg-white shadow-sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLoans.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-200" />
                      <p className="text-[10px] font-black text-black uppercase tracking-widest italic">No data sequences found in archive</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-black rounded-2xl p-0 overflow-hidden shadow-2xl">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader>
              <div className="h-10 w-10 text-black bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <XCircle className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter italic uppercase text-black border-l-4 border-black pl-4">
                Reject <span className="text-black">Application</span>
              </DialogTitle>
              <DialogDescription className="text-black font-bold uppercase tracking-widest text-[10px] mt-2">
                This action is irreversible. provide a reason for the client.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Rejection Manifesto</Label>
                <Textarea
                  id="reason"
                  placeholder="The application was dismissed due to insuffienct leverage..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="bg-slate-50 border-slate-200 rounded-xl min-h-[120px] font-bold italic placeholder:text-slate-300 focus:border-black transition-all text-sm p-4"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-50">
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                className="flex-1 h-12 rounded-xl border-slate-200 text-black font-black uppercase tracking-widest text-[10px] hover:text-black"
              >
                Abort
              </Button>
              <Button
                onClick={() => updateLoanStatus(selectedLoan?._id, 'rejected', rejectionReason)}
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 h-12 rounded-xl bg-black hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-100 border-none transition-all disabled:opacity-30"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
