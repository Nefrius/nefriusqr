import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import CoinTimer from './components/CoinTimer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QR Kod Oluşturucu',
  description: 'Fotoğraflarınızı QR kodlara dönüştürün',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <AuthProvider>
          <Navbar />
          {children}
          <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} QR Kod Oluşturucu. Tüm hakları saklıdır.</p>
            </div>
          </footer>
          <CoinTimer />
        </AuthProvider>
      </body>
    </html>
  )
}
