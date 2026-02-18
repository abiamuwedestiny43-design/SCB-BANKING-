"use client"

import type React from "react"
import * as Portal from "@radix-ui/react-portal"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, DollarSign, CheckCircle, Trash2, Zap, ArrowUpRight, ArrowDownLeft, X, ShieldAlert, Cpu, RefreshCw } from "lucide-react"
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
  DropdownMenuTrigger
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
      alert("Invalid liquidity volume detected. Please re-input.")
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
        alert(j?.message || "Protocol transmission failed.")
      }
    } catch (err) {
      console.error("[HB BANK] admin tx error:", err)
      alert("System fault detected during migration.")
    } finally {
      setIsLoading(false)
    }
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeBtn, setActiveBtn] = useState<HTMLButtonElement | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      menuRef.current.style.top = `${menuPosition.top}px`
      menuRef.current.style.right = `${menuPosition.right}px`
    }
  }, [menuOpen, menuPosition])

  const handleAction = async (action: string) => {
    setMenuOpen(false)
    setIsLoading(true)
    try {
      switch (action) {
        case "view":
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
            alert("Approval protocol failed.")
          }
          break
        case "delete":
          if (confirm("Initiate permanent data erasure for this node? This cannot be reversed.")) {
            const deleteResponse = await fetch(`/api/admin/users/${userId}`, {
              method: "DELETE",
            })
            if (deleteResponse.ok) {
              router.refresh()
            } else {
              alert("Node deletion protocol aborted.")
            }
          }
          break
        case "credit":
          await openTxModal("credit")
          break
        case "debit":
          await openTxModal("debit")
          break
      }
    } catch (error) {
      console.error("Action error:", error)
      alert("Executive override error.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!menuOpen && activeBtn) {
      const rect = activeBtn.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      })
    }
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          ref={(node) => setActiveBtn(node)}
          onClick={toggleMenu}
          className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-orange-600 text-white shadow-lg transition-all gap-3 font-black uppercase tracking-[0.2em] text-[10px] relative z-[40] group active:scale-95 border border-white/5"
        >
          <Cpu className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" /> Protocols
        </Button>

        {menuOpen && (
          <Portal.Root>
            <div
              className="fixed inset-0 z-[100]"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
              }}
            />
            <div
              ref={menuRef}
              className="w-64 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 shadow-3xl z-[101] animate-in fade-in zoom-in-95 duration-200 glass-dark fixed"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleAction("view")}
                className="w-full flex items-center gap-4 rounded-[1.2rem] px-5 py-3.5 text-slate-500 hover:text-white hover:bg-white/5 transition-all text-left group"
              >
                <div className="h-8 w-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Edit className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Edit Metadata</span>
              </button>

              <div className="h-px bg-white/5 mx-2 my-2" />

              <button
                onClick={() => handleAction("credit")}
                className="w-full flex items-center gap-4 rounded-[1.2rem] px-5 py-3.5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-600/5 transition-all group text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Credit Assets</span>
              </button>

              <button
                onClick={() => handleAction("debit")}
                className="w-full flex items-center gap-4 rounded-[1.2rem] px-5 py-3.5 text-slate-500 hover:text-blue-500 hover:bg-blue-600/5 transition-all group text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Debit Assets</span>
              </button>

              <div className="h-px bg-white/5 mx-2 my-2" />

              <button
                onClick={() => handleAction("approve")}
                className="w-full flex items-center gap-4 rounded-[1.2rem] px-5 py-3.5 text-slate-500 hover:text-white hover:bg-white/5 transition-all text-left group"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 group-hover:bg-orange-600 group-hover:text-white transition-all border border-white/5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Approve Node</span>
              </button>

              <button
                onClick={() => handleAction("delete")}
                className="w-full flex items-center gap-4 rounded-[1.2rem] px-5 py-3.5 text-red-500 hover:text-white hover:bg-red-600 transition-all text-left group"
              >
                <div className="h-8 w-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-white/20 group-hover:text-white transition-all">
                  <Trash2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Erase Node</span>
              </button>
            </div>
          </Portal.Root>
        )}
      </div>

      <Dialog open={txOpen} onOpenChange={setTxOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border-white/5 text-white rounded-[3.5rem] overflow-hidden p-0 shadow-3xl glass-dark">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="p-10 space-y-10 relative z-10">
            <DialogHeader>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[9px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl">
                <Zap className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Migration Unit
              </div>
              <DialogTitle className="text-4xl font-black italic tracking-tighter flex items-center gap-4 uppercase leading-none">
                {txType === "credit" ? (
                  <>
                    <ArrowUpRight className="w-10 h-10 text-orange-600" />
                    ASSET <span className="text-orange-600 italic">INJECTION</span>
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="w-10 h-10 text-blue-600" />
                    ASSET <span className="text-blue-600 italic font-medium">DRAIN</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-4">
                {txType === "credit"
                  ? "Initializing intra-system credit migration to subject node."
                  : "Initializing intra-system debit extraction from subject node."
                }
              </DialogDescription>
            </DialogHeader>

            {txSuccess ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-8 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-600/20 animate-pulse"></div>
                  <CheckCircle className="w-12 h-12 text-orange-500 relative z-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Protocol Success</h3>
                  <p className="text-slate-500 font-bold text-xs mt-3 uppercase tracking-widest">Assets Synchronized with Ledger</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Volume (Amount)</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-900 border-white/5 rounded-2xl h-16 text-3xl font-black text-white focus:border-orange-500 focus:ring-orange-500/10 transition-all pl-12 shadow-inner group-hover:bg-slate-900 group-hover:border-white/10"
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-700 group-focus-within:text-orange-600 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Currency Matrix</Label>
                  <Select value={txCurrency} onValueChange={setTxCurrency}>
                    <SelectTrigger className="bg-slate-900 border-white/5 rounded-2xl h-14 text-white font-black uppercase text-[10px] tracking-widest focus:ring-orange-500/10">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-white/10 text-white rounded-2xl">
                      {["USD", "EUR", "GBP", "JPY", "INR", "CHF", "CAD", "AUD", "SGD"].map(c => (
                        <SelectItem key={c} value={c} className="font-black py-3 hover:bg-orange-600 hover:text-white transition-colors">{c} — PROTOCOL</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Remark</Label>
                  <Input
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder={`System ${txType === 'credit' ? 'Injection' : 'Extraction'} Sequence`}
                    className="bg-slate-900 border-white/5 rounded-2xl h-14 text-white font-bold italic placeholder:text-slate-800 focus:border-orange-500 shadow-inner"
                  />
                </div>

                <div className="flex gap-6 pt-6">
                  <Button variant="ghost" onClick={() => setTxOpen(false)} className="flex-1 h-14 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] transition-all">
                    Abort
                  </Button>
                  <Button
                    onClick={submitTransaction}
                    disabled={isLoading}
                    className={`flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 border-none ${txType === 'credit'
                      ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/20'
                      : 'bg-white text-slate-950 hover:bg-slate-200 shadow-white/10'
                      }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      `Execute ${txType === 'credit' ? 'Credit' : 'Debit'}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!txSuccess && (
            <div className="bg-black/60 p-6 flex items-start gap-4 border-t border-white/5">
              <div className="h-10 w-10 min-w-[40px] rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 border border-orange-600/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed mt-1">
                <span className="text-orange-500">Executive Warning:</span> This override will bypass standard regional verification protocols and modify ledger state directly across all Sovereign nodes.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
