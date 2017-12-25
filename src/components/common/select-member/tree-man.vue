<template>
	<div class="tree_man">
		<div class="search-inp-wrap">
			<Input class="search-inp" v-model="keyWord" placeholder="请输入姓名进行搜索" @on-change="searchFn"/>
		</div>
		<div class="man_scroll scroll sm_scroll">
			<li class="li cp" v-for="each in list" @click="checkEach(each)">
				<div class="head-wrap l">
					<avatar :avatar="each.avatar" :name="each.userName" :size="'28px'"/>
				</div>
				<div class="userName l">
					{{each.userName}}
				</div>
				<div class="r">
					<!-- Checkbox阻止事件 -->
					<Checkbox class="cbx" style="pointer-events:none" :value="each.checked"/>
				</div>				
			</li>
			<li class="ajaxStatus">
				<Spin class="auto" v-if="ajaxStatus=='loading'"/>
				<span v-if="ajaxStatus=='over'">已加载全部</span>
				<span class="cp" v-if="ajaxStatus=='success'" @click="add">加载更多</span>
				<span class="cp" v-if="ajaxStatus=='error'">加载失败 <span class="cp" style="color:#1FDA9A" @click="getList">重新加载</span></span>
			</li>
		</div>
	</div>
</template>
<script type="text/javascript">
	import avatar from '../avatar';
	export default{
		props:['info'],
		components:{
			avatar
		},

		data(){
			return {
				ajaxStatus:'loading',  // loding---加载中 success---加载更多 error---加载失败 over--全部;
				keyWord:"",
				pageSize:40,
				pageNum:1,
				list:[],
				timer:null,
			}
		},
		watch:{
			// 储存变量 , 设置默认值
			list(){
				// 人员列表会随着搜索清空 请求数据的时候也需要验证
				this.$selectMember.saveAjaxMan = this.list ;
				this.$selectMember.setDefaultTure('man');
			}
		},

		mounted(){
			this.getList();
			this.$selectMember.$on('resetKeyWord',()=>{
				this.keyWord='';
			})
		},
		methods:{
			searchFn(str){
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.list=[];
					this.pageNum=1;
					this.getList();
				},300)
			},
			getList(){
				this.ajaxStatus = 'loading' ;
            	this.$ajax({
	                url: '/logger/user/getUsersBySpace',
	                data:{
	                	pageSize : this.pageSize,
	                	pageNum  : this.pageNum,
	                	keyWord  : this.keyWord,
	                },
	                success: (res)=>{
	                	if( res.code==0 ){
	                		let arr = res.data ;
	                			arr.length>=this.pageSize ? this.ajaxStatus='success' : this.ajaxStatus='over' ;
	                			arr = res.data ;
		                		arr.map(v=>{
		                			v.checked=false ;
		                		})
	                		this.list=this.list.concat( arr );
	                	}else {
	                		this.ajaxStatus = 'error' ;
	                	}
	                },
	                error:(res)=>{
	                	console.log(res)
	                	this.ajaxStatus = 'error' ;
	                }
	            })
	            this.$ajax
			},
            add(){
            	this.pageNum++ ;
            	this.getList() ;
            },
            checkEach( each ){
            	each.checked = !each.checked ;
            	if( each.checked ){
            		// 添加右侧
            		this.$selectMember.right_add('man',each);
            	}else {
            		// 删除右侧
            		this.$selectMember.right_del('man',each);
            	};
            }
		}
	}
</script>
<style lang="less">
	.tree_man{
		.avatar-wrapper .name{
			font-size: 12px;
		}
		.search-inp-wrap{
			position: absolute;
			top: 0;left: 20px;right: 21px;
			height: 47px;
			.search-inp{
				position: absolute;bottom: 0;
			}
		}
		.man_scroll{
			position: absolute;
			top: 47px;bottom: 0px;
			left: 0px;right: 0px;
		}
		.li{
			padding: 5px 15px 5px 22px;
			font-size: 13px;
			line-height: 28px;
			overflow: hidden;
			.head-wrap{
				width: 28px;height: 28px;
				background: #f0f0f0;
				border-radius: 50%;
			}
			.userName{
				margin-left: 8px;
			}
			&:hover{
				background:rgba(126,231,192,0.1);
			}
		}
		.li:nth-of-type(1){
			padding-top: 13px;
		}
		.ajaxStatus{
			text-align: center;
			padding: 10px 0 15px 0;
			&>span{
				font-size: 12px;
				padding: 0 10px;
			}
		}
	}
</style>