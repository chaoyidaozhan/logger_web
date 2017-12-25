<template>
	<div class="right_selected_part">
		<div class="title">
			<span class="l">已选择</span>
			<span class="r">清空</span>
		</div>
		<!-- 部门 -->	
		<div class="tit cp" @click="openDep=!openDep" v-show="info.dep">
			部门
			<Icon type="chevron-up" class="r" v-show="openDep"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openDep"></Icon>
		</div>
		<ul v-show="openDep">
			<li class="li" v-for="each in depList">
				<div class="head-wrap l">
					<Icon type="social-usd-outline"></Icon>
				</div>
				<div class="depName elli l">
					{{each.deptName}}
				</div>
				<div class="r" @click="removeSelected('dep',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>	
		</ul>
		<!-- 团队 -->	
		<div class="tit cp" @click="openTeam=!openTeam" v-show="info.team">
			团队
			<Icon type="chevron-up" class="r" v-show="openTeam"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openTeam"></Icon>
		</div>
		<ul v-show="openTeam">
			<li class="li" v-for="each in teamList">
				<div class="head-wrap l">
					<Icon type="social-octocat"></Icon>
				</div>
				<div class="groupName elli l">
					{{each.groupName}}
				</div>
				<div class="r" @click="removeSelected('team',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>			
		</ul>
		<!-- 人员 -->		
		<div class="tit cp" @click="openMan=!openMan" v-show="info.man">
			人员
			<Icon type="chevron-up" class="r" v-show="openMan"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openMan"></Icon>
		</div>
		<ul v-show="openMan">
			<li class="li" v-for="each in manList">
				<div class="head-wrap elli l">
					<avatar :avatar="each.avatar" :name="each.userName" :size="'28px'"/>
				</div>
				<div class="userName l">
					{{each.userName}}
				</div>
				<div class="r" @click="removeSelected('man',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>				
			</li>			
		</ul>
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
			console.log(this.info.dep)
		},

		data(){
			return {
				openDep :true,
				openTeam:true,
				openMan :true
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
		.title{
			height: 40px;line-height: 40px;
			padding:0 15px;
			box-sizing: border-box;
			border-bottom: 1px solid #e9eaec;
			.r{
				color: #fd838a
			}
		}
		.tit{
			height: 27px;line-height: 27px;
			padding:0 15px;
			box-sizing: border-box;
			border-top: 1px solid #e9eaec;
			background: #f9f9f9;
			.r{
				font-size: 12px;
				color: #999;
				opacity: .8;
				position: relative;top: 7px;
			}
		}
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
			padding: 7px 16px 7px 15px;
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
	.right_selected_part>div:nth-child(2){
		border: none;
	}
	
</style>