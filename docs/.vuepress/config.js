module.exports = {
    title: 'jdkhome',
    description: 'linkji\'s blog.',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/img/logo.png' }]
    ],
    themeConfig: {
        nav: [
            { text: 'other', link: '/other/' },
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
            '/other/': [
                '',
                'milestone-20190718',
                'test-markdown'
            ],
            // fallback
           
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
    },
}