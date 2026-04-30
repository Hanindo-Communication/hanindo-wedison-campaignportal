'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  href?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  href,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  // Base classes with mobile-first touch targets (min 48px)
  const baseClasses = `
    font-semibold rounded-full transition-all duration-300 
    inline-flex items-center justify-center gap-2
    min-h-[48px] touch-target
    active:scale-95 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `.trim().replace(/\s+/g, ' ')
  
  const variantClasses = {
    primary: 'bg-electric-blue text-white hover:bg-electric-blue-dark shadow-lg hover:shadow-xl',
    secondary: 'bg-success-green text-white hover:bg-green-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white bg-transparent',
    ghost: 'text-slate-700 hover:bg-slate-100',
  }
  
  // Mobile-first sizes with adequate touch targets
  const sizeClasses = {
    small: 'px-4 py-2.5 text-sm min-h-[40px]',
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[56px]',
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`
  
  const MotionButton = motion.button
  const MotionLink = motion.a

  // Handle scroll to section
  const handleClick = (e: React.MouseEvent) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    onClick?.()
  }
  
  if (href) {
    // Check if it's an internal anchor or external link
    const isExternal = href.startsWith('http') || href.startsWith('https://wa.me')
    
    return (
      <MotionLink
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={classes}
        onClick={handleClick}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {children}
      </MotionLink>
    )
  }
  
  return (
    <MotionButton
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </MotionButton>
  )
}
