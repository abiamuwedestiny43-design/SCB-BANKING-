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
    <div className="p-4 md:p-10 space-y-10 relative min-h-screen bg-slate-50/50">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col gap-4 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="w-fit rounded-xl hover:bg-white border border-slate-200 text-slate-950 hover:text-black transition-all shadow-sm"
        >
          <Link href="/admin/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">
            <UserPlus className="w-3 h-3" /> Account Creation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">
            Create New <span className="text-slate-500 italic font-medium">Account</span>
          </h1>
          <p className="text-slate-900 font-bold max-w-md uppercase text-xs tracking-widest">Open a new user account with full banking access and privileges.</p>
        </div>
      </div>

      <Card className="max-w-4xl bg-white border-slate-200 shadow-2xl rounded-[3rem] relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl"></div>

        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-2xl font-black text-black italic tracking-tight uppercase">Account Details</CardTitle>
          <CardDescription className="text-slate-900 font-black uppercase tracking-widest text-[10px] mt-1">
            Complete all required fields to register the new user account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Account Credentials
              </h3>

              <div className="space-y-2">
                <Label htmlFor="profileImage" className="text-black font-black uppercase tracking-widest text-[10px]">Profile Picture</Label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  title="Upload profile picture"
                  onChange={(e) => setFormData((prev) => ({ ...prev, profileImageFile: e.target.files?.[0] || null }))}
                  className="block w-full text-sm text-slate-900 font-bold file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:transition-all file:cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black font-black uppercase tracking-widest text-[10px]">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black font-black uppercase tracking-widest text-[10px]">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usercode" className="text-black font-black uppercase tracking-widest text-[10px]">User Access Code</Label>
                  <Input
                    id="usercode"
                    placeholder="Enter access code"
                    value={formData.usercode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usercode: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityPin" className="text-black font-black uppercase tracking-widest text-[10px]">Security PIN</Label>
                  <Input
                    id="securityPin"
                    type="password"
                    placeholder="0000"
                    maxLength={4}
                    value={formData.securityPin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityPin: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-black font-black uppercase tracking-widest text-[10px]">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-black font-black uppercase tracking-widest text-[10px]">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-black font-black uppercase tracking-widest text-[10px]">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Address Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-black font-black uppercase tracking-widest text-[10px]">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Financial District"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-black font-black uppercase tracking-widest text-[10px]">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-black font-black uppercase tracking-widest text-[10px]">State / Province</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-black font-black uppercase tracking-widest text-[10px]">Country</Label>
                  <Input
                    id="country"
                    placeholder="USA"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-black font-black uppercase tracking-widest text-[10px]">Postal / Zip Code</Label>
                  <Input
                    id="zipcode"
                    placeholder="10001"
                    value={formData.zipcode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
              </div>
            </div>

            {/* Account Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2 italic">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Account Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-black font-black uppercase tracking-widest text-[10px]">Primary Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-xl">
                      <SelectItem value="USD" className="text-black hover:bg-slate-50 font-medium">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR" className="text-black hover:bg-slate-50 font-medium">EUR — Euro</SelectItem>
                      <SelectItem value="GBP" className="text-black hover:bg-slate-50 font-medium">GBP — British Pound</SelectItem>
                      <SelectItem value="JPY" className="text-black hover:bg-slate-50 font-medium">JPY — Japanese Yen</SelectItem>
                      <SelectItem value="INR" className="text-black hover:bg-slate-50 font-medium">INR — Indian Rupees</SelectItem>
                      <SelectItem value="CHF" className="text-black hover:bg-slate-50 font-medium">CHF — Swiss Franc</SelectItem>
                      <SelectItem value="CAD" className="text-black hover:bg-slate-50 font-medium">CAD — Canadian Dollar</SelectItem>
                      <SelectItem value="AUD" className="text-black hover:bg-slate-50 font-medium">AUD — Australian Dollar</SelectItem>
                      <SelectItem value="SGD" className="text-black hover:bg-slate-50 font-medium">SGD — Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance" className="text-black font-black uppercase tracking-widest text-[10px]">Starting Balance</Label>
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
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 text-black focus:border-indigo-600 transition-all font-black"
                  />
                </div>
              </div>

              {/* Access Levels */}
              <div className="space-y-3">
                <Label className="text-black font-black uppercase tracking-widest text-[10px]">Access Levels</Label>
                <div className="flex flex-wrap gap-4">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-indigo-500/30 transition-all">
                      <Checkbox
                        id={role}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                        className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <Label htmlFor={role} className="capitalize text-black font-black cursor-pointer text-sm">
                        {role.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Permissions */}
              <div className="space-y-3">
                <Label className="text-black font-black uppercase tracking-widest text-[10px]">Account Permissions</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-indigo-500/30 transition-all">
                    <Checkbox
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked as boolean }))}
                      className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                    <Label htmlFor="verified" className="text-black font-black cursor-pointer text-sm">Account Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-indigo-500/30 transition-all">
                    <Checkbox
                      id="canTransfer"
                      checked={formData.canTransfer}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, canTransfer: checked as boolean }))
                      }
                      className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                    <Label htmlFor="canTransfer" className="text-black font-black cursor-pointer text-sm">Transfer Enabled</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-xs"
              >
                {isLoading ? "Synchronizing..." : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-14 px-10 rounded-2xl bg-white hover:bg-slate-50 text-black font-black border border-slate-200 transition-all uppercase tracking-widest text-xs shadow-sm"
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
