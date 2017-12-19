const menus = [
    {
        name: '日志查询',
        icon: 'depart-signin',
        checkChilren: true,
        subMenu: [
            {
                name: '所有日志',
                path: '/DepartmentCheckinDeal'
            },
            {
                name: '@我的',
                path: '/DepartmentCheckinCount'
            },
            {
                name: '我的日志',
                path: '/DepartmentCheckinCount'
            },
            {
                name: '团队日志',
                path: '/DepartmentCheckinCount'
            },
            {
                name: '下属日志',
                type: ['deptManager'],
                path: '/DepartmentCheckinCount'
            },
        ]
    },
    {
        name: '我的草稿',
        path: '/CheckinAnalyse',
        icon: 'error'
    },
    {
        name: '我的收藏',
        path: '/CheckinAnalyse',
        icon: 'error'
    },
    {
        name: '日志统计',
        icon: 'setting-signin',
        subMenu: [
            {
                name: '按部门统计',
                path: '/SigninRule'
            },
            {
                name: '按团队统计',
                path: '/CheckinSettingType'
            }
        ]
    },
    {
        name: '日志汇总',
        path: '/CheckinCycle',
        icon: 'signin-circle',
    },
    {
        name: '模板管理',
        path: '/CheckinCycle',
        icon: 'signin-circle',
        type: ['admin ','diary_examer'],
    },
]
export default menus;
