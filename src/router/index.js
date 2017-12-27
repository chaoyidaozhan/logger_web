import APP from '../view/app';  // App根组件

import LoggerDetail from '../view/logger-detail'; // 创建日志
import LoggerDetailList from '../view/logger-detail/logger-detail-list'; // 创建日志
import LoggerDetailOperate from '../view/logger-detail/logger-detail-operate'; // 创建日志

import LoggerQueryAll from '../view/logger-query/all'; // 日志查询 --所有
import LoggerQueryAtme from '../view/logger-query/atme'; // 日志查询 --@我的
import LoggerQueryGroup from '../view/logger-query/group'; // 日志查询 --团队
import LoggerQueryMy from '../view/logger-query/my'; // 日志查询 --我的
import LoggerQueryUnder from '../view/logger-query/under'; // 日志查询 --下属

import DraftOfMine from '../view/draft-mine/'; // 我的草稿
import CollectOfMine from '../view/collect-mine/'; // 我的收藏


import LoggerSummary from '../view/logger-summary/'; // 日志汇总

import LoggerTemplate from '../view/logger-template-manager/'; // 日志模板
import LoggerTemplateList from '../view/logger-template-manager/logger-template-list'; // 日志模板 --列表
import LoggerTemplateOperate from '../view/logger-template-manager/logger-template-operate'; // 日志模板 --新建编辑

import StatisticsOfDept from '../view/logger-statistics/dept'; // 日志统计 --部门
import StatisticsOfGroup from '../view/logger-statistics/group';  // 日志统计 --团队
import StatisticsOfMember from '../view/logger-statistics/member'; // 日志统计 --成员

export default [
    {
        path: '/',
        component: APP,
        children:[
            {
                path: 'LoggerDetail',
                component: LoggerDetail,
                children: [
                    {
                        path: 'template',
                        component: LoggerDetailList,
                    },
                    {
                        path: 'operate/:loggertype/:id',
                        component: LoggerDetailOperate,
                    },
                    {
                        path: '*',
                        redirect: '/LoggerDetail/template'
                    },
                ]
            },
            {
                path: 'LoggerQueryAll',
                component: LoggerQueryAll
            },
            {
                path: 'LoggerQueryAtme',
                component: LoggerQueryAtme
            },
            {
                path: 'LoggerQueryGroup',
                component: LoggerQueryGroup
            },
            {
                path: 'LoggerQueryMy',
                component: LoggerQueryMy
            },
            {
                path: 'LoggerQueryUnder',
                component: LoggerQueryUnder
            },
            {
                path: 'CollectOfMine', 		    
                component: CollectOfMine
            },
            {
                path: 'DraftOfMine', 		    	
                component: DraftOfMine
            },
            {
                path: 'StatisticsOfDept', 		    	
                component: StatisticsOfDept
            },
            {
                path: 'StatisticsOfGroup', 		    	
                component: StatisticsOfGroup
            },
            {
                path: 'StatisticsOfMember', 		    	
                component: StatisticsOfMember
            },
            {
                path: 'LoggerSummary', 		    	
                component: LoggerSummary
            },
            {
                path: 'LoggerTemplate', 		    	
                component: LoggerTemplate,
                redirect: '/LoggerTemplate/manager',
                children: [
                    {
                        path: 'manager',
                        component: LoggerTemplateList,
                    },
                    {
                        path: 'operate/:loggertype/:id',
                        component: LoggerTemplateOperate,
                    },
                    {
                        path: '*',
                        redirect: '/LoggerTemplate/manager'
                    },
                ]
            },
            {
                path: '*',
                redirect: '/LoggerQueryAll'
            },
        ]
    },

];
