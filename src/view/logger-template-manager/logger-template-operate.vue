<template>
    <div>
        <fs-template-create />
    </div>
</template>
<script>
import FsTemplateCreate from 'app_component/logger-template-manager/template-create';
export default {
    data () {
        return {
            list1: [1, 2, 3, 4],
            // list2: [6, 7, 8, 9]
        }
    },
    components: {
        FsTemplateCreate
    },
    methods: {
        dragEnd(e) {
            
            // console.log(e)
            console.log(this.list1)
            console.log(this.list2)
        },
        handleStart(e) {
            console.log(e)
        }
    }
}
</script>
<style lang="less" scoped>
.left {
    display: inline-block;
    width: 40px;
    .list1 {
        width: 40px;
        height: 40px;
        border: 1px solid #eee;
        text-align: center;
        line-height: 40px;
    }
}
.right {
    display: inline-block;
    margin-left: 100px;
    .list2 {
        width: 100px;
        height: 40px;
        border: 1px solid #eee;
        text-align: center;
        line-height: 40px;
    }   
}
</style>

