const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
    primaryHue: 259,
    primarySaturation: 63,
    darkMode: false,
    nextThemes: {
        defaultTheme: 'light',
        forcedTheme: 'light',
    },
    logo: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={`${basePath}/logo.webp`} alt="Logo" style={{ height: 28, width: 28, borderRadius: 6 }} />
            <strong>아임인 디자인 시스템</strong>
        </span>
    ),
    project: {
        link: 'https://github.com/shuding/nextra',
    },
    docsRepositoryBase: 'https://github.com/shuding/nextra',
    footer: {
        text: '아임인 디자인 시스템 © 2026',
    },
    useNextSeoProps() {
        return {
            titleTemplate: '%s – 디자인 시스템'
        }
    }
}
