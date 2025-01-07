'use client'

import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaBell, FaLanguage, FaPalette, FaShieldAlt } from 'react-icons/fa'

export default function Settings() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [loading, user, router])

  if (loading || !user) return null

  const settingsItems = [
    {
      icon: FaBell,
      title: 'Bildirimler',
      description: 'Bildirim tercihlerinizi yönetin',
      comingSoon: true
    },
    {
      icon: FaLanguage,
      title: 'Dil',
      description: 'Uygulama dilini değiştirin',
      comingSoon: true
    },
    {
      icon: FaPalette,
      title: 'Görünüm',
      description: 'Tema ve renk ayarlarını özelleştirin',
      comingSoon: true
    },
    {
      icon: FaShieldAlt,
      title: 'Güvenlik',
      description: 'Hesap güvenlik ayarlarınızı yönetin',
      comingSoon: true
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Ayarlar</h1>

          <div className="space-y-4">
            {settingsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-700/50 p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600/50 p-3 rounded-lg">
                      <Icon className="text-xl text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  {item.comingSoon && (
                    <span className="text-xs text-yellow-500 font-medium px-2 py-1 bg-yellow-500/10 rounded-full">
                      Yakında
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Sürüm 1.0.0
          </p>
        </motion.div>
      </div>
    </main>
  )
} 