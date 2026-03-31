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

        {/* Landing Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredItem(page.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              <Link href={page.path}>
                <div
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
                    hoveredItem === page.id
                      ? 'border-electric-blue shadow-lg scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        page.config.badge?.color || 'bg-electric-blue/10 text-electric-blue'
                      }`}
                    >
                      <FiTag className="text-sm" />
                      {page.config.badge?.text || page.variantId}
                    </span>
                    <FiExternalLink
                      className={`text-lg transition-colors ${
                        hoveredItem === page.id ? 'text-electric-blue' : 'text-slate-400'
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {page.config.name || `${page.campaignId} - ${page.variantId}`}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {page.config.description || 'Landing page untuk campaign ini'}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar />
                      {page.config.date || 'Jan 2026'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers />
                      {page.config.targetAudience || 'General'}
                    </span>
                  </div>

                  {/* Path */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <code className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
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
