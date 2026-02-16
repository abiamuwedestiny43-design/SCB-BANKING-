"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export default function TAXVerificationPage() {
  const [taxCode, setTaxCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [transferDetails, setTransferDetails] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const params = useParams()
  const txRef = params.txRef as string

  useEffect(() => {
    fetchTransferDetails()
  }, [txRef])

  const fetchTransferDetails = async () => {
    try {
      const response = await fetch(`/api/transfers/${txRef}`)
      if (response.ok) {
        const data = await response.json()
        setTransferDetails(data.transfer)
      }
    } catch { }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taxCode.trim()) {
      setError("Please enter the TAX authorization signature")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/verify-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef, taxCode: taxCode.trim() }),
      })
      const data = await response.json()
      if (response.ok) {
        setIsVerified(true)
        router.push(`/dashboard/transfer/verify/tac/${txRef}`)
      } else {
        setError(data.message || "Invalid TAX authorization signature")
      }
    } catch {
      setError("Network error in jurisdiction protocol.")
    } finally {
      setIsLoading(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-10 relative z-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <Button variant="ghost" onClick={() => router.push(`/dashboard/transfer/verify/dco/${txRef}`)} className="h-14 w-14 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-white group px-0 shrink-0 shadow-sm">
            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-indigo-50 border border-indigo-100 w-fit mx-auto md:mx-0 rounded-full shadow-sm">
              <Shield className="h-3 w-3" />
              Tax Compliance Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
              Compliance <span className="text-slate-400 italic">Auth</span>
            </h1>
            <p className="text-slate-600 font-medium">Stage 05: Global Tax Compliance Authorization</p>
          </div>
        </motion.div>

        {/* Transfer Summary Artifact */}
        {transferDetails && (
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="border border-slate-200 shadow-xl bg-white rounded-[2.5rem] overflow-hidden group">
              <div className="p-8 border-b border-slate-100 bg-white/50 cursor-default">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Snapshot</p>
              </div>
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Value</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">
                    {transferDetails.currency} {transferDetails.amount?.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beneficiary</p>
                  <p className="text-lg font-bold text-slate-600 uppercase truncate text-xs">{transferDetails.accountHolder}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clearing Institution</p>
                  <p className="text-lg font-bold text-slate-600 uppercase truncate text-xs">{transferDetails.bankName}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAX Verification Card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="border border-slate-200 shadow-2xl bg-white rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-600 to-transparent"></div>
            <CardHeader className="p-10 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm relative group overflow-hidden">
                  <Shield className="h-10 w-10 relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-indigo-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Tax <span className="text-slate-400 italic">Gate</span></CardTitle>
                  <CardDescription className="text-slate-500 font-medium max-w-sm mx-auto">
                    Enter your high-level Tax Compliance Protocol code to authenticate the international tax settlement.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-6">
                      <AlertDescription className="text-center font-black uppercase text-xs tracking-widest">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-4 text-center">
                  <Label htmlFor="taxCode" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Sequence</Label>
                  <Input
                    id="taxCode"
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="......"
                    disabled={isLoading || isVerified}
                    className="h-24 text-center text-4xl font-black tracking-[0.8em] bg-white border-slate-200 rounded-[2rem] shadow-inner focus:ring-0 focus:border-indigo-600 placeholder:text-slate-200 text-indigo-600 transition-all uppercase"
                  />
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                    Mandatory secure tax compliance confirmation.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white font-black h-16 rounded-2xl shadow-xl shadow-indigo-600/10 uppercase tracking-tighter text-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                    disabled={isLoading || isVerified}
                  >
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : isVerified ? (
                      "Sequence Verified ✓"
                    ) : (
                      "Verify Sequence"
                    )}
                  </Button>
                  <Button type="button" variant="ghost" className="h-16 px-8 rounded-2xl border border-slate-200 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all" onClick={() => router.push("/dashboard")} disabled={isVerified}>
                    Abort
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Stepper Artifact */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="pt-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-slate-100"></div>
          <div className="flex items-center justify-between px-2">
            {[
              { label: "Initiate", percent: "✓", active: false, done: true },
              { label: "Processing", percent: "✓", active: false, done: true },
              { label: "Tax Check", percent: "85%", active: true, done: false },
              { label: "Complete", percent: "100%", active: false, done: false },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all duration-500",
                  step.active ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-110" :
                    step.done ? "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm" :
                      "bg-white border-slate-200 text-slate-400"
                )}>
                  {step.percent}
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest transition-colors",
                  step.active ? "text-indigo-600" :
                    step.done ? "text-indigo-400" :
                      "text-slate-300"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
          {/* Visual connecting lines */}
          <div className="absolute top-[26px] left-[15%] right-[15%] h-px bg-slate-100 -z-10"></div>
        </motion.div>
      </div>
    </div>
  )
}
