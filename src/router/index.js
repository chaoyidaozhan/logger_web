import APP from 'app_view/app' // App根组件

import create from './create'
import query from './query'
import draft from './draft'
import collect from './collect'
import statistics from './statistics'
import summary from './summary'
import summaryNew from './summary-new'
import template from './template'
import deploy from './deploy'
import groupTemplate from './groupTemplate'
import globalModal from './globalModal'

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
        ...summaryNew,
        ...template,
        ...deploy,
        ...groupTemplate,
        ...globalModal,
        {
            path: '*',
            redirect: '/LoggerQueryAll'
        }
    ]
}]
