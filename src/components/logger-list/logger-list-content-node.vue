<template>
    <div class="logger-list-row logger-list-content">
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
    </div>
</template>
<script>
export default {
    name: 'loggerListContentNode',
    props: {
        data: {
            type: Object
        },
        filterEncode: {
            type: Function
        }
    }
}
</script>
<style lang="less" scoped>
.logger-list-content-children {
    .logger-list-row {
        .logger-list-col {
            .title {
                color: #888888;
            }
            .caption {
                color: #555555;
                font-size: 12px;
            }
        }
    }
}
</style>
