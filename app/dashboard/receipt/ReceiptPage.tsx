"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Building,
  CheckCircle,
  DollarSign,
  Globe,
  Hash,
  User,
  ArrowLeft,
  Download,
  Info,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ReceiptPageProps {
  transfer: {
    txRef: string
    txDate: string
    amount: number
    currency: string
    txCharge: number
    txStatus: string
    bankHolder: string
    bankName: string
    bankAccount: string
    txRegion: string
    txReason?: string
    branchName?: string
    accountType?: string
    routingCode?: string
    identifier?: string
    chargesType?: string
  }
}

export default function ReceiptPage({ transfer }: ReceiptPageProps) {
  const formatCurrency = (value: number, currency = "USD") =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      value
    )

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })
      const margin = 20
      const pageWidth = 210
      const pageHeight = 297
      const usableWidth = pageWidth - margin * 2
      let y = 20

      const colors = {
        primary: [0, 28, 16], // Dark Emerald
        secondary: [99, 102, 241], // Emerald
        success: [99, 102, 241],
        text: [15, 23, 42],
        textMuted: [71, 85, 105],
        textLight: [148, 163, 184],
        border: [226, 232, 240],
        accent: [248, 250, 252],
      } as const

      // === HEADER / LOGO ===
      doc.setFillColor(...colors.primary)
      doc.rect(0, 0, pageWidth, 45, "F")

      // Logo Text
      doc.setFont("helvetica", "bold")
      doc.setFontSize(24)
      doc.setTextColor(255, 255, 255)
      doc.text("SCB BANKING", margin, 25)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(255, 255, 255)
      doc.text("BANK", margin + 45, 25)

      doc.setFontSize(10)
      doc.setTextColor(99, 102, 241)
      doc.setFont("helvetica", "bold")
      doc.text("ELECTRONIC RECEIPT", margin, 32)

      // Receipt Type
      doc.setFontSize(9)
      doc.setTextColor(148, 163, 184)
      doc.setFont("helvetica", "normal")
      doc.text("Official Banking Record", pageWidth - margin, 25, { align: "right" })
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Transaction Advice", pageWidth - margin, 32, { align: "right" })

      y = 60

      // === STATUS BANNER ===
      doc.setFillColor(...colors.accent)
      doc.roundedRect(margin, y, usableWidth, 20, 2, 2, "F")

      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.setFont("helvetica", "bold")
      doc.text("TRANSFER STATUS:", margin + 8, y + 12)

      doc.setTextColor(...colors.success)
      doc.setFontSize(11)
      doc.text("COMPLETED & VERIFIED", margin + 55, y + 12)

      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.setFont("helvetica", "normal")
      doc.text(`Ref: ${transfer.txRef}`, pageWidth - margin - 8, y + 12, { align: "right" })

      y += 35

      // === AMOUNT SECTION ===
      doc.setFontSize(10)
      doc.setTextColor(...colors.textMuted)
      doc.text("Transfer Amount", margin, y)
      y += 8

      doc.setFontSize(32)
      doc.setTextColor(...colors.text)
      doc.setFont("helvetica", "bold")
      doc.text(formatCurrency(transfer.amount, transfer.currency), margin, y + 10)

      doc.setFontSize(10)
      doc.setTextColor(...colors.textMuted)
      doc.setFont("helvetica", "normal")
      doc.text(`Date & Time: ${new Date(transfer.txDate).toLocaleString()}`, pageWidth - margin, y + 8, { align: "right" })

      y += 25

      // === DETAILS TABLE ===
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.2)
      doc.line(margin, y, pageWidth - margin, y)
      y += 12

      const addRow = (label: string, value: string, currentY: number) => {
        doc.setFontSize(9)
        doc.setTextColor(...colors.textMuted)
        doc.setFont("helvetica", "normal")
        doc.text(label, margin, currentY)

        doc.setTextColor(...colors.text)
        doc.setFont("helvetica", "bold")
        doc.text(value, pageWidth - margin, currentY, { align: "right" })

        doc.setDrawColor(...colors.border)
        doc.line(margin, currentY + 4, pageWidth - margin, currentY + 4)
        return currentY + 12
      }

      doc.setFontSize(12)
      doc.setTextColor(...colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text("Sender & Bank Info", margin, y)
      y += 10

      y = addRow("Bank Name", "SCB BANKING", y)
      y = addRow("Reference No", transfer.txRef, y)
      y = addRow("Transfer Type", transfer.txRegion || "International", y)

      y += 10
      doc.setFontSize(12)
      doc.setTextColor(...colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text("Receiver  Details", margin, y)
      y += 10

      y = addRow("Account Holder", transfer.bankHolder || "N/A", y)
      y = addRow("Target Institution", transfer.bankName || "N/A", y)
      y = addRow("Branch Location", transfer.branchName || "N/A", y)
      y = addRow("Routing / IFSC", transfer.routingCode || "N/A", y)
      y = addRow("Account Type", transfer.accountType || "N/A", y)
      y = addRow("Fee Allocation", transfer.chargesType || "SHA", y)
      y = addRow("Account Number", transfer.bankAccount || "N/A", y)

      y += 10
      doc.setFontSize(12)
      doc.setTextColor(...colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text("Financial Details", margin, y)
      y += 10

      y = addRow("Transfer Amount", formatCurrency(transfer.amount, transfer.currency), y)
      y = addRow("Service Fee", formatCurrency(transfer.txCharge || 0, transfer.currency), y)

      doc.setFillColor(...colors.primary)
      doc.roundedRect(margin, y - 2, usableWidth, 12, 1, 1, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text("TOTAL AMOUNT", margin + 5, y + 6)
      doc.text(formatCurrency((transfer.amount || 0) + (transfer.txCharge || 0), transfer.currency), pageWidth - margin - 5, y + 6, { align: "right" })

      y += 25

      // === MEMO ===
      if (transfer.txReason) {
        doc.setFillColor(...colors.accent)
        doc.roundedRect(margin, y, usableWidth, 20, 2, 2, "F")
        doc.setTextColor(...colors.textMuted)
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.text("DESCRIPTION:", margin + 5, y + 7)
        doc.setTextColor(...colors.text)
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.text(`"${transfer.txReason}"`, margin + 5, y + 14)
      }

      // === FOOTER ===
      const footerY = pageHeight - 30
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.5)
      doc.line(margin, footerY, pageWidth - margin, footerY)

      doc.setFontSize(8)
      doc.setTextColor(...colors.textLight)
      doc.setFont("helvetica", "normal")
      doc.text("SCB BANKING", pageWidth / 2, footerY + 8, { align: "center" })
      doc.text("This document is an official record of a financial transfer. Issued by SCB BANKING.", pageWidth / 2, footerY + 12, { align: "center" })
      doc.text("SCB BANKING © 2026 | Secure • Authorized • Verified", pageWidth / 2, footerY + 16, { align: "center" })

      // Watermark
      doc.setTextColor(245, 245, 245)
      doc.setFontSize(50)
      doc.setFont("helvetica", "bold")
      doc.text("VERIFIED", pageWidth / 2, pageHeight / 2 + 20, { align: "center", angle: 45 })

      const timestamp = new Date().toISOString().slice(0, 10)
      doc.save(`SCB_Receipt_${transfer.txRef}_${timestamp}.pdf`)
    } catch (err) {
      console.error("Receipt generation failed:", err)
      alert("Failed to generate receipt PDF.")
    }
  }

  const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-black hover:bg-white">
              <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter italic">Transaction Receipt</h1>
              <p className="text-sm md:text-base text-black font-bold uppercase tracking-widest opacity-60">Official record for transfer {transfer.txRef}</p>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider hidden sm:flex">
            Status: Completed
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Main Receipt */}
          <motion.div {...fadeIn} className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col items-center text-center border-b border-slate-50">
                <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center text-black mb-4 shadow-sm border border-emerald-100">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight italic">Transfer <span className="text-black">Successful</span></h2>
                <p className="text-[10px] md:text-xs text-black mt-2 uppercase tracking-widest font-black opacity-60">{new Date(transfer.txDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>

                <div className="mt-8">
                  <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-[0.2em] mb-2 opacity-60">Amount Disbursed</p>
                  <p className="text-5xl md:text-7xl font-black text-black tracking-tighter italic">
                    {formatCurrency(transfer.amount, transfer.currency)}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: "Account Holder", value: transfer.bankHolder, icon: User },
                  { label: "Target Bank", value: transfer.bankName, icon: Building },
                  { label: "Account Number", value: transfer.bankAccount, icon: Hash },
                  { label: "Transfer Region", value: transfer.txRegion, icon: Globe },
                  { label: "Service Fee", value: formatCurrency(transfer.txCharge, transfer.currency), icon: DollarSign },
                  { label: "Reference ID", value: transfer.txRef, icon: FileText, mono: true },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </p>
                    <p className={cn("text-sm md:text-base font-black text-black uppercase tracking-tight italic", item.mono && "font-mono text-xs md:text-sm tracking-normal not-italic")}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {transfer.txReason && (
                <div className="px-6 md:px-8 pb-8">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-widest mb-1.5 opacity-60">Description</p>
                    <p className="text-sm md:text-base text-black font-bold italic tracking-tight">"{transfer.txReason}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-black rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-20 h-20 text-white" />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-10 w-10 bg-black/10 rounded-lg flex items-center justify-center text-emerald-400 border border-black/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black uppercase tracking-widest italic tracking-tight">Compliance <span className="text-emerald-400">Verified</span></h4>
                  <p className="text-[10px] md:text-xs text-black font-bold uppercase tracking-widest opacity-60 leading-relaxed mt-1">This receipt serves as an official verified record of your financial transfer. Issued by SCB BANKING.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-black text-black uppercase tracking-tight italic">Receipt <span className="text-black">Actions</span></h3>
                <p className="text-[10px] md:text-xs text-black font-black uppercase tracking-widest opacity-60">Manage this transaction record</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleDownload}
                  className="w-full h-12 bg-black hover:bg-black text-white font-black rounded-xl text-sm uppercase tracking-widest transition-all italic"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="w-full h-12 border-slate-200 text-black font-black rounded-xl text-sm uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                >
                  <Link href="/dashboard/transfer">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    New Transfer
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="w-full h-12 border-slate-200 text-black font-black rounded-xl text-sm uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                >
                  <Link href="/dashboard">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-black shrink-0 mt-0.5" />
                <p className="text-[11px] text-orange-800 leading-relaxed">
                  Need to report a problem with this transaction? Please contact our <Link href="/dashboard/support/chat-apps" className="underline font-bold">support team</Link> with your reference ID.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
