<template>
	<div class="left_select_part">
		<ul class="tab" v-show="tabInfo.length>1">
			<li v-for="item in tabInfo.list" class="cp"
				:class="{active:activeIndex==item.index}"
				:style="{width:tabInfo.width}"
				@click="changeTab( item.index )">
				<span class="sp">{{item.value}}</span>
			</li>
		</ul>
		<div class="tab-content-wrap" :style="{paddingTop:tabInfo.paddingTop}">
			<div class="ud" v-show="activeIndex==1">
				<tree-dep-wrap v-if="mountdDep" :info="info"/>
			</div>
			<div class="ud" v-show="activeIndex==2">
				<tree-team  v-if="mountdTeam" :info="info"/>
			</div>
			<div class="ud" v-show="activeIndex==3">
				<tree-man   v-if="mountdMan"  :info="info"/>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import TreeTeam from './tree-team.vue';
	import TreeMan from './tree-man.vue';
	import TreeDepWrap from './tree-dep-wrap.vue';
	const DEFAULT_LIST = {
			dep :{
				show:false,
				value:'部门',
				index:1
			},
			team:{
				show:false,
				value:'团队',
				index:2
			},
			man :{
				show:false,
				value:'成员',
				index:3
			} 
		};

	export default{
		props:['info'],
		components:{
			TreeTeam,TreeMan,TreeDepWrap
		},

		data(){
			return {
				activeIndex: -1,
				// 防止第一次请求三个接口 ;
				mountdDep  : false ,
				mountdTeam : false ,
				mountdMan  : false ,
			}
		},
		computed:{
			tabInfo(){
				let list = JSON.parse( JSON.stringify(DEFAULT_LIST));
				!this.info.dep  ? delete list.dep  : null ;
				!this.info.team ? delete list.team : null ;
				!this.info.man  ? delete list.man  : null ;
				let length = Object.keys(list).length ;
				let width , paddingTop ;
					if( length>1 ){
						width      = 100/length + '%';
						paddingTop = '40px';
					}else {
						width      = '100%';
						paddingTop = '0px';						
					}
				// 默认第一个li添加active
					if( length>0 ){
						let key = Object.keys(list)[0];
						this.activeIndex = DEFAULT_LIST[key].index ;
					}
				let obj = {
					list,
					length,
					width,
					paddingTop
				}
				return obj ;
			}
		},
		
		mounted(){
			this.trigger_v_if();
		},
		updated(){
			this.trigger_v_if();
		},
		methods:{
			changeTab( index ){
				this.activeIndex = index ;
				this.$emit('changeTab',this.activeIndex);
			},
			// 防止一次请求三个接口 ;	
			trigger_v_if(){
				let open = this.info.open ;
				if( open ){
					this.activeIndex==1 && !this.mountdDep  ? this.mountdDep=true  : null ;
					this.activeIndex==2 && !this.mountdTeam ? this.mountdTeam=true : null ;
					this.activeIndex==3 && !this.mountdMan  ? this.mountdMan=true  : null ;
				}				
			}
		}
	}


	// ok.show({
	// 	dep:true,man:true,team:true,limit:{count:2},
	// 	selected:{
	// 		team:[
	// 			{"szId":null,"gid":555,"groupName":"上的风景束带结发手机","groupLogo":"http://ykj-esn-test.oss-cn-beijing.aliyuncs.com/","pub":null,"memberId":null,"groupMemberCount":2,"newFeedCount":null,"status":null,"createTime":null,"updateTime":null,"checked":true}]
	// 	}
	// },(res)=>{console.log(JSON.stringify(res))});
</script>
<style lang="less">
@import '../../../assets/css/var.less';
.left_select_part {
	position: relative;
	.tab {
		width: 100%;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid @border-color;
		position: absolute;
		left: 0;
		top: 0;
		background: @white-color;
		z-index: 1;
		li {
			height: 40px;
			line-height: 40px;
			float: left;
			width: 33.3%;
			text-align: center;
			transition: color .15s ease-in;
			.sp {
				display: inline-block;
				padding: 0 12px;
				position: relative;
				&::after {
					content: '';
					display: inline-block;
					height: 2px;
					width: 100%;
					position: absolute;
					left: 0;
					bottom: 0;
					background: transparent;
					transition: background .3s;
				}
			}
		}
		.active {
			color: @primary-color;
			.sp {
				&::after {
					background: @primary-color;
				}
			}
		}
	}
	.tab-content-wrap {
		height: 400px;
		.ud {
			position: relative;
			width: 100%;
			height: 100%;
		}
	}
}
</style>