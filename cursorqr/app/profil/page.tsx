'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaCoins, FaQrcode, FaHistory, FaShieldAlt, FaStar, FaChartLine } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Stats {
  totalGenerated: number
  totalSpent: number
}

export default function Profile() {
  const { user, coins, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [loading, user, router])

  if (loading || !user) return null

  const stats: Stats = {
    totalGenerated: 50, // Bu değerler gerçek verilerle değiştirilecek
    totalSpent: 300
  }

  const badges = [
    {
      icon: isAdmin ? FaShieldAlt : FaStar,
      label: isAdmin ? 'Admin' : 'Kullanıcı',
      color: isAdmin ? 'text-purple-400' : 'text-yellow-400'
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
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={user.photoURL || ''}
                alt={user.displayName || 'Kullanıcı'}
                fill
                className="rounded-full object-cover border-4 border-purple-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-gray-800 p-2 rounded-full border-2 border-purple-500">
                {badges.map((badge, index) => {
                  const Icon = badge.icon
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className={`${badge.color}`}
                    >
                      <Icon className="text-xl" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {user.displayName}
            </h1>
            <p className="text-gray-400">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-700/50 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-2">
                <FaCoins className="text-2xl" />
                <span className="text-2xl font-bold">{coins}</span>
              </div>
              <p className="text-gray-300">Mevcut Coin</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 text-purple-400 mb-2">
                <FaQrcode className="text-2xl" />
                <span className="text-2xl font-bold">{Math.floor(coins / 10)}</span>
              </div>
              <p className="text-gray-300">Oluşturulabilir QR</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaChartLine className="mr-2" />
              İstatistikler
            </h2>
            <div className="bg-gray-700/50 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Toplam Oluşturulan</p>
                  <p className="text-2xl font-bold text-white">{stats.totalGenerated}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Toplam Harcanan Coin</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSpent}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/gecmis')}
              className="w-full bg-gray-700/50 p-4 rounded-xl flex items-center justify-between hover:bg-gray-600/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaHistory className="text-xl text-purple-400" />
                <span className="text-white">QR Kod Geçmişi</span>
              </div>
              <span className="text-gray-400">Görüntüle →</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 