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
    idNumber: "",
    idImage: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    if (formData.pin.length !== 4) {
      setError("Security Rule: PIN must be 4 digits.")
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
        setError(data.message || "Account creation failed. Please check your details.")
      }
    } catch (error) {
      setError("Connection error. Network instability detected.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, idImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white pt-[180px] pb-20 px-4 overflow-hidden selection:bg-black/30">
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
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-black/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-black/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Hook */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-black text-[10px] font-black uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3" /> Account Registration
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter uppercase italic">
              ACCOUNT <span className="text-black">REGISTRATION</span>
            </h1>
            <p className="text-sm md:text-base text-black font-black uppercase tracking-widest opacity-60 max-w-md mx-auto italic leading-relaxed">
              Creating a new secure account within the <span className="text-black font-black">SCB BANKING</span> banking system.
            </p>
          </div>
        </div>

        {/* Form Deck */}
        <Card className="bg-white/70 backdrop-blur-2xl border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent" />

          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase border-l-4 border-black pl-6 italic">Core <span className="text-black">Credentials</span></CardTitle>
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
                <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <User className="w-3 h-3" /> Personal Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">First Name</Label>
                    <Input
                      value={formData.firstname}
                      onChange={(e) => handleChange("firstname", e.target.value)}
                      required
                      placeholder="JOHN"
                      className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 focus:ring-black/20 transition-all font-bold tracking-tight px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Last Name</Label>
                    <Input
                      value={formData.lastname}
                      onChange={(e) => handleChange("lastname", e.target.value)}
                      required
                      placeholder="DOE"
                      className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 focus:ring-black/20 transition-all font-bold tracking-tight px-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Date of Birth</Label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black group-focus-within:text-black" />
                      <Input
                        type="date"
                        value={formData.birthdate}
                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                        onChange={(e) => handleChange("birthdate", e.target.value)}
                        required
                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Gender</Label>
                    <Select onValueChange={(value) => handleChange("gender", value)}>
                      <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight px-4 ring-0 focus:ring-0">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-black">
                        <SelectItem value="male" className="focus:bg-slate-50 focus:text-black font-bold">Male</SelectItem>
                        <SelectItem value="female" className="focus:bg-slate-50 focus:text-black font-bold">Female</SelectItem>
                        <SelectItem value="others" className="focus:bg-slate-50 focus:text-black font-bold">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* SECTION: IDENTITY VERIFICATION */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Identity Verification
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">ID / Passport Number</Label>
                    <Input
                      value={formData.idNumber}
                      onChange={(e) => handleChange("idNumber", e.target.value)}
                      required
                      placeholder="N-12345678"
                      className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 focus:ring-black/20 transition-all font-bold tracking-tight px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Upload ID Photo</Label>
                    <div className="relative group">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="h-12 pt-2.5 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight file:bg-black file:text-white file:border-0 file:rounded-md file:text-[8px] file:font-black file:uppercase file:px-3 file:py-1 file:mr-4"
                      />
                    </div>
                    {formData.idImage && (
                      <div className="mt-2 h-10 w-16 rounded border border-slate-100 overflow-hidden">
                        <img src={formData.idImage} alt="ID Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION: ACCESS PARAMETERS */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Account Access
                </p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black group-focus-within:text-black" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="user@example.com"
                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Password</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Confirm Password</Label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Phone Number</Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black group-focus-within:text-black" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+1 (995) 000-0000"
                          className="h-12 pl-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-bold tracking-tight placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Account PIN (4 Digits)</Label>
                      <Input
                        type="password"
                        maxLength={4}
                        value={formData.pin}
                        onChange={(e) => handleChange("pin", e.target.value.replace(/\D/g, ""))}
                        required
                        placeholder="••••"
                        className="h-12 bg-white border-slate-200 rounded-xl text-black focus:border-black/50 transition-all font-black text-xl text-center tracking-[0.5em] placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-black hover:bg-black text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-xl shadow-black/20 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      Register Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black hover:text-black transition-colors border-b border-black/20 hover:border-black">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>

          <div className="p-10 bg-white border-t border-slate-100 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-black/40" />
              <span className="text-[9px] font-black text-black uppercase tracking-widest">Global Access</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black/40" />
              <span className="text-[9px] font-black text-black uppercase tracking-widest">Advanced Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-black/40" />
              <span className="text-[9px] font-black text-black uppercase tracking-widest">Live Processing</span>
            </div>
          </div>
        </Card>

        {/* Legal Cipher */}
        <div className="mt-10 text-center opacity-20 hover:opacity-100 transition-opacity">
          <p className="text-[8px] font-black text-black uppercase tracking-[0.5em] leading-relaxed">
            By creating an account, you agree to the SCB BANKING Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
