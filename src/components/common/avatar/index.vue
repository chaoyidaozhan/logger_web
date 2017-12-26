<template>
    <div class="avatar-wrapper" 
        :style="{
            'width':size, 
            'height':size,
            'font-size': fontSize,
            'background-color': `${loadError ? backgroundColor : ''}`}"> 
        <template v-if="avatar && !loadError">
            <img 
                v-if="!type"
                :src="avatar"
                @error="onError" 
                class="avatar">
            <template v-else>
                <span v-if="type=='depart'"></span>
                <span v-if="type=='group'"></span>
            </template>
        </template>
        <span class="name" v-else>{{ formatName }}</span>
    </div>
</template>
<script>
import encodeColor from 'app_src/filters/encode-color'
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
        },
        type: {
            type: String
        }
    },
    data() {
        return {
            loadError: false,
            backgroundColor: this.getColors()
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
        getColors() {
			return encodeColor(this.name);
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
