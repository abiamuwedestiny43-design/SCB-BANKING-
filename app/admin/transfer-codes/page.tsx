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
  Database
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
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Lock className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Secure Protocol Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            TRANSFER <span className="text-orange-600 italic">SYSTEM</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-lg text-lg uppercase tracking-tight">Central hub for global verification sequences and user clearance levels.</p>
        </div>

        <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Firewall Status</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">Operational</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/5"></div>
          <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-10">
        {/* Global Security Sequences section */}
        <Card className="xl:col-span-12 xxl:col-span-8 bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark group">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 group-hover:h-2 transition-all duration-500"></div>
          <CardHeader className="p-12 md:p-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="h-16 w-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white shadow-3xl group-hover:scale-110 transition-transform duration-500">
                  <Fingerprint className="w-8 h-8 text-orange-500 shadow-2xl" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">Master Code Control</p>
                  <CardTitle className="text-4xl font-black text-white tracking-tight italic uppercase">Clearance Sequences</CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-[1.5rem] bg-black border border-white/5 hover:bg-orange-600 text-slate-500 hover:text-white transition-all duration-500 shadow-xl"
                onClick={() => setExpandedSections(prev => ({ ...prev, codes: !prev.codes }))}
              >
                {expandedSections.codes ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedSections.codes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <CardContent className="p-12 md:p-16 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                      { label: "COT Protocol", value: cot, set: setCot, color: "text-orange-600", bg: "bg-orange-500/5", icon: ShieldCheck },
                      { label: "IMF Sequence", value: imf, set: setImf, color: "text-blue-500", bg: "bg-blue-500/5", icon: Globe },
                      { label: "ESI Auth", value: esi, set: setEsi, color: "text-purple-500", bg: "bg-purple-500/5", icon: Key },
                      { label: "DCO Matrix", value: dco, set: setDco, color: "text-emerald-500", bg: "bg-emerald-500/5", icon: RefreshCw },
                      { label: "TAX Token", value: tax, set: setTax, color: "text-red-500", bg: "bg-red-500/5", icon: Activity },
                      { label: "TAC Link", value: tac, set: setTac, color: "text-cyan-500", bg: "bg-cyan-500/5", icon: Cpu },
                    ].map((row) => (
                      <div key={row.label} className="group/item relative space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-3 group-hover/item:text-white transition-colors">
                          <row.icon className={cn("w-4 h-4", row.color)} /> {row.label}
                        </label>
                        <div className="flex gap-4">
                          <Input
                            value={row.value}
                            onChange={(e) => row.set(e.target.value)}
                            className="h-16 bg-black border-white/5 focus:bg-slate-950 focus:border-orange-600/50 focus:ring-8 focus:ring-orange-600/5 transition-all rounded-[1.5rem] font-mono text-2xl font-black text-white shadow-inner px-6"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => row.set(genCode())}
                            className="h-16 w-16 rounded-[1.5rem] bg-slate-900 border border-white/5 text-orange-500 hover:bg-orange-600 hover:text-white shadow-2xl transition-all duration-500 group/btn"
                          >
                            <RefreshCw className="h-5 w-5 group-hover/btn:rotate-180 transition-transform duration-700" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <Button
                      onClick={save}
                      disabled={saving}
                      className="w-full bg-orange-600 hover:bg-white hover:text-black text-white font-black h-24 rounded-[3rem] shadow-3xl transition-all hover:scale-[1.01] active:scale-[0.98] uppercase tracking-[0.4em] text-xs group border-none"
                    >
                      {saving ? (
                        <RefreshCw className="w-8 h-8 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-4">
                          <Terminal className="w-5 h-5 group-hover:animate-pulse" />
                          COMMIT SECURITY PROTOCOLS
                        </span>
                      )}
                    </Button>
                    <div className="mt-12 flex justify-center gap-8 opacity-20">
                      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-1 w-8 bg-orange-600 rounded-full animate-pulse"></div>)}
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* User Permission Matrix */}
        <Card className="xl:col-span-12 xxl:col-span-4 bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark group">
          <CardHeader className="p-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-3xl group-hover:rotate-12 transition-transform duration-500">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Authorization</p>
                    <CardTitle className="text-2xl font-black text-white tracking-tight italic uppercase">User Clearance</CardTitle>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Query Registry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 h-18 bg-black/60 border-white/5 rounded-[2rem] font-black text-lg placeholder:text-slate-800 text-white focus:ring-8 focus:ring-blue-500/5 transition-all shadow-inner"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 bg-transparent">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-12 space-y-6">
              {filteredUsers?.map((user: any) => (
                <motion.div
                  layout
                  key={user._id}
                  className="flex items-center justify-between p-8 bg-black/40 border border-white/5 rounded-[2.5rem] hover:shadow-3xl hover:border-white/20 transition-all group/user shadow-inner"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-2xl group-hover/user:scale-110 duration-500 italic",
                      user.bankAccount?.canTransfer
                        ? 'bg-blue-600 text-white shadow-blue-500/20'
                        : 'bg-slate-900 text-slate-600'
                    )}>
                      {user.bankInfo?.bio?.firstname?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-black text-white text-sm uppercase tracking-widest group-hover/user:text-blue-500 transition-colors italic">
                        {user.bankInfo?.bio?.firstname} {user.bankInfo?.bio?.lastname}
                      </p>
                      <p className="text-[10px] text-slate-600 font-black italic tracking-tighter truncate max-w-[150px] mt-2 uppercase">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleUserTransfer(user._id, user.bankAccount?.canTransfer)}
                    className={cn(
                      "h-12 px-8 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all duration-500 shadow-xl",
                      user.bankAccount?.canTransfer
                        ? "bg-slate-900 border border-white/10 text-white hover:bg-emerald-600"
                        : "bg-black border border-white/5 text-slate-600 hover:bg-blue-600 hover:text-white"
                    )}
                  >
                    {user.bankAccount?.canTransfer ? "AUTHORIZED" : "REVOKED"}
                  </Button>
                </motion.div>
              ))}
              {!filteredUsers?.length && (
                <div className="text-center py-20 px-10 space-y-8 grayscale opacity-20 animate-pulse">
                  <div className="w-24 h-24 rounded-[3rem] bg-slate-900 border border-white/5 flex items-center justify-center mx-auto shadow-3xl">
                    <Database className="w-10 h-10 text-orange-500" />
                  </div>
                  <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] italic leading-relaxed">No Identity Signatures Found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
