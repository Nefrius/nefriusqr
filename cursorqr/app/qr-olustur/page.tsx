'use client'

import { Suspense } from 'react'
import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic'

const SearchParamsWrapper = dynamicImport(() => import('./search-params-wrapper'))

export default function QRPage() {
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
      <SearchParamsWrapper />
    </Suspense>
  )
} 