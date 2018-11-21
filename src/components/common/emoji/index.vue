<template>
    <div class="faces-wrapper">
        <ul>
            <li class="face-item" v-for="(faceItem, key) in faceArr" :key="key" @click="handleFace($event, faceItem)">
                <i :title="faceItem" :exp="faceItem"></i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            faceArr:  ['龇牙', '哈哈', '色', '可怜', '晕', '汗', '害羞', '调皮', '疑问', '闭嘴', '得意',
            '流泪', '愉快', '难过', '困', '生病', '笑cry', '尴尬', '偷笑', '奋斗', '赞', '握手', 'OK', 'yeak',
            '鼓掌', '拳头', '肌肉', '握拳', '拜托', '祈祷', '踩', '亲亲', '嘘', '大哭', '发呆', '困Zzz', '思考',
            '白眼', '傲慢', '酷', '囧', '鄙视', '饥饿', '吓', '抠鼻', '惊讶', '发怒', '惊恐', '吐', '拜拜', '给力',
            '咖啡', '下雨', '闪电', '下雪', '足球', '篮球', '飞机', '邮件', '雨伞', '奖杯', '怪物', '药', '炸弹', '蛋糕'
            ]
        }
    },
    methods: {
        handleFace(e, faceItem) {
            e.stopPropagation()
            this.$emit("handleFace", faceItem)
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/var.less';
.faces-wrapper {
    display: inline-block;
    box-sizing: content-box;
    width: 300px;
    padding: 10px;
    overflow: hidden;
    border: 1px solid @border-color;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .15);
    background-color: @white-color;
    .face-item {
        display: inline-block;
        cursor: pointer;
    }
}
</style>
