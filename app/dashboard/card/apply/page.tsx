"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, CheckCircle, AlertCircle, ChevronLeft, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const cardOptions = [
  {
    type: "debit" as const,
    vendor: "visacard" as const,
    name: "Visa Debit Card",
    description: "Everyday purchases with direct access to your account.",
    features: ["No annual fees", "Contactless payments", "Global acceptance"]
  },
  {
    type: "debit" as const,
    vendor: "mastercard" as const,
    name: "MasterCard Debit",
    description: "Enhanced security for global shopping and ATM access.",
    features: ["Zero liability protection", "Purchase protection", "ATM choice"]
  },
  {
    type: "credit" as const,
    vendor: "visacard" as const,
    name: "Visa Credit Card",
    description: "Build credit and enjoy flexible spending limits.",
    features: ["Cashback rewards", "Travel insurance", "Credit building"]
  },
  {
    type: "credit" as const,
    vendor: "amex" as const,
    name: "American Express",
    description: "Premium credit with exclusive rewards and concierge.",
    features: ["Premium rewards", "Lounge access", "Travel perks"]
  }
]

export default function ApplyForCardPage() {
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleApply = async () => {
    if (!selectedCard) {
      setMessage({ type: 'error', text: 'Please select a card type' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const [cardType, vendor] = selectedCard.split('-')

      const response = await fetch('/api/cards/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardType,
          vendor
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Application submitted! We will process it shortly.'
        })
        setTimeout(() => {
          router.push('/dashboard/card')
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

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-4 md:p-6 pt-16 lg:pt-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-black hover:bg-white">
            <Link href="/dashboard/card"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-base font-bold text-black">Request New Card</h1>
            <p className="text-xs text-black">Choose a card that fits your lifestyle</p>
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

        <RadioGroup value={selectedCard} onValueChange={setSelectedCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardOptions.map((card, index) => (
            <motion.div key={index} {...fadeIn} transition={{ delay: index * 0.05 }}>
              <RadioGroupItem
                value={`${card.type}-${card.vendor}`}
                id={`card-${index}`}
                className="sr-only"
              />
              <Label
                htmlFor={`card-${index}`}
                className={cn(
                  "block cursor-pointer transition-all duration-300 rounded-xl border p-5 relative overflow-hidden h-full",
                  selectedCard === `${card.type}-${card.vendor}`
                    ? 'bg-slate-50/30 border-orange-400 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                    selectedCard === `${card.type}-${card.vendor}` ? "bg-black text-white" : "bg-slate-50 text-black"
                  )}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <Badge className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                    card.type === 'debit' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                  )}>
                    {card.type}
                  </Badge>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="text-sm font-bold text-black">{card.name}</h3>
                  <p className="text-xs text-black leading-relaxed font-medium">{card.description}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50">
                  {card.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-orange-400" />
                      <span className="text-[10px] text-black font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedCard === `${card.type}-${card.vendor}` && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-black">
                    <CheckCircle className="h-5 w-5 fill-white" />
                  </motion.div>
                )}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>

        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-100/50 px-4 py-3 rounded-xl border border-slate-200 flex-1 w-full">
            <ShieldCheck className="h-5 w-5 text-black" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-black uppercase tracking-wider">Identity Protected</p>
              <p className="text-[10px] text-black truncate">Application is secured by 256-bit encryption</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:w-32 h-11 border-slate-200 text-black font-bold rounded-lg text-xs"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={isSubmitting || !selectedCard}
              className="flex-[2] sm:w-48 h-11 bg-black hover:bg-black text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
            >
              {isSubmitting ? 'Processing...' : 'Submit Application'}
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
