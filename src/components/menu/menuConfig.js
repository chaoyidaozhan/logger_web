const menus = [
    {
        name: '我的考勤',
        path: '/MyCheckin',
        icon: 'my-signin'
    },
    {
        name: '申请记录',
        path: '/CheckinRecord',
        icon: 'repair-signin'
    },
    {
        name: '部门考勤',
        type: ['attendanceAdmin', 'signinAdmin', 'deptManager'],
        icon: 'depart-signin',
        subMenu: [
            {
                name: '考勤审批',
                path: '/DepartmentCheckinDeal'
            },
            {
                name: '考勤统计',
                path: '/DepartmentCheckinCount'
            }
        ]
    },
    {
        name: '异常签到',
        path: '/CheckinAnalyse',
        type: ['attendanceAdmin', 'signinAdmin'],
        icon: 'error'
    },
    {
        name: '考勤设置',
        type: ['attendanceAdmin', 'signinAdmin'],
        icon: 'setting-signin',
        subMenu: [
            {
                name: '考勤规则',
                path: '/SigninRule'
            },
            {
                name: '类型设置',
                path: '/CheckinSettingType'
            }
        ]
    },
    {
        name: '考勤周期',
        path: '/CheckinCycle',
        icon: 'signin-circle',
        type: ['attendanceAdmin'],
    },
    {
        name: '权限设置',
        type: ['attendanceAdmin'],
        icon: 'setting-limit',
        subMenu: [
            {
                name: '签到管理员',
                path: '/LimitsSetAdmin'
            },
            {
                name: '审批授权',
                path: '/LimitsSetApprove'
            },
            {
                name: '考勤白名单',
                path: '/LimitsWhiteList'
            },
            {
                name: '考勤通知',
                path: '/LimitsCheckinNotice'
            }
        ]
    },
    {
        name: '设置签到提示语',
        path: '/CheckinTips',
        icon: 'signin-tips',
        type: ['identity'],
    },
]
export default menus;
