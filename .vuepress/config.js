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
                'nginx',
                'mongodb',
                'database',
                'seata',
                'other'
            ],
            '/dev-ops/block-chain/': [
                '',
                'omnicore',
                'go-ethereum'
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
                'kubernetes-assigning-pod-to-nodes',
                'jenkins-pipeline-k8s',
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
                'blzo-ex-mqtt',
                'blzo-ex-google-auth',
                'blzo-ex-authj'
            ],
            '/twiggy/':[
                {
                    title: 'Twiggy',
                    collapsable: false,
                    children: [
                        '',
                        'scene',
                    ]
                },
                {
                    title: '快速开始',
                    collapsable: false,
                    children: [
                        'what-does-need-user-to-do',
                        'basic-concept',
                        'mod',
                        'preview',
                    ]
                }
            ],
            '/other/diy-computer/':[
                {
                    title: '什么是/为什么',
                    collapsable: false,
                    children: [
                        '',
                    ]
                },
                {
                    title: '硬件知识科普',
                    collapsable: false,
                    children: [
                        'cpu',
                        'gpu',
                        'mem',
                        'disk',
                        'board',
                        'power',
                    ]
                },
            ],
            // 架构
            '/architect/': [
                {
                    title: '序',
                    collapsable: false,
                    children: [
                        '',
                        'index/two-ways-for-programmers'
                    ]
                },
                {
                    title: '杂货',
                    collapsable: false,
                    children: [
                        'other/distributed-timed-tasks',
                    ]
                },
            ],
            // fallback
           
        },
        sidebarDepth: 2,
        lastUpdated: true,
    },
}