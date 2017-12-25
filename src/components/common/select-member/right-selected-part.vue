<template>
	<div class="right_selected_part">
		<!-- 部门 -->
		<template>
			<li class="li" v-for="each in depList" @click="removeSelected('dep',each)">
				<div class="head-wrap l">
					<Icon type="social-usd-outline"></Icon>
				</div>
				<div class="depName elli l">
					{{each.deptName}}
				</div>
				<div class="r">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>	
		</template>
		<!-- 团队 -->
		<template>
			<li class="li" v-for="each in teamList" @click="removeSelected('team',each)">
				<div class="head-wrap l">
					<Icon type="social-octocat"></Icon>
				</div>
				<div class="groupName elli l">
					{{each.groupName}}
				</div>
				<div class="r">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>			
		</template>
		<!-- 人员 -->
		<template>
			<li class="li" v-for="each in manList" @click="removeSelected('man',each)">
				<div class="head-wrap elli l">
					<avatar :avatar="each.avatar" :name="each.userName" :size="'28px'"/>
				</div>
				<div class="userName l">
					{{each.userName}}
				</div>
				<div class="r">
					<Icon type="close-round" class="close cp"></Icon>
				</div>				
			</li>			
		</template>
	</div>
</template>
<script type="text/javascript">
   /*
 		所有选中内容
	    selected:{ 
	        dep :{},
	        team:{},
	        man :{}
	    }  
    */
	import avatar from '../avatar';

	export default{
		props:["info"],
		components:{
			avatar
		},

		computed:{
			depList(){
				return this.info.selected.dep ;
			},
			teamList(){
				return this.info.selected.team ;
			},
			manList(){
				return this.info.selected.man ;
			},			
		},
		updated(){

		},

		mounted(){
			window.ll = this ;
		},

		data(){
			return {

			}
		},
		methods:{
			removeSelected( k , each ){
				this.$selectMember.right_del( k , each );
			},
			// 设置默认 true ;
			setCheckTrue(){

			}
		}
	}
</script>
<style lang="less">
	.right_selected_part{
		.avatar-wrapper .name{
			font-size: 12px;
		}
		.head-wrap{
			width: 28px;height: 28px;
			background: #f0f0f0;
			border-radius: 50%;
		}
		.li{
			line-height: 28px;
			color: #333;
			overflow: hidden;
			font-size: 13px;
			padding: 7px 18px 7px 15px;
			&:hover .close{
				display: inline-block;
			}
			&:hover{
				background:rgba(126,231,192,0.1);
			}
		}
		.li:nth-of-type(1){
			padding-top: 13px;
		}
		.close{
			font-size: 12px;
			color: #999;
			display: none;
			opacity: .8;
			position: relative;top: -1px;
		}
		.depName,.groupName,.userName{
			margin-left: 8px;
			max-width: 150px;
		}
	}
</style>