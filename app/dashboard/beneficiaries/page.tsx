"use client"
import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Users, Plus, Trash2, Globe, Landmark, Fingerprint, ChevronRight, ChevronLeft, ShieldCheck, MapPin } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BeneficiariesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/beneficiaries", fetcher)
  const beneficiaries = data?.beneficiaries || []
  const { data: profileData } = useSWR("/api/user/profile", fetcher)
  const userLocalEnabled = profileData?.user?.bankAccount?.canLocalTransfer ?? false
  const userIntlEnabled = profileData?.user?.bankAccount?.canInternationalTransfer ?? false
  const { data: localFlagData } = useSWR("/api/system/local-transfer-enabled", fetcher)
  const systemLocalEnabled = localFlagData?.enabled ?? true
  const localPermission = userLocalEnabled && systemLocalEnabled

  const [bankRegion, setBankRegion] = useState<"local" | "international">("local")
  const [bankName, setBankName] = useState("")
  const [bankHolder, setBankHolder] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankCountry, setBankCountry] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [identifierCode, setIdentifierCode] = useState("")
  const [branchName, setBranchName] = useState("")
  const [accountType, setAccountType] = useState("Savings")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const addBeneficiary = async () => {
    setError("")
    setSaving(true)
    try {
      const res = await fetch("/api/user/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankRegion,
          bankAccount,
          bankInfo: {
            bankName,
            bankHolder,
            bankCountry,
            identifier: bankRegion === "international" ? identifier : "IFSC/Routing",
            identifierCode,
            branchName,
            accountType
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Failed to add beneficiary")
        return
      }
      toast({ title: "Authorized", description: "Beneficiary added successfully." })
      setBankName("")
      setBankHolder("")
      setBankAccount("")
      setBankCountry("")
      setIdentifier("")
      setIdentifierCode("")
      setBranchName("")
      setAccountType("Savings")
      mutate()
    } finally {
      setSaving(false)
    }
  }

  const removeBeneficiary = async (id: string) => {
    const res = await fetch("/api/user/beneficiaries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      toast({ title: "Removed", description: "Beneficiary removed from list." })
      mutate()
    }
  }

  return (
    <div className="min-h-screen bg-black w-full p-6 md:p-12 pt-24 md:pt-32 relative overflow-hidden selection:bg-orange-500/20">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* Industrial Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/5">
              <Users className="w-3.5 h-3.5 text-orange-500" /> REGISTRY MANAGEMENT
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              TRANSFER <span className="text-orange-600 italic">BENEFICIARIES</span>
            </h1>
            <p className="text-slate-400 font-bold max-w-lg text-lg">Manage authorized recipient details for quick liquidity migration sequences.</p>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="h-14 px-8 rounded-2xl bg-slate-900 border border-white/10 font-black text-[10px] uppercase tracking-widest text-white flex items-center gap-3 hover:bg-slate-800 transition-all shadow-sm">
              <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4" /> NODE_DASHBOARD
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Add Form */}
          <motion.div {...fadeInUp} className="lg:col-span-12 xl:col-span-5">
            <Card className="border border-white/5 shadow-2xl bg-slate-900/40 rounded-[3rem] overflow-hidden glass-dark">
              <CardHeader className="p-10 border-b border-white/5 bg-slate-900 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-600 text-[9px] font-black uppercase tracking-widest mb-4">
                  <Plus className="w-3 h-3" /> INITIALIZE_NODE
                </div>
                <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">Register <span className="text-orange-500">Receiver</span></CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest">Enrollment sequence for new authorized entities.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert className="bg-red-900/20 border-red-900/50 rounded-2xl p-6">
                      <AlertDescription className="text-red-400 font-black uppercase text-sm italic">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Protocol Region</Label>
                    <Select value={bankRegion} onValueChange={(v: any) => setBankRegion(v)}>
                      <SelectTrigger className="h-16 bg-slate-900 border-white/10 rounded-2xl text-white font-black focus:ring-orange-500/20 transition-all uppercase tracking-widest text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                        <SelectItem value="local" className="font-black uppercase tracking-widest text-[10px] focus:bg-orange-600 focus:text-white">Local Network</SelectItem>
                        <SelectItem value="international" className="font-black uppercase tracking-widest text-[10px] focus:bg-orange-600 focus:text-white">Cross-Border Relay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Assigned Provider</Label>
                    <div className="relative group">
                      <Landmark className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-orange-600 transition-colors" />
                      <Input
                        placeholder="NODE_PROVIDER_ID"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="pl-14 h-16 bg-slate-900 border-white/10 focus:bg-slate-800 focus:border-orange-600/50 focus:ring-orange-600/10 text-white font-black transition-all rounded-2xl uppercase tracking-widest text-xs placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Authorized Holder</Label>
                    <div className="relative group">
                      <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-orange-600 transition-colors" />
                      <Input
                        placeholder="ENTITY_LEGAL_NAME"
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                        className="pl-14 h-16 bg-slate-900 border-white/10 focus:bg-slate-800 focus:border-orange-600/50 focus:ring-orange-600/10 text-white font-black transition-all rounded-2xl uppercase tracking-widest text-xs placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Sequence Reference</Label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-orange-600 transition-colors" />
                      <Input
                        placeholder="ACCOUNT_OR_IBAN"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="pl-14 h-16 bg-slate-900 border-white/10 focus:bg-slate-800 focus:border-orange-600/50 focus:ring-orange-600/10 text-white font-black transition-all rounded-2xl uppercase tracking-widest text-xs placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Branch Name</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-orange-600 transition-colors" />
                      <Input
                        placeholder="BRANCH_IDENTIFIER"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        className="pl-14 h-16 bg-slate-900 border-white/10 focus:bg-slate-800 focus:border-orange-600/50 focus:ring-orange-600/10 text-white font-black transition-all rounded-2xl uppercase tracking-widest text-xs placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">
                      {bankRegion === "international" ? "SWIFT / Routing" : "IFSC / Routing Code"}
                    </Label>
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-orange-600 transition-colors" />
                      <Input
                        placeholder="IDENTIFIER_CODE"
                        value={identifierCode}
                        onChange={(e) => setIdentifierCode(e.target.value)}
                        className="pl-14 h-16 bg-slate-900 border-white/10 focus:bg-slate-800 focus:border-orange-600/50 focus:ring-orange-600/10 text-white font-black transition-all rounded-2xl uppercase tracking-widest text-xs placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Account Category</Label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger className="h-16 bg-slate-900 border-white/10 rounded-2xl text-white font-black focus:ring-orange-500/20 transition-all uppercase tracking-widest text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                        {["Savings", "Current", "Checking"].map((t) => (
                          <SelectItem key={t} value={t} className="font-black uppercase tracking-widest text-[10px] focus:bg-orange-600 focus:text-white">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {bankRegion === "international" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 gap-8 pt-8 border-t border-white/5">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Jurisdiction</Label>
                        <Input placeholder="UNITED_STATES" value={bankCountry} onChange={(e) => setBankCountry(e.target.value)} className="h-16 bg-slate-900 border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs" />
                      </div>
                    </motion.div>
                  )}
                </div>

                <Button
                  onClick={addBeneficiary}
                  disabled={saving}
                  className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black h-20 rounded-[2rem] shadow-2xl uppercase tracking-[0.3em] text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 group/btn border-none"
                >
                  {saving ? "TRANSMITTING..." : "COMMIT_REGISTRY"} <Plus className="ml-4 h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* List Display */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-12 xl:col-span-7 space-y-8">
            <div className="flex items-center justify-between px-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Active <span className="text-orange-600">Registry</span></h2>
              <div className="px-5 py-2 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] shadow-xl">
                {isLoading ? "SCANNING..." : `${beneficiaries.length} IDENTIFIED`}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {beneficiaries.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center rounded-[3rem] border-none bg-white shadow-2xl glass flex flex-col items-center justify-center space-y-6">
                    <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                      <Users className="h-10 w-10" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No authorized entities found in registry.</p>
                  </motion.div>
                ) : (
                  beneficiaries.map((b: any, index: number) => (
                    <motion.div
                      key={b._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="relative p-8 rounded-[2.5rem] bg-white shadow-2xl border-none flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 hover:scale-[1.02] glass overflow-hidden">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-orange-500 shadow-xl overflow-hidden relative group-hover:scale-110 transition-transform duration-500">
                            <Landmark className="h-7 w-7 relative z-10" />
                            <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <p className="font-black text-slate-900 text-xl tracking-tighter uppercase italic">
                                {b.bankInfo.bankHolder}
                              </p>
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                                {b.bankInfo.bankName}
                              </p>
                              <div className="h-4 w-[1px] bg-slate-100" />
                              <p className="text-[10px] text-orange-600 font-black tracking-[0.2em] uppercase">
                                {b.bankAccount}
                              </p>
                              {b.bankInfo.branchName && (
                                <>
                                  <div className="h-4 w-[1px] bg-slate-100" />
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{b.bankInfo.branchName}</p>
                                </>
                              )}
                              {b.bankInfo.accountType && (
                                <>
                                  <div className="h-4 w-[1px] bg-slate-100" />
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{b.bankInfo.accountType}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                          <div className={cn(
                            "px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] border shadow-sm",
                            b.bankRegion === 'local' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                          )}>
                            {b.bankRegion.toUpperCase()}
                          </div>
                          <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-slate-50 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-white hover:shadow-xl transition-all group/btn" asChild>
                            <Link href={`/dashboard/transfer?accountNumber=${encodeURIComponent(b.bankAccount)}&bankName=${encodeURIComponent(b.bankInfo.bankName)}&accountHolder=${encodeURIComponent(b.bankInfo.bankHolder)}&branchName=${encodeURIComponent(b.bankInfo.branchName || "")}&accountType=${encodeURIComponent(b.bankInfo.accountType || "Savings")}&routingCode=${encodeURIComponent(b.bankInfo.identifierCode || "")}&country=${encodeURIComponent(b.bankInfo.bankCountry || "")}`}>
                              <ChevronRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                          <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-slate-50 bg-slate-50 text-slate-300 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all" onClick={() => removeBeneficiary(b._id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
                .glass { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
            `}} />
    </div>
  )
}
