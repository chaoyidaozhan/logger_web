<template>
    <div class="template-item cursor-pointer" @click="goToDetail">
        <div class="template-item-content">
            <div class="template-item-title ellipsis">{{ data.title }}</div>
            <div v-if="!showEdit" class="template-item-describe ellipsis">{{ data.describe }}</div>
            <template v-if="showEdit">
                <div class="template-item-time ellipsis">更新于{{ data.createTime | filterTime }}</div>
                <div v-if="!data.dataStatus" class="template-item-status ellipsis">已停用</div>
            </template>
        </div>
        <div class="template-operate-modal" v-if="showEdit">
            <!--启用， 停用-->
            <template v-if="!data.dataStatus">
                <span @click="handleSwitch('start')"><i class="icon-play"></i></span>
                 <!--停用显示编辑和删除-->
                <span @click="goToTemplate"><i class="icon-edit"></i></span>
                <span><i class="icon-delete" @click="handleDelete"></i></span>
            </template>
            <template v-else>
                <!--启用显示查看-->
                <span @click="handleSwitch('stop')"><i class="icon-stop"></i></span>
                <span><i class="icon-check"></i></span>
            </template>
        </div>
    </div>
</template>
<script>
import FormatTime from 'app_src/filters/format-time';
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
    filters: {
        filterTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD HH:mm')
        },
    },
    methods: {
        ...mapActions({
            updateTemplateContent: 'update_template_content'
        }),
        handleSwitch(name) {
            this.$ajax({
                url: `/logger/template/${name}`,
                type: 'post',
                data: {
                    id: this.data.id
                },
                success: (res)=>{
                    this.data.dataStatus = name == 'start' ? 1 : 0
                    console.log(this.$store);
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误');
                }
            })
        },
        handleDelete() {
            this.$ajax({
                url: `/logger/template/delete/${this.data.id}`,
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.$emit('deleteData', this.data);
                    }
                },
                error: (res)=>{
                    this.$Message.error(res && res.msg || '网络错误');
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
                })
            } 
            // console.log(this.data);
            // console.log(this.$store.state.template)
        },
        goToTemplate(e) {
            e.stopPropagation();
            console.log(this.$store.state.template.content,23456)
            console.log(this.data.id,23456)
            this.updateTemplateContent({
                content: this.data
            });
            this.$router.push({
                path: `/LoggerTemplate/operate/${this.data.id}`,
                query: {
                    token: this.$store.state.userInfo.token
                }
            })
        }
    }
}
</script>
<style lang="less">
@import '../../assets/css/var.less';
.template-item {
    width: 100%;
    padding-bottom: 45%;
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
            margin-top: 26px;
            margin-bottom: 8px;
        }        
        .template-item-describe {
            font-size: 12px;
            color: @gray-color-light;
        }   
        .template-item-time {
            font-size: 12px;
            color: @gray-color-light;
        }  
        .template-item-status {
            color: @gray-color-light;
            font-size: 20px;
            padding: 4px 10px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 2px;
            transform: scale(0.5);
            transform-origin: left;
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
        transition: .2s ease opacity;
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
            font-size: 14px;
            color: @white-color;
            transition: .2s ease opacity;
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
        }
    }
}
</style>
