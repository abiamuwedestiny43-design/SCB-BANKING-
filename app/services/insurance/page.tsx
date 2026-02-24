"use client"

import { motion } from "framer-motion"
import { Shield, HeartPulse, Home, Car, PhoneCall, CheckCircle2, Zap, ArrowRight, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InsurancePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      title: "Life & Health",
      description: "Explore term and permanent life coverage, disability, and supplemental options that protect income and wellbeing.",
      icon: HeartPulse,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Home & Auto",
      description: "Bundle options, policy comparisons, and claim support ensure your assets are protected without overpaying.",
      icon: Car,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  ]

  const metrics = [
    { title: "Clear Terms", desc: "We demystify exclusions, deductibles, and limits so you can choose confidently.", icon: Shield },
    { title: "Claims Support", desc: "When something happens, we coordinate quickly to restore balance with minimal friction.", icon: PhoneCall },
    { title: "Integrated Billing", desc: "Manage premiums and renewals in the same place you manage your cash flow.", icon: CheckCircle2 }
  ]

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black/30">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-32 bg-white">
        {/* Minimal Orbital Structure */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-100 rounded-full opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-100 rounded-full opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-black text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Zap className="w-3 h-3" /> Risk Mitigation Protocol
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter lowercase">
              asset <span className="text-black italic">protection</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-black font-medium leading-relaxed">
              Coverage that fits your life. Clear terms, superior value, and integrated management for your peace of mind.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button size="lg" className="bg-black hover:bg-black text-white font-black px-10 h-16 rounded-2xl shadow-xl shadow-black/20 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Get Protected</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-200 bg-white/50 hover:bg-slate-50 text-black font-black px-10 h-16 rounded-2xl backdrop-blur-md text-lg uppercase tracking-tight shadow-sm" asChild>
              <Link href="/about">Policy Analysis</Link>
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-black" />
          <p className="text-[10px] font-black uppercase tracking-widest text-black">Scroll Down</p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-12 text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-8 leading-none uppercase">
                Comprehensive <span className="text-black italic">Safeguards</span>
              </h2>
              <p className="text-xl text-black max-w-4xl mx-auto font-medium leading-relaxed">
                Protecting your estate requires more than just a policy. It requires a strategic framework
                that adapts to your evolving lifestyle and institutional requirements.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-12">
              <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden border border-slate-200 group shadow-3xl">
                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Insurance Protection" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-60" />
                <div className="absolute top-12 left-12">
                  <div className="px-6 py-3 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl">Elite Risk Ecosystem</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.2 }}
                className="group relative h-[600px] rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl bg-white"
              >
                <img
                  src={feature.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt={feature.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 p-12 space-y-6">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{feature.title}</h3>
                    <p className="text-slate-300 font-medium leading-relaxed max-w-sm">{feature.description}</p>
                  </div>
                  <Button variant="ghost" className="text-orange-400 font-black p-0 h-auto hover:bg-transparent group-hover:translate-x-2 transition-transform">
                    Initialize Coverage <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability Section */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-slate-100 transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-black mb-8 border border-slate-100 group-hover:scale-110 transition-transform shadow-sm">
                  <m.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-black lowercase tracking-tighter mb-2">{m.title}</h4>
                <p className="text-sm text-black font-medium leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 relative overflow-hidden bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase italic relative z-10">
              Fortify your <span className="text-black not-italic uppercase">Legacy Today</span>
            </h2>
            <p className="text-xl text-black font-medium relative z-10">
              Consult with our risk specialists and ensure your assets are protected against the unknown.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-6 relative z-10">
            <Button size="lg" className="bg-black text-white hover:bg-black font-black px-12 h-16 rounded-2xl shadow-xl shadow-black/20 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Open Protection Hub</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-black border-slate-200 bg-white hover:bg-slate-50 font-black px-12 h-16 rounded-2xl text-lg uppercase tracking-tight shadow-sm" asChild>
              <Link href="/contact">Speak to Underwriter</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
