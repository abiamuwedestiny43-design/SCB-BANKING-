"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, DollarSign, CheckCircle, Trash2, Zap, ArrowUpRight, ArrowDownLeft, ShieldAlert, RefreshCw, UserCheck, ShieldX } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"

interface UserActionsProps {
  userId: string
}

export default function UserActions({ userId }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [txType, setTxType] = useState<"credit" | "debit">("credit")
  const [txAmount, setTxAmount] = useState<string>("")
  const [txCurrency, setTxCurrency] = useState<string>("USD")
  const [txDesc, setTxDesc] = useState<string>("")
  const [txSuccess, setTxSuccess] = useState(false)
  const router = useRouter()

  const openTxModal = async (type: "credit" | "debit") => {
    setTxType(type)
    setTxAmount("")
    setTxDesc("")
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      if (res.ok) {
        const data = await res.json()
        const assigned = data?.user?.bankInfo?.system?.currency
        setTxCurrency(assigned || "USD")
      } else {
        setTxCurrency("USD")
      }
    } catch {
      setTxCurrency("USD")
    }
    setTxOpen(true)
  }

  const submitTransaction = async () => {
    if (!txAmount || Number.isNaN(Number(txAmount)) || Number(txAmount) <= 0) {
      alert("Invalid amount detected. Please re-input.")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: txType,
          amount: Number(txAmount),
          currency: txCurrency,
          description: txDesc || `System ${txType === 'credit' ? 'Credit' : 'Debit'}`,
        }),
      })
      if (res.ok) {
        setTxSuccess(true)
        router.refresh()
        setTimeout(() => {
          setTxOpen(false)
          setTxSuccess(false)
        }, 1500)
      } else {
        const j = await res.json().catch(() => ({}))
        alert(j?.message || "Transaction failed.")
      }
    } catch (err) {
      console.error("[BANK] admin tx error:", err)
      alert("System error during transaction.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      switch (action) {
        case "edit":
          router.push(`/admin/users/${userId}/edit`)
          break
        case "approve":
          const approveResponse = await fetch("/api/admin/users/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
          if (approveResponse.ok) {
            router.refresh()
          } else {
            alert("Approval failed.")
          }
          break
        case "delete":
          if (confirm("Permanently delete this user account? This cannot be reversed.")) {
            const deleteResponse = await fetch(`/api/admin/users/${userId}`, {
              method: "DELETE",
            })
            if (deleteResponse.ok) {
              router.refresh()
            } else {
              alert("User deletion failed.")
            }
          }
          break
      }
    } catch (error) {
      console.error("Action error:", error)
      alert("Action failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 rounded-xl bg-white border-slate-200 hover:border-orange-500 text-slate-400 hover:text-orange-600 transition-all shadow-sm flex items-center justify-center group"
          >
            <MoreHorizontal className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl z-[9999]" sideOffset={8}>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/users/${userId}`)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer outline-none group"
          >
            <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Edit className="h-4 w-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Profile & Edit</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem
            onClick={() => openTxModal("credit")}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer outline-none group"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Add Funds</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openTxModal("debit")}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-all cursor-pointer outline-none group"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Deduct Funds</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem
            onClick={() => handleAction("approve")}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer outline-none group"
          >
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <UserCheck className="h-4 w-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Verify Status</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction("delete")}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 hover:text-white hover:bg-red-500 transition-all cursor-pointer outline-none group"
          >
            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
              <Trash2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Delete User</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={txOpen} onOpenChange={setTxOpen}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 rounded-3xl overflow-hidden p-0 shadow-2xl z-[10000]">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
                <Zap className="w-3.5 h-3.5 text-orange-500" /> Admin Transaction
              </div>
              <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3 text-slate-900 italic uppercase">
                {txType === "credit" ? (
                  <>
                    <ArrowUpRight className="w-7 h-7 text-emerald-600" />
                    Credit <span className="text-orange-600">Account</span>
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="w-7 h-7 text-blue-600" />
                    Debit <span className="text-orange-600">Account</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {txSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase italic">Ledger Updated</h3>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-50 border-slate-200 rounded-2xl h-14 text-2xl font-black text-slate-900 pl-12"
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</Label>
                  <Select value={txCurrency} onValueChange={setTxCurrency}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
                      {["USD", "EUR", "GBP", "JPY", "INR", "CHF", "CAD", "AUD", "SGD"].map(c => (
                        <SelectItem key={c} value={c} className="font-black text-[10px] tracking-widest uppercase">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Memo</Label>
                  <Input
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder="Transaction reason..."
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-slate-900 font-bold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setTxOpen(false)} className="flex-1 h-12 rounded-xl border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                    Cancel
                  </Button>
                  <Button
                    onClick={submitTransaction}
                    disabled={isLoading}
                    className={`flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] text-white border-none ${txType === 'credit' ? 'bg-emerald-600' : 'bg-blue-600'}`}
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Execute'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
