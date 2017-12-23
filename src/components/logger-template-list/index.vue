<template>
    <div class="content">
        <div class="col" v-if="showEdit">
            <div class="template-item cursor-pointer">
                <div class="template-item-content">
                    <i class=""></i>
                    创建模板
                </div>
            </div>
        </div>
        <transition-group name="scale">
            <div class="col" v-for="item in list" :key="item.id">
                <fs-template-item @setTempListData="setTempListData" :showEdit="showEdit" :data="item" @deleteData="deleteData"/>
            </div>
        </transition-group>
    </div>
</template>
<script>
import FsTemplateItem from './template-node';
export default {
    props: {
        showEdit: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            list: [],
            show: true,
            totalCount: 0
        }
    },
    components: {
        FsTemplateItem
    },
    methods: {
        setTempListData(name) {
            this.list = this.$store.state.template[`${name}`];
        },
        getTemplateApp(call) {
            this.$store.dispatch('update_template_app').then(()=>{
                this.setTempListData('app');
            })
        },
        getTemplateWeb(call) { // 全部日志分页
            this.$store.dispatch('update_template_web').then(()=>{
                this.setTempListData('web');
            })
        },
        deleteData(data) { // 删除日志
            this.list.forEach((val, i)=>{
                if(data.id == val.id) {
                    this.list.splice(i, 1)
                }
            })
        },
        loadData() { // 默认优先获取数据保存到store
            if(this.showEdit) {
                if(!this.$store.state.template.web.length) { 
                    this.getTemplateWeb();
                } else {
                    this.setTempListData('web');
                }
            } else {
                if(!this.$store.state.template.app.length) { 
                    this.getTemplateApp();
                } else {
                    this.setTempListData('app');
                }
            }
        },
    },
    created () {
        this.loadData();
    }
}
</script>
<style lang="less" scoped>
 .content {
    font-size: 0;
    .col {
        width: 33.33333333333%;
        display: inline-block;
        padding: 0 10px 20px;
        transition: .4s ease all;
        font-size: 14px;
        overflow: hidden;
        vertical-align: top;
        &.scale-leave-active {
            transition: width .3s, opacity .3s;
        }
        &.scale-leave-to {
            width: 0;
            opacity: 0;
            padding: 0;
        }
    }
    @media (min-width: 1280px) {
        .col {
            width: 25%;
        }
    }
    @media (min-width: 1680px) {
        .col {
            width: 20%;
        }
    }
    @media (min-width: 1920px) {
        .col {
            width: 16.666666666%;
        }
    }
    
    
}
</style>
