import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockClosedIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const UnauthorizedPage  : React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-blue-900/30 relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="flex justify-center"
            >
              <div className="p-4 bg-red-500/20 rounded-2xl inline-block">
                <ShieldExclamationIcon className="w-20 h-20 text-red-400" />
              </div>
            </motion.div>

            <div className="space-y-4 text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
                403 Access Denied
              </h1>
              <p className="text-gray-300 text-xl font-light">
                Oops! You don't have permission to view this page
              </p>
              <div className="py-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold 
                             hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <LockClosedIcon className="w-5 h-5" />
                    Return to Safety
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400 text-center">
                <span className="block mb-2 font-semibold">Security Tip</span>
                If you believe this is an error, please contact your system administrator
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;