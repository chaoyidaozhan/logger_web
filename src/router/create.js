import Create from 'app_view/create' // 创建日志
import CreateList from 'app_view/create/list' // 创建日志列表
import CreateOperate from 'app_view/create/operate' // 创建日志操作

export default [{
    path: 'LoggerDetail',
    component: Create,
    children: [{
            path: 'template',
            component: CreateList
        },
        {
            path: 'operate/:loggertype/:id',
            component: CreateOperate
        },
        {
            path: '*',
            redirect: '/LoggerDetail/template'
        },
    ]
}]
