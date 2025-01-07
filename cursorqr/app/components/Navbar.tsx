'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQrcode, FaHistory, FaInfoCircle, FaCoins, FaUser, FaCog, FaSignOutAlt, FaSpinner, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Toast from './Toast'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, coins, loading, error, isAdmin, signInWithGoogle, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Ana Sayfa', icon: FaQrcode },
    { href: '/gecmis', label: 'Geçmiş', icon: FaHistory },
    { href: '/hakkinda', label: 'Hakkında', icon: FaInfoCircle },
    { href: '/teknik', label: 'Teknik Detaylar', icon: FaInfoCircle },
  ]

  const userMenuItems = [
    { href: '/profil', label: 'Profil', icon: FaUser },
    { href: '/ayarlar', label: 'Ayarlar', icon: FaCog },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin Paneli', icon: FaShieldAlt }] : []),
  ]

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => router.push('/')}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaQrcode className="text-3xl text-purple-500" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                QR Oluşturucu
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <div
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'text-purple-400 bg-gray-800'
                        : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center space-x-4">
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaSpinner className="text-purple-500 text-xl" />
                </motion.div>
              ) : (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <FaCoins className="text-xl" />
                        <span className="font-semibold">{coins}</span>
                      </div>
                      <div className="relative">
                        <motion.button
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                          className="focus:outline-none"
                        >
                          <Image
                            src={user.photoURL || ''}
                            alt={user.displayName || 'Kullanıcı'}
                            width={32}
                            height={32}
                            className="rounded-full ring-2 ring-purple-500 hover:ring-4 transition-all"
                          />
                        </motion.button>

                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg py-1 z-50"
                            >
                              <div className="px-4 py-3 border-b border-gray-700">
                                <p className="text-sm text-white font-semibold">{user.displayName}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                              {userMenuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                  <div
                                    key={item.href}
                                    onClick={() => {
                                      router.push(item.href)
                                      setIsMenuOpen(false)
                                    }}
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2 cursor-pointer"
                                  >
                                    <Icon className="text-lg" />
                                    <span>{item.label}</span>
                                  </div>
                                )
                              })}
                              <button
                                onClick={() => {
                                  logout()
                                  setIsMenuOpen(false)
                                }}
                                className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 flex items-center space-x-2"
                              >
                                <FaSignOutAlt className="text-lg" />
                                <span>Çıkış Yap</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={signInWithGoogle}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full text-sm font-semibold shadow-lg"
                    >
                      Google ile Giriş Yap
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {error && (
        <Toast
          message={error}
          type="error"
          isVisible={true}
        />
      )}
    </>
  )
} 