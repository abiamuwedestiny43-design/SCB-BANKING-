// components/Footer.tsx
import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-900 py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">DANAMON<span className="text-orange-600 font-medium">BANK</span></span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Your trusted financial partner for over 50 years. Building a stronger future through innovative banking solutions.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6">Services</h3>
            <ul className="space-y-3 text-sm text-slate-600 font-bold">
              <li><Link href="/services/personal" className="hover:text-orange-600 transition-colors">Personal Banking</Link></li>
              <li><Link href="/services/business" className="hover:text-orange-600 transition-colors">Business Banking</Link></li>
              <li><Link href="/services/mortgage" className="hover:text-orange-600 transition-colors">Mortgage</Link></li>
              <li><Link href="/loans" className="hover:text-orange-600 transition-colors">Loans</Link></li>
              <li><Link href="/services/investment" className="hover:text-orange-600 transition-colors">Investment Services</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-slate-600 font-bold">
              <li><Link href="/help" className="hover:text-orange-600 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-orange-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/branches" className="hover:text-orange-600 transition-colors">Branch Locations</Link></li>
              <li><Link href="/security" className="hover:text-orange-600 transition-colors">Security Center</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6">Contact</h3>
            <div className="space-y-4 text-sm text-slate-600 font-bold">
              <div className="flex items-center gap-3 group text-slate-600">
                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                +62 (21) 8064 5000
              </div>
              <div className="flex items-center gap-3 group text-slate-600">
                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                support@danamonbk.com
              </div>
              <div className="flex items-start gap-3 group text-slate-600">
                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed text-xs">Jl. HR. Rasuna Said No. 10,<br />Block C, Karet, Setiabudi,<br />Jakarta Selatan 12920, Indonesia.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            &copy; 2026 PT Bank Danamon Indonesia Tbk. Registered and supervised by OJK. A member of the LPS insurance scheme.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 grayscale brightness-0 opacity-20">
              <div className="h-6 w-12 bg-slate-900 rounded"></div>
              <div className="h-6 w-12 bg-slate-900 rounded"></div>
              <div className="h-6 w-12 bg-slate-900 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
