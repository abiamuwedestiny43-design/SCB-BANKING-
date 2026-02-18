"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Settings, ShieldCheck, Zap, Globe, Lock, Cpu, Database, Activity, RefreshCw, Key, Layers, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localEnabled, setLocalEnabled] = useState(true)
  const [globalEnabled, setGlobalEnabled] = useState(true)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [singleBusy, setSingleBusy] = useState(false)
  const [singleUserId, setSingleUserId] = useState("")
  const [foundUser, setFoundUser] = useState<any>(null)

  const toggleUserPerm = async (type: "local" | "international", enabled: boolean) => {
    if (!foundUser) return
    setError(null)
    try {
      const res = await fetch("/api/admin/users/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: foundUser.id, type, enabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Protocol update failed.")
      else {
        setFoundUser({ ...foundUser, [type === "local" ? "canLocalTransfer" : "canInternationalTransfer"]: enabled })
      }
    } catch {
      setError("System failure during protocol sync.")
    }
  }

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const [localRes, globalRes] = await Promise.all([
            fetch("/api/admin/settings/local-transfer"),
            fetch("/api/admin/settings/global-transfer"),
          ])
          const localData = await localRes.json()
          const globalData = await globalRes.json()

          if (!mounted) return
          if (!localRes.ok) setError(localData?.message || "Failed to load settings")
          else setLocalEnabled(Boolean(localData.enabled))

          if (!globalRes.ok) setError((prev) => prev || globalData?.message || "Failed to load settings")
          else setGlobalEnabled(Boolean(globalData.enabled))
        } catch {
          setError("Failed to load settings")
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [])

  const handleSaveGlobal = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/global-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: globalEnabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Failed to save")
    } catch {
      setError("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLocal = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/local-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: localEnabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Failed to save")
    } catch {
      setError("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const bulkSetUsersTransfer = async (enabled: boolean, type: "all" | "local" | "international" = "all") => {
    setBulkBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/users-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, type }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || "Failed to update users")
      }
    } catch {
      setError("Failed to update users")
    } finally {
      setBulkBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="p-12 min-h-screen bg-black flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/[0.03] animate-pulse"></div>
        <div className="relative">
          <Cpu className="w-16 h-16 text-orange-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-orange-600/20 blur-xl animate-pulse"></div>
        </div>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.6em] animate-pulse uppercase relative z-10">Modulating System Variables...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Architecture Config
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            GLOBAL <span className="text-orange-600 italic">SYSTEM</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-lg text-lg uppercase tracking-tight leading-none mb-1">Fine-tuning of core infrastructure parameters and operational security protocols.</p>
        </div>

        <div className="p-6 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-3xl glass-dark flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Node Status</p>
            <p className="text-sm font-black text-white uppercase tracking-widest">Operational</p>
          </div>
          <div className="h-10 w-[1px] bg-white/5"></div>
          <div className="h-12 w-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-orange-500 shadow-xl">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-[2rem] p-6 relative z-10 shadow-3xl animate-in slide-in-from-top-4 duration-500">
          <AlertDescription className="font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-4">
            <Lock className="w-5 h-5" /> Protocol Conflict: {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Protocol Card */}
          <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark">
            <CardHeader className="p-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white shadow-3xl">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase italic">Transfer Matrix</CardTitle>
                  <CardDescription className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] mt-3">Control the universal flow of assets across the Sovereign network.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 space-y-12">
              {/* Global Transfers Switch */}
              <div className="group p-8 rounded-[3rem] bg-black/40 border border-white/5 hover:bg-orange-600/5 hover:border-orange-600/20 transition-all duration-500 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 h-40 w-40 bg-orange-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-4">
                    <Label className="text-xl font-black text-white flex items-center gap-3 italic tracking-tight uppercase">
                      <Globe className="w-5 h-5 text-orange-600" /> Unified Registry
                    </Label>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">Kill-switch for ALL asset migrations (Local & Intl) cluster-wide.</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <Switch
                      checked={globalEnabled}
                      onCheckedChange={setGlobalEnabled}
                      className="data-[state=checked]:bg-orange-600 scale-125 border-white/10"
                      disabled={saving}
                    />
                    <Button
                      onClick={handleSaveGlobal}
                      disabled={saving}
                      className="bg-slate-900 border border-white/5 hover:bg-white hover:text-black text-white font-black px-8 rounded-2xl h-14 text-[10px] uppercase tracking-[0.3em] shadow-3xl"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "SYNC UNIT"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Local Transfers Switch */}
              <div className="group p-8 rounded-[3rem] bg-black/40 border border-white/5 hover:bg-blue-600/5 hover:border-blue-600/20 transition-all duration-500 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 h-40 w-40 bg-blue-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-4">
                    <Label className="text-xl font-black text-white flex items-center gap-3 italic tracking-tight uppercase">
                      <Layers className="w-5 h-5 text-blue-500" /> Intrasystem Bridge
                    </Label>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">Restrict asset movement within the internal First State Node network.</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <Switch
                      checked={localEnabled}
                      onCheckedChange={setLocalEnabled}
                      className="data-[state=checked]:bg-blue-600 scale-125 border-white/10"
                      disabled={saving}
                    />
                    <Button
                      onClick={handleSaveLocal}
                      disabled={saving}
                      className="bg-slate-900 border border-white/5 hover:bg-white hover:text-black text-white font-black px-8 rounded-2xl h-14 text-[10px] uppercase tracking-[0.3em] shadow-3xl"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "SYNC BRIDGE"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Bulk Override Section */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center gap-4">
                    <Zap className="w-6 h-6 text-orange-600 animate-pulse" /> Bulk Override Sequences
                  </Label>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed max-w-xl">
                    Atomic permission synchronization for the entire user directory. <span className="text-red-500 italic">WARNING: HIGH ENTROPY ACTION.</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: "Unified Protocol", type: "all", color: "orange", icon: ShieldCheck },
                    { label: "Local Registry", type: "blue", color: "blue", icon: Database },
                    { label: "Intl Clearance", type: "international", color: "orange", icon: Globe },
                  ].map((btn, i) => (
                    <div key={i} className="space-y-6 p-8 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-inner group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3">
                        <btn.icon className={cn("w-4 h-4", btn.color === 'orange' ? "text-orange-600" : "text-blue-500")} />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{btn.label}</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Button
                          onClick={() => bulkSetUsersTransfer(true, btn.type as any)}
                          disabled={bulkBusy}
                          className={cn(
                            "w-full text-white font-black hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[9px] h-14 rounded-xl shadow-3xl border-none",
                            btn.color === 'orange' ? "bg-orange-600" : "bg-blue-600"
                          )}
                        >
                          Enable Set
                        </Button>
                        <Button
                          onClick={() => bulkSetUsersTransfer(false, btn.type as any)}
                          disabled={bulkBusy}
                          className="w-full bg-slate-900 border border-white/5 text-red-500 font-black hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-[9px] h-14 rounded-xl shadow-3xl"
                        >
                          Revoke Set
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Control Units */}
        <div className="space-y-12">
          {/* Individual Target Controller */}
          <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[3.5rem] p-10 overflow-hidden relative glass-dark">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-3">
                  <Key className="w-6 h-6 text-orange-600 rotate-12" /> Node Override
                </h3>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] leading-relaxed">
                  Target precise identity nodes for protocol modulation.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <Input
                    placeholder="Entity Identifier (Email/ID)"
                    value={singleUserId}
                    onChange={(e) => setSingleUserId(e.target.value)}
                    className="bg-black/60 border-white/5 rounded-2xl h-18 text-white font-black uppercase text-xs tracking-widest focus:border-orange-600 transition-all placeholder:text-slate-800 shadow-inner px-6"
                  />
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!singleUserId) return
                      setSingleBusy(true)
                      setError(null)
                      try {
                        const res = await fetch(`/api/admin/users/permissions?identifier=${encodeURIComponent(singleUserId)}`)
                        const data = await res.json()
                        if (!res.ok) {
                          setError(data?.message || "Node signature not found.")
                          setFoundUser(null)
                        } else {
                          setFoundUser(data)
                        }
                      } catch {
                        setError("Network interrupt during node lookup.")
                      } finally {
                        setSingleBusy(false)
                      }
                    }}
                    className="absolute right-2 top-2 h-14 px-6 rounded-xl bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black shadow-3xl transition-all border-none"
                  >
                    {singleBusy ? <RefreshCw className="w-4 h-4 animate-spin" /> : "QUERY"}
                  </Button>
                </div>

                {foundUser && (
                  <div className="p-8 rounded-[3rem] bg-black/40 border border-white/5 space-y-10 animate-in fade-in slide-in-from-top-6 duration-700 shadow-inner group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 border border-white/10 flex items-center justify-center text-orange-600 font-black text-2xl uppercase shadow-2xl group-hover:scale-110 transition-transform italic">
                        {foundUser.name[0]}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-black text-white uppercase tracking-widest italic">{foundUser.name}</p>
                        <p className="text-[10px] text-slate-600 font-black truncate max-w-[160px] uppercase tracking-tighter">{foundUser.email}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-slate-900/60 rounded-2xl border border-white/5 shadow-2xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Matrix</span>
                        <Switch
                          checked={foundUser.canLocalTransfer}
                          onCheckedChange={(val) => toggleUserPerm("local", val)}
                          className="data-[state=checked]:bg-blue-600 border-white/10"
                        />
                      </div>
                      <div className="flex items-center justify-between p-6 bg-slate-900/60 rounded-2xl border border-white/5 shadow-2xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intl Matrix</span>
                        <Switch
                          checked={foundUser.canInternationalTransfer}
                          onCheckedChange={(val) => toggleUserPerm("international", val)}
                          className="data-[state=checked]:bg-orange-600 border-white/10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* System Security Advisory */}
          <Card className="bg-slate-950 border border-white/10 rounded-[3.5rem] p-10 shadow-3xl relative overflow-hidden group glass-dark">
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-orange-600/10 transition-all duration-1000"></div>
            <div className="relative z-10 space-y-8">
              <div className="h-14 w-14 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-500 mb-2 shadow-2xl border border-orange-600/20">
                <ShieldCheck className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em]">Propagating Node</p>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Security <span className="text-white/30">Advisory</span></h3>
              </div>
              <p className="text-xs text-orange-100/30 font-bold leading-relaxed italic border-l-2 border-orange-600/30 pl-4">
                "System architecture changes propagate instantly through the global Sovereign server cluster. Authorized administrative clearance is required for all modulation sequences."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
