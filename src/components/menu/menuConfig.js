const menus = [
    {
        name: '日志查询',
        icon: 'icon-search',
        checkChilren: true,
        subMenu: [
            {
                name: '所有日志',
                type: ['admin', 'diary_examer', 'deptManager'],
                path: '/LoggerQueryAll'
            },
            {
                name: '@我的',
                path: '/LoggerQueryAtme'
            },
            {
                name: '我的日志',
                path: '/LoggerQueryMy'
            },
            {
                name: '团队日志',
                path: '/LoggerQueryGroup'
            },
            {
                name: '下属日志',
                type: ['deptManager'],
                path: '/LoggerQueryUnder'
            },
        ]
    },
    {
        name: '我的草稿',
        path: '/DraftOfMine',
        icon: 'icon-draft'
    },
    {
        name: '我的收藏',
        path: '/CollectOfMine',
        icon: 'icon-collect-normal'
    },
    {
        name: '日志统计',
        icon: 'icon-statistics',
        subMenu: [
            {
                name: '按部门统计',
                path: '/StatisticsOfDept'
            },
            {
                name: '按团队统计',
                path: '/StatisticsOfGroup'
            },
            {
                name: '按人员统计',
                path: '/StatisticsOfMember'
            },
        ]
    },
    {
        name: '日志汇总',
        path: '/LoggerSummary',
        icon: 'icon-collect',
    },
    {
        name: '模板管理',
        path: '/LoggerTemplate/manager',
        icon: 'icon-template',
        type: ['admin ','diary_examer'],
    },
]
export default menus;
