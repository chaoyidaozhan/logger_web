<template>
    <div class="avatar-wrapper" 
        :style="{
            'width':size, 
            'height':size,
            'line-height':size,
            'background-color': `${isDefault() && !loadError ?  '' : backgroundColor}`}"> 
        <template v-if="isDefault() && !loadError">
            <img 
                :src="avatar"
                @error="onError" 
                class="avatar">
        </template>
        <template v-else :style="{'font-size': fontSize}">
            <template v-if="!!type">
                <span :style="{'font-size': fontSize}" class="name" v-if="type=='dept'">
                    <i class="icon-department"></i>
                </span>
                <span :style="{'font-size': fontSize}" class="name" v-if="type=='group'">
                    <!-- <Icon type="person-stalker"></Icon> -->
                    <YYIcon type="qunzu-fill"></YYIcon>
                </span>
            </template>
            <span :style="{'font-size': fontSize}" class="name" v-else-if="name">{{ formatName }}</span>
            <span :style="{'font-size': fontSize}" class="name" v-else>
                <Icon type="person"></Icon>
            </span>
        </template>
    </div>
</template>
<script>
import encodeColor from 'app_src/filters/encode-color'
export default {
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
            return /[\u4e00-\u9fa5]/.test(this.name.trim(''))
                  ? this.name.substr(-this.nameLength)
                  : this.name.substr(0, this.nameLength)
        }
    },
    methods: {
        isDefault() {
            let avatar = ''
            if(this.avatar && this.avatar.indexOf('default_avatar') != -1) {
                avatar = ''
            } else if(this.avatar && this.avatar.indexOf('defaultGroup') != -1) {
                avatar = ''
            }  else {
                avatar = this.avatar
            }
            return avatar
        },
        onError(e) {
            this.loadError = true
        },
        getColors() {
			return encodeColor(this.name)
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
            color: #fff;
        }
    }
</style>
