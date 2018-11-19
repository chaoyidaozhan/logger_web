<template>
	<div class="tree_man">
		<search-input v-if="!info.memberApiUri" :showCharCode="showCharCode" @change="keyWordChange" @setChara="setChara"/>
		<ul class="man_scroll" :class="{
			showCharCode: showCharCode,
			defineApi: !!info.memberApiUri
		}">
			<li class="li cp" v-for="(each, index) in list" :key="index" @click="checkEach(each)">
				<div class="head-wrap l">
					<avatar :avatar="each.avatar" :name="each.userName" fontSize="12px" :size="'28px'"/>
				</div>
				<div class="userName l">
					<div class="user-name">{{each.userName}}</div>
					<div class="dept-name">{{each.deptName}}</div>
				</div>
				<div class="r">
					<!-- Checkbox阻止事件 -->
					<Checkbox class="cbx" style="pointer-events:none" :value="each.checked"/>
				</div>				
			</li>
			<li class="ajaxStatus" v-if="info.showLoading">
				<Spin class="auto" v-if="ajaxStatus=='loading'"/>
				<span v-if="ajaxStatus=='over'">{{$t('status.loadedAllData')}}</span>
				<span class="cp" v-if="ajaxStatus=='success'" @click="add">{{$t('status.loadMore')}}</span>
				<span class="cp" v-if="ajaxStatus=='error'">{{$t('status.networkError')}} <span class="cp" style="color:#1FDA9A" @click="getList">{{$t('status.clickToReload')}}</span></span>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
import avatar from '../avatar'
import searchInput from './search-input.vue'
export default {
	props: ['info'],
	components: {
		avatar,
		searchInput
	},
	data() {
		return {
			ajaxStatus: 'loading', // loding---加载中 success---加载更多 error---加载失败 over--全部
			keyWord: '',
			initial: "",
			isSort: 1,
			chara: '',
			pageSize: 40,
			pageNum: 1,
			list: [],
			showCharCode: true
		}
	},
	watch: {
		// 储存变量 , 设置默认值
		list() {
			// 人员列表会随着搜索清空 请求数据的时候也需要验证
			this.$selectTree.saveAjaxMan = this.list
			this.$selectTree.setDefaultTure('man')
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		keyWordChange(kw) {
			if (this.keyWord == kw) {
				return
			}
			this.keyWord = kw
			this.isSort = 0
			this.list = []
			this.pageNum = 1
			this.getList()
		},
		setChara(chara) {
			if (this.chara !== chara) {
				this.initial = chara
				this.isSort = 1
				this.chara = chara
				this.list = []
				this.pageNum = 1
				this.getList()
			}
		},
		getList() {
			this.ajaxStatus = 'loading'
			this.$ajax({
				url: this.info.memberApiUri || '/user/getUsersBySpace',
				data: {
					pageSize: this.pageSize,
					pageNum: this.pageNum,
					keyWord: this.keyWord,
					initial: this.initial,
					isSort: this.isSort // 是否按首字母排序 0否, 1是
				},
				success: (res) => {
					if (res.code == 0) {
						let arr = res.data
						arr.length >= this.pageSize ? this.ajaxStatus = 'success' : this.ajaxStatus = 'over'
						arr.map(v => {
							v.checked = false
						})
						this.list = this.list.concat(arr)
					} else {
						this.ajaxStatus = 'error'
					}
				},
				error: (res) => {
					this.ajaxStatus = 'error'
				}
			})
			this.$ajax
		},
		add() {
			this.pageNum++
			this.getList()
		},
		checkEach(each) {
			// 限制 
			let next = this.$selectTree.checkLimit(each, 'man')
			if (!next) {
				return
			}

			// 正常选择 
			each.checked = !each.checked
			if (each.checked) {
				// 添加右侧
				this.$selectTree.selected('man', each)
			} else {
				// 删除右侧
				this.$selectTree.removeSelected('man', each)
			}
		}
	}
}
</script>
<style lang="less">
.tree_man {
	.avatar-wrapper .name {
		font-size: 12px;
	}
	.man_scroll {
		position: absolute;
		top: 47px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		overflow-y: auto;

		&.showCharCode {
			top: 97px;
		}
		&.defineApi {
			top: 0;
		}
	}

	.ajaxStatus {
		text-align: center;
		padding: 10px 0 15px 0;

		&>span {
			font-size: 12px;
			padding: 0 10px;
		}
	}

	.li {
		padding: 5px 15px 5px 22px;
		font-size: 13px;
		line-height: 28px;
		overflow: hidden;

		.head-wrap {
			width: 28px;
			height: 28px;
			font-size: 0;
			position: relative;
			top: 4px;
		}

		.userName {
			margin-left: 8px;
			line-height: 18px;

			.dept-name {
				color: #999;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		&:hover {
			background: rgba(126, 231, 192, 0.1);
		}
	}

	.li:nth-of-type(1) {
		margin-top: 6px;
	}
}
</style>
