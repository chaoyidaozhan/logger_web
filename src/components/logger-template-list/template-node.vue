<template>
    <div class="template-item cursor-pointer" @click="goToDetail">
        <div class="template-item-content">
            <div class="template-item-title ellipsis" v-html="filterHtml(data.title)"></div>
            <div v-if="!showEdit" class="template-item-describe ellipsis" v-html="filterHtml(data.describe)"></div>
            <template v-if="showEdit">
                <div class="template-item-time ellipsis">{{$t('operate.update')}}{{ data.createTime | filterTime }}</div>
                <div v-if="!data.dataStatus" class="template-item-status ellipsis">{{$t('operate.discontinued')}}</div>
            </template>
        </div>
        <div class="template-operate-modal" v-if="showEdit">
            <!--启用， 停用-->
            <template v-if="!data.dataStatus">
                <span title="启用" @click="handleSwitch('start')"><i class="icon-play"></i></span>
                 <!--停用显示编辑和删除-->
                <span title="编辑" @click="goToTemplate"><i class="icon-edit"></i></span>
                <span title="删除"><i class="icon-delete" @click="handleDelete"></i></span>
            </template>
            <template v-else>
                <!--启用显示查看-->
                <span title="停用" @click="handleSwitch('stop')"><i class="icon-stop"></i></span>
                <span title="查看" @click="goToTemplate"><i class="icon-check"></i></span>
            </template>
        </div>
    </div>
</template>
<script>
import FormatTime from 'app_src/filters/format-time';
import HTMLDeCode from 'app_src/filters/HTMLDeCode';

import { mapActions } from 'vuex';
export default {
    props: {
        data: {
            type: Object,
        },
        showEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            timer: null
        }
    },
    filters: {
        filterTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD HH:mm')
        },
    },
    methods: {
        ...mapActions({
            updateTemplateContent: 'update_template_content'
        }),
        filterHtml(val) {
            return HTMLDeCode(val)
        },
        handleSwitch(name) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$ajax({
                    url: `/template/${name}`,
                    type: 'post',
                    requestBody: true,
                    data: {
                        id: this.data.id
                    },
                    success: (res)=>{
                        this.data.dataStatus = name == 'start' ? 1 : 0
                    },
                    error: (res)=>{
                        this.$Message.error(res && res.msg || this.$t('status.networkError'));
                    }
                });
            }, 200);
        },
        handleDelete() {
            this.$Modal.confirm({
                title: '删除模板提醒',
                content: '点击确定删除模板',
                onOk:()=>{
                    this.$ajax({
                        url: `/template/delete/${this.data.id}`,
                        success: (res)=>{
                            if(res && res.code == 0) {
                                this.$emit('deleteData', this.data);
                            }
                        },
                        error: (res)=>{
                            this.$Message.error(res && res.msg || this.$t('status.networkError'));
                        }
                    });
                }
            })
           
        },
        goToDetail() {
            this.updateTemplateContent({
                content: this.data
            });
            if(!this.showEdit) {
                this.$router.push({
                    path: `operate/create/${this.data.id}`,
                    query: {
                        token: this.$store.state.userInfo.token,
                        templateName: this.data.title||'' 
                    }
                });
            } 
        },
        goToTemplate(e) {
            e.stopPropagation();
            this.updateTemplateContent({
                content: this.data
            });
            this.$router.push({
                path: `/LoggerTemplate/operate/${this.data.id}`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            });
        }
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.template-item {
    width: 100%;
    padding-bottom: 47%;
    position: relative;
    .template-item-content {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        border: 1px solid;
        border-color: @border-color;
        border-radius: 4px;
        padding: 0 20px;
        transition: .4s ease all;
        &:before {
            content: '';
            position: absolute;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            top: -1px;
            height: 6px;
            left: -1px;
            right: -1px;
            background-color: @primary-color;
            opacity: .4;
            transition: .4s ease all;
        }
        .template-item-title {
            font-size: 14px;
            color: @gray-color-dark;
            margin-top: 22px;
            margin-bottom: 2px;
            padding: 2px 0;
        }        
        .template-item-describe {
            font-size: 12px;
            color: @gray-color-light;
            padding: 2px 0;
        }   
        .template-item-time {
            font-size: 12px;
            color: @gray-color-light;
            padding: 2px 0;
        }  
        .template-item-status {
            color: @gray-color-light;
            font-size: 20px;
            padding: 4px 10px;
            margin-top: 4px;
            border-radius: 20px;
            display: inline-block;
            transform: scale(0.5);
            transform-origin: left top;
            border: 2px solid @gray-color-elip;
        } 
        &:hover {
            &:before {
                opacity: 1;
            }
            box-shadow: 0 2px 4px @box-shadow;
        }     
    }
    .template-operate-modal {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        border-radius: 4px;
        background-color: rgba(0,0,0,.5);
        opacity: 0;
        transform: translateY(-70%);
        transition: .3s ease-in-out all;
        text-align: center;
        &:before {
            height: 100%;
            width: 1px;
            content: '';
            display: inline-block;
            vertical-align: middle;
        }
        span {
            display: inline-block;
            vertical-align: middle;
            width: 32px;
            height: 32px;
            line-height: 33px;
            text-align: center;
            background-color: rgba(0,0,0,.5);
            border-radius: 50%;
            margin: 0 10px;
            font-size: 16px;
            color: @white-color;
            transition: .3s ease-in-out color, .4s ease-in-out transform;
            transform: translateY(-100%);
            .icon-play {
                margin-left: 2px;
            }
            &:hover {
                color: @primary-color;
            }
        }
    }
    &:hover {
        .template-operate-modal{
            opacity: 1;
            transform: translateY(0);
            span {
                transform: translateY(0);
            }
        }
    }
}
</style>
