const menus = [
    {
        name: 'menus.logQuery',
        icon: 'icon-search',
        checkChilren: true,
        subMenu: [
            {
                name: 'menus.all',
                path: '/LoggerQueryAll'
            },
            {
                name: 'menus.atMe',
                path: '/LoggerQueryAtme'
            },
            {
                name: 'menus.myLogs',
                path: '/LoggerQueryMy'
            },
            {
                name: 'menus.internalGroupLog',
                path: '/LoggerQueryGroup'
            },
            {
                name: 'menus.lowerLevelLog',
                path: '/LoggerQueryLowerLevel'
            },
            {
                name: 'menus.subordinateLog',
                type: ['deptManager'],
                path: '/LoggerQueryUnder'
            },
        ]
    },
    {
        name: 'menus.myDraft',
        path: '/DraftOfMine',
        icon: 'icon-draft'
    },
    {
        name: 'menus.myFavorite',
        path: '/CollectOfMine',
        icon: 'icon-collect-normal'
    },
    {
        name: 'menus.logStatistic',
        icon: 'icon-statistics',
        subMenu: [
            {
                name: 'menus.department',
                path: '/StatisticsOfDept'
            },
            {
                name: 'menus.employee',
                path: '/StatisticsOfMember'
            },
            {
                name: 'menus.internalGroupReport',
                path: '/StatisticsOfGroup'
            },
        ]
    },
    {
        name: 'menus.summary',
        path: '/LoggerSummary',
        icon: 'icon-collect',
    },
    {
        name: 'menus.templateManagement',
        path: '/LoggerTemplate/manager',
        icon: 'icon-template',
        type: ['admin ','diary_examer'],
    },
]
export default menus;
