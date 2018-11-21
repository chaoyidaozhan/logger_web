<template>
<Modal v-model="info.open" class="select-tree" width="600px" @on-cancel="handleCancel">
	<div slot="header" class="header">
		{{info.title}}
	</div>
	<div class="select-tree-body">
		<div class="select-tree-left">
			<select-tree-left :info="info" @switchTab="switchTab"/>
		</div>
		<div class="select-tree-right">
			<select-tree-right :info="info"/>
		</div>
	</div>
	<div slot="footer">
		<p class="l maxCount" v-show=" maxCount>1 ">
			<span v-if="lang == 'en'">
				No more than {{maxCount}} people per selection, please select in batches
			</span>
			<span v-else-if="lang == 'tw'">
				每次选择不可超过{{maxCount}}人，请分批选择
			</span>
			<span v-else>
				每次选择不可超过{{maxCount}}人，请分批选择
			</span>
		</p>
		<div class="show-all-wrap" v-show="info.limit.showAll && info.limit.count==1">
			<Button class="btn" type="ghost" v-show="showAllIndex==1" @click="selectAll('dep')" >
				{{$t('operate.all')}}{{$t('noun.department')}}
			</Button>
			<Button class="btn" type="ghost" v-show="showAllIndex==2" @click="selectAll('team')">
				{{$t('operate.all')}}{{$t('noun.internalGroup')}}
			</Button>
			<Button class="btn" type="ghost" v-show="showAllIndex==3" @click="selectAll('man')" >
				{{$t('operate.all')}}{{$t('noun.personnel')}}
			</Button>
		</div>
		<Button class="btn" type="ghost" @click="handleCancel">{{$t('operate.cancel')}}</Button>
		<Button class="btn success" type="success" @click="handleOk">{{$t('operate.ok')}}</Button>
	</div>
</Modal>
</template>
<script>
import SelectTreeLeft from './select-tree-left'
import SelectTreeRight from './select-tree-right'
export default {
	props: ['info'],
	components: {
		SelectTreeLeft,
		SelectTreeRight
	},
	data() {
		return {
			showAllIndex: -1
		}
	},
	computed: {
		maxCount() {
			return this.info.limit.count
		}
	},
	methods: {
		handleCancel() {
			this.$emit('handleCancel')
		},
		handleOk() {
			this.$emit('handleOk')
		},
		selectAll(type) {
			this.$selectTree.selectAll(type)
		},
		switchTab(i) {
			this.showAllIndex = i
		}
	}
}
</script>
<style lang="less">
@import '../../../assets/css/var.less';

li {
	list-style: none;
}

.inlb {
	vertical-align: middle;
	display: inline-block;
}

.cp {
	cursor: pointer;
}

.discp {
	cursor: not-allowed;
}

.elli {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.auto {
	display: block;
	width: 20px;
	margin: 0 auto;
}

.r {
	float: right;
}

.l {
	float: left;
	width: 240px;
}

.show-all-wrap {
	margin-right: 7px;
	display: inline-block;
}

.select-tree {
	.ivu-modal-header {
		background: @white-color;
		font-size: 14px;
	}

	.ivu-modal-content {
		overflow: hidden;
	}

	.ivu-modal-body {
		height: 400px;
		padding: 0px;
	}

	.select-tree-body {
		position: relative;
		height: 100%;
		padding-right: 240px;

		.select-tree-left {
			position: relative;
			height: 100%;
			width: 100%;
		}

		.select-tree-right {
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			width: 240px;
			border-left: 1px solid @border-color;
		}

		.select-tree-left>section,
		.select-tree-right>section {
			width: 100%;
			height: 100%;
		}
	}

	.btn {
		min-width: 90px;
	}

	.success {
		background: @primary-color;
		border: 1px solid @primary-color;
	}

	.maxCount {
		font-size: 12px;
		color: @primary-color;
		line-height: 14px;
		text-align: left;
	}
}
</style>
