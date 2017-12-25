<template>
	<ul class="tree_dep">
		<li v-show="loading">
			<Spin class="auto" style="margin-top:10px;"/>
		</li>
		<li v-for="each in list" class="li">
			<div class="part1 cp" @click="checkEach(each)">
				<!-- 阻止冒泡 -->
				<div class="openIc-wrap inlb" @click.stop="autoExpand(each)" v-if="each.haveSub">
					<Icon type="arrow-right-b openIc" :class="{rot:each.open}"></Icon>
				</div>
				<div class="depName inlb elli">{{each.deptName}}</div>
				<!-- Checkbox阻止事件 -->
				<Checkbox class="cbx" style="pointer-events:none" :value="each.checked"/>
			</div>
			<div class="part2" v-show="each.openChild">
				<tree-dep v-if="each.childMount" :pid="each.deptId"/>
			</div>
		</li>
	</ul>	
</template>
<script>

	export default{
		props:{
			pid:{
				default:'',
			},
			info:{}
		},
		data(){
			return {
				list:[],
				loading:true,
				openC:false
			}
		},
		watch:{
			// 储存变量 , 设置默认值
			list(){
				this.$selectMember.saveAjaxDep = this.$selectMember.saveAjaxDep.concat( this.list );
				this.$selectMember.setDefaultTure('dep');
			}
		},

		mounted(){
			this.getList();
		},
		methods:{
			handleList( arr ){
				arr.map( v=>{
					v.open       = false ;
					v.childMount = false ;
					v.checked    = false ;
					v.openChild  = false ;
				})
				this.list = arr ;
			},
			getList(){
				let pid = this.pid ;
            	let data={ pid : this.pid };
            	!pid ? delete data.pid : null ;
            	this.$ajax({
	                url: '/logger/team/getDepts',
	                data: data ,
	                success: (res)=>{
	                	this.loading=false;
	                    if( res.code==0 ){
	                    	// 处理数据
	                    	this.handleList( res.data );
	                    }
	                },
	                error:(res)=>{
	                	this.loading=false;
	                	console.error(res);
	                }
	            })
            },
            autoExpand(each){
            	// 真实dom元素 ;
            	each.open = !each.open ;
            	if( each.open ){
            		// 当展开时 , 子元素没挂载自动挂载 -- 无动画 ;
            		if( each.childMount==false ){
            			each.childMount=true ;
            		} 
        			setTimeout(()=>{
        				each.openChild=true ;
        			},200) 	       		
            	}else {
        			setTimeout(()=>{
        				each.openChild=false ;
        			},200)
            	}
            },
            checkEach(each){
            	each.checked = !each.checked ;
            	if( each.checked ){
            		// 添加右侧
            		this.$selectMember.right_add('dep',each);
            	}else {
            		// 删除右侧
            		this.$selectMember.right_del('dep',each);
            	};
            }
		}
	}

</script>
<style lang="less">
	.tree_dep{
		.li{
			font-size: 12px;
			line-height: 25px;
			padding: 5px 0;
			transform:height .3s ;
			.part1{
				position: relative;
				padding-left: 15px;
				.openIc-wrap{
					position: absolute;
					left: 0;top: 0;
					width: 15px;height: 100%;
					.openIc{
						line-height: 25px;
						font-size: 12px;
						transition:transform .3s;
					}
					.rot{
						transform:rotate(90deg);
					}
				}
				.depName{
					max-width: 80%;
				}
				.cbx{
					position: absolute;
					right: 0
				}
			}
			.part2{
				padding-left: 15px;
				transition:height .4s ease-in-out;
				overflow-y: hidden;
				// transform-origin: top;
			}
		}
	}

</style>


