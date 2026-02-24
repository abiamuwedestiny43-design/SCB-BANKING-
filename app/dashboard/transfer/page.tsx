"use client"

import type React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2, Globe, MapPin, ArrowRightLeft, CreditCard, Banknote,
  CheckCircle2, ArrowRight, User, ShieldCheck, BookUser, AlertCircle, ChevronLeft
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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
  const { data: profileData } = useSWR("/api/user/profile", fetcher)
  const assignedCurrency = profileData?.user?.currency
  const canTransferAll = profileData?.user?.bankAccount?.canTransfer ?? true

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/transfers/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, transferType, amount: Number.parseFloat(formData.amount) }),
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
    } catch {
      setError("An error occurred. Please try again.")
      toast({ variant: "destructive", description: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      setError("Please enter a valid 6-digit OTP")
      toast({ variant: "destructive", description: "Invalid OTP: please enter 6 digits." })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/transfers/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef: pendingTransfer.txRef, otpCode }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({ description: "OTP verified. Completing transfer..." })
        router.push(`/dashboard/receipt/${pendingTransfer.txRef}`)
      } else {
        setError(data.message || "OTP verification failed")
        toast({ variant: "destructive", description: data.message || "OTP verification failed" })
      }
    } catch {
      setError("An error occurred. Please try again.")
      toast({ variant: "destructive", description: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-black hover:bg-white">
            <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">Send Money</h1>
            <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Transfer funds securely</p>
          </div>
        </div>

        {/* Transfer Type Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 flex gap-1">
          <button
            type="button"
            onClick={() => setTransferType("local")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm md:text-base font-black uppercase tracking-widest transition-all italic",
              transferType === "local" ? "bg-black text-white shadow-sm" : "text-black hover:text-black hover:bg-slate-50"
            )}
          >
            <MapPin className="h-4 w-4" /> Local Transfer
          </button>
          <button
            type="button"
            onClick={() => setTransferType("international")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm md:text-base font-black uppercase tracking-widest transition-all italic",
              transferType === "international" ? "bg-black text-white shadow-sm" : "text-black hover:text-black hover:bg-slate-50"
            )}
          >
            <Globe className="h-4 w-4" /> International
          </button>
        </div>

        {/* Error */}
        {error && (
          <Alert className="bg-red-50 border-red-200 rounded-xl py-2.5 px-4">
            <AlertCircle className="h-4 w-4 text-black" />
            <AlertDescription className="text-red-600 text-xs font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Saved Beneficiaries */}
          {beneficiaries.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <BookUser className="h-4 w-4 text-black" />
                <p className="text-xl md:text-3xl font-black text-black uppercase tracking-tight italic">Saved <span className="text-black">Beneficiaries</span></p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedBeneficiaryId(null)}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-all",
                    !selectedBeneficiaryId ? "border-black bg-slate-50 text-black" : "border-slate-100 text-black hover:border-slate-200"
                  )}
                >
                  <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-black" />
                  </div>
                  <span className="font-medium text-[10px]">New</span>
                </button>
                {beneficiaries.map((b: any) => (
                  <button
                    type="button"
                    key={b._id}
                    onClick={() => setSelectedBeneficiaryId(b._id)}
                    className={cn(
                      "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-all min-w-[60px]",
                      selectedBeneficiaryId === b._id ? "border-black bg-slate-50 text-black" : "border-slate-100 text-black hover:border-slate-200"
                    )}
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-black text-xs">
                      {b.bankInfo.bankHolder[0]}
                    </div>
                    <span className="font-medium text-[10px] truncate max-w-[56px]">{b.bankInfo.bankHolder.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recipient Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-4">
            <h2 className="text-xl md:text-3xl font-black text-black uppercase tracking-tight italic flex items-center gap-2">
              <User className="h-6 w-6 text-black" /> Recipient <span className="text-black">Identity Matrix</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bankName" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-sm md:text-base font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountNumber" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange("accountNumber", e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-sm md:text-base font-mono font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 transition-all"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="accountHolder" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Beneficiary Name</Label>
                <Input
                  id="accountHolder"
                  placeholder="Full name of account holder"
                  value={formData.accountHolder}
                  onChange={(e) => handleChange("accountHolder", e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 text-sm md:text-base font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branchName" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Branch Name</Label>
                <Input
                  id="branchName"
                  placeholder="Branch (optional)"
                  value={formData.branchName}
                  onChange={(e) => handleChange("branchName", e.target.value)}
                  disabled={isLoading}
                  className="h-12 text-sm md:text-base font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="routingCode" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">
                  {transferType === "international" ? "SWIFT / BIC Code" : "IFSC / Routing Code"}
                </Label>
                <Input
                  id="routingCode"
                  placeholder={transferType === "international" ? "BIC / IBAN" : "IFSC code"}
                  value={formData.routingCode}
                  onChange={(e) => handleChange("routingCode", e.target.value)}
                  disabled={isLoading}
                  className="h-12 text-sm md:text-base font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Account Type</Label>
                <Select value={formData.accountType} onValueChange={(value) => handleChange("accountType", value)}>
                  <SelectTrigger className="h-12 text-sm md:text-base font-bold rounded-xl border-slate-200 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {["Savings", "Current", "Checking"].map((t) => (
                      <SelectItem key={t} value={t} className="text-sm md:text-base font-black uppercase tracking-tight italic">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {transferType === "international" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-black">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger className="h-9 text-xs rounded-lg border-slate-200 bg-slate-50">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 rounded-lg text-xs">
                      {["United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Singapore", "Switzerland", "United Arab Emirates"].map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-4">
            <h2 className="text-xl md:text-3xl font-black text-black uppercase tracking-tight italic">Transaction <span className="text-black">Metrics</span></h2>
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Transfer Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300 italic">
                  {formData.currency === "USD" ? "$" : formData.currency}
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-12 h-20 text-4xl md:text-7xl font-black rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 italic tracking-tighter transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Reason for transfer..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                className="h-24 text-sm md:text-base font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-orange-400/10 resize-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-black">Fee Allocation</Label>
              <RadioGroup
                value={formData.chargesType}
                onValueChange={(val) => handleChange("chargesType", val)}
                className="grid grid-cols-3 gap-2"
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
                      className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2.5 hover:bg-slate-100 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-slate-50 cursor-pointer transition-all"
                    >
                      <span className="text-xs font-bold text-black">{type.label}</span>
                      <span className="text-[9px] text-black mt-0.5">{type.desc}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Save beneficiary toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <RadioGroup
              value={saveBeneficiaryChoice}
              onValueChange={(v: any) => setSaveBeneficiaryChoice(v)}
              className="grid grid-cols-2 gap-2"
            >
              {[{ id: "no", label: "One-Time Transfer" }, { id: "yes", label: "Save Beneficiary" }].map((choice) => (
                <div key={choice.id}>
                  <RadioGroupItem value={choice.id} id={`save-${choice.id}`} className="peer sr-only" />
                  <Label
                    htmlFor={`save-${choice.id}`}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3.5 hover:bg-slate-100 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-slate-50 cursor-pointer transition-all text-sm md:text-base font-black uppercase tracking-widest italic"
                  >
                    {choice.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || !canTransferAll}
            className="w-full h-16 bg-black hover:bg-black text-white rounded-2xl font-black text-sm md:text-base border-none shadow-xl transition-all uppercase tracking-widest italic group"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Send Money Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>
      </div>

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="max-w-sm bg-white rounded-2xl border border-slate-100 shadow-xl p-6">
          <DialogHeader className="text-center space-y-2">
            <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto">
              <ShieldCheck className="h-6 w-6 text-black" />
            </div>
            <DialogTitle className="text-base font-bold text-black">Security Verification</DialogTitle>
            <DialogDescription className="text-xs text-black">
              Enter the 6-digit OTP sent to your registered device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
              className="h-12 text-center text-2xl font-bold tracking-widest border-slate-200 focus:border-orange-400 rounded-xl"
            />
            <Button
              onClick={handleOtpVerification}
              disabled={isLoading}
              className="w-full h-10 bg-black hover:bg-black text-white rounded-xl font-semibold text-xs border-none"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Complete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
