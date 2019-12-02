module.exports = {
    title: 'JDKHOME',
    description: 'linkji\'s blog.',
    head: [
        ['link', { rel: 'icon', href: '/img/logo.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/img/logo.png' }]
    ],
    themeConfig: {
        nav: [
            { text: '友链', link: '/links' },
            {
                text: '关于', items: [
                    { text: '版权声明', link: '/license.md' },
                    { text: '关于我', link: '/about.md' },
                ]
            },
        ],
        sidebar: {
            // 常用服务搭建文档
            '/dev-ops/deploy/': [
                '',
                'database',
                'ethereum-client-go',
                'seata',
                'other'
            ],
            // K8S相关
            '/dev-ops/kubernetes/': [
                '',
                'ubuntu-install-k8s',
                'deploy-nginx',
                'deploy-elk',
                'crash-loop-back-off',
                'filebeat-node-get-log',
                'proactive-log-cleanup',
                'master-ip-change',
                'restart-pod',
            ],
            // BLZO脚手架文档
            '/blzo/': [
                '',
                'manage-dev',
                'manage-auth-use'
            ],
            '/blzo-ex/': [
                '',
                'blzo-ex-basic',
                'blzo-ex-utils',
                'blzo-ex-version',
                'blzo-ex-usignin',
                'blzo-ex-redission',
                'blzo-ex-ip2region',
                'blzo-ex-consul',
                'blzo-ex-mqtt',
                'blzo-ex-task',
                'blzo-ex-google-auth',
                'blzo-ex-authj'
            ],
            // 架构
            '/architect/': [
                '',
                'distributed-timed-tasks',
            ],
            // fallback
           
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
    },
}