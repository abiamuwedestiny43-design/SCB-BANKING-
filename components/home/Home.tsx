import { ChevronDown, Shield, TrendingUp, Home, CreditCard, Clock, ArrowRight, Building, Globe, Zap, Lock, BarChart3, Star, Users, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LiveMarketRates from './LiveMarketRates';

const HomePages: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-36 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/60 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/80 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-200 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-black tracking-widest uppercase animate-fade-in">
                <Zap className="w-3 h-3 fill-current" /> First State Bank
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-slate-900">
                Banking for the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
                  Modern Era.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience the convergence of traditional security and digital innovation. First State Bank empowers your financial journey with precision and care.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-2">
                <Link href="/register">
                  <button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-[#020617] px-8 py-4 rounded-xl text-lg font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 group">
                    Open Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl text-lg font-bold border border-slate-300 transition-all hover:border-indigo-500 flex items-center justify-center gap-2">
                    Our Story
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-slate-200 mt-8">
                <div>
                  <div className="flex -space-x-3 mb-2 justify-center lg:justify-start">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center overflow-hidden">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest"><span className="text-slate-900">500k+</span> Trusted Users</p>
                </div>
                <div className="h-10 w-[1px] bg-slate-300 hidden sm:block"></div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1 mb-2 text-indigo-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">4.9/5 Rating</p>
                </div>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 hover:scale-[1.02] bg-[#0f172a]">
                <Image
                  src="/business-banking-hero.jpg"
                  alt="First State Bank - Professional Banking Services"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">First State Premium</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">**** 8842</p>
                      </div>
                    </div>
                    <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[75%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Spending Limit</span>
                    <span>$50,000 / Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">Scroll</p>
          <ChevronDown className="w-5 h-5 animate-bounce text-indigo-400" />
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 mb-8 opacity-60">Powering Leading Enterprises</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-all duration-700">
            {['TechVentures', 'GLOBAL CORP', 'FirstState', 'SecureChain', 'NEXUS FINANCIAL'].map((brand, i) => (
              <div key={i} className="text-xl md:text-2xl font-black italic tracking-tighter text-slate-700 hover:text-indigo-600 transition-colors cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Rates */}
      <LiveMarketRates />

      {/* Features Grid */}
      <section className="py-32 relative bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <span className="text-indigo-600 font-bold tracking-wider text-xs uppercase px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200">Why First State Bank</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">The Standard of Excellence</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">We combine heritage with cutting-edge technology to deliver a banking experience that is second to none.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Ironclad Security', desc: 'Bank with confidence knowing your assets are protected by military-grade encryption and 24/7 fraud monitoring.' },
              { icon: Zap, title: 'Instant Processing', desc: 'Experience real-time transactions. Send and receive funds globally in seconds, not days.' },
              { icon: Globe, title: 'Global Access', desc: 'Manage your finances from anywhere in the world with our award-winning mobile and web platforms.' }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-indigo-200">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Highlight */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-20"></div>
              <Image
                src="/investment-services-hero.jpg"
                alt="Investment Services"
                width={600}
                height={600}
                className="relative z-10 rounded-[2.5rem] shadow-2xl border border-slate-200"
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full border border-slate-200 p-4 flex items-center justify-center z-20 shadow-xl hidden lg:flex">
                <div className="text-center">
                  <p className="text-3xl font-black text-indigo-600">+28%</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg. Yield</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
                Smart Investing for <br />
                <span className="text-indigo-600 italic">Strategic Growth</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Connect your capital to opportunities. First State Bank offers curated investment portfolios, real-time market insights, and personalized advisory services.
              </p>

              <ul className="space-y-4">
                {[
                  'AI-Driven Market Analysis',
                  'Diversified Global Portfolios',
                  'Zero-Commission Trading on Select Assets',
                  'Tax-Efficient Investment Structures'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" /> {item}
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Link href="/services/investment">
                  <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    Explore Investments <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-32 bg-slate-50 relative border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Comprehensive Services</h2>
              <p className="text-slate-600 max-w-md">Everything you need to manage, grow, and protect your wealth.</p>
            </div>
            <Link href="/services">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm hover:text-indigo-700 transition-colors cursor-pointer flex items-center gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: 'Personal', link: '/services/personal', desc: 'Checking, savings, and everyday banking tools.', bgClass: 'bg-emerald-500/10', iconClass: 'text-emerald-400' },
              { icon: Building, title: 'Business', link: '/services/business', desc: 'Scalable solutions for startups to enterprises.', bgClass: 'bg-blue-500/10', iconClass: 'text-blue-400' },
              { icon: Home, title: 'Mortgages', link: '/services/mortgage', desc: 'Home loans with competitive rates and terms.', bgClass: 'bg-indigo-500/10', iconClass: 'text-indigo-400' },
              { icon: TrendingUp, title: 'Wealth', link: '/services/investment', desc: 'Strategic investment planning and management.', bgClass: 'bg-purple-500/10', iconClass: 'text-purple-400' }
            ].map((service, index) => (
              <div key={index} className="group relative p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                <div className={`h-14 w-14 rounded-xl ${service.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border ${service.iconClass.replace('text-', 'border-')}`}>
                  <service.icon className={`w-7 h-7 ${service.iconClass}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 mb-6 min-h-[40px]">{service.desc}</p>
                <Link href={service.link} className="inline-flex items-center justify-center w-full py-3 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[3rem] bg-gradient-to-b from-slate-50 to-white p-8 md:p-16 border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-block p-3 rounded-xl bg-indigo-100 border border-indigo-200">
                  <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-slate-900">
                  Security that Never Sleeps.
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  We employ advanced biometric authentication, AI-driven fraud detection, and 256-bit encryption to ensure your assets are protected around the clock.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg">Biometric Access</h4>
                    <p className="text-slate-500 text-sm">FaceID & Fingerprint</p>
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg">Real-Time Alerts</h4>
                    <p className="text-slate-500 text-sm">Instant notifications</p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl">
                <Image
                  src="/personal-banking-hero.jpg"
                  alt="Secure Banking"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Ready to Switch?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join over 500,000 customers who trust First State Bank with their financial future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full bg-indigo-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl">
                Create Your Account
              </button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full bg-white border border-slate-300 text-slate-900 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-100 transition-all">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePages;
