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
  AlertCircle
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
                    identifier: transferType === "international" ? "Routing/SWIFT" : undefined,
                    identifierCode: formData.routingCode || undefined,
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
    <div className="min-h-screen bg-white w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Minimal Background Structure */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-slate-500/[0.01] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-slate-500/[0.01] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-white border border-slate-200 rounded-3xl mb-2 shadow-sm">
            <ArrowRightLeft className="h-10 w-10 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-orange-600 text-[10px] font-black uppercase tracking-widest mx-auto shadow-sm">
              <ShieldCheck className="w-3 h-3" /> Secure Transfer Gateway
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
              Initiate <span className="text-slate-400 italic">Transfer</span>
            </h1>
          </div>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Execute cross-border settlement and peer-to-peer funds transfer via our high-speed secure clearing house.
          </p>
        </motion.div>



        <div className="grid grid-cols-1 gap-10">
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="border border-slate-200 bg-white overflow-hidden rounded-[3rem] shadow-xl relative">
              <div className="h-2 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 opacity-80" />
              <CardHeader className="p-10 pb-6 border-b border-slate-100 bg-white">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction Profile</p>
                    <CardTitle className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Transfer Details</CardTitle>
                  </div>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setTransferType("local")}
                      className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        transferType === "local" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-slate-500 hover:text-orange-600"
                      )}
                    >
                      <MapPin className="h-4 w-4" /> Local Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType("international")}
                      className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        transferType === "international" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <Globe className="h-4 w-4" /> Global Wire
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 space-y-12">
                <form onSubmit={handleSubmit} className="space-y-12">
                  {error && (
                    <Alert className="rounded-2xl border-l-4 border-red-600 bg-white text-red-700 font-bold p-6 shadow-sm">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="font-black uppercase tracking-widest text-xs ml-3">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Beneficiary Quick Select */}
                  <div className="space-y-6">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                      <BookUser className="h-4 w-4 text-orange-600" />
                      Saved Recipient Tokens
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setSelectedBeneficiaryId(null)}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-5 group relative overflow-hidden",
                          !selectedBeneficiaryId ? "border-orange-600 bg-orange-50 shadow-lg shadow-orange-600/5" : "border-slate-100 bg-white hover:border-slate-200"
                        )}
                      >
                        <div className={cn("h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0", !selectedBeneficiaryId ? "border-orange-600 bg-orange-600" : "border-slate-300")}>
                          {!selectedBeneficiaryId && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase tracking-tight">New Payee</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Input manual data</p>
                        </div>
                      </div>
                      {beneficiaries.map((b: any) => (
                        <div
                          key={b._id}
                          onClick={() => setSelectedBeneficiaryId(b._id)}
                          className={cn(
                            "p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden",
                            selectedBeneficiaryId === b._id ? "border-orange-600 bg-orange-50 shadow-lg shadow-orange-600/5" : "border-slate-100 bg-white hover:border-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-5 flex-1 overflow-hidden z-10">
                            <div className={cn("h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all", selectedBeneficiaryId === b._id ? "border-orange-600 bg-orange-600" : "border-slate-300")}>
                              {selectedBeneficiaryId === b._id && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <div className="truncate">
                              <p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">{b.bankInfo.bankHolder}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter truncate">{b.bankInfo.bankName} <span className="mx-1 opacity-30">|</span> {b.bankAccount}</p>
                            </div>
                          </div>
                          <span className={cn("text-[8px] font-black px-2 py-1 rounded bg-white shadow-sm uppercase ml-2 border z-10", b.bankRegion === 'international' ? 'text-blue-600 border-blue-100' : 'text-orange-600 border-orange-100')}>
                            {b.bankRegion === 'international' ? 'WIRE' : 'LOCAL'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                      <Label htmlFor="bankName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Institution</Label>
                      <div className="relative group">
                        <Banknote className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                        <Input
                          id="bankName"
                          placeholder="Bank Name (e.g. JPMorgan)"
                          value={formData.bankName}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-12 h-14 bg-white border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-orange-600/10 transition-all rounded-2xl font-bold text-slate-900 placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="accountNumber" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Credentials</Label>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                        <Input
                          id="accountNumber"
                          placeholder="Account Number"
                          value={formData.accountNumber}
                          onChange={(e) => handleChange("accountNumber", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-12 h-14 bg-white border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-orange-600/10 transition-all rounded-2xl font-bold text-slate-900 placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 col-span-1 md:col-span-2">
                      <Label htmlFor="accountHolder" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Beneficiary</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                        <Input
                          id="accountHolder"
                          placeholder="Account Holder Name"
                          value={formData.accountHolder}
                          onChange={(e) => handleChange("accountHolder", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-12 h-14 bg-white border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-orange-600/10 transition-all rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 uppercase"
                        />
                      </div>
                    </div>

                    {transferType === "international" && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-4">
                          <Label htmlFor="country" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jurisdiction</Label>
                          <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                            <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl font-bold text-slate-900 focus:ring-orange-600/10 focus:border-orange-600">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72 rounded-2xl bg-white border-slate-200 text-slate-900 shadow-2xl">
                              {[
                                "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
                              ].map((c) => (
                                <SelectItem key={c} value={c} className="rounded-xl hover:bg-white focus:bg-orange-50 px-4 py-3 cursor-pointer">
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="routingCode" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SWIFT BIC / Routing</Label>
                          <div className="relative group">
                            <Globe className="absolute left-4 top-4 h-5 w-5 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
                            <Input
                              id="routingCode"
                              placeholder="SWIFT BIC / Routing"
                              value={formData.routingCode}
                              onChange={(e) => handleChange("routingCode", e.target.value)}
                              disabled={isLoading}
                              className="pl-12 h-14 bg-white border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-orange-600/10 transition-all rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 uppercase"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      <Label htmlFor="amount" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Value</Label>
                      <div className="relative group">
                        <span className="absolute left-6 top-4 text-3xl font-black text-slate-300 group-focus-within:text-orange-600 transition-colors">$</span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => handleChange("amount", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-14 h-20 bg-white border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-orange-600/10 shadow-sm transition-all rounded-2xl text-4xl font-black text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="currency" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Settlement Asset</Label>
                      <Select value={formData.currency} onValueChange={() => { }} disabled>
                        <SelectTrigger className="h-20 bg-slate-100 border-slate-200 rounded-2xl font-black text-slate-400 cursor-not-allowed opacity-70">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl bg-white border-slate-200">
                          <SelectItem value={assignedCurrency || "USD"}>{assignedCurrency || "USD"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Remittance Memo (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      disabled={isLoading}
                      placeholder="Specify the nature of this transaction"
                      className="min-h-[140px] bg-white border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-orange-600/10 transition-all rounded-[2rem] p-8 font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                    />
                  </div>

                  <div className="p-8 bg-white border border-slate-200 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                        <BookUser className="h-7 w-7 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Sync Credentials</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Store recipient for future clearing</p>
                      </div>
                    </div>
                    <RadioGroup
                      value={saveBeneficiaryChoice}
                      onValueChange={(v: "yes" | "no") => setSaveBeneficiaryChoice(v)}
                      className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem id="save-no" value="no" className="sr-only" />
                        <Label
                          htmlFor="save-no"
                          className={cn(
                            "cursor-pointer px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            saveBeneficiaryChoice === "no" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900"
                          )}
                        >
                          Discard
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem id="save-yes" value="yes" className="sr-only" />
                        <Label
                          htmlFor="save-yes"
                          className={cn(
                            "cursor-pointer px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            saveBeneficiaryChoice === "yes" ? "bg-orange-600 text-white shadow-md" : "text-slate-400 hover:text-orange-600"
                          )}
                        >
                          Commit
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-col gap-6 pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading || !canTransferAll}
                      className="w-full bg-orange-600 hover:bg-slate-900 text-white font-black h-20 rounded-[2.5rem] shadow-xl shadow-orange-600/10 transition-all hover:scale-[1.02] active:scale-[0.98] group text-xl uppercase tracking-tighter disabled:bg-slate-200"
                    >
                      {isLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-3">
                          Commit Transaction
                          <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </Button>
                    <div className="flex flex-col items-center gap-2 opacity-60">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                        <ShieldCheck className="h-3 w-3 text-orange-600" />
                        Encrypted Execution Environment
                      </div>
                      <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600 w-2/3 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* OTP Dialog */}
      <AnimatePresence>
        {showOtpDialog && (
          <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
            <DialogContent className="rounded-[3rem] border-slate-200 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-12 max-w-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-600" />
              <DialogHeader className="space-y-6">
                <div className="h-20 w-20 bg-orange-50 border border-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <ShieldCheck className="h-10 w-10 text-orange-600" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Verification Protocol</p>
                  <DialogTitle className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Identity <span className="text-slate-400 italic">Auth</span></DialogTitle>
                </div>
                <DialogDescription className="text-center text-slate-500 font-bold text-base leading-relaxed">
                  A verification token has been dispatched to your global relay. Input the <span className="text-orange-600 font-black">6-DIGIT</span> sequence below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-12 pt-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 text-center block">Transmission Sequence</Label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="h-24 text-center text-5xl font-black tracking-[1.5rem] bg-white border-slate-200 rounded-[2rem] shadow-inner focus:border-orange-600 focus:ring-0 placeholder:text-slate-200 text-orange-600"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button onClick={handleOtpVerification} disabled={isLoading} className="h-20 bg-slate-900 hover:bg-black text-white font-black rounded-[2rem] shadow-xl text-lg uppercase tracking-tight transition-all">
                    {isLoading ? "Verifying..." : "Authorize Execution"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowOtpDialog(false)} className="h-12 font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[10px]">
                    Abort Transaction
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
