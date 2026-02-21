"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCheck,
  Clock,
  ArrowRight,
  Inbox,
  ChevronLeft,
  MailOpen,
  Mail
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NotificationsPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/notifications", fetcher)

  const notifications = data?.notifications || []
  const unreadCount = notifications.filter((n: any) => !n.viewed).length

  const markAllRead = async () => {
    const res = await fetch("/api/user/notifications", { method: "PATCH" })
    if (res.ok) {
      toast({
        title: "All Caught Up!",
        description: "All notifications marked as read.",
        className: "bg-orange-600 border-none text-white font-bold"
      })
      mutate()
    }
  }

  const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white">
              <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Notifications</h1>
              <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest opacity-60">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              size="sm"
              onClick={markAllRead}
              className="bg-slate-900 hover:bg-orange-600 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all italic h-12 px-6"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {isLoading ? (
              <div className="py-16 text-center">
                <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-300">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">No notifications</h3>
                  <p className="text-xs text-slate-400 mt-0.5">You're all caught up!</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                <AnimatePresence>
                  {notifications.map((n: any, idx: number) => {
                    const isDebit = n.message.toLowerCase().includes("debited")
                    const isCredit = n.message.toLowerCase().includes("credited")

                    return (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn(
                          "flex items-start gap-3 p-4 transition-colors hover:bg-slate-50/70 relative",
                          !n.viewed && "bg-orange-50/40"
                        )}
                      >
                        {/* Unread indicator */}
                        {!n.viewed && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500 rounded-r" />
                        )}

                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                          isDebit ? "bg-red-50 text-red-500" :
                            isCredit ? "bg-emerald-50 text-emerald-500" :
                              "bg-blue-50 text-blue-500"
                        )}>
                          {n.viewed ? (
                            <MailOpen className="h-4 w-4 opacity-60" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={cn(
                                "text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded italic",
                                isDebit ? "bg-red-50 text-red-600" :
                                  isCredit ? "bg-emerald-50 text-emerald-600" :
                                    "bg-blue-50 text-blue-600"
                              )}>
                                {isDebit ? "Debit" : isCredit ? "Credit" : "Info"}
                              </span>
                              {!n.viewed && (
                                <div className="h-1.5 w-1.5 bg-orange-500 rounded-full" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest opacity-60 flex-shrink-0">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(n.period).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <p className="text-sm md:text-base font-bold text-slate-800 mt-2 leading-relaxed tracking-tight italic opacity-90">{n.message}</p>
                          {n.redirect && (
                            <Link
                              href={n.redirect}
                              className="inline-flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 mt-2 italic group"
                            >
                              View details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
