<template>
<ul>
	<li v-for="(each, index) in list" 
		:key="index"
		class="li cp" @click="checkEach(each)">
		<div class="head-wrap l">
			<avatar :name="each.deptName" type="dept" :size="'28px'"/>
		</div>
		<div class="deptName l">
			{{each.deptName}}
		</div>
		<div class="r">
			<!-- Checkbox阻止事件 -->
			<YYCheckbox class="cbx" style="pointer-events:none" :value="each.checked"/>
		</div>
	</li>
	<li class="ajaxStatus" v-if="info.showLoading">
		<Spin class="auto" v-if="ajaxStatus=='loading'"/>
		<span v-if="ajaxStatus=='over'">{{$t('status.loadedAllData')}}</span>
		<span class="cp" v-if="ajaxStatus=='success'">{{$t('status.loadMore')}}</span>
		<span class="cp" v-if="ajaxStatus=='error'">{{$t('status.networkError')}} <span class="cp" style="color:#1FDA9A" @click="getDepTypesList">{{$t('status.clickToReload')}}</span></span>
	</li>
</ul>
</template>
<script>
import avatar from '../avatar'
export default {
	props: ['info'],
	components: {
		avatar
	},
	data() {
		return {
			list: [],
			ajaxStatus: 'loading'
		}
	},
	watch: {
		// 储存变量 , 设置默认值
		list() {
			this.$selectTree.saveAjaxDep = this.list
			this.$selectTree.setDefaultTure('dep')
		}
	},
	mounted() {
		this.getDepTypesList()
	},
	methods: {
		getDefineDepts() { // 获取其他部门
			this.$ajax({
				url: this.info.deptApiUri,
				data: this.info.deptApiData || {},
				success: (res) => {
					if (res.code == 0) {
						if(res.data instanceof Array) {
							this.list = res.data.map((item)=>{
								item.checked = false
								return item
							})
						} else {
							let arr1 = [] // 主岗
							res.data['0'] ? arr1.push(res.data['0']) : ""
							let arr2 = res.data['1'] || [] // 兼职
							let arr3 = res.data['2'] || [] // 其它
							arr1[0] && arr1[0].deptName && (arr1[0].deptName += `（主岗）`)
							arr2.forEach(item => {
								item.deptName += `（兼职）`
							})
							let arr = arr1.concat(arr2, arr3)
							arr.map(v => {
								v.checked = false
							})
							this.list = arr
						}
						this.ajaxStatus = 'over'
					} else {
						this.ajaxStatus = 'error'
					}
				},
				error: (res) => {
					this.ajaxStatus = 'error'
				}
			})
		},
		getAuthDepts() { // 获取按照部门统计下部门
			this.$ajax({
				url: this.info.deptApiUri,
				data: this.info.deptApiData || {},
				success: (res) => {
					if (res.code == 0) {
						let arr = res.data.depts || []
						arr.map(v => {
							v.checked = false
						})
						this.list = arr
						this.ajaxStatus = 'over'
					} else {
						this.ajaxStatus = 'error'
					}
				},
				error: (res) => {
					this.ajaxStatus = 'error'
				}
			})
		},
		// 自定义部门接口
		getDepTypesList() {
			if (this.info.showOtherDept) {
				this.getDefineDepts()
			} else if (this.info.deptApiUri.includes('getAuthDepts')) {
				this.getAuthDepts()
			}
		},
		checkEach(each) {
			// 限制 
			let next = this.$selectTree.checkLimit(each, 'dep')
			if (!next) {
				return
			}
			// 正常选择 
			each.checked = !each.checked
			if (each.checked) {
				// 添加右侧
				this.$selectTree.selected('dep', each)
			} else {
				// 删除右侧
				this.$selectTree.removeSelected('dep', each)
			}
		}
	}
}
</script>

