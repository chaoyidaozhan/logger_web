import APP from '../view/app';  // App根组件

import LoggerQueryAll from '../view/logger-query/all'; // 日志查询 --所有
import LoggerQueryAtme from '../view/logger-query/atme'; // 日志查询 --@我的
import LoggerQueryGroup from '../view/logger-query/group'; // 日志查询 --团队
import LoggerQueryMy from '../view/logger-query/my'; // 日志查询 --我的
import LoggerQueryUnder from '../view/logger-query/under'; // 日志查询 --下属

import DraftOfMine from '../view/draft-mine/'; // 我的草稿
import CollectOfMine from '../view/collect-mine/'; // 我的收藏


import LoggerSummary from '../view/logger-summary/'; // 日志汇总
import LoggerTemplate from '../view/logger-template/'; // 日志模板

import StatisticsOfDepart from '../view/logger-statistics/depart'; // 日志统计 --部门
import StatisticsOfGroup from '../view/logger-statistics/group';  // 日志统计 --团队
import StatisticsOfMember from '../view/logger-statistics/member'; // 日志统计 --成员

export default [
    {
        path: '/',
        component: APP,
        children:[
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
                path: 'StatisticsOfDepart', 		    	
                component: StatisticsOfDepart
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
                component: LoggerTemplate
            },
            {
                path: '*',
                redirect: '/LoggerQueryAll'
            },
        ]
    },

];
