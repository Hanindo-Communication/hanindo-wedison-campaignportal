'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
  href?: string
  onClick?: () => void
}

export default function Logo({ className = '', size = 'medium', href = '/', onClick }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  // Height-based sizing for landscape logo (width auto-scales to preserve aspect ratio)
  const sizeConfig = {
    small: { height: 28, width: 120 },   // Mobile navbar
    medium: { height: 36, width: 150 },  // Desktop navbar
    large: { height: 48, width: 200 },   // Footer
  }

  const { height, width } = sizeConfig[size]

  const handleClick = (e: React.MouseEvent) => {
    if (href === '#' || onClick) {
      e.preventDefault()
      if (onClick) {
        onClick()
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const logoContent = (
    <div className="flex-shrink-0">
      {!imageError ? (
        <Image
          src="/logo/logo-wedison.png"
          alt="Wedison Logo"
          width={width}
          height={height}
          className={`h-auto w-auto max-h-full object-contain ${className}`}
          style={{ height: `${height}px`, width: 'auto' }}
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <span className="font-bold text-xl tracking-tight text-wedison-navy">WEDISON</span>
      )}
    </div>
  )

  if (href === '#' || onClick) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center cursor-pointer"
        aria-label="Scroll to top"
      >
        {logoContent}
      </button>
    )
  }

  return (
    <Link href={href} className="flex items-center">
      {logoContent}
    </Link>
  )
}
