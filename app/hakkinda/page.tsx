'use client'

import { motion } from 'framer-motion'
import { FaQrcode, FaLock, FaRocket } from 'react-icons/fa'

const features = [
  {
    icon: FaQrcode,
    title: 'Kolay Kullanım',
    description: 'Sadece birkaç tıklama ile fotoğraflarınızı QR kodlara dönüştürün.'
  },
  {
    icon: FaLock,
    title: 'Güvenli',
    description: 'Fotoğraflarınız güvenli bir şekilde saklanır ve şifrelenir.'
  },
  {
    icon: FaRocket,
    title: 'Hızlı',
    description: 'Saniyeler içinde QR kodlarınızı oluşturun ve paylaşın.'
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function About() {
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
            Hakkımızda
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Fotoğraflarınızı QR kodlara dönüştürmek hiç bu kadar kolay olmamıştı.
            Modern ve kullanıcı dostu arayüzümüzle size en iyi deneyimi sunuyoruz.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={item}
                className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 shadow-xl"
              >
                <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Icon className="text-3xl text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-gray-400">
            Sorularınız veya önerileriniz için bize ulaşın.
          </p>
          <motion.a
            href="mailto:info@qrolusturucu.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-full shadow-lg"
          >
            İletişime Geç
          </motion.a>
        </motion.div>
      </div>
    </main>
  )
} 