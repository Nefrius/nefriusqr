'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCamera, FaImage, FaMagic, FaLink, FaFont, FaCoins, FaChartBar, FaStar } from 'react-icons/fa'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'
import Toast from './components/Toast'

const BUBBLE_COUNT = 20;

type QRType = 'image' | 'url' | 'text'

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
}

export default function Home() {
  const router = useRouter()
  const { user, coins, updateCoins } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [qrType, setQrType] = useState<QRType>('image')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isClient, setIsClient] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  useEffect(() => {
    setIsClient(true)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const showToast = (message: string, type: 'info' | 'error' | 'success') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 3000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateQR = async () => {
    if (!user) {
      showToast('Lütfen önce giriş yapın', 'error')
      return
    }

    const requiredCoins = qrType === 'url' ? 50 : 10
    if (coins < requiredCoins) {
      showToast(`Yetersiz coin! QR kod oluşturmak için en az ${requiredCoins} coin gerekli.`, 'error')
      return
    }

    if (qrType === 'image' && !selectedImage) {
      showToast('Lütfen bir fotoğraf seçin', 'error')
      return
    }

    if (qrType === 'url' && !urlInput) {
      showToast('Lütfen bir URL girin', 'error')
      return
    }

    if (qrType === 'text' && !textInput) {
      showToast('Lütfen bir metin girin', 'error')
      return
    }

    try {
      setUploading(true)
      
      let data: string
      if (qrType === 'image') {
        data = selectedImage!.split(',')[1]
      } else if (qrType === 'url') {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = 500
        canvas.height = 100
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = '16px Arial'
        ctx.fillStyle = 'black'
        ctx.fillText(urlInput, 10, 50)
        data = canvas.toDataURL('image/png').split(',')[1]
      } else {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = 500
        canvas.height = 200
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = '16px Arial'
        ctx.fillStyle = 'black'
        const words = textInput.split(' ')
        let line = ''
        let y = 30
        words.forEach(word => {
          const testLine = line + word + ' '
          if (ctx.measureText(testLine).width > 480) {
            ctx.fillText(line, 10, y)
            line = word + ' '
            y += 25
          } else {
            line = testLine
          }
        })
        ctx.fillText(line, 10, y)
        data = canvas.toDataURL('image/png').split(',')[1]
      }
      
      const formData = new FormData()
      formData.append('key', '85d3f5d272c6d2d97c9250622357fd44')
      formData.append('image', data)

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      })

      const responseData = await response.json()
      
      if (responseData.success) {
        await updateCoins(coins - requiredCoins)
        showToast('QR kod başarıyla oluşturuldu!', 'success')

        const historyItem = {
          id: Date.now().toString(),
          type: qrType,
          content: qrType === 'image' ? selectedImage : qrType === 'url' ? urlInput : textInput,
          qrUrl: responseData.data.url,
          cost: requiredCoins,
          date: new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }

        const savedHistory = localStorage.getItem('qr-history')
        const history = savedHistory ? JSON.parse(savedHistory) : []
        history.unshift(historyItem)
        localStorage.setItem('qr-history', JSON.stringify(history))

        router.push(`/qr-olustur?imageUrl=${encodeURIComponent(responseData.data.url)}`)
      } else {
        throw new Error('Yükleme başarısız: ' + (responseData.error?.message || 'Bilinmeyen hata'))
      }
    } catch (error) {
      console.error('Yükleme hatası:', error)
      showToast('QR kod oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const qrTypes = [
    { type: 'image', label: 'Fotoğraf', icon: FaImage, cost: 10 },
    { type: 'url', label: 'Website', icon: FaLink, cost: 50 },
    { type: 'text', label: 'Metin', icon: FaFont, cost: 10 }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animasyonlu Baloncuklar */}
      <div className="absolute inset-0 pointer-events-none">
        {isClient && [...Array(BUBBLE_COUNT)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`,
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
            }}
            initial={{ 
              x: 0,
              y: 0,
              scale: 0
            }}
            animate={{
              x: Math.random() * (dimensions.width || 500),
              y: Math.random() * (dimensions.height || 500),
              scale: 1
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            QR Kod Oluşturucu
          </h1>
          <p className="text-gray-400 text-xl">
            Fotoğraf, website veya metinlerinizi QR kodlara dönüştürün.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Bilgi Paneli */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaCoins className="text-yellow-400 mr-2" />
                Coin Sistemi
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <span>Her gün 100 ücretsiz coin</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                  <span>Fotoğraf QR: 10 coin</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-2" />
                  <span>Website QR: 50 coin</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                  <span>Metin QR: 10 coin</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaImage className="text-purple-400 mr-2" />
                Desteklenen Formatlar
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                  <span>JPG, PNG, GIF</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                  <span>Maksimum 5MB</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                  <span>Yüksek kalite desteği</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ana QR Oluşturma Bölümü */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700"
            >
              <div className="grid grid-cols-3 gap-4 mb-8">
                {qrTypes.map((item) => {
                  const Icon = item.icon
                  const isSelected = qrType === item.type
                  return (
                    <motion.button
                      key={item.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQrType(item.type as QRType)}
                      className={`p-4 rounded-xl flex flex-col items-center space-y-2 ${
                        isSelected ? 'bg-purple-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      <Icon className="text-2xl" />
                      <span className="font-medium">{item.label}</span>
                      <div className="flex items-center text-sm">
                        <FaCoins className="mr-1 text-yellow-400" />
                        <span>{item.cost}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {qrType === 'image' ? (
                !selectedImage ? (
                  <div className="text-center space-y-8">
                    <motion.div
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                    >
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-full inline-flex items-center space-x-3 text-xl font-semibold shadow-lg"
                        >
                          <FaImage size={24} />
                          <span>Fotoğraf Seç</span>
                        </motion.div>
                      </label>
                    </motion.div>

                    <motion.p
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.2 }}
                      className="text-gray-400"
                    >
                      veya
                    </motion.p>

                    <motion.button
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-8 rounded-full inline-flex items-center space-x-3 text-xl font-semibold shadow-lg"
                    >
                      <FaCamera size={24} />
                      <span>Kamera Kullan</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="relative w-64 h-64 mx-auto mb-6">
                      <Image
                        src={selectedImage}
                        alt="Seçilen fotoğraf"
                        width={256}
                        height={256}
                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-3 -right-3 bg-purple-500 p-2 rounded-full shadow-lg"
                      >
                        <FaMagic className="text-white text-xl" />
                      </motion.div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(null)}
                        className="bg-red-500 text-white py-3 px-6 rounded-full shadow-lg"
                      >
                        Fotoğrafı Kaldır
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-full shadow-lg disabled:opacity-50"
                        onClick={generateQR}
                        disabled={uploading}
                      >
                        {uploading ? 'Yükleniyor...' : 'QR Kod Oluştur'}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              ) : qrType === 'url' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-gray-300 block">Website Adresi</label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateQR}
                    disabled={uploading || !urlInput}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-full shadow-lg disabled:opacity-50"
                  >
                    {uploading ? 'Yükleniyor...' : 'QR Kod Oluştur'}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-gray-300 block">Metin</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="QR koda dönüştürmek istediğiniz metni girin..."
                      rows={4}
                      className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateQR}
                    disabled={uploading || !textInput}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-full shadow-lg disabled:opacity-50"
                  >
                    {uploading ? 'Yükleniyor...' : 'QR Kod Oluştur'}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sağ İstatistik Paneli */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaChartBar className="text-pink-400 mr-2" />
                İstatistikler
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Oluşturulan QR</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                    <span className="text-purple-400 font-bold">1000+</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Aktif Kullanıcı</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-2" />
                    <span className="text-pink-400 font-bold">500+</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mutlu Müşteri</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                    <span className="text-blue-400 font-bold">99%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaStar className="text-yellow-400 mr-2" />
                Premium Özellikler
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <span>Sınırsız QR oluşturma</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <span>Özel tasarım QR kodları</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  <span>7/24 destek</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Özellikler Bölümü */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Özelliklerimiz
          </h2>
          <p className="text-gray-400 text-xl">
            QR kod oluşturmanın en kolay ve güvenli yolu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors"
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <FaImage className="text-3xl text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Fotoğraf QR</h3>
            <p className="text-gray-400">
              Fotoğraflarınızı QR kodlara dönüştürün ve kolayca paylaşın. Yüksek kaliteli görüntü desteği.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 hover:border-pink-500/50 transition-colors"
          >
            <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
              <FaLink className="text-3xl text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Website QR</h3>
            <p className="text-gray-400">
              Web sitelerinizi QR kodlarla paylaşın. Ziyaretçileriniz tek tıkla sitenize ulaşsın.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-colors"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <FaFont className="text-3xl text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Metin QR</h3>
            <p className="text-gray-400">
              Metinlerinizi QR kodlara dönüştürün. Notlar, mesajlar ve daha fazlası için ideal.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Coin Sistemi */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg p-12 rounded-3xl border border-purple-500/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">
                Coin Sistemi ile Daha Fazla Özellik
              </h2>
              <p className="text-gray-300 mb-8">
                Her gün ücretsiz coinler kazanın ve premium özelliklerimizden faydalanın. 
                Website QR kodları için 50 coin, diğer QR kodlar için sadece 10 coin harcayın.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-300">
                  <FaCoins className="text-yellow-400 mr-3" />
                  Her gün 100 ücretsiz coin
                </li>
                <li className="flex items-center text-gray-300">
                  <FaImage className="text-purple-400 mr-3" />
                  Fotoğraf QR: 10 coin
                </li>
                <li className="flex items-center text-gray-300">
                  <FaLink className="text-pink-400 mr-3" />
                  Website QR: 50 coin
                </li>
                <li className="flex items-center text-gray-300">
                  <FaFont className="text-blue-400 mr-3" />
                  Metin QR: 10 coin
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <FaCoins className="text-9xl mx-auto text-yellow-400 animate-float" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </main>
  )
}
