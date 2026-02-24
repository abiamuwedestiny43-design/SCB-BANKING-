"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, ArrowLeftRight, Users, CreditCard, Settings, LogOut,
  Menu, X, Banknote, BellRing, ShieldCheck, History, MessageCircle, ChevronRight
} from "lucide-react"
import type { IUser } from "@/models/User"

interface UserSidebarProps {
  user: IUser
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Send Money", href: "/dashboard/transfer", icon: ArrowLeftRight },
  { name: "Transactions", href: "/dashboard/transactions", icon: History },
  { name: "My Cards", href: "/dashboard/card", icon: CreditCard },
  { name: "Loans", href: "/dashboard/loans", icon: Banknote },
  { name: "Beneficiaries", href: "/dashboard/beneficiaries", icon: Users },
  { name: "Support", href: "/dashboard/support/chat-apps", icon: MessageCircle },
  { name: "Notifications", href: "/dashboard/notifications", icon: BellRing },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl bg-white border-slate-200 text-black shadow-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex-shrink-0",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="px-6 py-5 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-base md:text-lg font-bold text-black tracking-tight">SCB BANKING</span>
            </Link>
          </div>

          {/* User profile */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black font-bold text-base flex-shrink-0 overflow-hidden">
                {user.profileImage
                  ? <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  : user.bankInfo.bio.firstname[0]
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-semibold text-black truncate">
                  {user.bankInfo.bio.firstname} {user.bankInfo.bio.lastname}
                </p>
                <p className="text-xs text-black truncate font-mono">{user.bankNumber}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <p className="px-2 text-xs font-bold uppercase tracking-widest text-black mb-3">Menu</p>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm md:text-base font-medium transition-all group",
                    isActive
                      ? "bg-slate-50 text-black shadow-sm"
                      : "text-black hover:text-black hover:bg-slate-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-black" : "text-black group-hover:text-black")} />
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-black shadow-sm shadow-black/50" />}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm md:text-base font-medium text-black hover:text-red-700 hover:bg-red-50 transition-all group"
            >
              <LogOut className="h-5 w-5 flex-shrink-0 text-black group-hover:text-red-600" />
              Sign Out
            </button>
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
