const menus = [
    {
        name: '日志查询',
        icon: 'depart-signin',
        checkChilren: true,
        subMenu: [
            {
                name: '所有日志',
                path: '/LoggerQuery/0'
            },
            {
                name: '@我的',
                path: '/LoggerQuery/4'
            },
            {
                name: '我的日志',
                path: '/LoggerQuery/-1'
            },
            {
                name: '团队日志',
                path: '/LoggerQuery/3'
            },
            {
                name: '下属日志',
                type: ['deptManager'],
                path: '/LoggerQuery/1'
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
                name: '按人员统计',
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
