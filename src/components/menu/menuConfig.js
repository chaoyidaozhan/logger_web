const menus = [
    {
        name: 'menus.logQuery',
        icon: 'icon-search-2018',
        checkChilren: true,
        subMenu: [
            {
                name: 'menus.all',
                path: '/LoggerQueryAll'
            },
            {
                name: 'menus.unread',
                path: '/LoggerQueryUnread'
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
                type: ['deptManager'],
                path: '/LoggerQueryLowerLevel'
            }
        ]
    },
    {
        name: 'menus.myDraft',
        path: '/DraftOfMine',
        icon: 'icon-draft-2018'
    },
    {
        name: 'menus.myFavorite',
        path: '/CollectOfMine',
        icon: 'icon-collect-normal-2018'
    },
    {
        name: 'menus.logStatistic',
        icon: 'icon-statistics-2018',
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
        icon: 'icon-collect-2018'
    },
    {
        name: 'menus.templateManagement',
        path: '/LoggerTemplate/manager',
        icon: 'icon-manage',
        type: ['admin','diary_examer']
    },
    {
        name: 'menus.statistics',
        path: '/LoggerSummaryNew',
        icon: 'icon-statistics-2018',
        showStatistics: true,
        type: ['showStatistics']
    },
    {
        name: 'menus.deploy',
        path: '/Deploy',
        icon: 'icon-template-2018',
        showStatistics: true,
        type: ['showConfig']
    }
]
export default menus;
