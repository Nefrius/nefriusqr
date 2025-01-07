'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaInfoCircle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'

interface ToastProps {
  message: string
  type: 'info' | 'error' | 'success'
  isVisible: boolean
}

const icons = {
  info: FaInfoCircle,
  error: FaExclamationCircle,
  success: FaCheckCircle
}

const colors = {
  info: 'bg-blue-500',
  error: 'bg-red-500',
  success: 'bg-green-500'
}

export default function Toast({ message, type, isVisible }: ToastProps) {
  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`${colors[type]} text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2`}>
            <Icon className="text-xl" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 