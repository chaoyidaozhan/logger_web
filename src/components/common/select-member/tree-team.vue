<template>
	<div class="tree_team">
		<ul>
			<li v-for="each in list" class="li cp" @click="checkEach(each)">
				<div class="head-wrap l">
					<Icon type="social-octocat"></Icon>
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
				<span v-if="ajaxStatus=='over'">已加载全部</span>
				<span class="cp" v-if="ajaxStatus=='success'" @click="add">加载更多</span>
				<span class="cp" v-if="ajaxStatus=='error'">加载失败 <span class="cp" style="color:#1FDA9A" @click="getList">重新加载</span></span>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		props:['info'],
		components:{

		},

		data(){
			return {
				ajaxStatus:'loading',  // loding---加载中 success---加载更多 error---加载失败 over--全部;
				pageSize:20,
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
			getList(){
				this.ajaxStatus = 'loading' ;
            	this.$ajax({
	                url: '/logger/group/me',
	                data:{
	                	pageSize : this.pageSize ,
	                	pageNum  : this.pageNum
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
            },
            add(){
            	this.pageNum++ ;
            	this.getList() ;
            },
            checkEach( each ){
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
			padding: 5px 15px 5px 25px;
			&:hover{
				background:rgba(126,231,192,0.1);
			}
			.head-wrap{
				width: 28px;height: 28px;
				background: #f0f0f0;
				border-radius: 50%;
			}
			.groupName{
				margin-left: 8px;
			}
		}
		.li:nth-of-type(1){
			padding-top: 10px;
		}
	}
</style>