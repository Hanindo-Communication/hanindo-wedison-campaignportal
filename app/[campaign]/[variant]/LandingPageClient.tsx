'use client'

import { type CampaignConfig } from '@/lib/campaigns'
import { AdAttributionProvider } from '@/app/contexts/AdAttributionContext'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import FloatingWhatsAppButton from '@/app/components/ui/FloatingWhatsAppButton'
import HeroSection from './sections/HeroSection'
import PainPointsSection from '@/app/components/sections/PainPointsSection'
import CombinedSavingsSection from '@/app/components/sections/CombinedSavingsSection'
import ModelsTabSection from '@/app/components/sections/ModelsTabSection'
import FinancingSection from '@/app/components/sections/FinancingSection'
import ShowroomSection from '@/app/components/sections/ShowroomSection'
import FAQSection from '@/app/components/sections/FAQSection'
import LeadFormSection from '@/app/components/sections/LeadFormSection'
import OjolRoutePromoSection from './sections/OjolRoutePromoSection'
import WhyWedisonSection from '@/app/components/sections/WhyWedisonSection'
import PromoTickerSection from '@/app/components/sections/PromoTickerSection'

interface LandingPageClientProps {
  campaign: string
  variant: string
  config: CampaignConfig
}

// Map section names to components
const SECTION_COMPONENTS: Record<string, React.ComponentType<{ config?: CampaignConfig }>> = {
  'pain-points': PainPointsSection,
  'combined-savings': CombinedSavingsSection,
  models: ModelsTabSection,
  financing: FinancingSection,
  showroom: ShowroomSection,
  faq: FAQSection,
  'lead-form': LeadFormSection,
  'ojol-route-promo': OjolRoutePromoSection,
  'why-wedison': WhyWedisonSection,
  'promo-ticker': PromoTickerSection,
}

export default function LandingPageClient({ config }: LandingPageClientProps) {
  const navVariant = config.navigation === 'minimal' ? 'minimal' : 'default'

  // Render sections based on config
  const renderSection = (sectionName: string) => {
    // Handle hero section separately
    if (sectionName === 'hero') {
      return <HeroSection key="hero" config={config} />
    }

    const Component = SECTION_COMPONENTS[sectionName]
    if (!Component) {
      console.warn(`Unknown section: ${sectionName}`)
      return null
    }

    return <Component key={sectionName} config={config} />
  }

  return (
    <AdAttributionProvider>
      <main className="min-h-screen bg-white overflow-x-hidden">
        <Navbar variant={navVariant} />

        {/* Render sections in order defined by config */}
        {config.sections.map((section) => renderSection(section))}

        <Footer />

        {/* Floating WhatsApp Button - Always Visible */}
        <FloatingWhatsAppButton />
      </main>
    </AdAttributionProvider>
  )
}
