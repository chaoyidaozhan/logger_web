import Template from 'app_view/template/' // 日志模板
import TemplateList from 'app_view/template/list' // 日志模板 --列表
import TemplateOperate from 'app_view/template/operate' // 日志模板 --新建编辑

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
