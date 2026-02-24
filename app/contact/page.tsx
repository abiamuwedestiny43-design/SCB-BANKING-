import { Phone, Mail, MapPin, Clock, Send, Zap, Globe, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white text-black min-h-screen overflow-hidden font-sans">
      {/* Background Elements - Minimalist */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-black/[0.01] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/[0.01] rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-black text-[10px] font-black tracking-[0.3em] uppercase mb-8 shadow-sm">
            <Globe className="w-4 h-4" /> Global Support Network
          </div>
          <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tighter mb-8 text-black uppercase italic">
            Connect with the <br />
            <span className="text-black">
              Financial Elite.
            </span>
          </h1>
          <p className="text-sm md:text-lg text-black max-w-3xl mx-auto leading-relaxed mb-12 font-bold uppercase tracking-widest opacity-60">
            Our dedicated advisory team is standing by to assist with your institutional and personal banking requirements.
            Experience rapid response times and expert guidance.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-black/10 to-black/10 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white border border-slate-200 p-10 md:p-12 rounded-[3rem] shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-black text-black mb-8 italic uppercase tracking-tighter">Secure <span className="text-black">Transmission</span></h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">First Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-black focus:outline-none focus:border-black focus:bg-white transition-all font-medium" placeholder="Alexander" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Last Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-black focus:outline-none focus:border-black focus:bg-white transition-all font-medium" placeholder="Vance" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Institutional Email</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-black focus:outline-none focus:border-black focus:bg-white transition-all font-medium" placeholder="alex@company.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Subject Area</label>
                    <select
                      title="Select inquiry subject area"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-black focus:outline-none focus:border-black focus:bg-white transition-all appearance-none font-medium"
                    >
                      <option>Wealth Management</option>
                      <option>Institutional Loans</option>
                      <option>Mortgage Advisory</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Message</label>
                    <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-black focus:outline-none focus:border-black focus:bg-white transition-all resize-none font-medium" placeholder="Describe your inquiry..."></textarea>
                  </div>
                  <button className="w-full bg-black hover:bg-black text-white py-5 rounded-2xl font-black transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-black/20 uppercase tracking-widest text-sm">
                    Send Message <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-black mb-10 tracking-tight uppercase italic">Direct <span className="text-black">Channels</span></h2>
                <div className="space-y-8">
                  {[
                    { icon: Phone, title: 'Voice Support', value: '+1 (995) 886 436', desc: 'Available Mon-Fri, 9AM-6PM EST', color: 'text-black', bg: 'bg-slate-50', border: 'border-slate-100' },
                    { icon: Mail, title: 'Secure Email', value: 'support@firststatebank.online', desc: 'Encrypted communication line', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { icon: MapPin, title: 'Global HQ', value: '77 Financial Plaza', desc: 'Downtown District, Suite 1200', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className={`h-16 w-16 rounded-2xl ${item.bg} ${item.border} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-black mb-1 uppercase tracking-tight">{item.title}</h3>
                        <p className="text-lg font-bold text-black">{item.value}</p>
                        <p className="text-sm text-black font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-black animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Systems Operational</span>
                </div>
                <h3 className="text-2xl font-black text-black italic uppercase tracking-tighter">24/7 Digital <span className="text-black">Concierge</span></h3>
                <p className="text-sm md:text-base text-black leading-relaxed font-bold uppercase tracking-widest opacity-60">
                  Our AI-driven support ecosystem is always active for immediate account verification and urgent security reports.
                </p>
                <div className="pt-4">
                  <p className="text-3xl md:text-4xl font-black text-black underline decoration-black underline-offset-8 italic tracking-tighter">+1 (995) 886 436</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Locations */}
      <section className="py-24 bg-white relative border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black text-black mb-4 tracking-tighter uppercase italic">Our Global <span className="text-black">Offices</span></h2>
              <p className="text-sm md:text-lg text-black font-bold uppercase tracking-widest opacity-60">Strategically located in the world's most vital financial centers.</p>
            </div>
            <button className="px-8 py-4 rounded-xl bg-white border border-slate-200 text-black font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest text-xs">
              View Global Map <Globe className="w-5 h-5 text-black" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: 'London', address: '12 Canary Wharf, Financial District', hours: '08:00 - 18:00 GMT' },
              { city: 'New York', address: '44 Wall Street, Manhattan', hours: '09:00 - 18:00 EST' },
              { city: 'Singapore', address: '8 Marina Bay Financial Centre', hours: '09:00 - 17:00 SGT' }
            ].map((node, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-200 hover:border-slate-200 hover:bg-white transition-all shadow-sm">
                <h3 className="text-2xl font-black text-black mb-6 italic uppercase">{node.city}</h3>
                <div className="space-y-4 text-black text-sm font-medium">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-black shrink-0" />
                    <span>{node.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-black shrink-0" />
                    <span>{node.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
