<template>
<div class="sm-search-inp-wrap" :class="showCharCode ? 'showCharCode' : ''">
	<Input class="search-inp" 
		v-model="keyword" 
		:placeholder="$t('placeholder.enterKeyword')" 
		@on-change="handleChange" />
	<div class="chara-filter" v-if="showCharCode">
		<a href="javascript:void(0)" 
			:class="{'active':curActiveChara==''}"
			@click="setChara('')">
			{{$t('operate.all')}}
		</a>
		<a href="javascript:void(0)" 
			:class="{'active':curActiveChara == String.fromCharCode(64 + num)}" 
			@click="setChara(String.fromCharCode(64+num))"
		:key="num" v-for="num in 26">{{String.fromCharCode(64+num)}}</a>
	</div>
</div>
</template>
<script>
export default {
	props: {
		showCharCode: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			keyword: '',
			timer: null,
			curActiveChara: ''
		}
	},
	methods: {
		handleChange() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.$emit('change', this.keyword)
			}, 800)
		},
		setChara(chara) { // 按字母搜索
			this.curActiveChara = chara
			this.$emit('setChara', chara)
		}
	}
}
</script>
<style lang="less">
.sm-search-inp-wrap {
	position: absolute;
	top: 0;
	left: 20px;
	right: 21px;
	height: 47px;
	padding-top: 15px;

	&.showCharCode {
		height: 97px;
	}

	.chara-filter {
		margin-top: 5px;

		>a {
			padding: 3px;
			display: inline-block;
			color: #999;

			&.active {
				color: #E14C46;
			}
		}
	}
}
</style>
