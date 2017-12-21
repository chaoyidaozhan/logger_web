<template>
	<div class="left_select_part">
		<ul class="tab">
			<li class="cp" @click="changeTab(0)" :class="{active:activeIndex==0}">
				<span class="sp">部门</span>
			</li>
			<li class="cp" @click="changeTab(1)" :class="{active:activeIndex==1}">
				<span class="sp">团队</span>
			</li>
			<li class="cp" @click="changeTab(2)" :class="{active:activeIndex==2}">
				<span class="sp">成员</span>
			</li>
		</ul>
		<div class="tab-content-wrap" :style="{paddingTop: comPadding }" ref="scrollDom">
			<tree-dep  v-if="mountdDep"  v-show="activeIndex==0" :info="info"/>
			<tree-team v-if="mountdTeam" v-show="activeIndex==1" :info="info"/>
			<tree-man  v-if="mountdMan"  v-show="activeIndex==2" :info="info"/>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	import TreeDep from './tree-dep.vue';  
	import TreeTeam from './tree-team.vue';
	import TreeMan from './tree-man.vue';

	export default{
		props:['info'],
		components:{
			TreeDep,TreeTeam,TreeMan
		},

		data(){
			return {
				activeIndex:-1,
				// 防止第一次请求三个接口 ;
				mountdDep  : false ,
				mountdTeam : false ,
				mountdMan  : false ,
			}
		},
		computed:{
			comPadding(){
				if( this.info ){
					return '40px';
				}else {
					return '0px';
				}
			}
		},
		mounted(){
			this.changeTab(0);
		},
		methods:{
			changeTab(ind){
				this.activeIndex!=ind ? this.activeIndex = ind : null ;
				if( ind==0 ){
					!this.mountdDep ? this.mountdDep=true : null ;
				}else if( ind==1 ){
					!this.mountdTeam ? this.mountdTeam=true : null ;
				}else if( ind==2 ){
					!this.mountdMan ? this.mountdMan=true : null ;
				}
			}
		}
	}
</script>
<style lang="less">
	.left_select_part{
		position: relative;
		.tab{
			width: 100%;height: 40px;line-height: 40px;
			border-bottom: 1px solid #e9eaec;
			position: absolute;
			left: 0;top: 0;
			background: white;
			z-index: 1;
			li{
				height: 40px;line-height: 40px;
				float: left;
				width: 33.3%;
				text-align: center;
				transition:color .2s ease-in;
				.sp{
					display: inline-block;
					padding: 0 12px;
					position: relative;
					&::after{
						content: '';display: inline-block;
						height: 2px;width: 100%;
						position: absolute;
						left: 0;bottom: 0;
						background:transparent ;
						transition:background .2s ease-in;
					}
				}
			}
			.active{
				color: #1FDA9A;
				.sp{
					&::after{background: #1FDA9A;}
				}
			}
		}

		.tab-content-wrap{
			height: 400px;
			padding: 0 20px;
			overflow: auto;
		}
	}
</style>