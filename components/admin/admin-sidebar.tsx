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
  { group: "Overview" },
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Customers", href: "/admin/users", icon: Users },
  { group: "Banking" },
  { name: "All Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Debit & Credit Cards", href: "/admin/cards", icon: CreditCard },
  { name: "Loans & Credit", href: "/admin/loans", icon: Banknote },
  { group: "Administration" },
  { name: "Security", href: "/admin/security", icon: Shield },
  { name: "Transfer Codes", href: "/admin/transfer-codes", icon: Lock },
  { name: "Integrations", href: "/admin/integrations", icon: Plug },
  { name: "Settings", href: "/admin/settings", icon: Settings },
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
      <div className="lg:hidden fixed top-5 right-5 z-50">
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-md hover:border-orange-500 hover:text-orange-600 transition-all" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transform transition-transform duration-500 lg:translate-x-0 lg:static shadow-[4px_0_24px_-8px_rgba(0,0,0,0.08)]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full uppercase relative overflow-hidden">
          {/* Header/Logo */}
          <div className="p-6 pb-4 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl bg-orange-50 border border-orange-200 p-1.5 overflow-hidden">
                <Image src="/logo.svg" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">
                  FIRST<span className="text-orange-600 italic">STATE</span>
                </span>
                <span className="text-[9px] font-black tracking-[0.3em] text-slate-400 mt-0.5 uppercase">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Admin Profile Card */}
          <div className="px-4 py-4 border-b border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 border-2 border-orange-200 rounded-xl flex items-center justify-center text-orange-700 font-black text-base overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.bankInfo.bio.firstname[0]
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">
                  {user.bankInfo.bio.firstname} {user.bankInfo.bio.lastname}
                </p>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto relative z-10">
            {navigation.map((item, idx) => {
              if ('group' in item) {
                return (
                  <p key={idx} className="px-3 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-5 mb-2 flex items-center gap-3">
                    <span className="whitespace-nowrap">{item.group}</span>
                    <span className="h-px w-full bg-slate-100"></span>
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group",
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0",
                    isActive ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-600" />}
                </Link>
              )
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-slate-100 relative z-10">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl h-11 font-bold text-sm gap-3 transition-all duration-200 group"
              onClick={handleLogout}
            >
              <div className="h-8 w-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-100 transition-all">
                <LogOut className="h-4 w-4" />
              </div>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
