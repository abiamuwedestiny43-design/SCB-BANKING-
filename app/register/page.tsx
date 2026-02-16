"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus, ShieldCheck, Mail, Phone, Calendar, Lock, User, ArrowRight, Activity, Globe, Cpu } from "lucide-react"
import Image from "next/image"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    phone: "",
    birthdate: "",
    gender: "",
    pin: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Cipher mismatch: Passwords do not align.")
      setIsLoading(false)
      return
    }

    if (formData.pin.length !== 4) {
      setError("Protocol violation: PIN must be 4 digits.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        window.location.href = "/dashboard"
      } else {
        setError(data.message || "Node initialization failed. Check registry.")
      }
    } catch (error) {
      setError("Sync failure. Network instability detected.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white pt-[180px] pb-20 px-4 overflow-hidden selection:bg-orange-500/30">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg-white.png"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-white/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

        {/* Animated Glows */}
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Hook */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3" /> System Onboarding
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              IDENTITY <span className="text-orange-600">PROVISION</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm max-w-md mx-auto italic leading-relaxed">
              Establishing new secure node within the <span className="text-orange-600 font-bold">FIRST STATE</span> global asset perimeter.
            </p>
          </div>
        </div>

        {/* Form Deck */}
        <Card className="bg-white/70 backdrop-blur-2xl border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase border-l-4 border-orange-600 pl-6">Core Credentials</CardTitle>
          </CardHeader>

          <CardContent className="p-10 pt-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl py-4 border italic font-black text-xs uppercase tracking-widest">
                  <AlertDescription className="flex items-center justify-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-red-600/50" /> {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* SECTION: BIOSIGNATURES */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-orange-600/50 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <User className="w-3 h-3" /> Internal Bio-Data
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Forename</Label>
                    <Input
                      value={formData.firstname}
                      onChange={(e) => handleChange("firstname", e.target.value)}
                      required
                      placeholder="JOHN"
                      className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all font-bold tracking-tight px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Surname</Label>
                    <Input
                      value={formData.lastname}
                      onChange={(e) => handleChange("lastname", e.target.value)}
                      required
                      placeholder="DOE"
                      className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all font-bold tracking-tight px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Birth Epoch</Label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600" />
                      <Input
                        type="date"
                        value={formData.birthdate}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        onChange={(e) => handleChange("birthdate", e.target.value)}
                        required
                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-bold tracking-tight"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Biological Marker</Label>
                    <Select onValueChange={(value) => handleChange("gender", value)}>
                      <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-bold tracking-tight px-4 ring-0 focus:ring-0">
                        <SelectValue placeholder="GENDER_SELECTOR" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900">
                        <SelectItem value="male" className="focus:bg-orange-50 focus:text-white font-bold">MALE_PROTOCOL</SelectItem>
                        <SelectItem value="female" className="focus:bg-orange-50 focus:text-white font-bold">FEMALE_PROTOCOL</SelectItem>
                        <SelectItem value="others" className="focus:bg-orange-50 focus:text-white font-bold">DIVERSE_PROTOCOL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* SECTION: ACCESS PARAMETERS */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-orange-600/50 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Access Infrastructure
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Gateway ID (Email)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="identity_anchor@firststatebank.online"
                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Cipher</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cipher Confirm</Label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal Link (Phone)</Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+1 (995) 000-0000"
                          className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">System PIN (4 Digits)</Label>
                      <Input
                        type="password"
                        maxLength={4}
                        value={formData.pin}
                        onChange={(e) => handleChange("pin", e.target.value.replace(/\D/g, ""))}
                        required
                        placeholder="••••"
                        className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus:border-orange-500/50 transition-all font-black text-xl text-center tracking-[0.5em] placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-xl shadow-orange-600/20 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      Provision Node Access <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Existing Node Signature?{" "}
                    <Link href="/login" className="text-orange-600 hover:text-orange-700 transition-colors border-b border-orange-500/20 hover:border-orange-700">
                      Initialize Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>

          <div className="p-10 bg-white border-t border-slate-100 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-600/40" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cross-Region Details</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600/40" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantum Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-600/40" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-Time Core</span>
            </div>
          </div>
        </Card>

        {/* Legal Cipher */}
        <div className="mt-10 text-center opacity-20 hover:opacity-100 transition-opacity">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] leading-relaxed">
            By initializing this provisioning protocol, you agree to the FIRST STATE BANK Global Asset Custody Terms and Neural Agreement.
          </p>
        </div>
      </div>
    </div>
  )
}
