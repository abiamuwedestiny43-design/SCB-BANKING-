"use client"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/current-user")
        const data = await res.json()
        setCurrentUser(data.user)
      } catch (err) {
        console.error("Failed to load user:", err)
      }
    }
    fetchUser()

    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setCurrentUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "loans", label: "Loans", href: "/loans" },
    { id: "mortgage", label: "Mortgage", href: "/mortgage" },
    { id: "contact", label: "Contact", href: "/contact" },
  ]

  return (
    <nav className={cn(
      "fixed top-10 w-full z-50 transition-all duration-500",
      isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 py-2 shadow-sm" : "bg-white/10 backdrop-blur-md py-4 text-slate-900 border border-white/20 mx-auto max-w-7xl left-1/2 -translate-x-1/2 rounded-[2rem] shadow-2xl"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-2xl group-hover:scale-110 transition-transform bg-orange-50 flex items-center justify-center p-2">
              <ShieldCheck className="w-8 h-8 text-orange-600" />
            </div>
            <span className={cn(
              "text-xl font-black tracking-tighter transition-colors",
              isScrolled ? "text-slate-900" : "text-slate-900"
            )}>
              First State<span className={isScrolled ? "text-orange-600 italic" : "text-orange-600 italic"}> Bank</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-bold tracking-tight rounded-xl transition-all",
                  isScrolled ? "text-slate-600 hover:text-orange-600 hover:bg-orange-50" : "text-slate-600 hover:text-orange-600 hover:bg-white/50"
                )}
              >
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "px-4 py-2 text-sm font-bold tracking-tight rounded-xl transition-all flex items-center gap-1",
                isScrolled ? "text-slate-600 hover:text-orange-600 hover:bg-orange-50" : "text-slate-600 hover:text-orange-600 hover:bg-white/50"
              )}>
                Services <ChevronDown className="w-3 h-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2 bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl backdrop-blur-xl">
                <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white"><Link href="/services/">Overview</Link></DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white"><Link href="/services/personal">Personal Banking</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white"><Link href="/services/business">Business Banking</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white"><Link href="/services/investment">Investments</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white"><Link href="/services/mortgage">Mortgages</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-3 p-1 pr-4 rounded-2xl border transition-all",
                    isScrolled ? "bg-orange-50 border-orange-100 hover:bg-orange-100" : "bg-white border-slate-200 hover:bg-slate-50"
                  )}>
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-black overflow-hidden shadow-sm",
                      currentUser?.profileImage ? "" : "bg-orange-600 text-white"
                    )}>
                      {currentUser?.profileImage ? (
                        <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        currentUser?.bankInfo?.bio?.firstname?.[0] || 'U'
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-black transition-colors",
                      isScrolled ? "text-slate-900" : "text-slate-900"
                    )}>{currentUser?.bankInfo?.bio?.firstname || 'Account'}</span>
                    <ChevronDown className={isScrolled ? "w-4 h-4 text-orange-600" : "w-4 h-4 text-orange-600"} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl backdrop-blur-xl">
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white py-3">
                    <Link href="/dashboard" className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-orange-600 focus:text-white py-3">
                    <Link href="/dashboard/settings" className="flex items-center gap-3">
                      <User className="w-4 h-4" /> Profile Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl focus:bg-red-500 focus:text-white py-3 group">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-red-500 group-focus:text-white" /> Sign Out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={cn(
                    "text-sm font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all",
                    isScrolled ? "text-slate-900 hover:text-orange-600" : "text-slate-900 hover:text-orange-600"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-black uppercase tracking-widest px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-600/10"
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={cn("lg:hidden p-2 rounded-xl transition-colors", isScrolled ? "text-orange-600 bg-orange-50" : "text-orange-600 bg-white/50 border border-slate-200")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-x-0 bg-white border-t border-slate-100 transition-all duration-500 shadow-2xl",
        isMenuOpen ? "top-[114px] opacity-100 pointer-events-auto max-h-[85vh] overflow-y-auto" : "top-[104px] opacity-0 pointer-events-none max-h-0"
      )}>
        <div className="p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block p-4 text-lg font-black text-slate-900 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="w-full text-left p-4 text-lg font-black text-slate-900 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all flex items-center justify-between">
              Services <ChevronDown className="w-4 h-4 text-orange-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[85vw] mx-auto bg-white border-slate-100 text-slate-900 rounded-2xl p-2 shadow-xl">
              {['Personal Banking', 'Business Banking', 'Investments', 'Mortgages'].map((s, i) => (
                <DropdownMenuItem key={i} className="rounded-xl py-3 focus:bg-orange-600 focus:text-white">{s}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="pt-4 space-y-4">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 p-5 text-lg font-black rounded-[1.5rem] bg-orange-600 text-white shadow-xl shadow-orange-600/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" /> My Dashboard
                </Link>
                <button
                  className="w-full p-5 text-sm font-black uppercase tracking-widest text-red-600 bg-red-50 rounded-[1.5rem]"
                  onClick={async () => {
                    setIsMenuOpen(false)
                    await handleLogout()
                  }}
                >
                  Logout Account
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center p-5 text-sm font-black uppercase tracking-widest text-slate-900 bg-slate-100 rounded-[1.5rem]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center p-5 text-sm font-black uppercase tracking-widest text-white bg-orange-600 rounded-[1.5rem]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
