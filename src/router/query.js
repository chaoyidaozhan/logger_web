/**
 * 日志查询
 * QueryAll 所有日志
 * QueryAtme @我的
 * QueryGroup 内部群
 * QueryMy 我的
 * QueryUnder 下属
 * QueryLevel 下级
 */
import QueryAll from 'app_view/query/all'
import QueryAtme from 'app_view/query/atme'
import QueryGroup from 'app_view/query/group'
import QueryMy from 'app_view/query/my'
import QueryUnder from 'app_view/query/under'
import QueryLevel from 'app_view/query/level'

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
}, ]
