<template>
    <div class="logger-list-row logger-list-content">
        <template v-if="typeof data === 'object'">
            <div class="logger-list-col">
                <div class="title">{{filterEncode(data.title)}}</div>
                <div class="caption" >
                    <span v-html="filterEncode(data.content || data.value)"></span>
                    <span v-if="data.type=='InputTextNum'&& data.unit">{{data.unit}}</span>
                </div>
            </div>
            <template v-if="data.type == 'InputContainer' && data.children.length">
                <div class="logger-list-content-children">
                    <logger-list-content-node v-for="(item, index) in data.children"
                        :key="index"
                        :data="item"
                        :filterEncode="filterEncode" />
                </div>
            </template>
        </template>
        <template v-else>
            <div class="logger-list-col">
                <div class="caption" >
                    <span v-html="filterEncode(data)"></span>
                </div>
            </div>
        </template>
        
    </div>
</template>
<script>
export default {
    name: 'loggerListContentNode',
    props: {
        data: {
            type: Object | String | Number
        },
        filterEncode: {
            type: Function
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-list-row {
    margin-bottom: 26px;
}
.logger-list-content-children {
    .logger-list-row {
        margin-bottom: 10px;
        .logger-list-col {
            .title {
                color: @gray-color-light;
                margin-bottom: 0;
            }
        }
    }
}
</style>
