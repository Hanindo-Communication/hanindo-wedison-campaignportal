'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'

interface PasswordPromptProps {
  onSuccess: () => void
  storageKey?: string
}

const CORRECT_PASSWORD = 'admin123'

export default function PasswordPrompt({ onSuccess, storageKey = 'wedison-admin-auth' }: PasswordPromptProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  // Check if already authenticated on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem(storageKey)
    if (isAuthenticated === 'true') {
      onSuccess()
    }
    setIsChecking(false)
  }, [onSuccess, storageKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(storageKey, 'true')
      onSuccess()
    } else {
      setError('Password salah. Silakan coba lagi.')
      setPassword('')
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-electric-blue to-secondary-teal p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FiLock className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-white/80 mt-2">Masukkan password untuk mengakses dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-electric-blue transition-colors text-slate-800 placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
                >
                  <FiAlertCircle className="text-lg flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-electric-blue text-white font-semibold rounded-lg hover:bg-electric-blue-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Masuk
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-center text-sm text-slate-500">
              Wedison Landing Page Admin
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
