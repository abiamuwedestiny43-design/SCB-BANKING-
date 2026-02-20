"use client"

import type React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2,
  Globe,
  MapPin,
  ArrowRightLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  User,
  ShieldCheck,
  Search,
  BookUser,
  AlertCircle,
  Zap
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TransferPage() {
  const [transferType, setTransferType] = useState<"local" | "international">("local")
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    amount: "",
    currency: "USD",
    description: "",
    country: "",
    routingCode: "",
    branchName: "",
    accountType: "Savings",
    chargesType: "SHA",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [pendingTransfer, setPendingTransfer] = useState<any>(null)

  const [saveBeneficiaryChoice, setSaveBeneficiaryChoice] = useState<"no" | "yes">("no")
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null)

  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()

  const { data: beneData } = useSWR("/api/user/beneficiaries", fetcher)
  const beneficiaries = beneData?.beneficiaries || []
  const { data: localFlagData } = useSWR("/api/system/local-transfer-enabled", fetcher)

  const { data: profileData } = useSWR("/api/user/profile", fetcher)
  const assignedCurrency = profileData?.user?.currency
  const userLocalEnabled = profileData?.user?.bankAccount?.canLocalTransfer ?? true
  const userIntlEnabled = profileData?.user?.bankAccount?.canInternationalTransfer ?? true
  const canTransferAll = profileData?.user?.bankAccount?.canTransfer ?? true
  const localEnabled = (localFlagData?.enabled ?? true) && userLocalEnabled

  useEffect(() => {
    if (assignedCurrency) {
      setFormData((prev) => ({ ...prev, currency: assignedCurrency }))
    }
  }, [assignedCurrency])

  useEffect(() => {
    const accountNumber = params.get("accountNumber")
    const bankName = params.get("bankName")
    const accountHolder = params.get("accountHolder")
    if (accountNumber || bankName || accountHolder) {
      setFormData((prev) => ({
        ...prev,
        bankName: bankName || prev.bankName,
        accountNumber: accountNumber || prev.accountNumber,
        accountHolder: accountHolder || prev.accountHolder,
      }))
    }
  }, [params])

  useEffect(() => {
    if (!selectedBeneficiaryId) return
    const b = beneficiaries.find((x: any) => x._id === selectedBeneficiaryId)
    if (!b) return
    setTransferType(b.bankRegion === "international" ? "international" : "local")
    setFormData((prev) => ({
      ...prev,
      bankName: b.bankInfo.bankName || "",
      accountNumber: b.bankAccount || "",
      accountHolder: b.bankInfo.bankHolder || "",
      country: b.bankInfo.bankCountry || "",
      routingCode: b.bankInfo.identifierCode || "",
      branchName: b.bankInfo.branchName || "",
      accountType: b.bankInfo.accountType || "Savings",
    }))
  }, [selectedBeneficiaryId, beneficiaries])

  // useEffect(() => {
  //   if (!localEnabled && transferType === "local") {
  //     setTransferType("international")
  //   }
  // }, [localEnabled, transferType])

  // useEffect(() => {
  //   if (!userIntlEnabled && transferType === "international") {
  //     setTransferType("local")
  //   }
  // }, [userIntlEnabled, transferType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          transferType,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPendingTransfer(data.transfer)

        if (saveBeneficiaryChoice === "yes") {
          ; (async () => {
            try {
              await fetch("/api/user/beneficiaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bankRegion: transferType === "international" ? "international" : "local",
                  bankAccount: formData.accountNumber,
                  bankInfo: {
                    bankName: formData.bankName,
                    bankHolder: formData.accountHolder,
                    bankCountry: formData.country || undefined,
                    identifier: transferType === "international" ? "Routing/SWIFT" : "IFSC/Routing",
                    identifierCode: formData.routingCode || undefined,
                    branchName: formData.branchName || undefined,
                    accountType: formData.accountType || undefined,
                    chargesType: formData.chargesType || "SHA",
                  },
                }),
              })
            } catch { }
          })()
        }

        if (transferType === "local") {
          setShowOtpDialog(true)
        } else {
          router.push(`/dashboard/transfer/verify/cot/${data.transfer.txRef}`)
        }
      } else {
        setError(data.message || "Transfer initiation failed")
        toast({ variant: "destructive", description: data.message || "Transfer initiation failed" })
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast({ variant: "destructive", description: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async () => {
    const isSixDigits = /^\d{6}$/.test(otpCode)
    if (!isSixDigits) {
      setError("Please enter a valid 6-digit OTP")
      toast({ variant: "destructive", description: "Invalid OTP: please enter 6 digits." })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/transfers/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txRef: pendingTransfer.txRef,
          otpCode,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({ description: "OTP verified. Completing transfer..." })
        router.push(`/dashboard/receipt/${pendingTransfer.txRef}`)
      } else {
        setError(data.message || "OTP verification failed")
        toast({ variant: "destructive", description: data.message || "OTP verification failed" })
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast({ variant: "destructive", description: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-black w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden selection:bg-orange-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float"></div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none invert"></div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">

        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full"></div>
            <div className="relative inline-flex items-center justify-center p-6 bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl mb-2 group">
              <ArrowRightLeft className="h-12 w-12 text-orange-600 transition-transform group-hover:rotate-180 duration-700" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-orange-500 text-[10px] font-black uppercase tracking-[0.25em] mx-auto shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Identity Secured Gateway
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
              FUNDING <span className="text-orange-600 italic">CLEARANCE</span>
            </h1>
          </div>
          <p className="text-slate-400 font-bold max-w-2xl mx-auto text-base leading-relaxed uppercase tracking-tight">
            Authorized portal for high-fidelity cross-border settlement and real-time ledger synchronization.
          </p>
        </motion.div>



        <div className="grid grid-cols-1 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none bg-transparent shadow-none overflow-visible">
              <CardHeader className="p-0 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/40 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 glass-dark">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-2">
                      <Zap className="w-3 h-3 fill-orange-500" /> Clearance Protocol
                    </p>
                    <CardTitle className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Transfer <span className="text-slate-400 italic">Parameters</span></CardTitle>
                  </div>
                  <div className="flex bg-slate-950 p-1.5 rounded-[2rem] border border-white/5 shadow-inner shrink-0">
                    <button
                      type="button"
                      onClick={() => setTransferType("local")}
                      className={cn(
                        "flex items-center gap-2 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                        transferType === "local" ? "bg-orange-600 text-white shadow-[0_10px_25px_-5px_rgba(234,88,12,0.4)] scale-105" : "text-slate-500 hover:text-white"
                      )}
                    >
                      <MapPin className="h-4 w-4" /> Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType("international")}
                      className={cn(
                        "flex items-center gap-2 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                        transferType === "international" ? "bg-white text-slate-900 shadow-2xl scale-105" : "text-slate-500 hover:text-white"
                      )}
                    >
                      <Globe className="h-4 w-4" /> Global
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="bg-slate-900/40 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 glass-dark space-y-12">
                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert className="bg-red-900/20 border-red-900/50 rounded-2xl p-6">
                          <AlertDescription className="text-red-400 font-black uppercase text-sm italic">{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {/* Beneficiary registry quick select */}
                    <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 flex items-center gap-2">
                        <BookUser className="w-3.5 h-3.5 text-orange-500" /> Authorized Entities Registry
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div
                          onClick={() => setSelectedBeneficiaryId(null)}
                          className={cn(
                            "group p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden",
                            !selectedBeneficiaryId ? "border-orange-600 bg-orange-600/10 shadow-xl shadow-orange-600/5 scale-[1.02]" : "border-white/5 bg-slate-950 hover:border-white/10"
                          )}
                        >
                          <div className={cn("h-10 w-10 rounded-2xl border flex items-center justify-center transition-all shrink-0", !selectedBeneficiaryId ? "border-orange-600 bg-orange-600 text-white" : "border-white/10 text-slate-600")}>
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-white text-xs uppercase tracking-tight">Manual Entry</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">New Protocol</p>
                          </div>
                          {!selectedBeneficiaryId && <div className="absolute top-2 right-4 text-[8px] font-black text-orange-600 uppercase">Active</div>}
                        </div>

                        {beneficiaries.map((b: any) => (
                          <div
                            key={b._id}
                            onClick={() => setSelectedBeneficiaryId(b._id)}
                            className={cn(
                              "group p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden",
                              selectedBeneficiaryId === b._id ? "border-orange-600 bg-orange-600/10 shadow-xl shadow-orange-600/5 scale-[1.02]" : "border-white/5 bg-slate-950 hover:border-white/10"
                            )}
                          >
                            <div className={cn("h-10 w-10 rounded-2xl border flex items-center justify-center transition-all shrink-0 font-black", selectedBeneficiaryId === b._id ? "border-orange-600 bg-orange-600 text-white" : "border-white/10 bg-slate-900 text-slate-500")}>
                              {b.bankInfo.bankHolder[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-white text-xs uppercase tracking-tight truncate">{b.bankInfo.bankHolder}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{b.bankInfo.bankName}</p>
                            </div>
                            {selectedBeneficiaryId === b._id && <CheckCircle2 className="h-4 w-4 text-orange-500 absolute bottom-3 right-4" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                      <div className="space-y-4">
                        <Label htmlFor="bankName" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Destination Institution</Label>
                        <div className="relative group">
                          <Banknote className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 group-focus-within:text-orange-500 transition-all duration-500" />
                          <Input
                            id="bankName"
                            placeholder="NODE_PROVIDER_ID"
                            value={formData.bankName}
                            onChange={(e) => handleChange("bankName", e.target.value)}
                            required
                            disabled={isLoading}
                            className="pl-16 h-20 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/5 transition-all rounded-[2rem] font-bold text-white placeholder:text-slate-800 text-lg shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="accountNumber" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Account Registry</Label>
                        <div className="relative group">
                          <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 group-focus-within:text-orange-500 transition-all duration-500" />
                          <Input
                            id="accountNumber"
                            placeholder="TARGET_SEQUENCE"
                            value={formData.accountNumber}
                            onChange={(e) => handleChange("accountNumber", e.target.value)}
                            required
                            disabled={isLoading}
                            className="pl-16 h-20 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/5 transition-all rounded-[2rem] font-bold text-white placeholder:text-slate-800 text-lg shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <Label htmlFor="accountHolder" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Principal Beneficiary</Label>
                        <div className="relative group">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 group-focus-within:text-orange-500 transition-all duration-500" />
                          <Input
                            id="accountHolder"
                            placeholder="ENTITY_LEGAL_NAME"
                            value={formData.accountHolder}
                            onChange={(e) => handleChange("accountHolder", e.target.value)}
                            required
                            disabled={isLoading}
                            className="pl-16 h-20 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/5 transition-all rounded-[2rem] font-bold text-white placeholder:text-slate-800 text-lg uppercase tracking-tight shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="branchName" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Branch Location</Label>
                        <div className="relative group">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 group-focus-within:text-orange-500 transition-all duration-500" />
                          <Input
                            id="branchName"
                            placeholder="BRANCH_IDENTIFIER"
                            value={formData.branchName}
                            onChange={(e) => handleChange("branchName", e.target.value)}
                            disabled={isLoading}
                            className="pl-16 h-20 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/5 transition-all rounded-[2rem] font-bold text-white placeholder:text-slate-800 text-lg uppercase shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="routingCode" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">
                          {transferType === "international" ? "Clearing Code (SWIFT/IBAN)" : "IFSC / Routing Code"}
                        </Label>
                        <div className="relative group">
                          <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 group-focus-within:text-orange-500 transition-all duration-500" />
                          <Input
                            id="routingCode"
                            placeholder="BIC_OR_IBAN_NODE"
                            value={formData.routingCode}
                            onChange={(e) => handleChange("routingCode", e.target.value)}
                            disabled={isLoading}
                            className="pl-16 h-20 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/5 transition-all rounded-[2rem] font-bold text-white placeholder:text-slate-800 text-lg uppercase shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <Label htmlFor="accountType" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Account Category</Label>
                        <Select value={formData.accountType} onValueChange={(value) => handleChange("accountType", value)}>
                          <SelectTrigger className="h-20 bg-slate-950 border-white/5 rounded-[2rem] font-bold text-white focus:ring-orange-600/5 focus:border-orange-600/30 transition-all text-lg px-8 shadow-inner">
                            <SelectValue placeholder="SET_ACCOUNT_TYPE" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[2rem] bg-slate-950 border-white/10 text-white shadow-2xl p-2">
                            {["Savings", "Current", "Checking"].map((t) => (
                              <SelectItem key={t} value={t} className="rounded-2xl hover:bg-slate-900 focus:bg-orange-600 px-6 py-4 cursor-pointer font-bold uppercase tracking-widest text-[10px]">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {transferType === "international" && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 md:col-span-2">
                          <div className="space-y-4">
                            <Label htmlFor="country" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Jurisdiction</Label>
                            <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                              <SelectTrigger className="h-20 bg-slate-950 border-white/5 rounded-[2rem] font-bold text-white focus:ring-orange-600/5 focus:border-orange-600/30 transition-all text-lg px-8 shadow-inner">
                                <SelectValue placeholder="SET_SOVEREIGN_STATE" />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 rounded-[2rem] bg-slate-950 border-white/10 text-white shadow-2xl p-2">
                                {[
                                  "United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Singapore", "Switzerland", "United Arab Emirates"
                                ].map((c) => (
                                  <SelectItem key={c} value={c} className="rounded-2xl hover:bg-slate-900 focus:bg-orange-600 px-6 py-4 cursor-pointer font-bold uppercase tracking-widest text-[10px]">
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <Label htmlFor="amount" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Liquid Value</Label>
                        <div className="relative group">
                          <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-700 group-focus-within:text-orange-500 transition-colors">{formData.currency === "USD" ? "$" : assignedCurrency}</span>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleChange("amount", e.target.value)}
                            required
                            disabled={isLoading}
                            className="pl-16 h-28 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/10 shadow-xl shadow-orange-950 transition-all rounded-[2.5rem] text-4xl md:text-5xl font-black text-white tracking-tighter"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <Label htmlFor="description" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Transmission Note</Label>
                        <Textarea
                          id="description"
                          placeholder="Reason for migration sequence..."
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          disabled={isLoading}
                          className="h-32 bg-slate-950 border-white/5 focus:bg-slate-900 focus:border-orange-600/50 focus:ring-orange-600/5 transition-all rounded-[2rem] p-8 font-bold text-white placeholder:text-slate-800 text-lg shadow-inner resize-none"
                        />
                      </div>

                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Fee Allocation (Charges Type)</Label>
                        <RadioGroup
                          value={formData.chargesType}
                          onValueChange={(val) => handleChange("chargesType", val)}
                          className="grid grid-cols-3 gap-4"
                        >
                          {[
                            { id: "SHA", label: "SHA", desc: "Shared" },
                            { id: "OUR", label: "OUR", desc: "Sender Pays" },
                            { id: "BEN", label: "BEN", desc: "Recipient Pays" }
                          ].map((type) => (
                            <div key={type.id}>
                              <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                              <Label
                                htmlFor={type.id}
                                className="flex flex-col items-center justify-between rounded-2xl border-2 border-white/5 bg-slate-950 p-4 hover:bg-slate-900 peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-600/10 cursor-pointer transition-all"
                              >
                                <span className="text-sm font-black text-white">{type.label}</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{type.desc}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <RadioGroup
                        value={saveBeneficiaryChoice}
                        onValueChange={(v: any) => setSaveBeneficiaryChoice(v)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {[
                          { id: "no", label: "One-Time Migration" },
                          { id: "yes", label: "Commit to Registry" }
                        ].map((choice) => (
                          <div
                            key={choice.id}
                            onClick={() => setSaveBeneficiaryChoice(choice.id as any)}
                            className={cn(
                              "flex items-center gap-4 p-6 rounded-2xl border transition-all cursor-pointer",
                              saveBeneficiaryChoice === choice.id ? "border-orange-600/50 bg-orange-600/5 text-white" : "border-white/5 bg-slate-950/50 text-slate-500 hover:border-white/10"
                            )}
                          >
                            <RadioGroupItem value={choice.id} id={`save-${choice.id}`} className="border-slate-500 text-orange-600" />
                            <Label htmlFor={`save-${choice.id}`} className="font-bold uppercase tracking-widest text-[10px] cursor-pointer">{choice.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !canTransferAll}
                      className="w-full h-24 bg-orange-600 hover:bg-orange-500 text-white rounded-[2.5rem] shadow-2xl font-black text-[10px] uppercase tracking-[0.5em] transition-all hover:scale-[1.02] active:scale-[0.98] group/btn border-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" /> SYNCHRONIZING_PROTOCOLS...
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          EXECUTE_CLEARANCE_SEQUENCE <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* OTP Dialog Redesign */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-slate-950 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-orange-600/5 blur-3xl pointer-events-none"></div>
          <div className="relative p-12 space-y-10">
            <DialogHeader className="space-y-4">
              <div className="h-20 w-20 bg-slate-900 border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
                <ShieldCheck className="h-10 w-10 text-orange-500" />
              </div>
              <DialogTitle className="text-3xl font-black text-center text-white tracking-tighter uppercase italic">Identity <span className="text-orange-500">Protocol</span></DialogTitle>
              <DialogDescription className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                Verification sequence initiated. Enter the 6-digit cryptographic clearance code sent to your linked device.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Input
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="h-24 bg-slate-900 border-white/5 rounded-[2rem] text-center text-5xl font-black text-white tracking-[0.3em] placeholder:text-slate-800 focus:ring-orange-600/20 focus:border-orange-600/50 transition-all shadow-inner"
              />
              <Button
                onClick={handleOtpVerification}
                disabled={isLoading}
                className="w-full h-20 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-105 active:scale-95 border-none"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "VERIFY_IDENTITY"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
        .glass-dark { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); }
        .text-gradient { background: linear-gradient(to right, #ea580c, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 10s ease-in-out infinite; }
      `}} />
    </div>
  )
}

