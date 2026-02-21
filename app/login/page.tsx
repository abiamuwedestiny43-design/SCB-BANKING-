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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ShieldCheck, Lock, Mail, ArrowRight, Fingerprint, Cpu, Globe } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [authUser, setAuthUser] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setAuthUser(data.user)
        setShowPinModal(true)
      } else {
        setError(data.message || "Incorrect email or password.")
      }
    } catch (error) {
      setError("Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPinError("")

    try {
      const response = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        if (authUser.roles.includes("super-admin") || authUser.roles.includes("administrator")) {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        setPinError(data.message || "Invalid security PIN.")
      }
    } catch (error) {
      setPinError("Authentication error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden selection:bg-orange-500/30 pt-32 pb-12">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/login-bg-white.png"
          alt="Danamon Bank"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-100/20 rounded-full blur-[150px] transition-all duration-1000" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        {/* Logo Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 shadow-2xl shadow-orange-500/10 mb-2 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck className="w-10 h-10 text-orange-600 relative z-10 transform group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic">
              DANAMON<span className="text-orange-600">BANK</span>
            </h1>
            <p className="text-sm md:text-base text-orange-600/50 font-black uppercase tracking-[0.4em] italic opacity-80">Secure Banking Platform</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/70 backdrop-blur-2xl border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

          <CardHeader className="space-y-2 p-10 pb-2 text-center">
            <CardTitle className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Secure <span className="text-orange-600">Login</span></CardTitle>
            <CardDescription className="text-sm md:text-base text-slate-600 font-black uppercase tracking-widest opacity-60 italic">Access your Danamon Bank account securely.</CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl py-3 border italic font-bold text-xs">
                  <AlertDescription className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="user@example.com"
                      disabled={isLoading}
                      className="h-14 pl-12 bg-white border-slate-200 rounded-2xl text-slate-900 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</Label>
                    <Link href="/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors">
                      Forgot Password
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      disabled={isLoading}
                      className="h-14 pl-12 bg-white border-slate-200 rounded-2xl text-slate-900 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-orange-600/20 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2 relative z-10">
                    Enter System <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="pt-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Need an account?{" "}
                  <Link href="/register" className="text-orange-600 hover:underline">
                    Sign Up Now
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Secure Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Global Cluster</span>
          </div>
        </div>
      </div>

      {/* PIN Verification Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="bg-white border-slate-200 rounded-[3rem] p-10 max-w-md overflow-hidden relative shadow-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="text-center relative z-10 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-2">
              <Fingerprint className="w-8 h-8 text-orange-600" />
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 italic tracking-tight">PIN Verification</DialogTitle>
            <DialogDescription className="text-slate-600 font-medium">Input your 4-digit security PIN to finalize access.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePinVerify} className="space-y-8 mt-6 relative z-10">
            {pinError && (
              <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl py-3 border italic font-bold text-xs">
                <AlertDescription className="flex items-center justify-center gap-2">
                  {pinError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="pin" className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block">Access PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4).replace(/\D/g, ""))}
                maxLength={4}
                disabled={isLoading}
                autoFocus
                placeholder="0000"
                className="h-20 text-center text-4xl font-black tracking-[0.5em] bg-white border-slate-200 rounded-2xl text-slate-900 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all placeholder:text-slate-200"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || pin.length !== 4}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-orange-600/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Security PIN"}
            </Button>

            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
              User Email: <span className="text-orange-600/60">{authUser?.email?.toUpperCase()}</span>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
