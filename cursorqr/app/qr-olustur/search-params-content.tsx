'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

interface QRContentProps {
  imageUrl: string
}

const QRContent: ComponentType<QRContentProps> = dynamic(() => import('./qr-content').then(mod => mod.default), { ssr: false })

export default function SearchParamsContent() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('imageUrl')

  return imageUrl ? <QRContent imageUrl={imageUrl} /> : null
} 