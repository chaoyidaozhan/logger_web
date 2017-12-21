<template>
    <div class="avatar-wrapper" 
        :style="{
            'width':size, 
            'height':size,
            'font-size': fontSize,
            'background-color': `${loadError ? backgroundColor : ''}`}"> 
        <img v-if="avatar && !loadError"
            :src="avatar"
            @error="onError" 
            class="avatar">
        <span class="name" v-else>{{ formatName }}</span>
    </div>
</template>
<script>
export default{
    props: {
        avatar: {
            type: String
        },
        name: {
            type: String
        },
        size: {
            type: String,
            default: '44px'
        },
        nameLength: {
            type: Number,
            default: 2
        },
        fontSize: {
            type: String,
            default: "14px"
        }
    },
    data() {
        return {
            loadError: false,
            backgroundColor: this.getRandomColor()
        }
    },
    computed: {
        formatName: function() {
            return /[\u4e00-\u9fa5]/.test(this.name)
                  ? this.name.substr(-this.nameLength)
                  : this.name.substr(0, this.nameLength);
        }
    },
    methods: {
        onError(e) {
            this.loadError = true;
        },
        getRandomColor () {
			var colors = ['#29d4ff', '#1594ff', '#ffa92f', '#b587fa',
                         '#06cf86', '#fa6771', '#73d51c', '#8991ff'];
			return colors[this.randomBetween(0, colors.length - 1)];
		},
		randomBetween(lowerValue, upperValue) {
			var choices = upperValue - lowerValue + 1;
			return Math.floor(Math.random() * choices + lowerValue);
		}
    }
};
</script>
<style lang="less" scoped>
    .avatar-wrapper{
        display: inline-block;
        overflow: hidden;        
        font-size: 0;
        text-align: center;
        border-radius: 50%;
        vertical-align: middle;
        .avatar {
            width: 100%;
            height: 100%;
        }
        .name {
            display: block;
            width: 100%;
            height: 100%;
            font-size: 14px;
            color: #fff;
            margin-left: -1px;
            &:before {
                display: inline-block;
                width: 1px;
                height: 100%;
                content: '';
                vertical-align: middle;
            }
        }
    }
</style>
