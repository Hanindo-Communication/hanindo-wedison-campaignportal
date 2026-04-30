import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import TikTokPageView from './components/analytics/TikTokPageView'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Wedison - Motor Listrik Hemat BBM | SuperCharge 15 Menit',
    template: '%s | Wedison Motor Listrik',
  },
  description: 'Hemat 60% biaya BBM dengan motor listrik Wedison. SuperCharge 15 menit, cicilan mulai Rp 400rb/bulan. DP 0% tersedia.',
  keywords: [
    'motor listrik',
    'motor listrik murah',
    'motor listrik indonesia',
    'wedison',
    'supercharge',
    'hemat bbm',
    'motor listrik jakarta',
    'cicilan motor listrik',
    'motor listrik ojol',
  ],
  authors: [{ name: 'Wedison Indonesia' }],
  creator: 'Wedison Indonesia',
  publisher: 'PT Wedison Indonesia',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Wedison - Motor Listrik Hemat BBM | SuperCharge 15 Menit',
    description: 'Hemat 60% biaya BBM dengan motor listrik Wedison. SuperCharge 15 menit, cicilan mulai Rp 400rb/bulan.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Wedison Motor Listrik',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedison - Motor Listrik Hemat BBM',
    description: 'Hemat 60% biaya BBM dengan motor listrik Wedison. SuperCharge 15 menit.',
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1B8C5A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={montserrat.variable}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NRFXB3GJ');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* TikTok Pixel Code Start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D5M7DLBC77U27TJUP94G');
  ttq.page();
}(window, document, 'ttq');`,
          }}
        />
        {/* TikTok Pixel Code End */}

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${montserrat.className} antialiased text-rendering-optimize`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NRFXB3GJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <TikTokPageView />
        {children}
      </body>
    </html>
  )
}
