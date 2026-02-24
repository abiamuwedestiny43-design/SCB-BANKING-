"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Settings, ShieldCheck, Zap, Globe, Lock, Cpu, Database, Activity, RefreshCw, Key, Layers, Radio, ChevronRight, ShieldAlert } from "lucide-react"
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
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center gap-4">
        <Cpu className="w-10 h-10 text-black animate-spin" />
        <p className="text-sm font-black text-black uppercase tracking-widest">Loading Settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">
            Bank <span className="text-black">Settings</span>
          </h1>
          <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Configure bank-wide settings, limits, and operational preferences.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm">
          <div className="h-2 w-2 rounded-full bg-black animate-pulse"></div>
          <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">System Operational</p>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl p-4">
          <ShieldAlert className="h-5 w-5" />
          <AlertDescription className="font-bold text-sm ml-2">Error: {error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Transfer Controls */}
          <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black">
                  <Globe className="w-5 h-5 font-black" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-black tracking-tighter italic uppercase">Transfer Protocol Controls</CardTitle>
                  <CardDescription className="text-xs font-bold text-black uppercase tracking-widest mt-0.5">Global switches for bank-wide asset movement</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Global Transfers Switch */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all group shadow-inner">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-black flex items-center gap-2 italic tracking-tight uppercase">
                      Universal Transacting Flow
                    </Label>
                    <p className="text-xs text-black font-bold uppercase tracking-widest">Emergency kill-switch for ALL transfers (Local & International) bank-wide.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Switch
                      checked={globalEnabled}
                      onCheckedChange={setGlobalEnabled}
                      className="data-[state=checked]:bg-black"
                    />
                    <Button
                      onClick={handleSaveGlobal}
                      disabled={saving}
                      className="bg-black hover:bg-black text-white font-black px-6 rounded-xl h-11 text-[10px] uppercase tracking-widest transition-all"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Global"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Local Transfers Switch */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 transition-all group shadow-inner">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-black flex items-center gap-2 italic tracking-tight uppercase">
                      Intra-Bank Transfers
                    </Label>
                    <p className="text-xs text-black font-bold uppercase tracking-widest">Restrict or allow asset movement between internal bank accounts.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Switch
                      checked={localEnabled}
                      onCheckedChange={setLocalEnabled}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Button
                      onClick={handleSaveLocal}
                      disabled={saving}
                      className="bg-black hover:bg-blue-600 text-white font-black px-6 rounded-xl h-11 text-[10px] uppercase tracking-widest transition-all"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Local"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-black" /> Bulk Permission Overrides
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "All Transfers", type: "all", color: "orange" },
                    { label: "Local Only", type: "local", color: "blue" },
                    { label: "International", type: "international", color: "orange" },
                  ].map((btn, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                      <p className="text-[10px] font-black text-black uppercase tracking-widest text-center">{btn.label}</p>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => bulkSetUsersTransfer(true, btn.type as any)}
                          disabled={bulkBusy}
                          className={cn(
                            "w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            btn.color === 'orange' ? "bg-black hover:bg-black" : "bg-blue-600 hover:bg-blue-700"
                          )}
                        >
                          Enable All
                        </Button>
                        <Button
                          onClick={() => bulkSetUsersTransfer(false, btn.type as any)}
                          disabled={bulkBusy}
                          variant="outline"
                          className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200 text-black hover:bg-red-50 hover:border-red-200"
                        >
                          Revoke All
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Node Controller */}
        <div className="space-y-6">
          <Card className="bg-white border-2 border-black shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-black bg-black text-white">
              <CardTitle className="text-xl font-black italic tracking-tighter uppercase leading-none">Precise Override</CardTitle>
              <CardDescription className="text-white/40 font-bold uppercase text-[9px] tracking-widest mt-1">Target specific customer for override</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-black uppercase tracking-widest ml-1">Customer Identifier</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email or Account ID"
                    value={singleUserId}
                    onChange={(e) => setSingleUserId(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                  <Button
                    onClick={async () => {
                      if (!singleUserId) return
                      setSingleBusy(true)
                      setError(null)
                      try {
                        const res = await fetch(`/api/admin/users/permissions?identifier=${encodeURIComponent(singleUserId)}`)
                        const data = await res.json()
                        if (!res.ok) {
                          setError(data?.message || "Customer not found.")
                          setFoundUser(null)
                        } else {
                          setFoundUser(data)
                        }
                      } catch {
                        setError("Network error.")
                      } finally {
                        setSingleBusy(false)
                      }
                    }}
                    disabled={singleBusy}
                    className="aspect-square h-11 rounded-xl bg-black hover:bg-black p-0"
                  >
                    {singleBusy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {foundUser && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center font-black italic">
                      {foundUser.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black text-black uppercase tracking-widest">{foundUser.name}</p>
                      <p className="text-[10px] text-black font-bold truncate max-w-[150px]">{foundUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">Local</span>
                      <Switch
                        checked={foundUser.canLocalTransfer}
                        onCheckedChange={(val) => toggleUserPerm("local", val)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">Global</span>
                      <Switch
                        checked={foundUser.canInternationalTransfer}
                        onCheckedChange={(val) => toggleUserPerm("international", val)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-emerald-600 border-none rounded-2xl shadow-lg text-white">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest">Security Advisory</p>
                <p className="text-[10px] font-bold opacity-80 leading-relaxed italic">
                  Changes to bank-wide transfer protocols take effect immediately. Ensure all compliance checks are completed before global shifts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
