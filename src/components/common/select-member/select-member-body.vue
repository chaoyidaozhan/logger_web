<template>

    <Modal v-model="info.open" class="select_member" width="600px">
        <div slot="header" class="header">
            {{info.title}}
        </div>
        <div class="sel_body">
            <div class="sel_left">
            	<left-select-part :info="info"/>
            </div>
            <div class="sel_right sm_scroll">
            	<right-selected-part :info="info"/>
            </div>
        </div>
        <div slot="footer">
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
		methods:{
			cancel(){
				this.$emit('cancel');
			},
			submit(){
				this.$emit('submit');
			}
		}
	}

</script>
<style lang="less">
	li{
		list-style: none;
	}
	.sm_scroll{
		overflow-y: auto;
	}
	.inlb{
		vertical-align: middle;
		display: inline-block;
	}
	.cp{
		cursor: pointer;
	}
	.discp{
		cursor: not-allowed;
	}
	.elli{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.auto{
		display:block;width:20px;margin:0 auto;
	}
	.r{float: right;}
	.l{float: left;}

	.select_member{
		.ivu-modal-header{
			background: #F2F3F4;
			font-size: 14px;
		}
		.ivu-modal-content{
			overflow: hidden;
		}
		.ivu-modal-body{
			height: 400px;
			padding: 0px;
		}
		.sel_body{
			position: relative;
			height: 100%;
			.sel_left{
				position: relative;
				height: 100%;width: 360px;
			}
			.sel_right{
				height: 100%;
				position: absolute;
				top: 0;right: 0;
				width: 238px;
				border-left: 1px solid #e9eaec;
			}
			.sel_left>section,.sel_right>section{
				width: 100%;height: 100%;
			}
		}
		.btn{
			width: 90px;
		}
		.success{
		    background: #1FDA9A;
		    border: 1px solid #1FDA9A;
		}
	}

	// .fs_tree{
	// 	position: relative;
	// 	top: -20px;
	// 	font-size: 13px;
	// }
</style>