import { Shield, Users, Award, TrendingUp, Zap, ArrowRight, Target, Globe } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

const AboutPage: React.FC = () => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-bold tracking-wider mb-8 animate-fade-in uppercase">
            <Zap className="w-4 h-4" /> Our Legacy & Vision
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-8 text-slate-900 uppercase">
            Pioneering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-700 italic">
              Future of Trust.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up font-medium">
            For over five decades, FIRST STATE BANK has been more than just a financial
            institution — we have been a trusted partner in helping individuals,
            families, and businesses grow and secure their futures.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
            {[
              { number: "500K+", label: "Active Clients" },
              { number: "$2B+", label: "Assets Managed" },
              { number: "50+", label: "Years Excellence" },
              { number: "100+", label: "Global Hubs" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&auto=format&fit=crop&q=60"
                  alt="Our Team"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                Our <span className="text-orange-600 italic">Genesis</span>
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
                <p>
                  At FIRST STATE BANK, we believe that finance is not only about numbers — it’s
                  about people. That’s why we focus on building genuine relationships
                  with our customers, offering personalized solutions designed to
                  meet their unique needs.
                </p>
                <p>
                  Whether it’s securing your first home, planning for retirement, or
                  scaling a business, our team is here to walk with you every step of the way.
                  With a foundation built on trust, innovation, and sustainability,
                  we are committed to creating opportunities.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/contact">
                  <button className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-sm group">
                    Join our journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="p-12 rounded-[3rem] bg-white border border-slate-200 shadow-xl hover:border-orange-200 transition-all duration-500">
              <div className="h-16 w-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Empowering individuals and businesses by providing exceptional financial solutions
                rooted in integrity, innovation, and customer-centricity. We believe banking
                should not just be transactional — it should be transformational. Through transparent
                practices and community investment, we strive to be more than a bank — we aim
                to be a trusted financial partner for life.
              </p>
            </div>

            <div className="p-12 rounded-[3rem] bg-white border border-slate-200 shadow-xl hover:border-blue-200 transition-all duration-500">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-8">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                A future where banking is seamless, accessible to all, and a force for
                social and environmental good. Our aim is to lead in sustainable finance,
                digital innovation, and community enrichment, becoming the go-to
                institution for clients seeking financial growth with purpose. We see
                a world where each investment carries meaning — driving both prosperity
                and well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 text-slate-900">
            <p className="text-xs font-black tracking-[0.5em] uppercase text-orange-600 mb-4">Core Principles</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">The FIRST STATE BANK Standard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Integrity",
                description: "Upholding the highest ethical standards in all we do, ensuring transparency and accountability.",
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-100"
              },
              {
                icon: Users,
                title: "Customer Focus",
                description: "Placing you at the center. Every decision is guided by empathy and delivering value.",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "Relentless in our pursuit of quality — from efficiency to product innovation.",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-100"
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "Embracing evolution and creative thinking to deliver smarter financial solutions.",
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-100"
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-orange-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 ${value.bg} ${value.border} border rounded-3xl mb-8 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-10 h-10 ${value.color}`} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                  {value.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative rounded-[3rem] bg-white p-12 md:p-20 text-center space-y-8 overflow-hidden border border-slate-200 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight relative z-10 text-slate-900 uppercase">Start Your Legacy <br /> with First State Bank</h2>
            <p className="text-slate-600 max-w-xl mx-auto relative z-10 font-medium">
              Join thousands of clients who trust us with their financial future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link href="/register">
                <button className="w-full sm:w-auto bg-orange-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-orange-700 transition-all hover:scale-105 shadow-xl shadow-orange-600/20">
                  Get Started
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all shadow-sm">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
