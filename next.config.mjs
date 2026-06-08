import nextra from 'nextra'

const withNextra = nextra({
  // nextra v4: theme/themeConfig are no longer passed here.
  // Theme is configured via the <Layout> component in app/layout.jsx.
})

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
const basePath = isGitHubPages ? '/design-system-docs' : ''

export default withNextra({
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix: isGitHubPages ? '/design-system-docs/' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
})
