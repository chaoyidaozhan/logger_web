/**
 * 日志统计
 * StatisticsDept 部门
 * StatisticsGroup 内部群
 * StatisticsMember 成员
 */
import StatisticsDept from 'app_view/statistics/dept'
import StatisticsGroup from 'app_view/statistics/group'
import StatisticsMember from 'app_view/statistics/member'

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
