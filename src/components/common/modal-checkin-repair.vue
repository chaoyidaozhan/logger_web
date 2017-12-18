<template>

	<!-- 发起考勤  -->
	<!-- 内勤 + 外勤 -->

	<div>
	    <Modal
	        v-model="open"
	        title="补考勤详情"
	        class="signin-modal my_checkin_modal_repair">
	        <ul class="ul">
	        	<li v-if="fillData">
	        		<span class="tit">考勤日期</span>
	        		<span class="r">{{fillData.attendanceDate}}</span>
	        	</li>
	        	<li v-if="fillData">
	        		<span class="tit">签到时间</span>
	        		<span class="r">
	        			{{fillData.firstAttentance}} 
	        			至
	        			{{fillData.lastAttentance}}
	        			，状态 <span style="color:rgb(250, 79, 82)">{{fillData.statusString}}</span>
	        		</span>
	        	</li>
	        	<li>
	        		<span class="tit">补考勤类型</span>
	        		<Select class="r select" placeholder="选择考勤类型" v-model="status">
				        <Option v-for="item in fillList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
				    </Select>
	        	</li>
	        	<li v-if="fillTime">
	        		<span class="tit">起止时间</span>
	        		<div  class="r">
			        	<TimePicker 
							:clearable="false" 
							class="time" 
							v-model="fillTime.fillStartTime" 
							format="HH:mm" 
							@on-change="handleChangeStart"
							placeholder="开始时间"></TimePicker>
						<span class="label" style="margin-right:0px">至</span>
						<TimePicker 
							:clearable="false" 
							class="time" 
							v-model="fillTime.fillEndTime" 
							@on-change="handleChangeEnd"
							format="HH:mm" placeholder="结束时间"></TimePicker>
					</div>
	        	</li>
	        	<li>
	        		<span class="tit">审批人</span>
	        		<Select class="r man" placeholder="请选择审批人" v-model="accountId">
				        <Option v-for="item in fillManager" :value="item.accountId" :key="item.accountId">{{ item.userName }}</Option>
				    </Select>
	        	</li>
	        	<li class="txt" style="height:110px">
	        		<span class="tit">补考勤理由</span>
	        		<div class="textarea-wrap">
	        			<Input 
	        				v-model="textarea"
	        				type="textarea" 
							:rows="4" 
							:maxlength="20"
	        				placeholder="请填写考勤理由20字以内"></Input>
	        		</div>
	        	</li>
	        </ul>
            <div slot="footer" class="page-modal-footer">
                <Button type="ghost" @click="open = false">取消</Button>
                <Button type="info" @click="doRepairSubmit">确定</Button>
            </div>
	    </Modal>
	</div>
</template>
<script type="text/javascript">
export default {
	props: {
		save: { // 所有选中项
			type: Array,
			default: []
		}
	},
	data() {
		return {
			// 补考勤需要数据
			fillData: '', // -- *** 全选时为空 不显示 
			fillList: '', // -- 补考勤类型
			fillManager: '', // -- 审批人
			fillTime: '', // -- 获取起止时间

			open: false,
			status: '', // 选中补考勤类型
			textarea: '', // 选中补考勤理由
			accountId: '', // 选中人员id
		}
	},
	methods: {
		handleChangeStart(val) { // 开始时间
			console.log(val)
		},
		handleChangeEnd(val) { // 结束时间

		},
		// ajax
		ajax(data) {
			// 重置 补考勤状态 , 补考勤说明 , 审批人id
			this.status = '';
			this.textarea = '';
			// this.accountId =''; 


			// 判断 全选 , 单选
			if (data == 'all') {
				this.fillData = '';
			} else {
				this.fillData = data;
			}

			// 1 请求补考勤类型
			this.$ajax({
				url: '/signin/fillAttentanceType/getList',
				success: (res) => {
					if (res && res.code == 0) {
						res.data.length ? this.fillList = res.data : null;
					} else {
						this.$Message.warning((res && res.msg) || '网络错误');
					}
				},
				error: (res) => {
					this.$Message.error((res && res.msg) || '网络错误');
				}
			})

			// 2 请求审批人 
			this.$ajax({
				url: '/signin/dept/manager',
				type: 'post',
				success: (res) => {
					if (res && res.code == 0) {
						res.data.resMapList && res.data.resMapList.length ? this.fillManager = res.data.resMapList : null;
					} else {
						this.$Message.warning((res && res.msg) || '网络错误');
					}
				},
				error: (res) => {
					this.$Message.error((res && res.msg) || '网络错误');
				}
			})

			// 3 请求考勤时间
			this.$ajax({
				url: '/signin/fillAttendanceRecord/getFillTime',
				data: {
					fillDate: data == "all" ? "" : Date.parse((data.attendanceDate).match(/(\S)+/g)[0]),
				},
				success: (res) => {
					if (res && res.code == 0) {
						res.data ? this.fillTime = res.data : null;
					} else {
						this.$Message.warning((res && res.msg) || '网络错误');
					}
				},
				error: (res) => {
					this.$Message.error((res && res.msg) || '网络错误');
				}
			})
		},

		show(data) {
			this.ajax(data);
			this.open = true;
		},
		close() {
			this.open = false;
		},
		doRepairSubmit() {
			if (!this.status) {
				this.$Message.error('没有选择补考勤类型');
				return;
			}
			if (!this.accountId) {
				this.$Message.error('没有选择审批人');
				return;
			}
			let dealManName;
			this.fillManager.map(v => {
				v.accountId == this.accountId ? dealManName = v.userName : null;
			})
			let fillStartTime = this.fillTime.fillStartTime.toString();
			let fillEndTime = this.fillTime.fillEndTime.toString();
			let obj = {
				fillStartTime: fillStartTime.match(/\w{2}:\w{2}/)[0],
				fillEndTime: fillEndTime.match(/\w{2}:\w{2}/)[0],
				fillTypeId: this.status,
				dealManId: this.accountId,
				dealManName: dealManName,
				fillReason: this.textarea
			}
			this.fillData ? this.$emit('doRepairSubmit', obj, this.fillData.attendanceId) : this.$emit('doRepairSubmit', obj, 'all');


			// attentanceRecordId考勤的记录ID    Y   Array(Long)     缺勤记录的ID, 数组类型
			let arr;
			if (this.fillData) {
				// 单选
				arr = [this.fillData.attendanceId]
			} else {
				// 全选
				arr = this.save.map(v => {
					return v.attendanceId
				})
			}
			let params = {
				attentanceRecordId: arr.join(),
				...obj
			}

			this.$ajax({
				url: '/signin/fillAttendanceRecord/add',
				type: 'post',
				data: params,
				success: (res) => {
					if (res.code == 0) {
						this.$Message.success('已发起补考勤');
						this.open = false;
						this.$emit('doRepairSuccess');
					} else {
						this.$Message.error((res && res.msg) || '发起失败');
					}
				},
				error: (res) => {
					this.$Message.error((res && res.msg) || '发起失败');
				}
			});

		}
	}
}
</script>
<style lang="less">
.my_checkin_modal_repair {
	.ivu-select-item {
		white-space: normal;
		padding-right: 36px;
	}
	.ivu-modal-header {
		padding-right: 20px;
		padding-left: 20px;
	}
	.ivu-modal-body {
		padding-top: 0;
		padding-right: 20px;
		padding-left: 20px;
	}
	.ivu-modal-footer {
		border: none;
	}
	.tit {
		color: rgb(51, 51, 51)
	}
	.r {
		float: right;
	}
	.time {
		width: 116px;
	}
	.select {
		width: 116px;
		height: 32px!important;
	}
	.man {
		width: 252px;
		height: 32px!important;
	}
	.txt {
		height: 120px;
		.textarea-wrap {
			margin: 10px 0;
		}
	}
	.ul>li {
		height: 32px;
		line-height: 32px;
		width: 100%;
		margin-top: 10px;
	}
	.txt {
		height: 100px;
	}
}
</style>
