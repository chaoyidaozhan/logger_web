<template>
<div class="select-tree-right">
	<div class="title">
		<span class="l">
			{{$t('operate.selected')}}
			<span v-show="all">{{all}}</span>
		</span>
		<span class="r cp clear" @click="clearSelected">
			{{$t('operate.clear')}}
		</span>
	</div>
	<div class="sm_scroll scroll">
		<!-- 组织 -->
		<div class="tit cp" @click="openOrg=!openOrg" v-show="info.org">
			{{$t('noun.org')}}
			<Icon type="chevron-up" class="r" v-show="openOrg"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openOrg"></Icon>
		</div>
		<ul v-show="openOrg">
			<li class="li" v-for="(each, index) in orgList" :key="index">
				<div class="head-wrap l">
					<avatar :name="each.orgName" type="dept" :size="'28px'" />
				</div>
				<div class="depName elli l">
					{{each.orgName}}
				</div>
				<div class="r" @click="removeSelected('org',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>
		</ul>
		<!-- 部门 -->
		<div class="tit cp" @click="openDep=!openDep" v-show="info.dep">
			{{$t('noun.department')}}
			<Icon type="chevron-up" class="r" v-show="openDep"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openDep"></Icon>
		</div>
		<ul v-show="openDep">
			<li class="li" v-for="(each, index) in depList" :key="index">
				<div class="head-wrap l">
					<avatar :name="each.deptName" type="dept" :size="'28px'" />
				</div>
				<div class="depName elli l">
					{{each.deptName}}
				</div>
				<div class="r" @click="removeSelected('dep',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>
		</ul>
		<!-- 内部群 -->
		<div class="tit cp" @click="openTeam=!openTeam" v-show="info.team">
			{{$t('noun.internalGroup')}}
			<Icon type="chevron-up" class="r" v-show="openTeam"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openTeam"></Icon>
		</div>
		<ul v-show="openTeam">
			<li class="li" v-for="(each, index) in teamList" :key="index">
				<div class="head-wrap l">
					<avatar :avatar="each.groupLogo" type="group" :name="each.groupName" :size="'28px'" />
				</div>
				<div class="groupName elli l">
					{{each.groupName}}
				</div>
				<div class="r" @click="removeSelected('team',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>
		</ul>
		<!-- 人员 -->
		<div class="tit cp" @click="openMan=!openMan" v-show="info.man">
			{{$t('noun.personnel')}}
			<Icon type="chevron-up" class="r" v-show="openMan"></Icon>
			<Icon type="chevron-down" class="r" v-show="!openMan"></Icon>
		</div>
		<ul v-show="openMan">
			<li class="li" v-for="(each, index) in manList" :key="index">
				<div class="head-wrap elli l">
					<avatar :avatar="each.avatar" :name="each.userName" fontSize="12px" :size="'28px'" />
				</div>
				<div class="userName l">
					{{each.userName}}
				</div>
				<div class="r" @click="removeSelected('man',each)">
					<Icon type="close-round" class="close cp"></Icon>
				</div>
			</li>
		</ul>
	</div>
</div>
</template>
<script>
/*
	所有选中内容
	selected:{ 
		dep :{},
		team:{},
		man :{}
	}  
*/
import avatar from '../avatar'
export default {
	props: ["info"],
	components: {
		avatar
	},
	computed: {
		orgList() {
			return this.info.selected.org
		},
		depList() {
			return this.info.selected.dep
		},
		teamList() {
			return this.info.selected.team
		},
		manList() {
			return this.info.selected.man
		},
		all() {
			return this.info.selected.dep.length 
				+ this.info.selected.team.length 
				+ this.info.selected.man.length
				+ this.info.selected.org.length
		}
	},
	data() {
		return {
			openOrg: true,
			openDep: true,
			openTeam: true,
			openMan: true
		}
	},
	methods: {
		removeSelected(k, each) {
			this.$selectTree.removeSelected(k, each)
		},
		// 设置默认 true 
		clearSelected() {
			this.$selectTree.clearSelected()
		}
	}
}
</script>
<style lang="less">
@import '../../../assets/css/var.less';

.select-tree-right {
	height: 100%;
	width: 100%;
	position: relative;

	.title {
		height: 40px;
		line-height: 40px;
		padding: 0 15px;
		box-sizing: border-box;
		border-bottom: 1px solid @border-color;

		.r {
			color: @primary-color;

			&.clear {
				position: absolute;
				top: 0;
				right: 10px;
			}
		}
	}

	.tit {
		height: 27px;
		line-height: 27px;
		padding: 0 15px;
		box-sizing: border-box;
		border-top: 1px solid @border-color;
		background: @white-color-light;

		.r {
			font-size: 12px;
			color: @gray-color-light;
			opacity: .8;
			position: relative;
			top: 7px;
		}
	}

	.scroll {
		position: absolute;
		left: 0;
		right: 0;
		top: 40px;
		bottom: 0;
		overflow: auto;
	}

	.avatar-wrapper .name {
		font-size: 12px;
	}

	.head-wrap {
		width: 28px;
		height: 28px;
		// background: #f0f0f0;
		// border-radius: 50%;
		font-size: 0;
	}

	.li {
		line-height: 28px;
		color: @gray-color-dark;
		overflow: hidden;
		font-size: 13px;
		padding: 7px 16px 7px 15px;

		&:hover .close {
			display: inline-block;
		}

		&:hover {
			background: rgba(126, 231, 192, 0.1);
		}
	}

	.li:nth-of-type(1) {
		padding-top: 13px;
	}

	.close {
		font-size: 12px;
		color: @gray-color-light;
		display: none;
		opacity: .8;
		position: relative;
		top: -1px;
	}

	.depName,
	.groupName,
	.userName {
		margin-left: 8px;
		max-width: 130px;
	}

	.scroll>div:nth-child(1) {
		border: none;
	}
}
</style>
