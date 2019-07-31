/**
 * Template 日志模板
 * TemplateList 日志模板列表 --列表
 * TemplateOperate 日志模板 --新增编辑
 */
const Template = () => import('app_view/template/')
const TemplateList = () => import('app_view/template/list')
const TemplateOperate = () => import('app_view/template/operate')

export default [
    {
        path: 'LoggerTemplate',
        component: Template,
        children: [{
                path: 'manager',
                component: TemplateList,
            },
            {
                path: 'operate/:id',
                component: TemplateOperate,
            },
            {
                path: '*',
                redirect: '/LoggerTemplate/manager'
            }
        ]
    }
]
