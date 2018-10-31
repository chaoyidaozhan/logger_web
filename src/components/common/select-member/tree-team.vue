<template>
	<div class="tree_team">
		<search-input @change="keyWordChange"/>

		<ul class="man_scroll">
			<li v-for="(each, index) in list" :key="index" class="li cp" @click="checkEach(each)">
				<div class="head-wrap l">
					<avatar :avatar="each.groupLogo" type="group" :name="each.groupName" :size="'28px'"/>
				</div>
				<div class="groupName l">
					{{each.groupName}}
				</div>
				<div class="r">
					<!-- Checkbox阻止事件 -->
					<Checkbox class="cbx" style="pointer-events:none" :value="each.checked"/>
				</div>
			</li>
			<li class="ajaxStatus">
				<Spin class="auto" v-if="ajaxStatus=='loading'"/>
				<span v-if="ajaxStatus=='over'">{{$t('status.loadedAllData')}}</span>
				<span class="cp" v-if="ajaxStatus=='success'" @click="add">{{$t('status.loadMore')}}</span>
				<span class="cp" v-if="ajaxStatus=='error'">{{$t('status.networkError')}} <span class="cp" style="color:#1FDA9A" @click="getList">{{$t('status.clickToReload')}}</span></span>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	import avatar from '../avatar';
	import searchInput from './search-input.vue';
	export default {
		props:['info'],
		components:{
			avatar , searchInput
		},

		data(){
			return {
				ajaxStatus:'loading',  // loding---加载中 success---加载更多 error---加载失败 over--全部;
				keyWord:'',
				pageSize:40,
				pageNum:1,
				list:[],
			}
		},
		watch:{
			// 储存变量 , 设置默认值
			list(){
				this.$selectMember.saveAjaxTeam = this.list ;
				this.$selectMember.setDefaultTure('team');
			}
		},

		mounted(){
			this.getList();
		},
		methods:{
			keyWordChange(kw) {
				if (this.keyWord == kw) {
					return
				};
				this.keyWord = kw;
				this.list = [];
				this.pageNum = 1;
				this.getList();
			},
			getList(){
				// 请求部门地址可以自定义 ;
				let url = this.info.groupApiUri ? this.info.groupApiUri : '/group/me' ;
				this.ajaxStatus = 'loading' ;
            	this.$ajax({
	                url: url ,
	                data:{
	                	pageSize : this.pageSize,
	                	pageNum  : this.pageNum,
	                	keyword  : this.keyWord
	                },
	                success: (res)=>{
	                	if( res.code==0 ){
	                		let arr = res.data ;
	                			arr.length>=this.pageSize ? this.ajaxStatus='success' : this.ajaxStatus='over' ;
		                		arr.map(v=>{
		                			v.checked=false ;
		                		})
	                		this.list=this.list.concat( arr );
	                	}else {
	                		this.ajaxStatus = 'error' ;
	                	}
	                },
	                error:(res)=>{
	                	this.ajaxStatus = 'error' ;
	                }
	            })
            },
            add(){
            	this.pageNum++ ;
            	this.getList() ;
            },
            checkEach( each ){
            	// 限制 ;
				let next = this.$selectMember.checkLimit(each ,'team');
				if( !next ){ return };

            	// 正常选择 ;
            	each.checked = !each.checked ;
            	if( each.checked ){
            		// 添加右侧
            		this.$selectMember.right_add('team',each);
            	}else {
            		// 删除右侧
            		this.$selectMember.right_del('team',each);
            	};
            }
		}
	}
</script>
<style lang="less">
	.tree_team{
		.avatar-wrapper .name{
			font-size: 12px;
		}
		.man_scroll {
			position: absolute;
			top: 47px;
			bottom: 0px;
			left: 0px;
			right: 0px;
			overflow-y: auto;
		}
		.ajaxStatus{
			text-align: center;
			padding: 10px 0 15px 0;
			&>span{
				font-size: 12px;
				padding: 0 10px;
			}
		}
		.li{
			font-size: 13px;
			overflow: hidden;
			line-height: 28px;
			padding: 5px 15px 5px 22px;
			&:hover{
				background:rgba(126,231,192,0.1);
			}
			.head-wrap{
				width: 28px;height: 28px;
				font-size: 0;
			}
			.groupName{
				margin-left: 8px;
			}
		}
		.li:nth-of-type(1){
			margin-top: 6px;
		}
	}
</style>
