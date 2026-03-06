export default {
    darkMode: false,
    logo: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="Logo" style={{ height: 28, width: 28, borderRadius: '50%' }} />
            <strong>JuLee Design System</strong>
        </span>
    ),
    project: {
        link: 'https://github.com/shuding/nextra',
    },
    docsRepositoryBase: 'https://github.com/shuding/nextra',
    footer: {
        text: 'My Design System © 2026',
    },
    useNextSeoProps() {
        return {
            titleTemplate: '%s – 디자인 시스템'
        }
    }
}
