"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CreditCard, ArrowLeftRight, Settings, LogOut, Menu, X, Banknote, Shield, BarChart3, Plug, Activity, Lock, Fingerprint } from "lucide-react"
import type { IUser } from "@/models/User"
import Image from "next/image"

interface AdminSidebarProps {
  user: IUser
}

const navigation = [
  { group: "Core Matrix" },
  { name: "Executive Oversight", href: "/admin", icon: LayoutDashboard },
  { name: "Economic Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Identity Registry", href: "/admin/users", icon: Users },
  { group: "Operations" },
  { name: "Global Clearance", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Asset Issuance", href: "/admin/cards", icon: CreditCard },
  { name: "Lending Protocols", href: "/admin/loans", icon: Banknote },
  { group: "Infrastructure" },
  { name: "Security Core", href: "/admin/security", icon: Shield },
  { name: "Auth Sequences", href: "/admin/transfer-codes", icon: Lock },
  { name: "Cloud Integration", href: "/admin/integrations", icon: Plug },
  { name: "System Config", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-black border border-white/5 text-orange-600 shadow-3xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-black border-r border-white/5 transform transition-transform duration-500 lg:translate-x-0 lg:static shadow-[10px_0_50px_-20px_rgba(0,0,0,0.5)]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full uppercase relative overflow-hidden">
          {/* Subtle Background Mark */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-orange-600/5 rounded-full blur-[100px] opacity-50 animate-pulse"></div>

          {/* Header/Logo */}
          <div className="p-10 pb-12 relative z-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative h-12 w-12 rounded-[1.2rem] bg-slate-900 border border-white/5 p-2.5 shadow-3xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                <Image src="/logo.svg" alt="Logo" fill className="object-contain p-2 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-600"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white leading-none">
                  FIRST<span className="text-orange-600 italic">STATE</span>
                </span>
                <span className="text-[9px] font-black tracking-[0.4em] text-slate-500 mt-1 uppercase">Sovereign Node</span>
              </div>
            </Link>
          </div>

          {/* Identity Capsule */}
          <div className="px-8 mb-12 relative z-10">
            <div className="p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 shadow-inner flex flex-col gap-5 relative group overflow-hidden glass-dark">
              <div className="absolute top-0 right-0 h-20 w-20 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 bg-black border border-white/5 rounded-[1.2rem] flex items-center justify-center text-white font-black text-2xl overflow-hidden shadow-2xl">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.bankInfo.bio.firstname[0]
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-black rounded-full animate-pulse"></div>
                </div>
                <div className="overflow-hidden space-y-1">
                  <p className="text-sm font-black text-white truncate tracking-tight uppercase italic">
                    {user.bankInfo.bio.firstname} {user.bankInfo.bio.lastname}
                  </p>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-orange-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Master Level</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-500 tracking-[0.2em]">ACTIVE</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-800"></div>
                <div className="text-[9px] font-black text-orange-600 tracking-widest uppercase">ID: 009412</div>
              </div>
            </div>
          </div>

          {/* Registry Navigation */}
          <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
            {navigation.map((item, idx) => {
              if ('group' in item) {
                return (
                  <p key={idx} className="px-5 text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mt-12 mb-6 flex items-center gap-4">
                    <span className="whitespace-nowrap italic">{item.group}</span>
                    <span className="h-[1px] w-full bg-white/5"></span>
                  </p>
                )
              }

              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] text-xs font-black transition-all duration-500 group border border-transparent",
                    isActive
                      ? "bg-orange-600/10 text-white shadow-3xl border-orange-600/20 scale-[1.02]"
                      : "text-slate-500 hover:text-white hover:bg-white/5",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl",
                    isActive ? "bg-orange-600 text-white" : "bg-black border border-white/5 group-hover:bg-slate-900 group-hover:text-orange-600"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="tracking-[0.2em] uppercase italic">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Termination Unit */}
          <div className="p-8 pb-10 relative z-10">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-600 hover:text-white rounded-[1.8rem] h-16 font-black uppercase tracking-[0.4em] text-[10px] gap-5 transition-all duration-500 shadow-inner bg-black border border-white/5 group"
              onClick={handleLogout}
            >
              <div className="h-10 w-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                <LogOut className="h-5 w-5" />
              </div>
              Deauthorize Node
            </Button>
          </div>
        </div>
      </div>

      {/* Field Distortion Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-30 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
