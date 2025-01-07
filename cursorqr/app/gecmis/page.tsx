'use client'

import { motion } from 'framer-motion'
import { FaQrcode, FaCog } from 'react-icons/fa'

export default function History() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            QR Kod Geçmişi
          </h1>
          <p className="text-gray-400 text-xl">
            Yakında Sizlerle!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-12 text-center border border-gray-700/50 shadow-2xl"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="relative inline-block">
              <FaQrcode className="text-8xl mx-auto relative z-10 text-white" />
              <motion.div 
                className="absolute -top-4 -right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <FaCog className="text-3xl text-yellow-400" />
              </motion.div>
            </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-4 text-white"
          >
            Geliştirme Aşamasında
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 mb-8 max-w-lg mx-auto"
          >
            Çok yakında tüm QR kod geçmişinizi burada görüntüleyebilecek, 
            önceki QR kodlarınızı yönetebilecek ve yeni özelliklerden 
            faydalanabileceksiniz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center justify-center space-x-2 text-purple-400 font-medium"
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
} 