'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

const QRContent = dynamic(() => import('./qr-content'), { ssr: false })

function SearchContent() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('imageUrl')
  return imageUrl ? <QRContent imageUrl={imageUrl} /> : null
}

export default function SearchParamsContent() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
} 