<template>
    <div class="logger-list-row logger-list-content">
        <template v-if="typeof data === 'object'">
            <div class="logger-list-col" v-if="data.type === 'InputDate'">
                <div class="title-date" :id="data.id" >{{filterEncode(data.title)}}</div>
                <div class="caption" style="display:inline-block">
                    <span v-html="filterEncode(data.content || data.value)"></span>
                    <span v-if="data.type=='InputTextNum'&& data.unit">{{data.unit}}</span>
                </div>
            </div>
            <div class="logger-list-col" v-else>
                <div class="title" :id="data.id" >{{filterEncode(data.title)}}</div>
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
@import '~app_assets/css/var.less';
@rowMarginBottom: 14px;
.logger-list-row {
    margin-bottom: 18px;
}
.logger-list-content-children {
    .logger-list-row {
        margin-bottom: 6px;
        .logger-list-col {
            .title {
                color: #999 !important;
                margin-bottom: 0 !important;
                font-weight: 500;
            }
        }
    }
}
</style>
