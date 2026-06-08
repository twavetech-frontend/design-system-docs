import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

// Merge the docs-theme MDX components with any per-page overrides.
const themeComponents = getThemeComponents()

export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
  }
}
