import type React from "react"
import { CreditCard, Building, TrendingUp, Home, Shield, Calculator, CheckCircle, Zap, ArrowRight, BarChart3, Globe, Lock } from "lucide-react"
import Link from "next/link"

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-50/50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-50/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Zap className="w-4 h-4" /> Unified Financial Ecosystem
          </div>
          <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tighter mb-8 text-slate-900 uppercase italic">
            Services for a <br />
            <span className="text-orange-600">
              Sustainable Legacy.
            </span>
          </h1>
          <p className="text-sm md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 font-bold uppercase tracking-widest opacity-60">
            Danamon Bank provides a suite of elite financial frameworks designed to empower your journey. From personal wealth to institutional leverage, we orchestrate success at every scale.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: CreditCard,
                title: "Personal Banking",
                description: "Elite liquidity management and high-yield instruments for your lifestyle.",
                features: ["Zero-Fee Checking", "Smart Savings Units", "Instant Credit Lines", "Metal Debit Cards"],
                href: "/services/personal",
                color: "text-orange-600",
                bg: "bg-orange-50"
              },
              {
                icon: Building,
                title: "Business Banking",
                description: "Scalable commercial solutions engineered for corporate acceleration.",
                features: ["Operational Hubs", "Commercial Leverage", "Merchant Gateways", "Cash Flow Optimization"],
                href: "/services/business",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: TrendingUp,
                title: "Investment Services",
                description: "AI-driven market analysis and expert portfolio architecture.",
                features: ["Quantitative Trading", "Estate Structuring", "Mutual Fund Access", "Direct Advisories"],
                href: "/services/investment",
                color: "text-purple-600",
                bg: "bg-purple-50"
              },
              {
                icon: Home,
                title: "Mortgage Services",
                description: "Sophisticated real estate financing for high-value acquisitions.",
                features: ["Jumbo Asset Loans", "Dynamic Refinancing", "First-Buyer Programs", "Custom Amortization"],
                href: "/services/mortgage",
                color: "text-orange-600",
                bg: "bg-orange-50"
              },
              {
                icon: Shield,
                title: "Asset Protection",
                description: "Comprehensive risk mitigation and insurance frameworks.",
                features: ["Key-Man Insurance", "Liability Shelters", "High-Value Asset Cover", "Health Ecosystems"],
                href: "/services/insurance",
                color: "text-red-600",
                bg: "bg-red-50"
              },
              {
                icon: Calculator,
                title: "Strategic Planning",
                description: "Professional multi-generational financial engineering.",
                features: ["Retirement Matrix", "Tax Efficiency Hub", "Estate Succession", "Education Anchors"],
                href: "/services/planning",
                color: "text-cyan-600",
                bg: "bg-cyan-50"
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-200/60 hover:border-orange-200 hover:bg-white transition-all duration-500 hover:-translate-y-2 flex flex-col hover:shadow-2xl hover:shadow-orange-500/5 shadow-sm"
              >
                <div className={`h-20 w-20 rounded-3xl ${service.bg} border border-white flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-sm`}>
                  <service.icon className={`w-10 h-10 ${service.color}`} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight uppercase tracking-tighter">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-slate-500 mb-10 flex-grow leading-relaxed font-bold uppercase tracking-widest opacity-60">{service.description}</p>
                <ul className="space-y-4 mb-10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle className={`w-4 h-4 ${service.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className="block w-full">
                  <button className="w-full py-5 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-700 transition-all text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20">
                    Explore Solutions
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Infrastructure */}
      <section className="py-24 bg-slate-50 relative border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-orange-600 mb-6">Danamon Platform</p>
              <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight uppercase italic">Fortified <span className="text-orange-600">Digital Architecture</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
                Behind every service is a military-grade infrastructure designed to protect your assets while providing instant global access.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-sm">
                    <Lock className="w-5 h-5 text-orange-600" /> AES-256
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption Standards</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-sm">
                    <BarChart3 className="w-5 h-5 text-orange-600" /> Real-Time
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Auditing</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-slate-200 bg-white p-1">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
                  alt="Data Visualization"
                  className="w-full h-[400px] object-cover rounded-[2.8rem] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative rounded-[4rem] bg-slate-50 p-12 md:p-24 text-center space-y-10 overflow-hidden border border-slate-200 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight relative z-10 uppercase italic">Elevate <br /> <span className="text-orange-600 not-italic uppercase">Your Potential Today.</span></h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto relative z-10 font-medium">
              Join the institutional-grade banking revolution. It takes less than 3 minutes to start your legacy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link href="/register">
                <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-12 py-6 rounded-2xl text-xl font-black transition-all hover:scale-105 shadow-xl shadow-orange-600/20 uppercase tracking-tight">
                  Open Account
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 px-12 py-6 rounded-2xl text-xl font-black border border-slate-200 transition-all shadow-sm uppercase tracking-tight">
                  Speak with an Expert
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
