<template>
<div class="tree-org-wrap">
	<div class="search-wrap man_scroll">
		<ul>
			<li v-for="(each, index) in list" 
				:key="index"
				class="li cp" @click="checkEach(each)">
				<div class="head-wrap l">
					<avatar :name="each.orgName" type="dept" :size="'28px'"/>
				</div>
				<div class="deptName l">
					{{each.orgName}}
				</div>
				<div class="r">
					<!-- Checkbox阻止事件 -->
					<Checkbox class="cbx" style="pointer-events:none" :value="each.checked"/>
				</div>
			</li>
			<li class="ajaxStatus">
				<Spin class="auto" v-if="ajaxStatus=='loading'"/>
				<span v-if="ajaxStatus=='over'">{{$t('status.loadedAllData')}}</span>
				<span class="cp" v-if="ajaxStatus=='success'">{{$t('status.loadMore')}}</span>
				<span class="cp" v-if="ajaxStatus=='error'">{{$t('status.networkError')}} <span class="cp" style="color:#1FDA9A" @click="getDepTypesList">{{$t('status.clickToReload')}}</span></span>
			</li>
		</ul>
	</div>
</div>
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
			this.$selectTree.saveAjaxOrg = this.list
			this.$selectTree.setDefaultTure('org')
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		getList() {
			this.$ajax({
				url: this.info.orgApiUri,
				success: (res) => {
					if (res.code == 0) {
						let arr = res.data || []
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
		checkEach(each) {
			// 限制 
			let next = this.$selectTree.checkLimit(each, 'org')
			if (!next) {
				return
			}
			// 正常选择 
			each.checked = !each.checked
			if (each.checked) {
				// 添加右侧
				this.$selectTree.selected('org', each)
			} else {
				// 删除右侧
				this.$selectTree.removeSelected('org', each)
			}
		}
	}
}
</script>
<style lang="less">
.tree-org-wrap {
	.avatar-wrapper .name {
		font-size: 12px;
	}

	.tree-wrap {
		padding: 0 15px 0 25px;
	}

	.search-wrap .li {
		font-size: 13px;
		overflow: hidden;
		line-height: 28px;
		padding: 5px 15px 5px 22px;

		&:hover {
			background: rgba(126, 231, 192, 0.1);
		}

		.head-wrap {
			width: 28px;
			height: 28px;
			// background: #f0f0f0;
			// border-radius: 50%;
			font-size: 0;
		}

		.deptName {
			margin-left: 8px;
			width: 80%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}

	.search-wrap .li:nth-of-type(1) {
		padding-top: 12px;
	}

	.ajaxStatus {
		text-align: center;
		padding: 10px 0 15px 0;

		&>span {
			font-size: 12px;
			padding: 0 10px;
		}
	}

	.man_scroll {
		position: absolute;
		top: 0;
		bottom: 0px;
		left: 0px;
		right: 0px;
		overflow-y: auto;
	}
}
</style>
