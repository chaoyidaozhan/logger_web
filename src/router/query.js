/**
 * 日志查询
 * QueryAll 所有日志
 * QueryAtme @我的
 * QueryGroup 内部群
 * QueryMy 我的
 * QueryUnder 下属
 * QueryLevel 下级
 */

const QueryAll = () => import('app_view/query/all')
const QueryAtme = () => import('app_view/query/atme')
const QueryGroup = () => import('app_view/query/group')
const QueryMy = () => import('app_view/query/my')
const QueryUnder = () => import('app_view/query/under')
const QueryLevel = () => import('app_view/query/level')
const QueryUnread = () => import('app_view/query/unread')

export default [{
    path: 'LoggerQueryAll',
    component: QueryAll
}, {
    path: 'LoggerQueryAtme',
    component: QueryAtme
}, {
    path: 'LoggerQueryGroup',
    component: QueryGroup
}, {
    path: 'LoggerQueryMy',
    component: QueryMy
}, {
    path: 'LoggerQueryUnder',
    component: QueryUnder
}, {
    path: 'LoggerQueryLowerLevel',
    component: QueryLevel
}, {
    path: 'LoggerQueryUnread',
    component: QueryUnread
}, ]
