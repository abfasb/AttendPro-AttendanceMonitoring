import React, { useState } from 'react';
import { FiMenu, FiX, FiSmartphone, FiUsers, FiBarChart2, FiClock, FiCheckCircle } from 'react-icons/fi';
import { FaQrcode, FaGooglePlay, FaApple, FaStar, FaRegHeart, FaRocket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// New Components
const PulseRing = () => (
  <div className="absolute inset-0 rounded-full animate-ping bg-indigo-200/80"></div>
);

const Testimonials = [
  { name: "University Tech", role: "Administrator", text: "Reduced attendance processing time by 80%", stars: 5 },
  { name: "Global Corp", role: "HR Manager", text: "Best attendance solution we've ever used", stars: 5 },
  { name: "Tech Events Co", role: "Organizer", text: "Revolutionized our event management", stars: 5 },
];

const PricingPlans = [
  { name: "Starter", price: "0", features: ["100 scans/month", "Basic Analytics", "Email Support"] },
  { name: "Pro", price: "49", features: ["Unlimited Scans", "Advanced Analytics", "Priority Support", "Custom QR Codes"] },
  { name: "Enterprise", price: "Custom", features: ["Dedicated Server", "SLA", "Custom Integration", "Training"] },
];

const LandingPage : React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const colors = {
    primary: '#1E40AF',
    secondary: '#0F766E',
    accent: '#D97706',
    light: '#F8FAFC',
    dark: '#0F172A'
  };

  // Enhanced Features Array
  const features = [
    { icon: <FaQrcode />, title: "Dynamic QR Codes", desc: "Auto-expiring session codes with encryption" },
    { icon: <FiUsers />, title: "Role-Based Access", desc: "Custom permissions hierarchy for all users" },
    { icon: <FiBarChart2 />, title: "Advanced Analytics", desc: "Exportable reports with AI insights" },
    { icon: <FiClock />, title: "Geo-Tracking", desc: "Location verification with time stamps" },
    { icon: <FiCheckCircle />, title: "Smart Notifications", desc: "Customizable alert thresholds" },
    { icon: <FiSmartphone />, title: "Cross-Platform", desc: "Progressive Web App support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                AttendPro
              </span>
              <FaRocket className="ml-2 text-amber-600" />
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              {['Features', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ y: -2 }}
                  className={`relative px-3 py-1 transition-colors ${
                    activeSection === item.toLowerCase() 
                      ? `text-${colors.primary} font-semibold`
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <motion.div 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-700"
                      layoutId="underline"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-40 md:hidden"
          >
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-indigo-800 to-teal-700 bg-clip-text text-transparent">
                Next-Gen Attendance Management System
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                AI-powered analytics meet military-grade security in our complete attendance solution. 
                Trusted by leading universities and Fortune 500 companies.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <motion.button 
                  whileHover={{ y: -2 }}
                  className="bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-800 transition-colors flex items-center gap-3 shadow-lg"
                >
                  <FaGooglePlay className="text-2xl" /> 
                  <div className="text-left">
                    <span className="block text-xs">Get on</span>
                    <span className="block text-lg">Google Play</span>
                  </div>
                </motion.button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <img 
                      key={i}
                      src={`/avatar-${i+1}.jpg`}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      alt="User avatar"
                    />
                  ))}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-indigo-700">5,000+</span> active users daily
                </div>
              </div>
            </motion.div>
          </div>

          <div className="md:w-1/2 relative">
            <motion.div 
              initial={{ rotate: 3 }}
              animate={{ rotate: -3 }}
              transition={{ 
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 4
              }}
              className="absolute inset-0 bg-indigo-100 rounded-[40px]"
            />
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative bg-white rounded-[40px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 to-teal-600" />
              <div className="space-y-6">
                <div className="relative flex justify-center items-center h-64">
                  <PulseRing />
                  <FaQrcode className="text-9xl z-10" style={{ color: colors.primary }} />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Live Session QR Code</h3>
                  <div className="flex justify-center items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-slate-600">Active for 45 minutes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Flexible Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-6">
                    ${plan.price}<span className="text-lg text-slate-500">/month</span>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <FiCheckCircle className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 p-6">
                  <button className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Trusted By Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex gap-2 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-lg mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaRegHeart className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">See It in Action</h2>
            <p className="text-xl text-indigo-200">Experience our dashboard with interactive demo</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-white text-xl font-bold mb-6">Stay Updated</h3>
              <div className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-slate-800 rounded-lg px-4 py-3 flex-1"
                />
                <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-800">
                  Subscribe
                </button>
              </div>
              <p className="text-sm mt-4 text-slate-500">
                Join 10,000+ professionals getting our monthly updates
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;