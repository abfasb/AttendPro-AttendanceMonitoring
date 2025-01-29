import { useState } from 'react';
import { 
  FiMenu, FiX, FiSmartphone, FiUsers, FiBarChart2, FiClock, 
  FiCheckCircle, FiLock, FiCloud, FiDatabase, FiShield 
} from 'react-icons/fi';
import { FaQrcode, FaGooglePlay, FaApple, FaRegChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Modern Color Palette
  const colors = {
    primary: '#2563EB',    // Vibrant Blue
    secondary: '#059669',  // Emerald Green
    accent: '#DB2777',     // Pink Rose
    dark: '#0F172A',       // Deep Navy
    light: '#F8FAFC'       // Clean White
  };

  // Enhanced Features with Icons
  const featureCategories = [
    {
      title: "Core Technology",
      features: [
        { icon: <FaQrcode />, title: "Smart QR System", desc: "Dynamic session codes with auto-expiration and encryption" },
        { icon: <FiLock />, title: "Military Security", desc: "End-to-end encrypted data transmission and storage" },
        { icon: <FiCloud />, title: "Cloud Sync", desc: "Real-time sync across all devices and platforms" },
      ]
    },
    {
      title: "Advanced Analytics",
      features: [
        { icon: <FaRegChartBar />, title: "AI Insights", desc: "Predictive analytics and attendance patterns" },
        { icon: <FiDatabase />, title: "Data Mining", desc: "Deep dive into historical attendance records" },
        { icon: <FiShield />, title: "Compliance", desc: "Automated regulatory reporting and audits" },
      ]
    }
  ];

  const trustStats = [
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "256-bit", label: "Encryption" },
    { value: "50K+", label: "Daily Scans" },
    { value: "100%", label: "Compliance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <FaQrcode className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-slate-900">AttendPro</span>
            </motion.div>

            <div className="hidden md:flex gap-8 items-center">
              {['Features', 'Solutions', 'Resources', 'Contact'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ y: -2 }}
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  {item}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Signin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Signup
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>

          {isMenuOpen && (
            <div className="mt-4 md:hidden">
              <div className="flex flex-col gap-4">
                {['Features', 'Solutions', 'Resources', 'Contact'].map((item) => (
                  <motion.button
                    key={item}
                    whileHover={{ y: -2 }}
                    className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-left"
                  >
                    {item}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-left"
                >
                  Signin
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-left"
                >
                  Signup
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Enterprise-Grade Attendance Automation
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Transform your organization's attendance tracking with AI-powered insights, 
                military-grade security, and seamless multi-platform integration.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaGooglePlay className="text-xl" />
                  <div className="text-left">
                    <span className="block text-sm">Get on</span>
                    <span className="block text-lg">Google Play</span>
                  </div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:bg-slate-800 transition-colors"
                >
                  <FaApple className="text-xl" />
                  <div className="text-left">
                    <span className="block text-sm">Download on</span>
                    <span className="block text-lg">App Store</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div 
              className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex gap-4 mb-6">
                {featureCategories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`px-4 py-2 rounded-lg ${
                      activeFeature === index 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {featureCategories[index].title}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {featureCategories[activeFeature].features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50/50 hover:bg-indigo-100/50 transition-colors"
                  >
                    <div className="text-3xl text-indigo-600 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                      <p className="text-slate-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 to-emerald-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Trusted by Leading Organizations</h2>
            <p className="text-xl text-indigo-100">
              Built with enterprise-grade security and reliability at its core
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {trustStats.map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-100/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 opacity-90">
            {['University', 'Tech Corp', 'Hospital', 'Government'].map((client, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 p-6 rounded-xl flex items-center justify-center"
              >
                <span className="text-xl font-medium text-white/80">{client}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Streamlined Workflow</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FiCloud />, title: "Cloud Setup", desc: "5-minute configuration wizard" },
              { icon: <FiUsers />, title: "Role Assignment", desc: "Granular permission controls" },
              { icon: <FiBarChart2 />, title: "Live Dashboard", desc: "Real-time monitoring & alerts" },
            ].map((step, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="p-8 rounded-xl bg-indigo-50/50 border border-indigo-100"
              >
                <div className="text-4xl text-indigo-600 mb-4">{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 border-b border-slate-800 pb-12">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">AttendPro</h3>
              <p className="text-sm leading-relaxed">
                Revolutionizing attendance management through innovative technology and design.
              </p>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Security', 'Integrations', 'Mobile Apps'].map((item) => (
                  <li key={item} className="hover:text-white transition-colors">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Help Center', 'Status'].map((item) => (
                  <li key={item} className="hover:text-white transition-colors">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'GDPR', 'Compliance'].map((item) => (
                  <li key={item} className="hover:text-white transition-colors">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm text-slate-500">
            © 2024 AttendPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;