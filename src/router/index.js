import APP from 'app_view/app' // App根组件

import create from './create'
import query from './query'
import draft from './draft'
import collect from './collect'
import statistics from './statistics'
import summary from './summary'
import template from './template'

export default [{
    path: '/',
    component: APP,
    children: [
        ...create,
        ...query,
        ...draft,
        ...collect,
        ...statistics,
        ...summary,
        ...template,
        {
            path: '*',
            redirect: '/LoggerQueryAll'
        }
    ]
}]
