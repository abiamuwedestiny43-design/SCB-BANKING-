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
import { ArrowLeft, Save, User as UserIcon, ShieldCheck, Globe, CreditCard, Mail, Phone, MapPin, Fingerprint, Zap, ShieldAlert, Cpu, RefreshCw, Activity, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

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
          setError(data.message || "Failed to load customer")
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
        setError("Failed to load customer")
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
      toast({ title: "Customer Updated", description: "Customer details updated successfully." })
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
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center gap-4">
        <Cpu className="w-10 h-10 text-black animate-spin" />
        <p className="text-sm font-black text-black uppercase tracking-widest">Loading Customer Data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-xl border-slate-200 hover:border-black hover:text-black transition-all">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">
              Edit <span className="text-black">Customer</span>
            </h1>
            <p className="text-sm text-black font-bold uppercase tracking-widest opacity-60">Update customer profile and account permissions</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-12 px-8 rounded-2xl bg-black hover:bg-black text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-black/20"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving Changes..." : "Save Customer"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl p-4">
          <ShieldAlert className="h-5 w-5" />
          <AlertDescription className="font-bold text-sm ml-2">Error: {error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {/* Personal Information */}
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center gap-4 space-y-0">
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-black tracking-tighter italic uppercase">Personal Information</CardTitle>
              <CardDescription className="text-xs font-bold text-black uppercase tracking-widest mt-0.5">Customer identity and contact details</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Email Address", field: "email", icon: Mail },
                { label: "First Name", field: "firstname", icon: UserIcon },
                { label: "Last Name", field: "lastname", icon: UserIcon },
                { label: "Phone Number", field: "phone", icon: Phone },
                { label: "Date of Birth", field: "birthdate", type: "date", icon: Zap },
              ].map((item: any) => (
                <div key={item.field} className="space-y-2">
                  <Label className="text-xs font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                    <item.icon className="w-3 h-3 text-black" /> {item.label}
                  </Label>
                  <Input
                    type={item.type || "text"}
                    value={form[item.field]}
                    onChange={(e) => onChange(item.field, e.target.value)}
                    className="bg-slate-50 border-slate-100 rounded-xl h-11 text-black font-bold focus:border-black transition-all"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label className="text-xs font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Fingerprint className="w-3 h-3 text-black" /> Gender
                </Label>
                <Select value={form.gender} onValueChange={(v) => onChange("gender", v)}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-11 text-black font-bold focus:ring-black/20 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 text-black rounded-xl">
                    <SelectItem value="Not set">Not set</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Globe className="w-3 h-3 text-black" /> Religion
                </Label>
                <Input
                  value={form.religion}
                  onChange={(e) => onChange("religion", e.target.value)}
                  className="bg-slate-50 border-slate-100 rounded-xl h-11 text-black font-bold focus:border-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                  <CreditCard className="w-3 h-3 text-black" /> Primary Currency
                </Label>
                <Select value={form.currency} onValueChange={(v) => onChange("currency", v)}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-11 text-black font-bold focus:ring-black/20 text-xs uppercase tracking-widest">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 text-black rounded-xl">
                    {["USD", "EUR", "GBP", "JPY", "INR", "CHF", "CAD", "AUD", "SGD"].map(c => (
                      <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address and Geography */}
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center gap-4 space-y-0">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-black tracking-tighter italic uppercase">Address Information</CardTitle>
              <CardDescription className="text-xs font-bold text-black uppercase tracking-widest mt-0.5">Physical location and regional settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2 mb-6">
              <Label className="text-xs font-black text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-blue-600" /> Street Address
              </Label>
              <Input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                className="bg-slate-50 border-slate-100 rounded-xl h-11 text-black font-bold focus:border-black transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "City", field: "city" },
                { label: "State / Province", field: "state" },
                { label: "Country", field: "country" },
                { label: "Zip / Postal Code", field: "zipcode" },
              ].map(item => (
                <div key={item.field} className="space-y-2">
                  <Label className="text-xs font-black text-black uppercase tracking-widest ml-1">{item.label}</Label>
                  <Input
                    value={form[item.field]}
                    onChange={(e) => onChange(item.field, e.target.value)}
                    className="bg-slate-50 border-slate-100 rounded-xl h-11 text-black font-bold focus:border-black transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-4">
              <div className="h-10 w-10 min-w-[40px] rounded-lg bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-black leading-relaxed italic mt-1">
                Regional data is used to comply with local financial regulations and tax requirements for this customer&apos;s jurisdiction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Permissions */}
        <Card className="bg-white border-2 border-black shadow-sm rounded-2xl overflow-hidden lg:col-span-2">
          <CardHeader className="p-6 md:p-8 border-b border-slate-100 flex flex-row items-center gap-4 space-y-0">
            <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-black tracking-tighter italic uppercase leading-none">Account Permissions</CardTitle>
              <CardDescription className="text-xs font-bold text-black uppercase tracking-widest mt-1.5">Manage customer access levels and security overrides</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Account Status */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-black uppercase tracking-widest border-b border-slate-100 pb-2">Status & Verification</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Account Verified</p>
                      <p className="text-[10px] text-black font-bold">Manual verification status</p>
                    </div>
                    <Switch checked={form.verified} onCheckedChange={(v) => onChange("verified", v)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Discharge Assets</p>
                      <p className="text-[10px] text-black font-bold">General transfer permission</p>
                    </div>
                    <Switch checked={form.canTransfer} onCheckedChange={(v) => onChange("canTransfer", v)} />
                  </div>
                </div>
              </div>

              {/* Transfer Permissions */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Banking Clearance</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Local Transfers</p>
                      <p className="text-[10px] text-black font-bold">Intra-bank transactions</p>
                    </div>
                    <Switch checked={form.canLocalTransfer} onCheckedChange={(v) => onChange("canLocalTransfer", v)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Global Transfers</p>
                      <p className="text-[10px] text-black font-bold">Cross-border transactions</p>
                    </div>
                    <Switch checked={form.canInternationalTransfer} onCheckedChange={(v) => onChange("canInternationalTransfer", v)} />
                  </div>
                </div>
              </div>

              {/* Security Controls */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest border-b border-purple-100 pb-2">Security Protocols</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Email OTP</p>
                      <p className="text-[10px] text-black font-bold">Require mail verification</p>
                    </div>
                    <Switch checked={form.otpEmail} onCheckedChange={(v) => onChange("otpEmail", v)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Transfer Codes</p>
                      <p className="text-[10px] text-black font-bold">Require unique system codes</p>
                    </div>
                    <Switch checked={form.transferCodeRequired} onCheckedChange={(v) => onChange("transferCodeRequired", v)} />
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="md:col-span-3 pt-8 border-t border-slate-100">
                <Label className="text-xs font-black text-black uppercase tracking-widest ml-1 italic">Role Assignments</Label>
                <div className="flex flex-wrap gap-6 mt-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-3 cursor-pointer group">
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
                        className="h-5 w-5 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                      />
                      <Label htmlFor={`role-${role}`} className="capitalize font-black text-xs text-black group-hover:text-black transition-colors cursor-pointer tracking-widest uppercase">
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

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex items-center justify-center gap-4 z-40">
        <Button onClick={() => router.back()} variant="ghost" className="h-11 px-8 rounded-xl text-black hover:text-black hover:bg-slate-100 font-black uppercase tracking-widest text-xs transition-all">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={saving}
          className="h-11 px-12 rounded-xl bg-black hover:bg-black text-white font-black shadow-lg transition-all uppercase tracking-widest text-xs"
        >
          {saving ? "Updating..." : "Commit Changes"}
        </Button>
      </div>
    </div>
  )
}
