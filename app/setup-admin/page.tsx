"use client"

import { useState } from "react"
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SetupAdminPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string>("")

    const createAdmin = async () => {
        setLoading(true)
        setError("")
        setResult(null)

        try {
            const response = await fetch("/api/setup-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json()

            if (response.ok) {
                setResult(data)
            } else {
                setError(data.message || "Failed to create admin user")
            }
        } catch (err: any) {
            setError(err.message || "Network error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/10 border border-black/20 mb-4">
                            <Shield className="w-8 h-8 text-orange-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                            Admin Setup
                        </h1>
                        <p className="text-black font-medium">
                            Initialize your super admin account for SCB BANKING
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            Important Instructions
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Click the button below to create your admin account</li>
                            <li>• This will create a super-admin user in your production database</li>
                            <li>• After successful creation, login with the provided credentials</li>
                            <li>• <span className="text-yellow-400 font-bold">IMPORTANT:</span> Delete this page and API endpoint after setup!</li>
                        </ul>
                    </div>

                    {/* Create Button */}
                    {!result && (
                        <button
                            onClick={createAdmin}
                            disabled={loading}
                            className="w-full bg-black hover:bg-orange-400 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Admin User...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Create Super Admin
                                </>
                            )}
                        </button>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 bg-black/10 border border-black/20 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-red-400 font-bold mb-1">Error</h4>
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Result */}
                    {result && result.success && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-black/10 border border-black/20 rounded-2xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-emerald-400 font-bold text-lg mb-1">Success!</h4>
                                        <p className="text-emerald-300 text-sm">{result.message}</p>
                                    </div>
                                </div>

                                {result.credentials && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                                        <h5 className="text-white font-bold text-sm mb-3">Login Credentials:</h5>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-black">Email:</span>
                                                <span className="text-white font-mono">{result.credentials.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-black">Password:</span>
                                                <span className="text-white font-mono">{result.credentials.password}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-black">PIN:</span>
                                                <span className="text-white font-mono">{result.credentials.pin}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-black">Account:</span>
                                                <span className="text-white font-mono">{result.credentials.accountNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Warning */}
                            <div className="bg-black/10 border border-black/20 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-yellow-400 font-bold mb-2">Security Warning</h4>
                                        <p className="text-yellow-300 text-sm mb-3">{result.warning}</p>
                                        <div className="space-y-2 text-sm text-yellow-200">
                                            <p>To delete this setup page:</p>
                                            <code className="block bg-black/30 p-2 rounded text-xs">
                                                1. Delete: /app/setup-admin/page.tsx<br />
                                                2. Delete: /app/api/setup-admin/route.ts
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Login Button */}
                            <a
                                href="/login"
                                className="block w-full bg-white text-black font-black py-4 rounded-xl text-center hover:bg-slate-100 transition-all"
                            >
                                Go to Login Page →
                            </a>
                        </div>
                    )}

                    {/* Already Exists */}
                    {result && !result.success && result.message.includes("already exists") && (
                        <div className="mt-6">
                            <div className="bg-black/10 border border-black/20 rounded-2xl p-6 mb-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-blue-400 font-bold mb-1">Admin Already Exists</h4>
                                        <p className="text-blue-300 text-sm">{result.message}</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="/login"
                                className="block w-full bg-black hover:bg-orange-400 text-white font-black py-4 rounded-xl text-center transition-all"
                            >
                                Go to Login Page →
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
