"use client"

import { motion } from "framer-motion"
import { Home, Key, Calculator, MapPin, Calendar, Zap, ArrowRight, ShieldCheck, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MortgageServicesPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      title: "First-time Acquisition",
      description: "Navigating affordability, down payments, and timelines with high-precision guidance and competitive rates.",
      icon: Key,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Equity Refinance",
      description: "Lower your monthly commitment or tap into property value for strategic capital deployment.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ]

  const metrics = [
    { title: "Rate Clarity", desc: "Real-time comparison of fixed-rate stability vs ARM flexibility protocols.", icon: Calculator },
    { title: "Closing Speed", desc: "Streamlined documentation and digital signatures for rapid settlement cycles.", icon: Zap },
    { title: "Local Gateway", desc: "Specialists who understand regional market dynamics and underwriting nuances.", icon: MapPin }
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-500/30">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Landmark className="w-3 h-3" /> Real Estate Finance Protocol
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter lowercase">
              mortgage <span className="text-orange-600 italic">services</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
              Clarity from pre-qualification to the final signature. Secure your cornerstone with First State.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-black px-10 h-16 rounded-2xl shadow-xl shadow-orange-600/20 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Pre-Qualify Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-200 bg-white/50 hover:bg-slate-50 text-slate-600 font-black px-10 h-16 rounded-2xl backdrop-blur-md text-lg uppercase tracking-tight shadow-sm" asChild>
              <Link href="/about">Rate Analysis</Link>
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-orange-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Scroll Down</p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div {...fadeInUp} className="lg:col-span-12 text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none uppercase">
                Precision <span className="text-orange-600 italic">Home Financing</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
                From first-time buyers to seasoned homeowners, we provide clarity and competitive options.
                Our process is engineered to minimize friction and maximize transparency at every stage of the lifecycle.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-7">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-slate-200 group shadow-2xl">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Prime Property" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-60" />
                <div className="absolute top-8 left-8">
                  <div className="px-4 py-2 rounded-2xl bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Global Asset Hub</div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="lg:col-span-5 space-y-8">
              <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 backdrop-blur-lg space-y-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Secure Underwriting</h3>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">Our underwriting protocol utilizes advanced data aggregation to provide faster commitments and more flexible term structures.</p>
                <ul className="space-y-3">
                  {[
                    "Zero Hidden Documentation Fees",
                    "Automated Identity Verification",
                    "Real-time Rate Locking",
                    "Digital Escrow Integration"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600" /> {item}
                    </li>
                  ))}
                </ul>
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 p-12 space-y-6">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{feature.title}</h3>
                    <p className="text-slate-300 font-medium leading-relaxed max-w-sm">{feature.description}</p>
                  </div>
                  <Button variant="ghost" className="text-orange-400 font-black p-0 h-auto hover:bg-transparent group-hover:translate-x-2 transition-transform">
                    Initialize Protocol <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-orange-100 transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-8 border border-orange-100 group-hover:scale-110 transition-transform shadow-sm">
                  <m.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-slate-900 lowercase tracking-tighter mb-2">{m.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 relative overflow-hidden bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div {...fadeInUp} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic relative z-10">
              Secure your <span className="text-orange-600 not-italic uppercase">Ground Zero</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium relative z-10">
              Join the future of residency financing with First State's automated mortgage gateway.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-6 relative z-10">
            <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700 font-black px-12 h-16 rounded-2xl shadow-xl shadow-orange-600/20 text-lg uppercase tracking-tight" asChild>
              <Link href="/register">Start Application</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-slate-900 border-slate-200 bg-white hover:bg-slate-50 font-black px-12 h-16 rounded-2xl text-lg uppercase tracking-tight shadow-sm" asChild>
              <Link href="/contact">Speak to Consultant</Link>
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
