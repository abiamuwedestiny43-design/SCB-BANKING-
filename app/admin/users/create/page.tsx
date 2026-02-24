"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, UserPlus, Mail, Phone, MapPin, CreditCard, ChevronLeft, RefreshCw, Activity, Lock, Fingerprint, Globe, User } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function CreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    currency: "USD",
    roles: ["member"] as string[],
    verified: false,
    canTransfer: false,
    initialBalance: 0,
    usercode: "",
    securityPin: "",
    profileImageFile: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        router.push("/admin/users")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create customer")
      }
    } catch (error) {
      console.error("Create customer error:", error)
      alert("Failed to create customer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6 pb-32">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/admin/users" className="h-9 w-9 md:h-10 md:w-10 rounded-xl border border-slate-200 hover:border-black hover:text-black transition-all flex items-center justify-center flex-shrink-0 bg-white">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter italic uppercase">
              Register <span className="text-black">Account</span>
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-black font-bold uppercase tracking-widest opacity-60">Onboard a new customer to the digital ledger</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        <div className="lg:col-span-8 space-y-6">
          {/* Main Content Area */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-black">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-base md:text-lg font-black text-black tracking-tighter italic uppercase">Personal Information</h2>
            </div>
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="Enter first name"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Enter last name"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">Email Sequence</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">Phone Protocol</Label>
                  <Input
                    id="phone"
                    placeholder="+X XXX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">Primary Residence / Address</Label>
                <Input
                  id="address"
                  placeholder="Street name and building number"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">City / Hub</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">State / Region</Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">Jurisdiction / Country</Label>
                  <Input
                    id="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest ml-1">Postal Code</Label>
                  <Input
                    id="zipcode"
                    placeholder="000 000"
                    value={formData.zipcode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                    required
                    className="h-10 md:h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-black focus:border-black transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Side Panels */}
          <div className="bg-black border border-black shadow-xl rounded-2xl overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-4 md:p-6 border-b border-white/10 flex items-center gap-3 relative z-10">
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="text-base font-black tracking-tighter italic uppercase">Security Matrix</h2>
            </div>
            <div className="p-4 md:p-6 space-y-6 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="password" title="Set password" className="text-[9px] font-black text-black uppercase tracking-widest ml-1">Master Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="h-11 bg-white/5 border-white/10 rounded-xl font-bold text-white focus:border-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usercode" className="text-[9px] font-black text-black uppercase tracking-widest ml-1">Access Designation Code</Label>
                <Input
                  id="usercode"
                  placeholder="e.g. AX-204"
                  value={formData.usercode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usercode: e.target.value }))}
                  required
                  className="h-11 bg-white/5 border-white/10 rounded-xl font-bold text-white focus:border-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityPin" className="text-[9px] font-black text-black uppercase tracking-widest ml-1">Secure PIN (4 Digits)</Label>
                <Input
                  id="securityPin"
                  type="password"
                  placeholder="0000"
                  maxLength={4}
                  value={formData.securityPin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, securityPin: e.target.value }))}
                  required
                  className="h-11 bg-white/5 border-white/10 rounded-xl font-bold text-white focus:border-black transition-all text-center tracking-[0.5em]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe className="h-4 w-4" />
              </div>
              <h2 className="text-base font-black text-black tracking-tighter italic uppercase">Bank Config</h2>
            </div>
            <div className="p-4 md:p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-[9px] font-black text-black uppercase tracking-widest ml-1">Account Denomination</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-xl">
                    {["USD", "EUR", "GBP", "JPY", "INR", "CHF", "CAD", "AUD", "SGD"].map(c => (
                      <SelectItem key={c} value={c} className="font-black text-[10px] tracking-widest uppercase">{c} — LEDGER</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance" className="text-[9px] font-black text-black uppercase tracking-widest ml-1">Genesis Deposit</Label>
                <div className="relative">
                  <Input
                    id="initialBalance"
                    type="number"
                    placeholder="0.00"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData((prev) => ({ ...prev, initialBalance: Number(e.target.value) || 0 }))}
                    className="h-11 bg-slate-50 border-slate-200 rounded-xl font-black text-black pl-10"
                  />
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all">
                  <Label htmlFor="verified" className="text-[10px] font-black text-black uppercase tracking-widest cursor-pointer">Identity Verified</Label>
                  <Switch
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all">
                  <Label htmlFor="canTransfer" className="text-[10px] font-black text-black uppercase tracking-widest cursor-pointer">Transfer Protocol</Label>
                  <Switch
                    id="canTransfer"
                    checked={formData.canTransfer}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, canTransfer: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Strip */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 md:p-6 flex items-center justify-center gap-4 z-[50] shadow-2xl">
          <Link
            href="/admin/users"
            className="h-10 md:h-12 px-6 md:px-8 rounded-xl text-black hover:text-black font-black uppercase tracking-widest text-[10px] transition-all flex items-center"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-10 md:h-12 px-8 md:px-12 rounded-xl bg-black hover:bg-black text-white font-black shadow-lg shadow-orange-200 transition-all uppercase tracking-widest text-[10px] flex items-center gap-3"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Register Customer
          </Button>
        </div>
      </form>
    </div>
  )
}
