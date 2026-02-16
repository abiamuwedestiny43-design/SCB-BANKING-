"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, ShieldCheck, Mail, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setMessage("")

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage(data.message)
            } else {
                setError(data.message || "Something went wrong")
            }
        } catch (error) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden selection:bg-orange-500/30">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/login-bg-white.png"
                    alt="Background"
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

            {/* Container */}
            <div className="relative z-10 w-full max-w-lg">
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100 shadow-sm mb-2 group">
                        <Mail className="w-10 h-10 text-orange-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                            RESET <span className="text-orange-600 font-medium">ACCESS</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm italic">Initiate protocol to restore node credentials.</p>
                    </div>
                </div>

                <Card className="bg-white/70 backdrop-blur-2xl border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

                    <CardHeader className="text-center p-8 pb-0">
                        <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Forgot Password</CardTitle>
                        <CardDescription className="text-slate-600 font-medium text-sm italic">Enter your registered email to receive reset instructions.</CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl py-3 border italic font-black text-xs uppercase">
                                    <AlertDescription className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {message && (
                                <Alert className="bg-orange-50 border-orange-100 text-orange-600 rounded-2xl py-3 border italic font-black text-xs uppercase">
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                    Gateway ID (Email)
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-14 pl-12 bg-white border-slate-200 rounded-2xl text-slate-900 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all font-medium placeholder:text-slate-300"
                                        placeholder="identity_anchor@firststatebank.online"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-orange-600/20 group overflow-hidden relative"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2 relative z-10">
                                        Send Reset Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center pt-2">
                                <Link href="/login" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors">
                                    <ArrowLeft className="mr-2 h-3 w-3" />
                                    Back to Entry Point
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
