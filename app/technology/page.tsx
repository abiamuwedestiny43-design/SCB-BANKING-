"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Shield, Server, Lock, Zap, Globe, Database, Cloud, CheckCircle2, ArrowRight, Cpu, Network, HardDrive } from 'lucide-react';

export default function TechnologyPage() {
    return (
        <div className="bg-white text-slate-900 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-200/30 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-black tracking-widest uppercase">
                            <Server className="w-3 h-3" /> Banking Infrastructure
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-slate-900">
                            Your Money, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700">
                                Perfectly Protected
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Our state-of-the-art banking infrastructure combines cutting-edge security, lightning-fast performance, and 99.99% uptime to serve you better.
                        </p>
                    </div>

                    {/* Main Banking System Image */}
                    <div className="relative group max-w-5xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl">
                            <Image
                                src="/business-banking-hero.jpg"
                                alt="First State Bank - Advanced Banking Infrastructure"
                                width={1200}
                                height={700}
                                className="w-full h-auto object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                            {/* Overlay Stats */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-5 h-5 text-emerald-400" />
                                            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Uptime</p>
                                        </div>
                                        <p className="text-3xl font-black text-white">99.99%</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-5 h-5 text-orange-400" />
                                            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Security</p>
                                        </div>
                                        <p className="text-3xl font-black text-white">AES-256</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Database className="w-5 h-5 text-blue-400" />
                                            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Transactions</p>
                                        </div>
                                        <p className="text-3xl font-black text-white">10M+</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Globe className="w-5 h-5 text-purple-400" />
                                            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Global</p>
                                        </div>
                                        <p className="text-3xl font-black text-white">24/7</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-orange-600 font-bold tracking-wider text-xs uppercase px-3 py-1 rounded-full bg-orange-100 border border-orange-200">Our Technology</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Enterprise-Grade Infrastructure</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Built with the most advanced technologies to ensure security, speed, and reliability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Military-Grade Security',
                                desc: 'AES-256 encryption, multi-factor authentication, and real-time fraud detection protect every transaction.',
                                color: 'orange'
                            },
                            {
                                icon: Server,
                                title: 'Cloud Infrastructure',
                                desc: 'Distributed servers across multiple data centers ensure 99.99% uptime and instant failover.',
                                color: 'blue'
                            },
                            {
                                icon: Database,
                                title: 'Secure Data Storage',
                                desc: 'Your data is encrypted at rest and in transit, with automated backups every 15 minutes.',
                                color: 'emerald'
                            },
                            {
                                icon: Zap,
                                title: 'Lightning Performance',
                                desc: 'Sub-second transaction processing with optimized databases and caching layers.',
                                color: 'purple'
                            },
                            {
                                icon: Network,
                                title: 'Global Network',
                                desc: 'CDN-powered delivery ensures fast access from anywhere in the world.',
                                color: 'pink'
                            },
                            {
                                icon: Lock,
                                title: 'Compliance Ready',
                                desc: 'SOC 2, PCI DSS, and GDPR compliant infrastructure with regular security audits.',
                                color: 'orange'
                            }
                        ].map((tech, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className={`h-14 w-14 rounded-2xl bg-${tech.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-${tech.color}-200`}>
                                    <tech.icon className={`w-7 h-7 text-${tech.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{tech.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* System Architecture */}
            <section className="py-32 bg-gradient-to-br from-slate-50 to-orange-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
                                Scalable & <br />
                                <span className="text-orange-600">Resilient Architecture</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Our microservices architecture ensures that your banking experience is always fast, secure, and available—even during peak usage.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    'Auto-scaling infrastructure handles millions of requests',
                                    'Real-time data replication across multiple regions',
                                    'Automated disaster recovery and backup systems',
                                    'Zero-downtime deployments and updates'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-6">
                                <Link href="/about">
                                    <button className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg">
                                        Learn More About Us <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-20"></div>
                            <Image
                                src="/investment-services-hero.jpg"
                                alt="Banking System Architecture"
                                width={600}
                                height={600}
                                className="relative z-10 rounded-[2.5rem] shadow-2xl border border-slate-200"
                            />

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xl z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <Cpu className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Processing Power</p>
                                        <p className="text-2xl font-black text-slate-900">10K TPS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[3rem] bg-gradient-to-b from-slate-50 to-white p-8 md:p-16 border border-slate-200 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl">
                                <Image
                                    src="/personal-banking-hero.jpg"
                                    alt="Secure Banking Infrastructure"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl border border-slate-200 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">All Systems Operational</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Last checked: Just now</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="inline-block p-3 rounded-xl bg-orange-100 border border-orange-200">
                                    <Lock className="w-8 h-8 text-orange-600" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-slate-900">
                                    Security That Never Sleeps
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Our 24/7 security operations center monitors every transaction, with AI-powered fraud detection and instant alerts.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="text-slate-900 font-bold text-lg mb-1">Biometric Auth</h4>
                                        <p className="text-slate-500 text-sm">Face ID & Fingerprint</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="text-slate-900 font-bold text-lg mb-1">Real-Time Alerts</h4>
                                        <p className="text-slate-500 text-sm">Instant notifications</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="text-slate-900 font-bold text-lg mb-1">AI Monitoring</h4>
                                        <p className="text-slate-500 text-sm">Fraud detection</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <h4 className="text-slate-900 font-bold text-lg mb-1">Zero Trust</h4>
                                        <p className="text-slate-500 text-sm">Network security</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 pb-32 bg-gradient-to-br from-orange-600 to-orange-700">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Experience the Future of Banking</h2>
                    <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                        Join thousands of customers who trust our technology to power their financial future.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="w-full bg-white text-orange-600 px-12 py-5 rounded-2xl text-xl font-black hover:bg-orange-50 transition-all hover:scale-105 shadow-2xl">
                                Open Your Account
                            </button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <button className="w-full bg-transparent border-2 border-white text-white px-12 py-5 rounded-2xl text-xl font-bold hover:bg-white/10 transition-all">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
