module.exports = {
    title: 'jdkhome',
    description: 'linkji\'s blog.',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/img/logo.png' }]
    ],
    themeConfig: {
        nav: [
            { text: '服务搭建', link: '/dev-ops/service-build/' },
            { text: 'links', link: '/links' },
            {
                text: 'about', items: [
                    { text: 'github', link: 'https://www.github.com/jdkhome' },
                    { text: 'gitee', link: 'https://gitee.com/jdkhome' },
                    { text: 'me', link: '/about.md' }
                ]
            },
        ],
        sidebar: {
            '/dev-ops/service-build/': [
                '',
                'database',
                'ethereum-client-go',
                'other'
            ],
            '/blzo/': [
                '',
                'manage-dev',
                'manage-auth-use'
            ],
            // fallback
           
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
    },
}