"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, TrendingUp, Home, CreditCard, Clock, ArrowRight, Building, Globe, Zap, Lock, BarChart3, Star, Users, CheckCircle2, MessageCircle, Wallet, Check, Dribbble, Bell, EyeOff, MoreHorizontal, User, Activity, Plus, ArrowUpRight, ArrowDownLeft, History as HistoryIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LiveMarketRates from './LiveMarketRates';

const bgImages = [
  "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601597111158-2fcee29ac902?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556742560-60a03f444fde?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621416848469-9c51813f810b?q=80&w=2070&auto=format&fit=crop"
];

const HomePages: React.FC = () => {
  return (
    <div className="bg-[#F8F9FE] text-black overflow-hidden font-sans selection:bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">

        {/* Background Wave System */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(230,230,230,0.8)_0%,white_50%)]"></div>

          <svg className="absolute -top-40 -left-40 w-[140%] h-auto opacity-[0.15] blur-[2px]" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              animate={{
                d: [
                  "M-100,300 Q200,150 500,300 T1100,300",
                  "M-100,320 Q200,170 500,320 T1100,320",
                  "M-100,300 Q200,150 500,300 T1100,300"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              d="M-100,300 Q200,150 500,300 T1100,300" stroke="black" strokeWidth="2" fill="none"
            />
            <motion.path
              animate={{
                d: [
                  "M-100,350 Q250,200 500,350 T1100,350",
                  "M-100,330 Q250,180 500,330 T1100,330",
                  "M-100,350 Q250,200 500,350 T1100,350"
                ]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              d="M-100,350 Q250,200 500,350 T1100,350" stroke="black" strokeWidth="3" fill="none"
            />
            <motion.path
              animate={{
                d: [
                  "M-100,250 Q150,100 500,250 T1100,250",
                  "M-100,270 Q150,120 500,270 T1100,270",
                  "M-100,250 Q150,100 500,250 T1100,250"
                ]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              d="M-100,250 Q150,100 500,250 T1100,250" stroke="black" strokeWidth="1" fill="none"
            />
            <motion.circle
              animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              cx="200" cy="200" r="100" stroke="black" strokeWidth="0.5"
            />
          </svg>

          {/* Floating Blobs for extra depth */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, -30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[black]/10 rounded-full blur-[150px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left Content - FinFlex Style */}
            <div className="flex flex-col items-center lg:items-start space-y-10 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="bg-gradient-to-br from-[black] to-[black] p-2 rounded-xl shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-[black] tracking-tighter">FinFlex</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-black"
                >
                  SCB Banking <br />
                  <span className="text-black">Mobile UI Kit</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-1/3 left-[45%] hidden lg:block"
                >
                  <Star className="w-12 h-12 text-[black] fill-current animate-pulse shadow-xl" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-5"
              >
                {[
                  'Figma Auto-layout',
                  'Fully Customizable',
                  'Reuse Components',
                  'Design System Included',
                  'Light and Dark Mode'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="h-7 w-7 rounded-full bg-[black] flex items-center justify-center text-white shadow-md shadow-black transition-transform group-hover:scale-110">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xl font-bold text-black tracking-tight">{feature}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="#get-kit">
                  <button className="bg-[black] hover:bg-[black] text-white px-10 py-5 rounded-[2rem] text-xl font-black transition-all hover:scale-105 hover:shadow-2xl shadow-xl flex items-center gap-4 group">
                    <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                      <Dribbble className="w-5 h-5" />
                    </div>
                    120+ Screens
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Mockup Showcase */}
            <div className="relative h-[800px] hidden lg:flex items-center justify-center">
              {/* Floating Star */}
              <div className="absolute top-[10%] right-[10%] animate-bounce duration-3000">
                <div className="w-6 h-6 bg-[black] rotate-45 shadow-xl"></div>
              </div>

              {/* Dark Phone (Redesigned to match image) */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: -4 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-0 top-20 z-20 w-[340px] h-[720px] rounded-[3.5rem] border-[10px] border-[#1A1A1A] bg-[#0A0A0A] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="h-full w-full bg-[#0A0A0A] flex flex-col pt-3">
                  {/* Dynamic Island */}
                  <div className="h-7 w-28 bg-black mx-auto rounded-3xl mb-4"></div>

                  <div className="px-5 flex flex-col h-[calc(100%-40px)]">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-slate-800 overflow-hidden ring-1 ring-white/10">
                          <img src="https://ui-avatars.com/api/?name=Tony+Lanez&background=random" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[10px] text-white/50 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">Tony Lanez</div>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <Bell className="w-4 h-4 text-white opacity-90" />
                      </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-[#1E568F] rounded-[2rem] p-6 text-white h-48 relative overflow-hidden shadow-2xl mb-6 shrink-0">
                      <div className="absolute top-0 right-0 w-full h-full opacity-20">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <motion.path
                            animate={{ d: ["M0 40 Q 25 20, 50 40 T 100 40", "M0 50 Q 25 30, 50 50 T 100 50", "M0 40 Q 25 20, 50 40 T 100 40"] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            d="M0 40 Q 25 20, 50 40 T 100 40" stroke="white" fill="none" strokeWidth="0.5"
                          />
                          <motion.path
                            animate={{ d: ["M0 60 Q 30 40, 60 60 T 120 60", "M0 70 Q 30 50, 60 70 T 120 70", "M0 60 Q 30 40, 60 60 T 120 60"] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            d="M0 60 Q 30 40, 60 60 T 120 60" stroke="white" fill="none" strokeWidth="0.5"
                          />
                        </svg>
                      </div>
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-black italic tracking-widest opacity-80">VISA</span>
                          <div className="text-right">
                            <p className="text-[8px] uppercase tracking-widest opacity-60">Available balance</p>
                            <p className="text-xl font-bold">2732,5 BYN</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-xl font-medium tracking-[0.15em] font-mono">4429 0080 2755 4499</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[6px] uppercase opacity-40">Expiration</p>
                              <p className="text-[10px] font-bold">04/25</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[6px] uppercase opacity-40">Cardholder</p>
                              <p className="text-[10px] font-bold">Tony Lanez</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3 mb-8 shrink-0">
                      <button className="flex-1 h-11 bg-[#1E568F] rounded-xl flex items-center justify-center gap-1.5 text-white text-[10px] font-bold">
                        <ArrowUpRight className="h-3.5 w-3.5" /> Transfer
                      </button>
                      <button className="flex-1 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-1.5 text-white text-[10px] font-bold">
                        <ArrowDownLeft className="h-3.5 w-3.5" /> Request
                      </button>
                      <div className="h-11 w-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                        <MoreHorizontal className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* My Favourites */}
                    <div className="space-y-4 mb-8 shrink-0">
                      <div className="flex justify-between items-center px-1">
                        <h4 className="text-[11px] font-bold text-white tracking-tight">My Favourites</h4>
                        <MoreHorizontal className="h-3.5 w-3.5 text-white/30" />
                      </div>
                      <div className="flex justify-between px-1">
                        {[
                          { name: 'Bernice', alias: 'berni_clise' },
                          { name: 'Maxine', alias: 'max.stone' },
                          { name: 'Anna', alias: 'gladelina' },
                          { name: 'Franci', alias: 'makro' }
                        ].map((fav, i) => (
                          <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className="h-11 w-11 rounded-full bg-slate-800 ring-2 ring-white/5 overflow-hidden">
                              <img src={`https://i.pravatar.cc/150?u=${fav.name}`} alt={fav.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-[8px] text-white text-center font-medium leading-tight">
                              {fav.name}<br /><span className="opacity-40 text-[7px]">{fav.alias}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additionally */}
                    <div className="space-y-3 flex-grow overflow-hidden">
                      <h4 className="text-[11px] font-bold text-white px-1 tracking-tight">Additionally</h4>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 border border-white/5">
                          <HistoryIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-white/90">History</span>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex justify-between items-center pt-4 pb-2 border-t border-white/5 mt-auto">
                      <div className="flex flex-col items-center gap-1 text-[#1E568F]">
                        <Home className="w-4 h-4" />
                        <span className="text-[8px] font-bold">Home</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[8px] font-bold">Payments</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[8px] font-bold">Investing</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="text-[8px] font-bold">More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Light Phone */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 10 }}
                animate={{ opacity: 1, x: 50, rotate: 4 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-0 z-10 w-[340px] h-[720px] rounded-[3rem] border-8 border-slate-200 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <div className="h-full w-full bg-white flex flex-col pt-4">
                  <div className="h-6 w-32 bg-slate-100 mx-auto rounded-b-2xl mb-8"></div>
                  <div className="px-6 space-y-6">
                    <h2 className="text-center font-black text-xl">My Card</h2>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] text-black font-bold uppercase tracking-widest">My Balance</span>
                        <div className="text-2xl font-black leading-none">$17,560,00</div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] text-black font-bold uppercase tracking-widest">Name</span>
                        <div className="text-sm font-black leading-none uppercase">Fajar Kun</div>
                      </div>
                    </div>
                    <div className="bg-[black] rounded-[2rem] p-6 text-white h-48 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" /> <span className="text-sm font-black">SCB Banking</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-black tracking-widest">**** **** **** 9867</span>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-black opacity-80"></div>
                          <div className="w-6 h-6 rounded-full bg-black opacity-80"></div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[black] text-white py-4 rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add New Card
                    </button>
                    <div className="flex justify-around items-center pt-8 opacity-40">
                      <Home /><Activity /><CreditCard className="text-[black] opacity-100" /><User />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-[10px] font-black tracking-[0.4em] uppercase text-black mb-8 opacity-60">SUPPORTING LEADING COMPANIES</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-all duration-700">
            {['TechVentures', 'GLOBAL CORP', 'SCB', 'SecureChain', 'NEXUS FINANCIAL'].map((brand, i) => (
              <div key={i} className="text-xl md:text-2xl font-black italic tracking-tighter text-black hover:text-black transition-colors cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Rates */}
      <LiveMarketRates />

      {/* Features Grid */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[black] font-black tracking-[0.3em] text-[10px] md:text-xs uppercase px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm italic">Why SCB BANKING</span>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-black italic">Banking Excellence Standards</h2>
            <p className="text-sm md:text-lg text-black max-w-2xl mx-auto font-bold uppercase tracking-widest opacity-60">We blend a legacy of trust with cutting-edge technology to deliver an unparalleled banking experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Ironclad Security', desc: 'Bank with confidence knowing your assets are protected by military-grade encryption and 24/7 fraud monitoring.' },
              { icon: Zap, title: 'Instant Processing', desc: 'Experience real-time transactions. Send and receive funds globally in seconds, not days.' },
              { icon: Globe, title: 'Global Access', desc: 'Manage your finances from anywhere in the world with our award-winning mobile and web platforms.' }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-black hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-200 shadow-sm">
                  <feature.icon className="w-7 h-7 text-[black]" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-black leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Highlight */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black to-black rounded-[2.5rem] blur-xl opacity-20"></div>
              <Image
                src="/investment-services-hero.jpg"
                alt="Investment Services"
                width={600}
                height={600}
                className="relative z-10 rounded-[2.5rem] shadow-2xl border border-slate-200"
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full border border-slate-200 p-4 flex items-center justify-center z-20 shadow-xl hidden lg:flex">
                <div className="text-center">
                  <p className="text-3xl font-black text-[black]">+28%</p>
                  <p className="text-[10px] text-black uppercase font-bold tracking-widest">Avg. Yield</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-tight text-black italic">
                Smart Investing for <br />
                <span className="text-[black]">Strategic Growth</span>
              </h2>
              <p className="text-sm md:text-lg text-black font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                Connect your capital to opportunities. SCB BANKING offers curated investment portfolios, real-time market insights, and personalized advisory services.
              </p>

              <ul className="space-y-4">
                {[
                  'AI-Driven Market Analysis',
                  'Diversified Global Portfolios',
                  'Zero-Commission Trading on Select Assets',
                  'Tax-Efficient Investment Structures'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-black font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[black]" /> {item}
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Link href="/services/investment">
                  <button className="bg-[black] text-white px-8 py-4 rounded-xl font-bold hover:bg-[black] transition-colors flex items-center gap-2 group">
                    Explore Investment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-32 bg-white relative border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-black italic">Comprehensive <span className="text-[black]">Services</span></h2>
              <p className="text-sm md:text-lg text-black max-w-md font-bold uppercase tracking-widest opacity-60">Everything you need to manage, grow, and protect your wealth.</p>
            </div>
            <Link href="/services">
              <span className="text-[black] font-bold uppercase tracking-widest text-sm hover:text-[black] transition-colors cursor-pointer flex items-center gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: 'Personal', link: '/services/personal', desc: 'Checking, savings, and everyday banking tools.', bgClass: 'bg-black/10', iconClass: 'text-black' },
              { icon: Building, title: 'Business', link: '/services/business', desc: 'Scalable solutions for startups to enterprises.', bgClass: 'bg-black/10', iconClass: 'text-black' },
              { icon: Home, title: 'Mortgages', link: '/services/mortgage', desc: 'Home loans with competitive rates and terms.', bgClass: 'bg-black/10', iconClass: 'text-[black]' },
              { icon: TrendingUp, title: 'Wealth', link: '/services/investment', desc: 'Strategic investment planning and management.', bgClass: 'bg-black/10', iconClass: 'text-black' }
            ].map((service, index) => (
              <div key={index} className="group relative p-8 rounded-[2rem] bg-white border border-slate-200 hover:border-black hover:shadow-xl transition-all duration-300">
                <div className={`h-14 w-14 rounded-xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-200 shadow-sm ${service.iconClass}`}>
                  <service.icon className={`w-7 h-7 ${service.iconClass}`} />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">{service.title}</h3>
                <p className="text-sm text-black mb-6 min-h-[40px]">{service.desc}</p>
                <Link href={service.link} className="inline-flex items-center justify-center w-full py-3 rounded-lg border border-slate-300 text-sm font-bold text-black hover:bg-[black] hover:text-white hover:border-[black] transition-all">
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
          <div className="rounded-[3rem] bg-white p-8 md:p-16 border border-slate-200 overflow-hidden relative shadow-sm">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-block p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <Lock className="w-8 h-8 text-[black]" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-black">
                  Security that Never Sleeps.
                </h2>
                <p className="text-black text-lg leading-relaxed">
                  We employ advanced biometric authentication, AI-driven fraud detection, and 256-bit encryption to ensure your assets are protected around the clock.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-black font-bold text-lg">Biometric Access</h4>
                    <p className="text-black text-sm">FaceID & Fingerprint</p>
                  </div>
                  <div>
                    <h4 className="text-black font-bold text-lg">Real-Time Alerts</h4>
                    <p className="text-black text-sm">Instant notifications</p>
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
                  <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                  <span className="text-xs font-bold text-black uppercase tracking-wider">System Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-black italic">Ready to <span className="text-[black]">Join?</span></h2>
          <p className="text-sm md:text-lg text-black max-w-2xl mx-auto font-bold uppercase tracking-widest opacity-60">
            Join over 500,000 customers who trust SCB BANKING for their financial future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full bg-[black] text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-[black] transition-all hover:scale-105 shadow-xl">
                Create Your Account
              </button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full bg-white border border-slate-300 text-black px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-100 transition-all">
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
