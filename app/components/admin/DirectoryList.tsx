'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiExternalLink, FiCalendar, FiTag, FiUsers, FiLogOut } from 'react-icons/fi'
import { CAMPAIGNS, type CampaignConfig } from '@/lib/campaigns'

interface DirectoryListProps {
  onLogout: () => void
}

export default function DirectoryList({ onLogout }: DirectoryListProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Generate landing page list from campaigns config
  const landingPages = Object.entries(CAMPAIGNS).flatMap(([campaignId, variants]) =>
    Object.entries(variants).map(([variantId, config]) => ({
      id: `${campaignId}-${variantId}`,
      campaignId,
      variantId,
      path: `/${campaignId}/${variantId}`,
      config: config as CampaignConfig,
    }))
  )

  const handleLogout = () => {
    localStorage.removeItem('wedison-admin-auth')
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Wedison Admin</h1>
                <p className="text-xs text-slate-500">Landing Page Directory</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiLogOut className="text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-electric-blue">{landingPages.length}</div>
            <div className="text-sm text-slate-600">Total Landing Pages</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-success-green">{Object.keys(CAMPAIGNS).length}</div>
            <div className="text-sm text-slate-600">Active Campaigns</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-orange-500">Apr 2026</div>
            <div className="text-sm text-slate-600">Latest campaign slot</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-purple-500">Live</div>
            <div className="text-sm text-slate-600">Status</div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Landing Pages</h2>
          <div className="text-sm text-slate-500">
            Click to preview
          </div>
        </div>

        <div className="grid items-stretch md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredItem(page.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative flex min-h-0 h-full"
            >
              <Link href={page.path} className="flex min-h-0 w-full min-w-0">
                <div
                  className={`flex h-full min-h-0 w-full flex-col rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-300 ${
                    hoveredItem === page.id
                      ? 'border-electric-blue shadow-lg scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Badge */}
                  <div className="mb-4 flex shrink-0 items-start justify-between gap-2">
                    <span
                      className={`inline-flex min-w-0 max-w-[85%] items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        page.config.badge?.color || 'bg-electric-blue/10 text-electric-blue'
                      }`}
                    >
                      <FiTag className="shrink-0 text-sm" />
                      <span className="truncate">{page.config.badge?.text || page.variantId}</span>
                    </span>
                    <FiExternalLink
                      className={`shrink-0 text-lg transition-colors ${
                        hoveredItem === page.id ? 'text-electric-blue' : 'text-slate-400'
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-snug text-slate-800">
                    {page.config.name || `${page.campaignId} - ${page.variantId}`}
                  </h3>

                  {/* Description — tinggi baris tetap 2 untuk semua kartu */}
                  <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-600">
                    {page.config.description || 'Landing page untuk campaign ini'}
                  </p>

                  {/* Meta — satu baris, audiens panjang dipotong */}
                  <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex shrink-0 items-center gap-1">
                      <FiCalendar className="shrink-0" />
                      {page.config.date || 'Jan 2026'}
                    </span>
                    <span className="flex min-w-0 max-w-full items-center gap-1">
                      <FiUsers className="shrink-0" />
                      <span className="truncate" title={page.config.targetAudience || 'General'}>
                        {page.config.targetAudience || 'General'}
                      </span>
                    </span>
                  </div>

                  {/* Path — selalu di dasar kartu */}
                  <div className="mt-auto shrink-0 border-t border-slate-100 pt-4">
                    <code className="block truncate rounded bg-slate-50 px-2 py-1 text-xs text-slate-500">
                      {page.path}
                    </code>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State (if no campaigns) */}
        {landingPages.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <FiTag className="text-2xl text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum ada landing page</h3>
            <p className="text-slate-500">Tambahkan campaign baru di lib/campaigns.ts</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 PT Wedison Indonesia. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Admin Dashboard v1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
