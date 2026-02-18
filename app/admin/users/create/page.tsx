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
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

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
        alert(error.message || "Failed to create user")
      }
    } catch (error) {
      console.error("Create user error:", error)
      alert("Failed to create user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative min-h-screen bg-black selection:bg-orange-500/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      {/* Header */}
      <div className="flex flex-col gap-4 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="w-fit h-12 w-12 rounded-xl bg-slate-900 border border-white/5 text-white hover:bg-white hover:text-black transition-all shadow-2xl group"
        >
          <Link href="/admin/users">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/5 text-orange-500 text-[10px] font-black uppercase tracking-widest shadow-xl">
            <UserPlus className="w-3 h-3" /> Account Creation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Create New <span className="text-orange-600 italic font-medium">Account</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-md uppercase text-[10px] tracking-widest leading-relaxed">Open a new user account with full banking access and privileges on the Sovereign network.</p>
        </div>
      </div>

      <Card className="max-w-4xl bg-slate-900/40 border-white/5 shadow-3xl rounded-[3rem] relative z-10 overflow-hidden glass-dark">
        <div className="absolute top-0 right-0 h-32 w-32 bg-orange-600/5 rounded-full blur-3xl"></div>

        <CardHeader className="p-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
          <CardTitle className="text-2xl font-black text-white italic tracking-tight uppercase">Account Details</CardTitle>
          <CardDescription className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-2">
            Complete all required fields to register the new user account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Account Credentials */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/50"></div>
                Account Credentials
              </h3>

              <div className="space-y-3">
                <Label htmlFor="profileImage" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Profile Picture</Label>
                <div className="p-1 bg-black/40 border border-white/5 rounded-2xl">
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    title="Upload profile picture"
                    onChange={(e) => setFormData((prev) => ({ ...prev, profileImageFile: e.target.files?.[0] || null }))}
                    className="block w-full text-xs text-slate-500 font-bold file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-900 file:text-white hover:file:bg-orange-600 file:transition-all file:cursor-pointer file:shadow-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="usercode" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">User Access Code</Label>
                  <Input
                    id="usercode"
                    placeholder="Enter access code"
                    value={formData.usercode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usercode: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityPin" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Security PIN</Label>
                  <Input
                    id="securityPin"
                    type="password"
                    placeholder="0000"
                    maxLength={4}
                    value={formData.securityPin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityPin: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/50"></div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/50"></div>
                Address Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Financial District"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">State / Province</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Country</Label>
                  <Input
                    id="country"
                    placeholder="USA"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Postal / Zip Code</Label>
                  <Input
                    id="zipcode"
                    placeholder="10001"
                    value={formData.zipcode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                    required
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Account Configuration */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-orange-600 rounded-full shadow-lg shadow-orange-600/50"></div>
                Account Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Primary Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:ring-orange-600/20 capitalize font-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-white/10 text-white backdrop-blur-3xl rounded-xl">
                      <SelectItem value="USD" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">EUR — Euro</SelectItem>
                      <SelectItem value="GBP" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">GBP — British Pound</SelectItem>
                      <SelectItem value="JPY" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">JPY — Japanese Yen</SelectItem>
                      <SelectItem value="INR" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">INR — Indian Rupees</SelectItem>
                      <SelectItem value="CHF" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">CHF — Swiss Franc</SelectItem>
                      <SelectItem value="CAD" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">CAD — Canadian Dollar</SelectItem>
                      <SelectItem value="AUD" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">AUD — Australian Dollar</SelectItem>
                      <SelectItem value="SGD" className="focus:bg-orange-600 font-black uppercase tracking-widest text-[10px]">SGD — Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance" className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Starting Balance</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.initialBalance}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, initialBalance: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="bg-black/40 border-white/5 rounded-xl h-12 text-white focus:border-orange-600 transition-all font-black placeholder:text-slate-800"
                  />
                </div>
              </div>

              {/* Access Levels */}
              <div className="space-y-4">
                <Label className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Access Levels</Label>
                <div className="flex flex-wrap gap-4">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 hover:border-orange-600/30 transition-all group/role">
                      <Checkbox
                        id={role}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                        className="h-5 w-5 border-white/20 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      />
                      <Label htmlFor={role} className="capitalize text-slate-400 group-hover/role:text-white font-black cursor-pointer text-xs uppercase tracking-widest transition-colors">
                        {role.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Permissions */}
              <div className="space-y-4">
                <Label className="text-slate-400 font-black uppercase tracking-widest text-[10px] ml-1">Account Permissions</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 hover:border-orange-600/30 transition-all group/perm">
                    <Checkbox
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked as boolean }))}
                      className="h-5 w-5 border-white/20 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    />
                    <Label htmlFor="verified" className="text-slate-400 group-hover/perm:text-white font-black cursor-pointer text-xs uppercase tracking-widest transition-colors">Account Verified</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 hover:border-orange-600/30 transition-all group/perm">
                    <Checkbox
                      id="canTransfer"
                      checked={formData.canTransfer}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, canTransfer: checked as boolean }))
                      }
                      className="h-5 w-5 border-white/20 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    />
                    <Label htmlFor="canTransfer" className="text-slate-400 group-hover/perm:text-white font-black cursor-pointer text-xs uppercase tracking-widest transition-colors">Transfer Enabled</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-white/5">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 hover:bg-white hover:text-black text-white font-black h-16 px-12 rounded-2xl shadow-3xl shadow-orange-600/20 transition-all uppercase tracking-[0.2em] text-xs flex-1 sm:flex-none border-none"
              >
                {isLoading ? "Synchronizing..." : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-black border border-white/5 transition-all uppercase tracking-[0.2em] text-xs shadow-2xl"
              >
                <Link href="/admin/users">Cancel Operation</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
