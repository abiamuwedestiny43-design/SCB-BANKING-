"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Key,
  Users,
  Fingerprint,
  RefreshCw,
  Lock,
  Search,
  Activity,
  Cpu,
  Globe,
  Radio,
  Terminal,
  Database,
  ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const genCode = () => Math.floor(100000 + Math.random() * 900000).toString()

export default function AdminTransferCodesPage() {
  const { toast } = useToast()
  const { data, mutate } = useSWR("/api/admin/transfer-codes", fetcher)
  const { data: usersData, mutate: mutateUsers } = useSWR("/api/admin/users", fetcher)

  const [cot, setCot] = useState("")
  const [imf, setImf] = useState("")
  const [esi, setEsi] = useState("")
  const [dco, setDco] = useState("")
  const [tax, setTax] = useState("")
  const [tac, setTac] = useState("")
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [expandedSections, setExpandedSections] = useState({
    codes: true,
    users: true,
  })

  useEffect(() => {
    if (data?.codes) {
      setCot(data.codes.cot || "")
      setImf(data.codes.imf || "")
      setTac(data.codes.tac || "")
      setEsi(data.codes.esi || "")
      setDco(data.codes.dco || "")
      setTax(data.codes.tax || "")
    }
  }, [data])

  const save = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/transfer-codes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cot, imf, esi, dco, tax, tac }),
    })
    if (res.ok) {
      toast({ title: "Authorized", description: "Global transfer protocols updated successfully." })
      mutate()
    } else {
      toast({ title: "Error", description: "Failed to synchronize security codes." })
    }
    setSaving(false)
  }

  const toggleUserTransfer = async (userId: string, currentState: boolean) => {
    const res = await fetch("/api/admin/users/toggle-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, enable: !currentState }),
    })

    if (res.ok) {
      toast({
        title: "Profile Updated",
        description: `Transfer permissions ${!currentState ? "granted" : "revoked"} for user.`,
      })
      mutateUsers()
    } else {
      toast({ title: "Error", description: "User permission update failed." })
    }
  }

  const filteredUsers = usersData?.users?.filter((u: any) =>
    u.bankInfo?.bio?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.bankInfo?.bio?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
            Transfer <span className="text-orange-600">Codes</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">
            Manage global verification codes and user transfer permissions
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
          <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Security Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Global Security Sequences section */}
        <Card className="xl:col-span-8 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Lock className="w-5 h-5 font-black" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">Global Verification Codes</CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Edit system-wide codes for all transfers</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-slate-200"
              onClick={() => setExpandedSections(prev => ({ ...prev, codes: !prev.codes }))}
            >
              {expandedSections.codes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>

          <AnimatePresence>
            {expandedSections.codes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { label: "Verification Code (COT)", value: cot, set: setCot, icon: ShieldCheck, color: "text-orange-600", bg: "bg-orange-50" },
                      { label: "Institutional Code (IMF)", value: imf, set: setImf, icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Auth Code (ESI)", value: esi, set: setEsi, icon: Key, color: "text-purple-600", bg: "bg-purple-50" },
                      { label: "System Matrix (DCO)", value: dco, set: setDco, icon: RefreshCw, color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Tax Token (TAX)", value: tax, set: setTax, icon: Activity, color: "text-red-600", bg: "bg-red-50" },
                      { label: "Transfer Link (TAC)", value: tac, set: setTac, icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50" },
                    ].map((row) => (
                      <div key={row.label} className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <row.icon className={cn("w-3.5 h-3.5", row.color)} /> {row.label}
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={row.value}
                            onChange={(e) => row.set(e.target.value)}
                            className="h-12 bg-slate-50 border-slate-100 rounded-xl font-mono text-lg font-black text-slate-900 px-4 focus:border-orange-500 transition-all"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => row.set(genCode())}
                            className="h-12 w-12 rounded-xl border-slate-200 hover:text-orange-600 hover:border-orange-500 transition-all"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={save}
                      disabled={saving}
                      className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black h-14 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs gap-3"
                    >
                      {saving ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Terminal className="w-5 h-5" />
                      )}
                      {saving ? "SAVING PROTOCOLS..." : "UPDATE GLOBAL SYSTEM CODES"}
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* User Permission Matrix */}
        <Card className="xl:col-span-4 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5 font-black" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">Customer Clearance</CardTitle>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search Customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 border-slate-100 rounded-xl font-bold text-sm"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
              {filteredUsers?.map((user: any) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                      user.bankAccount?.canTransfer
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-400'
                    )}>
                      {user.bankInfo?.bio?.firstname?.[0] || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-black text-slate-900 text-xs uppercase tracking-widest truncate">
                        {user.bankInfo?.bio?.firstname} {user.bankInfo?.bio?.lastname}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={user.bankAccount?.canTransfer ? "default" : "outline"}
                    onClick={() => toggleUserTransfer(user._id, user.bankAccount?.canTransfer)}
                    className={cn(
                      "h-9 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all",
                      user.bankAccount?.canTransfer
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                        : "bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600"
                    )}
                  >
                    {user.bankAccount?.canTransfer ? "AUTHORIZED" : "REVOKED"}
                  </Button>
                </div>
              ))}
              {!filteredUsers?.length && (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Database className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">No customers found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
