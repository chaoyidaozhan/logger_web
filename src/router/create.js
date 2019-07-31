/**
 * Create 创建日志
 * CreateList 创建日志列表
 * CreateOperate 创建日志操作
 */
const Create = () => import('app_view/create')
const CreateList = () => import('app_view/create/list')
const CreateOperate = () => import('app_view/create/operate')

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
