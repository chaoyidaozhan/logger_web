import APP from '../view/app';  // App根组件

import LoggerQuery from '../view/logger-query/'; // 日志查询

import DraftOfMine from '../view/draft-mine/'; // 我的草稿
import CollectOfMine from '../view/collect-mine/'; // 我的收藏


import LoggerSummary from '../view/logger-summary/'; // 日志汇总
import LoggerTemplate from '../view/logger-template/'; // 日志模板

import StatisticsOfDepart from '../view/logger-statistics/'; // 日志统计 --部门
import StatisticsOfGroup from '../view/logger-statistics/';  // 日志统计 --团队
import StatisticsOfMember from '../view/logger-statistics/'; // 日志统计 --成员




export default [
    {
        path: '/',
        component: APP,
        children:[
            {
                path: 'LoggerQuery/:range',
                component: LoggerQuery
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
           
        ]
    },

];
