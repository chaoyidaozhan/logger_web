<template>

    <Modal v-model="info.open" class="select_member" width="600px" @on-cancel="cancel">
        <div slot="header" class="header">
            {{info.title}}
        </div>
        <div class="sel_body">
            <div class="sel_left">
            	<left-select-part :info="info" @changeTab="changeTab"/>
            </div>
            <div class="sel_right">
            	<right-selected-part :info="info"/>
            </div>
        </div>
        <div slot="footer">
        	<p class="l maxCount" v-show=" maxCount>1 ">
        		每次选择不可超过{{maxCount}}人，请分批选择
        	</p>
        	<div class="show-all-wrap" v-show="info.limit.showAll && info.limit.count==1">
        		<Button class="btn" type="ghost" v-show="showAllIndex==1" @click="chooseAll('dep')" >全部部门</Button>
        		<Button class="btn" type="ghost" v-show="showAllIndex==2" @click="chooseAll('team')">全部内部群</Button>
        		<Button class="btn" type="ghost" v-show="showAllIndex==3" @click="chooseAll('man')" >全部成员</Button>
        	</div>
            <Button class="btn" type="ghost" @click="cancel">取消</Button>
            <Button class="btn success" type="success" @click="submit">确定</Button>
        </div>
    </Modal>

</template>
<script type="text/javascript">
	import LeftSelectPart from './left-select-part';
	import RightSelectedPart from './right-selected-part';
	export default {
		props:['info'],
		components:{
			LeftSelectPart,RightSelectedPart
		},
		data(){
			return {
				showAllIndex:-1
			}
		},
		computed:{
			maxCount(){
				return this.info.limit.count ;
			}
		},
		methods:{
			cancel(){
				this.$emit('cancel');
			},
			submit(){
				this.$emit('submit');
			},
			chooseAll( type ){
				this.$selectMember.checkAll(type);
			},
			changeTab( i ){
				this.showAllIndex = i ;
			}
		},
		mounted(){
	
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
	width: 260px;
}

.show-all-wrap {
	margin-right: 7px;
	display: inline-block;
}

.select_member {
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
	.sel_body {
		position: relative;
		height: 100%;
		padding-right: 240px;
		.sel_left {
			position: relative;
			height: 100%;
			width: 100%;
		}
		.sel_right {
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			width: 240px;
			border-left: 1px solid @border-color;
		}
		.sel_left>section,
		.sel_right>section {
			width: 100%;
			height: 100%;
		}
	}
	.btn {
		width: 90px;
	}
	.success {
		background: @primary-color;
		border: 1px solid @primary-color;
	}
	.maxCount {
		font-size: 12px;
		line-height: 26px;
		color: @error-color;
	}
}
</style>