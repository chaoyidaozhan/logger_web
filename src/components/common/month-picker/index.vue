<template>
	<div class="select_data_button">
		<div class="btn btn-left" :class="{disabled:this.left_disabled}" @click="delMonth"></div>
		<div>{{year}}年{{month}}月</div>
		<div class="btn btn-rignt" :class="{disabled:this.right_disabled}" @click="addMonth"></div>
	</div>
</template>
<script type="text/javascript">
export default {
	data() {
		return {
			year: '',
			month: '',
			max_year: '',
			max_month: '',
			left_disabled: false,
			right_disabled: false
		}
	},
	watch: {
		month() {
			if (this.year == this.max_year && this.month == this.max_month) {
				this.right_disabled = true;
			} else {
				this.right_disabled = false;
			}
		}
	},
	methods: {
		// 初始化调用
		getDate(timesp, callback) {
			var year = timesp.getFullYear();
			var month = timesp.getMonth() + 1;
			var strDate = timesp.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			this.year = this.max_year = year;
			this.month = this.max_month = month;
			this.right_disabled = true;

			// 回调
			callback(this.year + '-' + this.month);
		},
		delMonth() {
			if (this.left_disabled) {
				return;
			};
			let y = +(this.year);
			let m = +(this.month);
			m--;
			if (m == 0) {
				m = 12;
				y--;
			}
			if (m >= 1 && m <= 9) {
				m = "0" + m;
			}
			this.year = y;
			this.month = m;

			this.$emit('onMonthChange', this.year + '-' + this.month);
		},
		addMonth() {
			if (this.right_disabled) {
				return;
			};
			let y = +(this.year);
			let m = +(this.month);
			m++;
			if (m == 13) {
				m = 1;
				y++;
			}
			if (m >= 1 && m <= 9) {
				m = "0" + m;
			}
			this.year = y;
			this.month = m;

			this.$emit('onMonthChange', this.year + '-' + this.month);
		}
	},

}
</script>
<style lang="less" scoped>
.select_data_button {
	width: 180px;
	height: 38px;
	padding: 0 30px;
	line-height: 38px;
	color: black;
	position: relative;
	text-align: center;
	font-size: 18px;
	.btn {
		width: 30px;
		height: 38px;
		position: absolute;
		top: 0;
		cursor: pointer;
		&::after {
			content: "";
			display: inline-block;
			border: 6px solid black;
			border-radius: 2.5px;
			border-top-color: transparent;
			border-bottom-color: transparent;
		}
	}
	.btn-left {
		left: -2px;
		&::after {
			border-left-color: transparent;
		}
	}
	.btn-rignt {
		right: 0;
		&::after {
			border-right-color: transparent;
		}
	}
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}
</style>