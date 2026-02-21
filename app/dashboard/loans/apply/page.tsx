"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Calculator, DollarSign, Clock, TrendingUp, ChevronLeft, Landmark, ShieldCheck } from "lucide-react"
import { getLoanTypeDetails, calculateMonthlyPayment } from "@/lib/utils/loan"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

const loanTypes = [
  { value: "personal", label: "Personal Loan", description: "For personal expenses, debt consolidation, etc." },
  { value: "business", label: "Business Loan", description: "For business expansion, equipment purchase, etc." },
  { value: "mortgage", label: "Mortgage Loan", description: "For purchasing residential or commercial property" },
  { value: "auto", label: "Auto Loan", description: "For purchasing vehicles" },
  { value: "education", label: "Education Loan", description: "For tuition fees and educational expenses" }
]

const employmentStatuses = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" }
]

export default function ApplyForLoanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    loanType: "",
    amount: "",
    duration: "",
    purpose: "",
    employmentStatus: "",
    annualIncome: "",
    existingLoans: "0"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [calculatedPayment, setCalculatedPayment] = useState<number | null>(null)

  const loanDetails = formData.loanType ? getLoanTypeDetails(formData.loanType) : null

  const handleCalculate = () => {
    if (formData.amount && formData.duration && loanDetails) {
      const monthlyPayment = calculateMonthlyPayment(
        parseFloat(formData.amount),
        loanDetails.interestRate,
        parseInt(formData.duration)
      )
      setCalculatedPayment(monthlyPayment)
    }
  }

  const handleApply = async () => {
    if (!formData.loanType || !formData.amount || !formData.duration || !formData.purpose || !formData.employmentStatus || !formData.annualIncome) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          duration: parseInt(formData.duration),
          annualIncome: parseFloat(formData.annualIncome),
          existingLoans: parseFloat(formData.existingLoans)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Loan application submitted! We will review it shortly.'
        })
        setTimeout(() => {
          router.push('/dashboard/loans')
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit application' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during submission' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }
  const inputCls = "h-9 bg-slate-50 border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:border-orange-400 placeholder:text-slate-300 shadow-none"

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:bg-white">
            <Link href="/dashboard/loans"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Loan Application</h1>
            <p className="text-xs text-slate-400">Request financial capital with competitive rates</p>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Alert className={cn(
                "border-none shadow-sm rounded-xl py-3 px-4 mb-2",
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              )}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className="text-xs font-semibold ml-2">
                  {message.text}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main Form Area */}
          <motion.div {...fadeIn} className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-slate-50 bg-slate-50/50">
                <Landmark className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900">Application Details</h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600">Loan Type</Label>
                  <Select value={formData.loanType} onValueChange={(value) => setFormData({ ...formData, loanType: value })}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-xs">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">Loan Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className={cn(inputCls, "pl-8")}
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                    {loanDetails && (
                      <p className="text-[10px] text-slate-400 font-medium">Range: ${loanDetails.minAmount.toLocaleString()} - ${loanDetails.maxAmount.toLocaleString()}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">Duration (Months)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        type="number"
                        placeholder="e.g. 12"
                        className={cn(inputCls, "pl-8")}
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>
                    {loanDetails && (
                      <p className="text-[10px] text-slate-400 font-medium">Max: {loanDetails.maxDuration} months</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">Employment Status</Label>
                    <Select value={formData.employmentStatus} onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}>
                      <SelectTrigger className={inputCls}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-xs">{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">Annual Gross Income</Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        type="number"
                        placeholder="Total per year"
                        className={cn(inputCls, "pl-8")}
                        value={formData.annualIncome}
                        onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600">Existing Monthly Liabilities</Label>
                  <Input
                    type="number"
                    placeholder="Current monthly loan payments"
                    className={inputCls}
                    value={formData.existingLoans}
                    onChange={(e) => setFormData({ ...formData, existingLoans: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600">Purpose of Loan</Label>
                  <Textarea
                    placeholder="Describe how you will use these funds..."
                    className="min-h-[100px] bg-slate-50 border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:border-orange-400 placeholder:text-slate-300 resize-none shadow-none"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <Button
                variant="ghost"
                className="flex-1 w-full h-10 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs hover:bg-white"
                onClick={() => router.back()}
              >
                Discard Application
              </Button>
              <Button
                onClick={handleApply}
                disabled={isSubmitting}
                className="flex-[2] w-full h-10 bg-slate-900 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
              >
                {isSubmitting ? 'Processing Submission...' : 'Submit Loan Request'}
              </Button>
            </div>
          </motion.div>

          {/* Calculator Sidebar */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-20">
              <div className="p-4 border-b border-slate-50 bg-orange-50/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-900">Loan Estimator</h3>
                </div>
                {loanDetails && (
                  <Badge className="bg-orange-500 text-white border-none px-1.5 py-0.5 text-[10px] font-bold">
                    {loanDetails.interestRate}% APR
                  </Badge>
                )}
              </div>

              <div className="p-5 space-y-6">
                {!formData.amount || !formData.duration || !loanDetails ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Fill in the amount and duration to see your estimated monthly repayment.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Repayment</p>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        {calculatedPayment ? `$${calculatedPayment.toFixed(2)}` : '—'}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Interest Rate</span>
                        <span className="font-bold text-slate-900">{loanDetails.interestRate}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Total Interest</span>
                        <span className="font-bold text-slate-900">
                          {calculatedPayment ? `$${(calculatedPayment * parseInt(formData.duration) - parseFloat(formData.amount)).toFixed(2)}` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                        <span className="text-slate-700 font-bold">Total Repayment</span>
                        <span className="font-black text-orange-600">
                          {calculatedPayment ? `$${(calculatedPayment * parseInt(formData.duration)).toFixed(2)}` : '—'}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCalculate}
                      size="sm"
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] h-8 border-none"
                    >
                      Refresh Estimates
                    </Button>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-relaxed">All loan applications are subject to credit verification and Danamon Bank internal policy guidelines.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
