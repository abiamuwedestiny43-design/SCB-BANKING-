"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, User as UserIcon, ShieldCheck, Globe, CreditCard, Mail, Phone, MapPin, Fingerprint, Zap, ShieldAlert, Cpu, RefreshCw, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminEditUserPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [rolesInput, setRolesInput] = useState("")

  const [form, setForm] = useState<any>({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    birthdate: "",
    gender: "",
    religion: "",
    location: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    currency: "USD",
    verified: false,
    canTransfer: false,
    otpEmail: false,
    otpTransferCode: false,
    roles: [] as string[],
    canLocalTransfer: false,
    canInternationalTransfer: false,
    transferCodeRequired: true,
  })

  const onChange = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }))

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Failed to load user")
          return
        }
        const u = data.user
        setForm({
          email: u.email || "",
          firstname: u.bankInfo?.bio?.firstname || "",
          lastname: u.bankInfo?.bio?.lastname || "",
          phone: u.bankInfo?.bio?.phone || "",
          birthdate: u.bankInfo?.bio?.birthdate ? new Date(u.bankInfo.bio.birthdate).toISOString().slice(0, 10) : "",
          gender: u.bankInfo?.bio?.gender || "Not set",
          religion: u.bankInfo?.bio?.religion || "",
          location: u.bankInfo?.address?.location || "",
          city: u.bankInfo?.address?.city || "",
          state: u.bankInfo?.address?.state || "",
          country: u.bankInfo?.address?.country || "",
          zipcode: u.bankInfo?.address?.zipcode || "",
          currency: u.bankInfo?.system?.currency || "USD",
          verified: !!u.bankAccount?.verified,
          canTransfer: !!u.bankAccount?.canTransfer,
          otpEmail: !!u.bankOtp?.email,
          otpTransferCode: !!u.bankOtp?.transferCode,
          roles: Array.isArray(u.roles) ? u.roles : [],
          canLocalTransfer: u.bankAccount?.canLocalTransfer || false,
          canInternationalTransfer: u.bankAccount?.canInternationalTransfer || false,
          transferCodeRequired: u.transferCodeRequired !== false,
        })
        setRolesInput((Array.isArray(u.roles) ? u.roles : []).join(","))
      } catch (e) {
        setError("Failed to load user")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const onSave = async () => {
    setSaving(true)
    setError("")
    try {
      const payload = {
        ...form,
        roles: rolesInput
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      }
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Failed to save")
        return
      }
      toast({ title: "Profile Updated", description: "User details updated successfully." })
      router.push(`/admin/users/${params.id}`)
      router.refresh()
    } catch (e) {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-12 min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Cpu className="w-16 h-16 text-orange-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-500 tracking-[0.5em] animate-pulse uppercase">Retrieving Node Parameters...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-12 space-y-12 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* High-Tech Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-16 w-16 rounded-[2rem] bg-slate-900 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 shadow-2xl transition-all p-0 flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
              <Fingerprint className="w-3.5 h-3.5 text-orange-600" /> Identity Logic Trace
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase italic">
              MODIFY <span className="text-orange-600 uppercase">ENTITY</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl glass-dark">
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-orange-600 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl hover:scale-105 active:scale-95 group border-none"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-3 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-3 group-hover:rotate-12 transition-transform" />
            )}
            {saving ? "Synchronizing..." : "Execute Sync"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-500 relative z-10 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-top-4 duration-500 glass-dark">
          <ShieldAlert className="h-5 w-5" />
          <AlertDescription className="font-black uppercase tracking-widest text-xs ml-3">Protocol Conflict: {error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Core Profile Card */}
        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark group transition-all duration-500 border-t-4 border-t-orange-600">
          <CardHeader className="p-8 md:p-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
            <CardTitle className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-4 uppercase leading-none">
              <UserIcon className="w-8 h-8 text-orange-600" /> Personal Matrix
            </CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 italic">Identity anchor points and biographical sequencing.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Entity Mailbox", field: "email", icon: Mail },
                { label: "Forename Identity", field: "firstname", icon: UserIcon },
                { label: "Surname Identity", field: "lastname", icon: UserIcon },
                { label: "Comms Channel", field: "phone", icon: Phone },
                { label: "Birth Epoch", field: "birthdate", type: "date", icon: Zap },
              ].map((item: any) => (
                <div key={item.field} className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <item.icon className="w-3 h-3 text-orange-600" /> {item.label}
                  </Label>
                  <Input
                    type={item.type || "text"}
                    value={form[item.field]}
                    onChange={(e) => onChange(item.field, e.target.value)}
                    className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:border-orange-600 transition-all shadow-inner [color-scheme:dark] placeholder:text-slate-800"
                  />
                </div>
              ))}

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Fingerprint className="w-3 h-3 text-orange-600" /> Gender Vector
                </Label>
                <Select value={form.gender} onValueChange={(v) => onChange("gender", v)}>
                  <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-orange-600/20 uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-white/10 text-white rounded-2xl backdrop-blur-3xl">
                    <SelectItem value="Not set" className="font-bold focus:bg-orange-600 uppercase tracking-widest text-[10px]">NOT SET</SelectItem>
                    <SelectItem value="male" className="font-bold focus:bg-orange-600 uppercase tracking-widest text-[10px]">MALE</SelectItem>
                    <SelectItem value="female" className="font-bold focus:bg-orange-600 uppercase tracking-widest text-[10px]">FEMALE</SelectItem>
                    <SelectItem value="others" className="font-bold focus:bg-orange-600 uppercase tracking-widest text-[10px]">OTHERS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Globe className="w-3 h-3 text-orange-600" /> Belief Protocol
                </Label>
                <Input
                  value={form.religion}
                  onChange={(e) => onChange("religion", e.target.value)}
                  className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:border-orange-600 transition-all shadow-inner placeholder:text-slate-800"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <CreditCard className="w-3 h-3 text-orange-600" /> Operational Currency
                </Label>
                <Select value={form.currency} onValueChange={(v) => onChange("currency", v)}>
                  <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-orange-600/20 uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-white/10 text-white rounded-2xl backdrop-blur-3xl">
                    {["USD", "EUR", "GBP", "JPY", "INR", "CHF", "CAD", "AUD", "SGD"].map(c => (
                      <SelectItem key={c} value={c} className="font-bold focus:bg-orange-600 uppercase tracking-widest text-[10px]">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geolocation Hub */}
        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4rem] overflow-hidden glass-dark group transition-all duration-500 border-t-4 border-t-blue-600">
          <CardHeader className="p-8 md:p-12 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
            <CardTitle className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-4 uppercase leading-none">
              <Globe className="w-8 h-8 text-blue-600" /> Physical Node
            </CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 italic">Geospatial positioning for regulatory compliance.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-blue-600" /> Residential Logic
              </Label>
              <Input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:border-blue-600 transition-all shadow-inner placeholder:text-slate-800"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "City Vector", field: "city" },
                { label: "State / Province", field: "state" },
                { label: "Sovereign Region", field: "country" },
                { label: "Zone Code", field: "zipcode" },
              ].map(item => (
                <div key={item.field} className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{item.label}</Label>
                  <Input
                    value={form[item.field]}
                    onChange={(e) => onChange(item.field, e.target.value)}
                    className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:border-blue-600 transition-all shadow-inner placeholder:text-slate-800"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-8 rounded-[2.5rem] bg-blue-600/10 border border-blue-600/20 flex items-center gap-6 glass-dark">
              <div className="h-14 w-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-blue-600 shadow-2xl">
                <Activity className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-relaxed italic">
                Geospatial data is automatically cross-referenced with local jurisdictional mandates during asset migration protocols.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Protocol */}
        <Card className="bg-slate-900/40 border-white/5 shadow-3xl rounded-[4.5rem] overflow-hidden lg:col-span-2 glass-dark border-t-8 border-t-slate-800">
          <CardHeader className="p-8 md:p-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-black border border-white/5 flex items-center justify-center text-orange-600 shadow-3xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Access Permissions</CardTitle>
                <CardDescription className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 italic">High-level overrides for account clearance and security filters.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-10">
                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mb-4 border-b border-orange-600/20 pb-2 italic">Status Matrix</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vetted Protocol</Label>
                    <Select value={form.verified ? "true" : "false"} onValueChange={(v) => onChange("verified", v === "true")}>
                      <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-orange-600/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl backdrop-blur-3xl">
                        <SelectItem value="true" className="font-black focus:bg-orange-600 uppercase tracking-widest text-[10px]">YES (VERIFIED)</SelectItem>
                        <SelectItem value="false" className="font-black focus:bg-orange-600 uppercase tracking-widest text-[10px]">NO (UNVERIFIED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Discharge</Label>
                    <Select
                      value={form.canTransfer ? "true" : "false"}
                      onValueChange={(v) => onChange("canTransfer", v === "true")}
                    >
                      <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-orange-600/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl backdrop-blur-3xl">
                        <SelectItem value="true" className="font-black focus:bg-orange-600 uppercase tracking-widest text-[10px]">ENABLED</SelectItem>
                        <SelectItem value="false" className="font-black focus:bg-orange-600 uppercase tracking-widest text-[10px]">LOCKED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 border-b border-blue-500/20 pb-2 italic">Migration Clearance</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Intrasystem Bridge</Label>
                    <Select
                      value={form.canLocalTransfer ? "true" : "false"}
                      onValueChange={(v) => onChange("canLocalTransfer", v === "true")}
                    >
                      <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-blue-600/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl backdrop-blur-3xl">
                        <SelectItem value="true" className="font-black focus:bg-blue-600 uppercase tracking-widest text-[10px]">ALLOWED</SelectItem>
                        <SelectItem value="false" className="font-black focus:bg-blue-600 uppercase tracking-widest text-[10px]">RESTRICTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Gateway</Label>
                    <Select
                      value={form.canInternationalTransfer ? "true" : "false"}
                      onValueChange={(v) => onChange("canInternationalTransfer", v === "true")}
                    >
                      <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-blue-600/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl backdrop-blur-3xl">
                        <SelectItem value="true" className="font-black focus:bg-blue-600 uppercase tracking-widest text-[10px]">ALLOWED</SelectItem>
                        <SelectItem value="false" className="font-black focus:bg-blue-600 uppercase tracking-widest text-[10px]">RESTRICTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] mb-4 border-b border-purple-500/20 pb-2 italic">Auth Sequences</h3>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email OTP Flux</Label>
                    <Select value={form.otpEmail ? "true" : "false"} onValueChange={(v) => onChange("otpEmail", v === "true")}>
                      <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-purple-600/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl backdrop-blur-3xl">
                        <SelectItem value="true" className="font-black focus:bg-purple-600 uppercase tracking-widest text-[10px]">ACTIVE</SelectItem>
                        <SelectItem value="false" className="font-black focus:bg-purple-600 uppercase tracking-widest text-[10px]">BYPASS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transfer Logic Hash</Label>
                    <Select
                      value={form.transferCodeRequired ? "true" : "false"}
                      onValueChange={(v) => onChange("transferCodeRequired", v === "true")}
                    >
                      <SelectTrigger className="bg-black/40 border-white/5 rounded-2xl h-14 text-white font-black focus:ring-purple-600/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white rounded-xl backdrop-blur-3xl">
                        <SelectItem value="true" className="font-black focus:bg-purple-600 uppercase tracking-widest text-[10px]">ENFORCED</SelectItem>
                        <SelectItem value="false" className="font-black focus:bg-purple-600 uppercase tracking-widest text-[10px]">DISABLED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 pt-12 border-t border-white/5">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Role Initialization</Label>
                <div className="flex flex-wrap gap-8 mt-6 bg-black/40 p-10 rounded-[3rem] border border-white/5 shadow-inner glass-dark">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-4 cursor-pointer group/role">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`role-${role}`}
                          checked={Array.isArray(form.roles) && form.roles.includes(role)}
                          onChange={(e) => {
                            const newRoles = Array.isArray(form.roles) ? [...form.roles] : []
                            if (e.target.checked) {
                              if (!newRoles.includes(role)) newRoles.push(role)
                            } else {
                              const idx = newRoles.indexOf(role)
                              if (idx > -1) newRoles.splice(idx, 1)
                            }
                            onChange("roles", newRoles)
                            setRolesInput(newRoles.join(", "))
                          }}
                          className="peer appearance-none h-8 w-8 rounded-xl bg-black border border-white/20 checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer shadow-3xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xs pointer-events-none opacity-0 peer-checked:opacity-100">
                          ✓
                        </div>
                      </div>
                      <Label htmlFor={`role-${role}`} className="capitalize font-black text-xs text-slate-500 group-hover/role:text-white transition-colors cursor-pointer tracking-[0.2em] uppercase italic">
                        {role.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center pt-20 relative z-10 pb-20">
        <div className="flex gap-6 p-3 rounded-[2.5rem] bg-slate-900/50 border border-white/5 shadow-3xl backdrop-blur-3xl glass-dark">
          <Button onClick={() => router.back()} variant="ghost" className="h-16 px-12 rounded-[1.5rem] text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] transition-all">
            Abandon Changes
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-16 px-24 rounded-[1.5rem] bg-orange-600 hover:bg-white hover:text-black text-white font-black shadow-orange-600/20 shadow-2xl transition-all uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 border-none"
          >
            {saving ? "EXECUTING SYNC..." : "COMMIT UPDATE"}
          </Button>
        </div>
      </div>
    </div>
  )
}

