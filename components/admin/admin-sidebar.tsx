"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CreditCard, ArrowLeftRight, Settings, LogOut, Menu, X, Banknote, Shield, BarChart3, Plug } from "lucide-react"
import type { IUser } from "@/models/User"
import Image from "next/image"

interface AdminSidebarProps {
  user: IUser
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Global Transfers", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Card Issuance", href: "/admin/cards", icon: CreditCard },
  { name: "Loan Protocols", href: "/admin/loans", icon: Banknote },
  { name: "Integrations", href: "/admin/integrations", icon: Plug },
  { name: "Security Center", href: "/admin/security", icon: Shield },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
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
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" className="bg-[#0f172a] border-orange-500/30 text-orange-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-sm",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full uppercase">
          {/* Header/Logo */}
          <div className="p-8 pb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                <Image src="/logo.svg" alt="Logo" fill className="object-cover" />
              </div>
              <span className="text-xl font-black tracking-tighter text-black">
                FIRST<span className="text-orange-700 italic">STATE</span>
              </span>
            </Link>
          </div>

          {/* User Profile Hook */}
          <div className="px-6 mb-10">
            <div className="p-4 rounded-[1.5rem] bg-orange-50 border border-orange-100 flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white border border-orange-200 rounded-xl flex items-center justify-center text-orange-600 font-black text-lg overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.bankInfo.bio.firstname[0]
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-600 border-2 border-white rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-black truncate">
                  {user.bankInfo.bio.firstname} {user.bankInfo.bio.lastname}
                </p>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-orange-700" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">Super Admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Core Banking</p>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                    isActive
                      ? "bg-orange-700 text-white shadow-xl shadow-orange-700/20"
                      : "text-black hover:text-orange-700 hover:bg-orange-50",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-orange-600/60")} />
                  <span>{item.name === "Loan Protocols" ? "Loan Services" : item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer/Logout */}
          <div className="p-6 border-t border-slate-100 bg-white/50">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
