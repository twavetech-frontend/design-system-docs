import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/tokens.css'
import '../styles/tokens-dark.css'
import '../styles/globals.css'

export const metadata = {
  title: {
    default: '아임인 디자인 시스템',
    template: '%s – 디자인 시스템',
  },
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const navbar = (
  <Navbar
    logo={
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={`${basePath}/logo.webp`}
          alt="Logo"
          style={{ height: 28, width: 28, borderRadius: 6 }}
        />
        <strong>아임인 디자인 시스템</strong>
      </span>
    }
  />
)

const footer = <Footer>아임인 디자인 시스템 © 2026</Footer>

export default async function RootLayout({ children }) {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/twavetech-frontend/design-system-docs/tree/main"
          darkMode={false}
          nextThemes={{ defaultTheme: 'light', forcedTheme: 'light' }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
