"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Banknote, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function IMFVerificationPage() {
  const [imfCode, setImfCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [transferDetails, setTransferDetails] = useState<any>(null)
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
      } else {
        console.error("Failed to fetch transfer details")
      }
    } catch (error) {
      console.error("Failed to fetch transfer details:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imfCode.trim()) {
      setError("Please enter the International Transfer Code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/verify-imf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef, imfCode: imfCode.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setTimeout(() => {
          router.push(`/dashboard/transfer/verify/esi/${txRef}`)
        }, 1200)
      } else {
        setError(data.message || "Invalid International Transfer Code")
      }
    } catch (error) {
      setError("Network error in processing.")
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
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-10 relative z-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <Button variant="ghost" onClick={() => router.push(`/dashboard/transfer/verify/cot/${txRef}`)} className="h-14 w-14 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-white group px-0 shrink-0 shadow-sm">
            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-orange-50 border border-orange-100 w-fit mx-auto md:mx-0 rounded-full shadow-sm">
              <Banknote className="h-3 w-3" />
              Global Protocol Clearance
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
              Settlement <span className="text-slate-400 italic">Auth</span>
            </h1>
            <p className="text-slate-600 font-medium">Stage 02: Global Settlement Clearance Code</p>
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

        {/* IMF Verification Card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="border border-slate-200 shadow-2xl bg-white rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
            <CardHeader className="p-10 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-[2rem] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm relative group overflow-hidden">
                  <Banknote className="h-10 w-10 relative z-10 group-hover:rotate-12 transition-transform" />
                  <div className="absolute inset-0 bg-orange-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Settlement <span className="text-slate-400 italic">Gate</span></CardTitle>
                  <CardDescription className="text-slate-500 font-medium max-w-sm mx-auto">
                    Provide your high-priority settlement clearance code to authorize the final disbursement stages.
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
                  <Label htmlFor="imfCode" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Clearance Sequence</Label>
                  <Input
                    id="imfCode"
                    type="text"
                    value={imfCode}
                    onChange={(e) => setImfCode(e.target.value)}
                    placeholder="......"
                    disabled={isLoading || isVerified}
                    className="h-24 text-center text-4xl font-black tracking-[0.8em] bg-white border-slate-200 rounded-[2rem] shadow-inner focus:ring-0 focus:border-orange-600 placeholder:text-slate-200 text-orange-600 transition-all uppercase"
                  />
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                    Mandatory secure clearance protocol requirement.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-slate-900 text-white font-black h-16 rounded-2xl shadow-xl shadow-orange-600/10 uppercase tracking-tighter text-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
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
              { label: "Processing", percent: "75%", active: true, done: false },
              { label: "Complete", percent: "100%", active: false, done: false },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all duration-500",
                  step.active ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20 scale-110" :
                    step.done ? "bg-orange-50 border-orange-100 text-orange-600 shadow-sm" :
                      "bg-white border-slate-200 text-slate-400"
                )}>
                  {step.percent}
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest transition-colors",
                  step.active ? "text-orange-600" :
                    step.done ? "text-orange-400" :
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
