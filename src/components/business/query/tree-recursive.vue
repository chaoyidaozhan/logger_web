<template>
    <div v-if="item && item.children && item.children.length > 0">
        <div class="treenode" v-for="(treenode, index) in item.children" :key="index" @click="back2check(treenode)">
            {{treenode.title}}
            <!-- <myTree :item="treenode" ></myTree>                       -->
        </div>
    </div>
</template>
<script>
export default {
    name: "myTree",
    props: {
        item:{
            type:Object,
            default:{}
        }
    },
    methods:{
       back2check(treenode){
            this.$emit('back2Title', treenode)
       } 
    }
}
</script>
<style scoped>
    .treenode{
        margin-top:20px;
        font-size:12px;
        margin-left: 12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
</style>
