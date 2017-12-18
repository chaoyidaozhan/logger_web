<template>

    <!-- 考勤静态详情展示 -->
    
	<div>
	    <Modal
            v-model="info.open"
            :title="info.title"
            class="signin-modal modal_detail_static"
            width="500px">
            <ul class="ul">
                <li v-for="each in info.list">
                    <div class="tit">
                    	{{each.l}}
                    </div>
                    <div class="r">
                    	<span>{{each.r}}</span>
                    </div>                  
                </li>
            </ul>
            <span v-if="info.icon==1" class="icon-status-signet-yes"/>
            <span v-if="info.icon==2" class="icon-status-signet-no"/>  
        </Modal>		
	</div>
</template>
<script type="text/javascript">

	export default{
		props:{
			info:{
				type:Object,
				default(){
					return {
						title:'',
						open:false,
						list:[]
					}
				}
			}
		},
	}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.modal_detail_static {
    [class^="icon-status"] {
        position: absolute;
        right: 34px;
        bottom: 17px;
        font-size: 100px;
    }
    .ivu-modal-header {
        padding-right: 25px;
        padding-left: 23px;
    }
    .ivu-modal-body {
        padding-top: 3px;
        padding-right: 25px;
        padding-left: 25px;
        padding-bottom: 75px;
    }
    .ivu-modal-footer {
        display: none;
    }
    .ul {
        &>li {
            padding: 15px 0;
            border-bottom: 1px solid @gray-color-elip;
            font-size: 14px;
            overflow: hidden;
            .tit {
                color: #111;
                float: left;
            }
            .r {
                float: right;
                width: 370px;
                color: @gray-color-light;
                span {
                    float: right;
                }
            }
        }
    }
}
</style>