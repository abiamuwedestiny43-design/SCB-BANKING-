import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in pt-32">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
            Contact Us
          </h1>
          <p className="text-base md:text-lg leading-relaxed animate-slide-up delay-200">
            At SCB BANKING, your questions and needs are our priority. Whether you’re looking for advice on loans, mortgages, or general banking services, our dedicated team is ready to provide personal support. Contact us and experience responsive, friendly, and professional service tailored to your needs.
            <br /><br />
            Reach out to us today and let us guide you through our services, help you manage your finances, or resolve any issues you may face. With various communication channels and convenient branch locations, staying connected with SCB BANKING is now easier than ever.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-in-left">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-black mb-6">Send a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">First Name</label>
                      <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                      <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Email</label>
                    <input type="email" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Phone</label>
                    <input type="tel" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Subject</label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                      <option>General Inquiry</option>
                      <option>Account Services</option>
                      <option>Loan Information</option>
                      <option>Mortgage Services</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Message</label>
                    <textarea rows={5} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" placeholder="How can we help you?"></textarea>
                  </div>
                  <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-black transition-colors font-medium">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="animate-slide-in-right space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-black">Phone</h3>
                      <p className="text-black">Customer Support: +44 7552 984349</p>
                      <p className="text-black">Loan Department: +44 7552 984350</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-black">Email</h3>
                      <p className="text-black">support@scbbankiing.com</p>
                      <p className="text-black">support@scbbankiing.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-black">Head Office</h3>
                      <p className="text-black">
                        One Canary Wharf,<br />
                        London, E14 5AB,<br />
                        United Kingdom
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Business Hours</h3>
                <div className="space-y-2 text-black">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>09:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">Need Urgent Help?</h3>
                <p className="text-black mb-4">
                  For urgent account issues or to report a lost/stolen card, call our 24/7 hotline:
                </p>
                <div className="text-2xl font-bold text-black">+44 7552 984349</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-black mb-16">Branch Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Canary Wharf Branch',
                address: 'One Canary Wharf, London, E14 5AB',
                phone: '+44 7552 984349',
                hours: 'Mon-Fri: 09:00-18:00, Sat: 09:00-14:00'
              },
              {
                name: 'Manchester Central',
                address: '100 Barbirolli Square, Manchester, M2 3BD',
                phone: '+44 7552 984351',
                hours: 'Mon-Fri: 09:00-17:00, Sat: 09:00-13:00'
              },
              {
                name: 'Birmingham Business District',
                address: '1 Colmore Row, Birmingham, B3 2BJ',
                phone: '+44 7552 984352',
                hours: 'Mon-Fri: 09:00-18:00, Sat: 09:00-14:00'
              }
            ].map((branch, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <h3 className="text-xl font-semibold text-black mb-4">{branch.name}</h3>
                <div className="space-y-3 text-black">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{branch.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-black mr-2 flex-shrink-0" />
                    <span className="text-sm">{branch.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{branch.hours}</span>
                  </div>
                </div>
                <button className="mt-4 w-full text-black font-medium hover:text-black text-sm border border-black py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
