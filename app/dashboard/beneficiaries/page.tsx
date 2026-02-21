"use client"
import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Users, Plus, Trash2, Globe, Landmark, Fingerprint, ChevronRight, ChevronLeft, ShieldCheck, MapPin, AlertCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BeneficiariesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/beneficiaries", fetcher)
  const beneficiaries = data?.beneficiaries || []
  const { data: profileData } = useSWR("/api/user/profile", fetcher)
  const { data: localFlagData } = useSWR("/api/system/local-transfer-enabled", fetcher)

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

  const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

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
      toast({ title: "Added", description: "Beneficiary added successfully." })
      setBankName(""); setBankHolder(""); setBankAccount(""); setBankCountry("")
      setIdentifier(""); setIdentifierCode(""); setBranchName("")
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

  const inputCls = "h-9 bg-slate-50 border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:border-orange-400 placeholder:text-slate-300"

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white">
            <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Beneficiaries</h1>
            <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">Manage your saved recipients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Add Form */}
          <motion.div {...fadeIn} className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-2.5 p-4 border-b border-slate-50">
                <div className="h-7 w-7 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight italic">Add <span className="text-orange-600">Beneficiary</span></h2>
                  <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest opacity-60">Save a new recipient</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {error && (
                  <Alert className="bg-red-50 border-red-100 py-2 px-3">
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                    <AlertDescription className="text-red-600 text-xs ml-2">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Transfer Type</Label>
                  <Select value={bankRegion} onValueChange={(v: any) => setBankRegion(v)}>
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="local" className="text-sm md:text-base font-black uppercase tracking-tight italic">Local Transfer</SelectItem>
                      <SelectItem value="international" className="text-sm md:text-base font-black uppercase tracking-tight italic">International Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Bank Name</Label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input placeholder="e.g. Chase Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} className="h-11 pl-9 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Account Holder</Label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input placeholder="Full legal name" value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} className="h-11 pl-9 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Account / IBAN Number</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input placeholder="Account number" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="h-11 pl-9 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Branch Name</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input placeholder="Branch name (optional)" value={branchName} onChange={(e) => setBranchName(e.target.value)} className="h-11 pl-9 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{bankRegion === "international" ? "SWIFT / BIC Code" : "IFSC / Routing Code"}</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input placeholder="Routing code" value={identifierCode} onChange={(e) => setIdentifierCode(e.target.value)} className="h-11 pl-9 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Account Type</Label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl text-slate-900 text-sm md:text-base font-bold focus:bg-white focus:border-orange-400 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["Savings", "Current", "Checking"].map((t) => (
                        <SelectItem key={t} value={t} className="text-sm md:text-base font-black uppercase tracking-tight italic">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {bankRegion === "international" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">Country</Label>
                    <Input placeholder="e.g. United States" value={bankCountry} onChange={(e) => setBankCountry(e.target.value)} className={inputCls} />
                  </motion.div>
                )}

                <Button
                  onClick={addBeneficiary}
                  disabled={saving}
                  size="sm"
                  className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all italic h-12 mt-1"
                >
                  {saving ? "Saving..." : "Add Beneficiary"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight italic">Saved <span className="text-orange-600">Beneficiaries</span></h2>
                <span className="text-[10px] md:text-xs font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase italic">
                  {isLoading ? "Loading..." : `${beneficiaries.length} saved`}
                </span>
              </div>

              <div className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {beneficiaries.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-14 text-center flex flex-col items-center gap-3">
                      <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">No beneficiaries yet</p>
                        <p className="text-xs text-slate-400 mt-0.5">Add recipients to send money faster.</p>
                      </div>
                    </motion.div>
                  ) : (
                    beneficiaries.map((b: any, index: number) => (
                      <motion.div
                        key={b._id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="flex items-center gap-3 p-4 hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                          <Landmark className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight italic truncate">{b.bankInfo.bankHolder}</p>
                            <span className={cn(
                              "text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0 uppercase italic tracking-widest",
                              b.bankRegion === 'local' ? 'bg-orange-50 text-orange-600' : 'bg-slate-900 text-white'
                            )}>
                              {b.bankRegion === 'local' ? 'Local' : 'Intl'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{b.bankInfo.bankName}</p>
                            <span className="text-slate-200">·</span>
                            <p className="text-[10px] md:text-xs text-orange-600 font-black font-mono tracking-tight">{b.bankAccount}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50">
                            <Link href={`/dashboard/transfer?accountNumber=${encodeURIComponent(b.bankAccount)}&bankName=${encodeURIComponent(b.bankInfo.bankName)}&accountHolder=${encodeURIComponent(b.bankInfo.bankHolder)}&branchName=${encodeURIComponent(b.bankInfo.branchName || "")}&accountType=${encodeURIComponent(b.bankInfo.accountType || "Savings")}&routingCode=${encodeURIComponent(b.bankInfo.identifierCode || "")}&country=${encodeURIComponent(b.bankInfo.bankCountry || "")}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => removeBeneficiary(b._id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
