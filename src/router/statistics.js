/**
 * 日志统计
 * StatisticsDept 部门
 * StatisticsGroup 内部群
 * StatisticsMember 成员
 */
const StatisticsDept = () => import('app_view/statistics/dept')
const StatisticsGroup = () => import('app_view/statistics/group')
const StatisticsMember = () => import('app_view/statistics/member')

export default [{
    path: 'StatisticsOfDept',
    component: StatisticsDept
}, {
    path: 'StatisticsOfGroup',
    component: StatisticsGroup
}, {
    path: 'StatisticsOfMember',
    component: StatisticsMember
}, ]
