'use client'

import { motion } from 'framer-motion'
import { FaReact, FaNodeJs, FaGithub, FaCode, FaFolder } from 'react-icons/fa'
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiFirebase } from 'react-icons/si'

export default function TeknikDetaylar() {
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
            Teknik Detaylar
          </h1>
          <p className="text-gray-400 text-xl">
            Bu projenin arkasındaki teknolojiler
          </p>
        </motion.div>

        {/* Teknoloji Stack'i */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Kullanılan Teknolojiler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-2">
              <SiNextdotjs className="text-4xl text-white" />
              <span className="text-gray-300">Next.js 13</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FaReact className="text-4xl text-blue-400" />
              <span className="text-gray-300">React</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <SiTypescript className="text-4xl text-blue-500" />
              <span className="text-gray-300">TypeScript</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <SiTailwindcss className="text-4xl text-cyan-400" />
              <span className="text-gray-300">Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <SiFirebase className="text-4xl text-yellow-500" />
              <span className="text-gray-300">Firebase</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FaNodeJs className="text-4xl text-green-500" />
              <span className="text-gray-300">Node.js</span>
            </div>
          </div>
        </motion.div>

        {/* Proje İstatistikleri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-center space-x-4">
              <FaFolder className="text-3xl text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Klasör Sayısı</h3>
                <p className="text-2xl text-purple-400">15+</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-center space-x-4">
              <FaCode className="text-3xl text-pink-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Kod Satırı</h3>
                <p className="text-2xl text-pink-400">2000+</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-center space-x-4">
              <FaGithub className="text-3xl text-blue-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Commit Sayısı</h3>
                <p className="text-2xl text-blue-400">50+</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Özellikler ve Detaylar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Teknik Özellikler</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start space-x-3">
              <span className="text-purple-400">•</span>
              <span>Server-Side Rendering ile hızlı sayfa yüklemeleri</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-purple-400">•</span>
              <span>TypeScript ile tip güvenliği ve daha iyi kod kalitesi</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-purple-400">•</span>
              <span>Tailwind CSS ile modern ve responsive tasarım</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-purple-400">•</span>
              <span>Firebase Authentication ile güvenli kullanıcı yönetimi</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-purple-400">•</span>
              <span>Firestore ile gerçek zamanlı veri yönetimi</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-purple-400">•</span>
              <span>Framer Motion ile akıcı animasyonlar</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </main>
  )
} 