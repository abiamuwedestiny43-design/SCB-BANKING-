"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, ChevronLeft, CreditCard, Lock, Scale } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function TAXVerificationPage() {
  const [taxCode, setTaxCode] = useState("")
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
      }
    } catch (error) {
      console.error("Failed to fetch transfer details:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taxCode.trim()) {
      setError("Please enter the Tax Code")
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

      if (response.ok) {
        setIsVerified(true)
        setTimeout(() => {
          router.push(`/dashboard/transfer/verify/tac/${txRef}`)
        }, 1200)
      } else {
        const data = await response.json()
        setError(data.message || "Invalid tax code")
      }
    } catch (error) {
      setError("A connection error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Transfer Verification</h1>
            <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">Step 5 of 6: Tax Review</p>
          </div>
        </div>

        {/* Transfer Summary */}
        {transferDetails && (
          <motion.div {...fadeIn}>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Transfer Amount</p>
                  <p className="text-base md:text-lg font-black text-slate-900 italic tracking-tight">{transferDetails.currency} {transferDetails.amount?.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destination</p>
                <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{transferDetails.txRegion}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner border border-slate-100">
                <Scale className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight italic">Tax <span className="text-orange-600">Verification</span></h2>
                <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest opacity-60 max-w-sm">
                  This transaction is subject to a mandatory tax review. Please enter your <span className="font-bold text-slate-700">Tax Code</span> to proceed.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6 pt-4">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <Alert className="bg-red-50 border-none text-red-700 rounded-lg py-3 px-4 flex items-center gap-2">
                        <AlertDescription className="text-xs font-bold text-center w-full">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="taxCode" className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Tax Code</Label>
                  <Input
                    id="taxCode"
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    disabled={isLoading || isVerified}
                    className="h-16 text-center text-3xl md:text-4xl font-black tracking-[0.4em] bg-slate-50 border-slate-200 rounded-2xl focus:border-orange-400 focus:bg-white placeholder:text-slate-200 text-slate-900 transition-all uppercase italic"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black h-16 rounded-2xl transition-all shadow-xl uppercase tracking-widest italic"
                    disabled={isLoading || isVerified}
                  >
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    ) : (
                      "Verify Tax Code"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-10 text-slate-400 font-bold text-xs"
                    onClick={() => router.push("/dashboard")}
                    disabled={isVerified}
                  >
                    Cancel Transfer
                  </Button>
                </div>
              </form>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global banking standards compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[0, 0, 0, 0, 1, 0].map((active, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all", active ? "w-6 bg-orange-500" : "w-1.5 bg-slate-300")} />
          ))}
        </div>
      </div>
    </div>
  )
}
