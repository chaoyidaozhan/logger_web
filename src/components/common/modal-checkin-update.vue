<template>
<!-- 修改考勤  -->
<!-- 内勤 + 外勤 -->
<div>
	<Modal v-model="open" title="填写补考勤" class="signin-modal my_checkin_modal_update">
		<ul class="ul">
			<li>
				<span class="tit">考勤日期</span>
				<span class="r">{{fillData.f_date}}</span>
			</li>
			<li>
				<span class="tit">申请时间</span>
				<span class="r">
					{{fillData.f_time}}
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
				<div class="r">
					<TimePicker :clearable="false" class="time" v-model="fillTime.fillStartTime" format="HH:mm" placeholder="开始时间"></TimePicker>
					<span class="label" style="margin-right:0px">至</span>
					<TimePicker :clearable="false" class="time" v-model="fillTime.fillEndTime" format="HH:mm" placeholder="结束时间"></TimePicker>
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
					<Input v-model="textarea" type="textarea" :rows="4" :maxlength="20" placeholder="请填写考勤理由20字以内"></Input>
				</div>
			</li>
		</ul>
		<div slot="footer" class="page-modal-footer">
			<Button type="ghost" @click="open = false">取消</Button>
			<Button type="info" @click="updateSubmit">确定</Button>
		</div>
	</Modal>
</div>
</template>
<script type="text/javascript">
import FormatTime from '../../filters/format-time'; // 'YYYY年MM月DD日 HH:mm:ss 周E'

export default {
	data() {
		return {
			// 补考勤数据
			fillData: '',
			fillList: '',
			fillManager: '',
			fillTime: '',

			open: false,
			status: '',
			textarea: '',
			accountId: '',
		}
	},
	methods: {
		getDate(stmp, str) { // 获取时间
			var d = new Date(stmp); return FormatTime(d, str)
		},
		ajax(each) { // 还原配置
			each.f_date = this.getDate(each.fillDate, 'YYYY-MM-DD 周E');
			each.f_time = this.getDate(each.applyTime, 'YYYY-MM-DD HH:mm');
			this.fillTime = {
				fillStartTime: each.fillStartTime,
				fillEndTime: each.fillEndTime
			};
			this.textarea = each.fillReason;
			this.status = each.fillTypeId;
			console.log(this.status)
			this.accountId = each.dealManId;
			this.fillData = each;

			this.$ajax({ // 1 请求补考勤类型
				url: '/signin//fillAttentanceType/getList',
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

			this.$ajax({ // 2 请求审批人 
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
		},

		show(each) {
			this.open = true;
			this.ajax(each);
			setTimeout(() => {
				this.textarea = this.fillData.fillReason;
			}, 300)
		},
		close() {
			this.open = false;
		},
		updateSubmit() { // 提交修改按钮
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
			let params = {
				fillStartTime: fillStartTime.match(/\w{2}:\w{2}/)[0],
				fillEndTime: fillEndTime.match(/\w{2}:\w{2}/)[0],
				fillTypeId: this.status,
				dealManId: this.accountId,
				dealManName: dealManName,
				fillReason: this.textarea,
				attentanceRecordId: this.fillData.attentanceRecordId,
				id: this.fillData.id
			}
			this.$ajax({ // 请求修改数据
				url: '/signin/fillAttendanceRecord/update', type: 'post',
				data: params,
				success: (res) => {
					if (res.code == 0) {
						this.$Message.success('修改考勤成功');
						this.$emit('updateSuccess');
						this.open = false;
					} else {
						this.$Message.error((res && res.msg) || '修改失败');
					}
				},
				error: (res) => {
					this.$Message.error((res && res.msg) || '修改失败');
				}
			})
		},
	}
}
</script>
<style lang="less">
.my_checkin_modal_update {
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
		height: 30px;
		width: 100%;
		margin-top: 10px;
	}
	.txt {
		height: 100px;
	}
}
</style>
