"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, UserPlus, ShieldCheck, Mail, Lock, Phone, MapPin, CreditCard, ChevronLeft, RefreshCw, Activity } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

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

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: checked ? [...prev.roles.filter((r) => r !== role), role] : prev.roles.filter((r) => r !== role),
    }))
  }

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
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-8 lg:p-12 pt-20 md:pt-28 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-xl border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all">
            <Link href="/admin/users">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">
              Create <span className="text-orange-600">Account</span>
            </h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest opacity-60">Register a new customer and setup their initial profile</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">State</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Zip Code</Label>
                  <Input
                    id="zipcode"
                    placeholder="10001"
                    value={formData.zipcode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                    required
                    className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-2 border-slate-900 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 bg-slate-900 text-white">
              <CardTitle className="text-xl font-black tracking-tighter italic uppercase">Security Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" title="Set password" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Account Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usercode" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">User Access Code</Label>
                <Input
                  id="usercode"
                  placeholder="e.g. CORE-123"
                  value={formData.usercode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usercode: e.target.value }))}
                  required
                  className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityPin" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Security PIN (4 digits)</Label>
                <Input
                  id="securityPin"
                  type="password"
                  placeholder="0000"
                  maxLength={4}
                  value={formData.securityPin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, securityPin: e.target.value }))}
                  required
                  className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                />
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-4">
                  <div className="h-10 w-10 min-w-[40px] rounded-lg bg-white border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed italic mt-1">
                    Please ensure the customer receives their access code and PIN privately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">Bank Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Initial Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 rounded-xl">
                    {["USD", "EUR", "GBP", "JPY", "INR", "CHF", "CAD", "AUD", "SGD"].map(c => (
                      <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Initial Deposit</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  placeholder="0.00"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, initialBalance: Number(e.target.value) || 0 }))}
                  className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="verified" className="text-xs font-black text-slate-900 uppercase tracking-widest">Verified Account</Label>
                  <Switch
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canTransfer" className="text-xs font-black text-slate-900 uppercase tracking-widest">Transfer Permissions</Label>
                  <Switch
                    id="canTransfer"
                    checked={formData.canTransfer}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, canTransfer: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex items-center justify-center gap-4 z-40">
          <Button type="button" onClick={() => router.back()} variant="ghost" className="h-11 px-8 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-xs transition-all">
            Cancel Registration
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 px-12 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black shadow-lg transition-all uppercase tracking-widest text-xs"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
            Register Customer
          </Button>
        </div>
      </form>
    </div>
  )
}
