'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const QRContent = dynamic(() => import('./qr-content'), { ssr: false })

export default function SearchParamsContent() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('imageUrl')
  return imageUrl ? <QRContent imageUrl={imageUrl} /> : null
} 