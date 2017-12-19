const menus = [
    {
        name: '日志查询',
        icon: 'depart-signin',
        checkChilren: true,
        subMenu: [
            {
                name: '所有日志',
                path: '/LoggerAll'
            },
            {
                name: '@我的',
                path: '/LoggerAtMe'
            },
            {
                name: '我的日志',
                path: '/LoggerOfMine'
            },
            {
                name: '团队日志',
                path: '/LoggerGroup'
            },
            {
                name: '下属日志',
                type: ['deptManager'],
                path: '/LoggerUnder'
            },
        ]
    },
    {
        name: '我的草稿',
        path: '/DraftOfMine',
        icon: 'error'
    },
    {
        name: '我的收藏',
        path: '/CollectOfMine',
        icon: 'error'
    },
    {
        name: '日志统计',
        icon: 'setting-signin',
        subMenu: [
            {
                name: '按部门统计',
                path: '/StatisticsOfDepart'
            },
            {
                name: '按团队统计',
                path: '/StatisticsOfGroup'
            },
            {
                name: '按团队统计',
                path: '/StatisticsOfMember'
            },
        ]
    },
    {
        name: '日志汇总',
        path: '/LoggerSummary',
        icon: 'signin-circle',
    },
    {
        name: '模板管理',
        path: '/LoggerTemplate',
        icon: 'signin-circle',
        type: ['admin ','diary_examer'],
    },
]
export default menus;
