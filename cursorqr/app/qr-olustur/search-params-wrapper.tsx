'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { FaDownload, FaShare, FaArrowLeft, FaMagic } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'

function QRContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('imageUrl')
  const [isClient, setIsClient] = useState(false)
  const [isShareSupported, setIsShareSupported] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!imageUrl) {
      router.push('/')
    }
    setIsShareSupported(typeof navigator !== 'undefined' && !!navigator.share)
  }, [imageUrl, router])

  const handleDownload = () => {
    if (!isClient) return
    const svg = document.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = 'qr-kod.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const handleShare = async () => {
    if (!isClient || !isShareSupported) return
    try {
      await navigator.share({
        title: 'QR Kod',
        text: 'QR kodumu paylaş',
        url: window.location.href
      })
    } catch (error) {
      console.error('Paylaşım hatası:', error)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                QR Kodunuz Yükleniyor...
              </h1>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!imageUrl) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => router.push('/')}
          className="mb-8 text-gray-300 hover:text-purple-400 flex items-center gap-2 text-xl transition-colors"
        >
          <FaArrowLeft /> Geri Dön
        </motion.button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              QR Kodunuz Hazır!
            </h1>
            <p className="text-gray-400">
              QR kodunuzu indirin veya paylaşın.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative mx-auto w-fit mb-8"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-lg"></div>
            <div className="relative bg-gray-900 p-4 rounded-xl">
              <QRCodeSVG
                value={imageUrl}
                size={256}
                level="H"
                includeMargin
                className="rounded-lg"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 -right-4 bg-purple-500 p-2 rounded-full shadow-lg"
            >
              <FaMagic className="text-white text-xl" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-full flex items-center gap-2 shadow-lg"
            >
              <FaDownload /> İndir
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-full flex items-center gap-2 shadow-lg"
            >
              <FaShare /> Paylaş
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SearchParamsWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                QR Kodunuz Yükleniyor...
              </h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <QRContent />
    </Suspense>
  )
} 