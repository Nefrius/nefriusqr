'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCoins, FaClock } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function CoinTimer() {
  const { nextCoinRefresh } = useAuth()
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!nextCoinRefresh) return ''

      const now = new Date()
      const diff = nextCoinRefresh.getTime() - now.getTime()

      if (diff <= 0) {
        window.location.reload()
        return '00:00:00'
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [nextCoinRefresh])

  if (!nextCoinRefresh) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-gray-800/90 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border border-gray-700 flex items-center space-x-3"
    >
      <div className="flex items-center text-yellow-400">
        <FaCoins className="mr-1" />
        <span className="font-medium">+100</span>
      </div>
      <div className="flex items-center text-gray-400">
        <FaClock className="mr-1" />
        <span>{timeLeft}</span>
      </div>
    </motion.div>
  )
} 