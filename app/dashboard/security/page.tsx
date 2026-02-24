import { Badge } from "@/components/ui/badge"
import { Shield, Clock, MapPin, Smartphone } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAuditLogs } from "@/lib/security"
import dbConnect from "@/lib/database"
import SystemOption from "@/models/SystemOption"
import { cn } from "@/lib/utils"

export default async function SecurityPage() {
  const user = await getCurrentUser()
  if (!user) return null

  await dbConnect()
  const globalOpt = await SystemOption.findOne({ key: "bank:transfer.global.enabled" }).lean()
  const localOpt = await SystemOption.findOne({ key: "bank:transfer.local.enabled" }).lean()
  const globalEnabled = typeof globalOpt?.value === "boolean" ? (globalOpt.value as boolean) : true
  const localEnabled = typeof localOpt?.value === "boolean" ? (localOpt.value as boolean) : true

  const auditLogs = getAuditLogs(user._id.toString(), 10)

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-black">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">Security Center</h1>
            <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Monitor account security and activity</p>
          </div>
        </div>

        {/* Security Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2.5 p-4 border-b border-slate-50">
              <Shield className="h-4 w-4 text-black" />
              <h3 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">Account <span className="text-black">Status</span></h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "Account Verified", value: user.bankAccount.verified ? "Verified" : "Unverified", active: user.bankAccount.verified },
                { label: "Transfers", value: user.bankAccount.canTransfer ? "Enabled" : "Disabled", active: user.bankAccount.canTransfer },
                { label: "Two-Factor Auth", value: "Offline", active: false },
                { label: "International Transfers", value: globalEnabled ? "Enabled" : "Disabled", active: globalEnabled },
                { label: "Local Transfers", value: localEnabled ? "Enabled" : "Disabled", active: localEnabled },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">{item.label}</span>
                  <Badge className={cn(
                    "text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded border uppercase italic tracking-widest",
                    item.active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                  )}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2.5 p-4 border-b border-slate-50">
              <Smartphone className="h-4 w-4 text-black" />
              <h3 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">App <span className="text-black">Settings</span></h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "PIN Protection", value: "Active", active: true },
                { label: "Notifications", value: "Enabled", active: true },
                { label: "Session Timeout", value: "7 Days", active: true },
                { label: "App Status", value: "Online", active: true },
                { label: "Privacy Mode", value: "Standard", active: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">{item.label}</span>
                  <Badge className={cn(
                    "text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded border uppercase italic tracking-widest",
                    item.active ? "bg-slate-50 text-black border-slate-100" : "bg-slate-50 text-black border-slate-200"
                  )}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-50">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-black" />
              <h3 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">Activity <span className="text-black">Log</span></h3>
            </div>
            <span className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest italic opacity-60">Recent login history</span>
          </div>
          <div className="divide-y divide-slate-50">
            {auditLogs.length > 0 ? (
              auditLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-3 p-4 hover:bg-slate-50/60 transition-colors">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    log.success ? "bg-green-50 text-green-500" : "bg-red-50 text-black"
                  )}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-black text-black uppercase tracking-tight italic">{log.action.replace(/_/g, " ")}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-300" />
                      <p className="text-[10px] md:text-xs font-bold text-black uppercase tracking-widest opacity-60">{log.ipAddress}</p>
                      <span className="text-slate-200">·</span>
                      <p className="text-[10px] md:text-xs font-bold text-black uppercase tracking-widest opacity-60">{log.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded border flex-shrink-0 uppercase italic tracking-widest",
                    log.success ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                  )}>
                    {log.success ? "Authorized" : "Denied"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Clock className="h-6 w-6 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-black">No activity logs found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
