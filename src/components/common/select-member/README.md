# 日志选人组件
# 
#  注意事项
#  		选人组件依赖 iview ajax.js avatar
# 	 	需要在vue.use(iview) Vue.prototype.$ajax=ajax ; 后引入
# 
#  用法
#		组件方法内调用 
# 		this.$selectMember.show( info , callback ); 
# 
# 		** info 为配置选项 , callback为点击确定调用方法, callback接受数为 选中后的信息;
# 		** info 为配置 ;
# 		var info = {
# 			title:'选人',    //标题
# 			dep:true,		//是否选择部门(可不传)
# 			team:true,		//是否选择团队(可不传)
# 			man:true,		//是否选择人员(可不传)
# 			selected: [
# 				dep:[],		//之前选的 部门
# 				team:[],	//之前选的 团队
# 				man:[]		//之前选的 人员
# 			]
# 		};
# 		
#   ---------------------------------------------------------------
#		示例 
#		
# 		this.$selectMember.show( info ,(res)=>{
# 			console.log(res)
# 		})
#
#		var info={
#            title:'选择可见范围',  
#            dep:true,
#            team:true,
#            man:true,    
#            selected : selected
#		};
# 		var selected = {
#		    "dep": [{
#		            "deptId": 96,
#		            "szId": null,
#		            "deptName": "佛山业务部11",
#		            "status": null,
#		            "parentId": "95",
#		            "createTime": null,
#		            "updateTime": null,
#		            "leaderMemberId": null,
#		            "haveSub": 1,
#		            "open": true,
#		            "childMount": true,
#		            "checked": true,
#		            "openChild": true
#		    }],
#		    "team": [{
#		            "szId": null,
#		            "gid": 346,
#		            "groupName": "红包群",
#		            "groupLogo": "http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/1/2252/201508/12/1439383982WR1i.png.thumb.jpg",
#		            "pub": null,
#		            "memberId": null,
#		            "groupMemberCount": 18,
#		            "newFeedCount": null,
#		            "status": null,
#		            "createTime": null,
#		            "updateTime": null,
#		            "checked": true
#		    }],
#		    "man": [{
#		            "instanceId": null,
#		            "accountId": null,
#		            "userName": "傅英杰",
#		            "memberId": "1797",
#		            "szId": 1,
#		            "avatar": "http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/avatar/000/00/17/97.jpg.thumb.jpg",
#		            "email": null,
#		            "mobile": null,
#		            "birthday": null,
#		            "sex": null,
#		            "duty": "客户助理",
#		            "deptId": 375,
#		            "deptName": "销售二部",
#		            "createTime": null,
#		            "updateTime": null,
#		            "spellName": null,
#		            "status": null,
#		            "staffNo": null,
#		            "employedDate": null,
#		            "leaveDate": null,
#		            "appId": null,
#		            "remark": null,
#		            "leader": null,
#		            "subGroups": null,
#		            "realName": null,
#		            "company": null,
#		            "admin": false,
#		            "deptManager": false,
#		            "groupManager": false,
#		            "checked": true
#		    }]
#		};
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
# 
