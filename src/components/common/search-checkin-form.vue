<template>
	<div class="search_checkin_form">
        <Form ref="formInline" :model="formInfo"  :inline="true">
        	<!-- 查询班次 -->
			<template v-if="showClassInfo">
				<FormItem>
					<span class="label">班次</span>
				</FormItem>
				<FormItem>
					<AutoComplete v-model="formInfo.classInfo.workName" @on-search="searchClass" style="width: 118px">
						<Option v-for="option in classOptions"
								:disabled="option.disabled" 
								:value="option.workName" :key="option.workName">
							<span class="demo-auto-complete-title">{{ option.workName }}</span>
						</Option>
					</AutoComplete>	
				</FormItem>
			</template>
        	<!-- 选择姓名 -->
			<template v-if="showUserInfo">
				<FormItem>
					<span class="label">姓名</span>
				</FormItem>
				<FormItem>
					<AutoComplete v-model="formInfo.userInfo.userName" @on-search="searchName" style="width: 118px">
						<Option v-for="option in userOptions"
								@click.native="handleSelect(option, 'userInfo')"
								:disabled="option.disabled" 
								:value="option.userName" :key="option.accountId">
							<span class="demo-auto-complete-title">{{ option.userName }}</span>
							<span v-if="option.deptName" class="demo-auto-complete-cation">{{ option.deptName }}</span>
						</Option>
					</AutoComplete>	
				</FormItem>
			</template>
	        <!-- 选择部门 -->
			<template  v-if="showDeptInfo">
				<FormItem>
					<span class="label">部门</span>
				</FormItem>
				<FormItem>
					<AutoComplete v-model="formInfo.deptInfo.deptName" @on-search="searchDept" style="width: 118px">
						<Option v-for="option in deptOptions" 
								@click.native="handleSelect(option, 'deptInfo')"
								:disabled="option.disabled" 
								:value="option.deptName" :key="option.deptId">
							<span class="demo-auto-complete-title">{{ option.deptName }}</span>
						</Option>
					</AutoComplete>	
				</FormItem>
			</template>
	        <!-- 选择起止时间 -->
	        <FormItem>
	        	<span class="label">时间</span>
	        </FormItem>
	        <FormItem>
	            <DatePicker 
	            	style="width:205px"
	            	:value="formInfo.timeArr"
					:clearable="false"
	            	@on-change="changeDate" 
	            	format="yyyy/MM/dd" 
	            	type="daterange" 
	            	placement="bottom-end"/>
	        </FormItem>
	        <!-- 选择补考勤类型 -->
			<template v-if="showStatus">
				<FormItem>
					<span class="label">补考勤类型</span>
				</FormItem>
				<FormItem>
					<Select v-model="formInfo.status" style="min-width: 65px;">
						<Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
					</Select>
				</FormItem>
			</template>
			<!-- 按钮 -->
			 <FormItem>
					<Button type="ghost" class="btn query" @click="handleQuery">查询</Button>
					<Button type="ghost" class="btn export_xlsx" @click="handleExportXlsx">导出</Button>
					<Button type="ghost" class="btn export_yonyou" @click="handleExportYonyou" 
							style="border:1px solid rgb(250, 79, 82);color:rgb(250, 79, 82)"
							v-show="showYonyouBtn">股份定制</Button>					
					<Button type="ghost" class="btn export_txt" @click="handleExportTxt" 
							style="border:1px solid rgb(250, 79, 82);color:rgb(250, 79, 82)"
							v-show="showTxtBtn">导出txt</Button>
			 </FormItem>
        </Form>

    </div>
</template>
<script type="text/javascript">
import FormatTime from '../../filters/format-time';
import config from '../../config/config';
export default {
	props: {
		showClassInfo: { // 是否显示班次
			type: Boolean,
			default: false
		},
		showUserInfo: { // 是否显示姓名
			type: Boolean,
			default: true
		},
		showDeptInfo: {	 // 是否显示部门
			type: Boolean,
			default: true
		},
		showStatus: {	// 是否显示状态
			type: Boolean,
			default: true
		},
		days: {	
			type: Number,
			default: 7
		},
		// 导出xlsx种类
		exportXlsxType:{},

	},
	data() {
		let date = new Date();
		let endDate = FormatTime(new Date(date.valueOf()), 'YYYY-MM-DD');
		let beginDate = FormatTime(new Date(date.valueOf() - 86400000 * this.days), 'YYYY-MM-DD');
		return {
			formInfo: { // 默认数据
				classInfo: {},
				userInfo: {},
				deptInfo: {},
				timeArr: [beginDate, endDate],
				status:-1
			},
			timer: null, // 搜索节流
			classOptions: [{ // 班次数据
				workName: "选择班次",
				disabled: true
			}],
			deptOptions: [{ // 部门数据
				deptName: "选择部门",
				deptId: -100,
				disabled: true
			}],
			userOptions: [{
				userName: '选择人员', // 人员数据
				accountId: -100,
				disabled: true
			}],
			statusList: [{  // 补考勤类型状态
				typeName: '全部',
				id: -1
			}],
		}
	},
	computed:{
		// 导出txt按钮
		showTxtBtn(){
			let memberId = this.$store.state.userInfo.memberId ;
			//3245662 鹏飞集团导出txt 3108596汪沛
			let arr = ["14627","231546","3014871","3161454","711","2836287","2834277","413347","386798","3245662","3108596"]; 
			if(arr.includes(memberId)){
				return true
			}else{
				return false
			}
		},
		// 股份定制按钮
		showYonyouBtn(){
			let memberId = this.$store.state.userInfo.memberId ;
			//秦艳霞 2887019,董蕾 2877521,柏娜 2889870, 刘秀 2836287
			let arr = ["2887019","2877521","2889870","2836287","231546"];  
			if(arr.includes(memberId)){
				return true
			}else{
				return false
			}
		},
		token(){
			return (storage.get('$sign') && storage.get('$sign').token) || config.token;
		}
	},
	methods: {
		handleSelect(params, type) { // 点击搜索的option
			this.formInfo[type] = {
				...params
			};
		},
		searchClass(workName){ // 查找班次
			if (workName.trim()) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$ajax({
						url: '/signin/workShift/getWorkNames',
						data: {
							workName: workName.trim(),
						},
						success: (res) => {
							if (res && res.code == 0 && res.data) {
								// 解决bug 当数组长度为0 AutoComplete 可能不显示
								this.classOptions = res.data.concat([{
									workName: "选择班次",
									disabled: true
								}])
							} else {
								this.$Message.warning((res && res.msg) || '网络错误');
							}
						},
						error: (res) => {
							this.$Message.error((res && res.msg) || '网络错误');
						}
					})
				}, 300)
			}
		},
		searchName(username) { // 查找名字
			this.formInfo.userInfo.accountId = '';
			if (username.trim()) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$ajax({
						url: '/signin/dept/searchUser',
						data: {
							userName: username.trim(),
						},
						success: (res) => {
							if (res && res.code == 0 && res.data) {
								// 解决bug 当数组长度为0 AutoComplete 可能不显示
								this.userOptions = res.data.concat([{
									userName: '选择人员',
									accountId: -100,
									disabled: true
								}])
							} else {
								this.$Message.warning((res && res.msg) || '网络错误');
							}
						},
						error: (res) => {
							this.$Message.error((res && res.msg) || '网络错误');
						}
					})
				}, 300)
			}
		},
		searchDept(deptName) { // 查找部门
			this.formInfo.deptInfo.deptId = '';
			if (!!deptName.trim()) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					// 获取人员列表
					this.$ajax({
						url: '/signin/dept/getDeptByName',
						data: {
							deptName: deptName.trim(),
						},
						success: (res) => {
							if (res && res.code == 0 && res.data) {
								// 解决bug 当数组长度为0 AutoComplete 可能不显示
								this.deptOptions = res.data.concat([{
									deptName: "选择部门",
									deptId: -100,
									disabled: true
								}])
							} else {
								this.$Message.warning((res && res.msg) || '网络错误');
							}
						},
						error: (res) => {
							this.$Message.error((res && res.msg) || '网络错误');
						}
					})
				}, 300)
			}
		},
		changeDate(time) { // 日期改变
			this.formInfo.timeArr = time.map(v => {
				return v.replace(/\//g, '-');
			});
		},
		getStatusList() { // 请求补考勤类型
			this.$ajax({
				url: '/signin//fillAttentanceType/getList',
				success: (res) => {
					if (res && res.code == 0) {
						!!res.data.length && (this.statusList = this.statusList.concat(res.data));
					} else {
						this.$Message.warning((res && res.msg) || '网络错误');
					}
				},
				error: (res) => {
					this.$Message.error((res && res.msg) || '网络错误');
				}
			})
		},
		handleQuery() { // 查询
			let params = {}
			if(this.showClassInfo) { 
				params.userName = this.formInfo.userInfo.userName || '';
				params.accountId = this.formInfo.userInfo.accountId || '';
				params.workName = this.formInfo.classInfo.workName || ''; 
			}
			if(this.showUserInfo) {
				params.accountId = this.formInfo.userInfo.accountId || '';
				if(!params.accountId) {
					params.userName = this.formInfo.userInfo.userName || '';
				}
			}
			if(this.showDeptInfo) {
				params.deptId = this.formInfo.deptInfo.deptId || '';
				if(!params.deptId) {
					params.deptName = this.formInfo.deptInfo.deptName || '';
				}
			}
			params.beginDate = this.formInfo.timeArr[0];
			params.endDate = this.formInfo.timeArr[1];

			let data = {};
			let keys = Object.keys(params);
			keys.forEach(item=>{
				if(!!params[item]) {
					data[item] = params[item]
				}
			})
			this.showStatus ? data.fillTypeId = this.formInfo.status : null ;
			this.$emit('handleQuery', data);
		},
		getExportParams(){
			let params = {}
				params.userName = this.formInfo.userInfo.userName || '';
				params.accountId = this.formInfo.userInfo.accountId || '';
				params.deptName = this.formInfo.deptInfo.deptName || '';
				params.deptId = this.formInfo.deptInfo.deptId || '';
				params.beginDate = this.formInfo.timeArr[0];
				params.endDate = this.formInfo.timeArr[1];
				return params ;	
		},
		// 导出Xlsx
		handleExportXlsx() { 
			let obj = this.getExportParams();
			let type = this.exportXlsxType ;
			if( !type ){
				return 
			}
			let host = config[__ENV__].apiHost;
			let path ;
			// 考勤汇总			
			if( type==1 ){
				path = `${host}/signin/dept/exportAttendanceSummaryExcel?`;
			}
			// 考勤明细 
			if( type==2 ){
				path = `${host}/signin/dept/exportAttendances?`;
			}
			// 异常签到
			if( type==3 ){
				path = `${host}/signin/signDeviceAnalysis/exportExcel?`;
			}
    		if( type==1 ){
    			// 考勤汇总导出时间不能超过三个月
	    		let b = Date.parse( new Date(obj.beginDate) );
	    		let e = Date.parse( new Date(obj.endDate) );
	    		if( e-b >= 86400000*30 ){
	    			this.$Message.error('不能超过三个月');
	    			return
	    		}
    		}
    		let href = `${path}token=${this.token}&userName=${obj.userName}&deptName=${obj.deptName}&beginDate=${obj.beginDate}&endDate=${obj.endDate}`;
    		window.open(href);
		},
		// 股份定制
		handleExportYonyou(){
			let obj = this.getExportParams();
			let host = config[__ENV__].apiHost;
			let path = `${host}/signin/attendanceSummary/exportAttendanceSummaryExcelByPointDate?`;
			let createTime = obj.endDate.replace(/-/g,'');
			let href = `${path}token=${this.token}&createTime=${createTime}&deptId=${obj.deptId}`;
			window.open(href);
		},
		// 导出txt
		handleExportTxt() { 
			let obj = this.getExportParams()
    		let beginDate = Date.parse( new Date(obj.beginDate) );
    		let endDate = Date.parse( new Date(obj.endDate) );
    		let host = config[__ENV__].apiHost;
    		let path = `${host}/signin/exportDailyAttendance/exportAttendanceSummaryTxt?`;
    		let href = `${path}token=${this.token}&beginDate=${beginDate}&endDate=${endDate}`;
		    window.open(href);
		}
	},
	mounted() {
		if (this.showStatus) {
			this.getStatusList()
		}
	},
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.search_checkin_form {
	.demo-auto-complete-cation {
		color: @gray-color-normal;
		display: block;
		white-space: nowrap;
		margin-top: 2px;
	}
	&::-webkit-scrollbar {
		width: 2px;
		height: 2px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		width: 6px;
		min-height: 40px;
		max-height: 100px;
		background-color: @table-bg-color;
	}
	.none {
		display: none;
	}
	.ivu-select-item {
		padding: 7px 10px;
	}
	.ivu-form-item {
		margin-bottom: 20px;
	}
	.label {
		font-size: 13px;
		position: relative;
		top: 1px;
		color: #111;
	}
	.btn {
		min-width: 61px;
		font-size: 13px;
		margin-right: 5px;
	}
	.query {
		border-color: @primary-color;
		color: @primary-color;
	}
}

.ivu-auto-complete.ivu-select-dropdown {
	max-height: 200px;
	min-width: 118px;
	width: auto!important;
	left: 0!important;
}
</style>