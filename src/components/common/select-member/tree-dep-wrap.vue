<template>
<div class="tree-dep-wrap">
	<search-input @change="keyWordChange" style="display:none" />
	<!-- keyword不为空显示平级结构 -->
	<div class="search-wrap man_scroll" v-if=" keyWord!='' ">
		<li v-for="(each, index) in list" :key="index" class="li cp" @click="checkEach(each)">
			<div class="head-wrap l">
				<avatar :name="each.deptName" type="dept" :size="'28px'" />
			</div>
			<div class="deptName l">
				{{each.deptName}}
			</div>
			<div class="r">
				<!-- Checkbox阻止事件 -->
				<Checkbox class="cbx" style="pointer-events:none" :value="each.checked" />
			</div>
		</li>
		<li class="ajaxStatus">
			<Spin class="auto" v-if="ajaxStatus=='loading'" />
			<span v-if="ajaxStatus=='over'">
				{{$t('status.loadedAllData')}}
			</span>
			<span class="cp" v-if="ajaxStatus=='success'">
				{{$t('status.loadMore')}}
			</span>
			<span class="cp" v-if="ajaxStatus=='error'">
				{{$t('status.networkError')}}
				<span class="cp" style="color:#1FDA9A" @click="getList">
				 {{$t('status.clickToReload')}}
				</span>
			</span>
		</li>
	</div>
	<!-- keyword为空显示树形结构 -->
	<div v-if=" keyWord=='' ">

		<!-- 没有传 deptApiUri , 走默认接口 -->
		<div class="tree-wrap man_scroll" v-if="!info.showOtherDept">
			<tree-dep :info="info" />
		</div>

		<!-- 自定义了部门接口 树形结构不显示 -->
		<div class="search-wrap man_scroll" v-if="info.showOtherDept">
			<other-dep :info="info" />
		</div>
	</div>
</div>
</template>
<script type="text/javascript">
import avatar from '../avatar';
import searchInput from './search-input.vue';
import otherDep from './other-dep.vue';
export default {
	props: ['info'],
	components: {
		avatar,
		searchInput,
		otherDep
	},
	data() {
		return {
			ajaxStatus: 'loading', // loding---加载中 success---加载更多 error---加载失败 over--全部;
			keyWord: '',
			list: []
		}
	},
	watch: {
		// 储存变量 , 设置默认值
		list() {
			this.$selectMember.saveAjaxDep = this.list;
			this.$selectMember.setDefaultTure('dep');
		}
	},
	methods: {
		keyWordChange(kw) {
			this.keyWord = kw;
			if (kw) {
				this.keyWordChangeGetList();
			}
		},
		keyWordChangeGetList() {
			if (this.info.deptApiUri) {
				// 自定义地址
				if (this.info.deptApiUri.includes('getDeptsWithPart')) {
					let data = this.info.deptApiData || {};
					data.keyWord = this.keyWord;
					this.$ajax({
						url: this.info.deptApiUri,
						data: data,
						success: (res) => {
							if (res.code == 0) {
								let arr1 = []; // 主岗
								res.data['0'] ? arr1.push(res.data['0']) : "";
								let arr2 = res.data['1'] || []; // 兼职
								let arr3 = res.data['2'] || []; // 其它
								arr1[0] && arr1[0].deptName && (arr1[0].deptName += `（主岗）`);
								arr2.forEach(item => {
									item.deptName += `（兼职）`;
								});
								let arr = arr1.concat(arr2, arr3);
								arr.map(v => {
									v.checked = false;
								})
								this.list = arr;
								this.ajaxStatus = 'over';
							} else {
								this.ajaxStatus = 'error';
							}
						},
						error: (res) => {
							this.ajaxStatus = 'error';
						}
					});
				} else if (this.info.deptApiUri.includes('getAuthDepts')) {
					let data = this.info.deptApiData || {};
					data.keyWord = this.keyWord;
					this.$ajax({
						url: this.info.deptApiUri,
						data: data,
						success: (res) => {
							if (res.code == 0) {
								let arr = res.data.depts || [];
								arr.map(v => {
									v.checked = false;
								})
								this.list = arr;
								this.ajaxStatus = 'over';
							} else {
								this.ajaxStatus = 'error';
							}
						},
						error: (res) => {
							this.ajaxStatus = 'error';
						}
					});
				}
			} else {
				// 默认地址
				this.$ajax({
					url: '/team/getDepts',
					data: {
						keyWord: this.keyWord
					},
					success: (res) => {
						if (res.code == 0) {
							let arr = res.data;
							arr.map(v => {
								v.checked = false;
							})
							this.list = arr;
							this.ajaxStatus = 'over';
						} else {
							this.ajaxStatus = 'error';
						}
					},
					error: (res) => {
						this.ajaxStatus = 'error';
					}
				});
			}
		},
		checkEach(each) {
			// 限制 ;
			let next = this.$selectMember.checkLimit(each, 'dep')
			if (!next) {
				return
			}
			// 正常选择 ;
			each.checked = !each.checked
			if (each.checked) {
				// 添加右侧
				this.$selectMember.right_add('dep', each)
			} else {
				// 删除右侧
				this.$selectMember.right_del('dep', each)
			};
		}
	}
}
</script>
<style lang="less">
	.tree-dep-wrap{
		.avatar-wrapper .name{
			font-size: 12px;
		}
		.tree-wrap{
			padding: 0 15px 0 25px;
		}
		.search-wrap .li{
			font-size: 13px;
			overflow: hidden;
			line-height: 28px;
			padding: 5px 15px 5px 22px;
			&:hover{
				background:rgba(126,231,192,0.1);
			}
			.head-wrap{
				width: 28px;height: 28px;
				// background: #f0f0f0;
				// border-radius: 50%;
				font-size: 0;
			}
			.deptName{
				margin-left: 8px;
				width: 80%;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}
		.search-wrap .li:nth-of-type(1){
			padding-top: 12px;
		}
		.ajaxStatus{
			text-align: center;
			padding: 10px 0 15px 0;
			&>span{
				font-size: 12px;
				padding: 0 10px;
			}
		}
		.man_scroll{
			position: absolute;
			top: 0;bottom: 0px;
			left: 0px;right: 0px;
			overflow-y: auto;
		}
	}
</style>
