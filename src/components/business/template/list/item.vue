<template>
    <div class="template-item cursor-pointer" @click="goToDetail">
        <div class="template-item-content" :class="{itemDisable: data.dataStatus == 0, day: data.dataType == 1, week: data.dataType == 2, mouth: data.dataType == 3, etc: data.dataType == 4}">
            <div class="mb-flex mb-flex-align-center">
                <div class="fileSuffixName"></div>
                <div class="templateTitle">{{data.title}}</div>
            </div>
            <div class="templateUpdataTime">{{$t('operate.updateTime') + ' : '}}{{data.createTime | filterTime}}</div>
        </div>
        <div class="bottomOperate mb-flex" v-if="showEdit">
            <div class="mb-flex mb-flex-align-stretch">
                <template v-if="data.dataStatus == 1">
                    <div :title="$t('operate.delete')" class="mb-flex-1 del itemDisable"></div>
                    <div :title="$t('operate.disable')" class="mb-flex-1 disable" @click="handleSwitch('stop')"></div>
                    <div :title="$t('operate.edit')" class="mb-flex-1 edit itemDisable"></div>
                    <div :title="$t('operate.copy')" class="mb-flex-1 copy" @click="createCopyTemplate(data)"></div>
                </template>
                <template v-else>
                    <div :title="$t('operate.delete')" class="mb-flex-1 del" @click="handleDelete"></div>
                    <div :title="$t('operate.enable')" class="mb-flex-1 enable" @click="handleSwitch('start')"></div>
                    <div :title="$t('operate.edit')" class="mb-flex-1 edit" @click="goToTemplate"></div>
                </template>
            </div>
        </div>
        <div :class="{itemDisable: data.dataStatus == 0}" class="enOrdisble" v-if="data.dataStatus == 0">{{$t('operate.discontinued')}}</div>
        <div v-if="isSelectIconShow" class="selectIcon" :class="{itemDisable: data.dataStatus == 0, selected: data.isCurrentTemplateSelected}"></div>
    </div>
</template>
<script>
import FormatTime from 'app_src/filters/format-time'
import HTMLDeCode from 'app_src/filters/HTMLDeCode'

import { mapActions } from 'vuex';
export default {
    props: {
        data: {
            type: Object,
        },
        showEdit: {
            type: Boolean,
            default: false
        },
        bottomOperate: {
            type: Boolean,
            default: true
        },
        isToDetail: {
            type: Boolean,
            default: true
        },
        isSelectIconShow: {
            type: Boolean,
            default: false
        },
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
        createCopyTemplate(originalItem) {
            let item = Object.assign({}, originalItem);
            delete item.memberId;
            delete item.createTime;
            item.copy = true;
            let itemTitle = item.title;
            let regArr = itemTitle.match(/(\d+)$/ig);
            let copyCount = regArr === null ? 1 : (++regArr[0]);
            item.title = itemTitle.replace(/(\d+)$/ig, copyCount);
            this.$ajax({
                url: '/template/add',
                type: 'post',
                data: {
                    ...item
                },
                requestBody: true,
                success: (res)=>{
                    if(res && res.code == 0) {
                        originalItem.title = item.title;
                        this.$YYMessage.success(this.$t('status.copyTemplateSuccess'));
                        this.$emit('successCreateCopyTemplate');
                    } else {
                        this.$YYMessage.error(res && res.msg || this.$t('status.networkError'));
                    }
                    this.$emit('handleLoading');
                },
                error: (res)=>{
                    this.$YYMessage.error(res && res.msg || this.$t('status.networkError'));
                }
            });
        },
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
                        this.$YYMessage.error(res && res.msg || this.$t('status.networkError'))
                    }
                });
            }, 200);
        },
        handleDelete() {
            this.$YYModal.show({
                title: this.$t('toast.deleteTemplateReminder'),
                content: this.$t('toast.clickOKToDeleteTheTemplate'),
                onOk:()=>{
                    this.$ajax({
                        url: `/template/delete/${this.data.id}`,
                        success: (res)=>{
                            if(res && res.code == 0) {
                                this.$emit('deleteData', this.data)
                            }
                        },
                        error: (res)=>{
                            this.$YYMessage.error(res && res.msg || this.$t('status.networkError'))
                        }
                    })
                }
            })
           
        },
        goToDetail(item) {
            if(this.isSelectIconShow) {
                this.data.isCurrentTemplateSelected = !this.data.isCurrentTemplateSelected;
            }
            if(!this.isToDetail) {
                return;
            }
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
        },
        goToTemplate(e) {
            e.stopPropagation()
            this.updateTemplateContent({
                content: this.data
            })
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
@import '../../../../assets/css/var.less';
.itemDisable {
    opacity: .5;
}
.template-item {
    width: 100%;
    height: 100%;
    position: relative;
    background: white;
    .template-item-content {
        // position: absolute;
        // width: 100%;
        // height: 100%;
        // left: 0;
        // border: 1px solid;
        // border-color: @border-color;
        box-sizing: border-box;
        padding: 22px 20px 0;
        // padding: 0 20px;
        transition: .4s ease all;
        .mb-flex {
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f0f0;
            .fileSuffixName {
                width: 40px;
                height: 40px;
                margin-right: 12px;
            }
            .templateTitle {
                font-size: 14px;
                color: #333;
                line-height: 22px;
                font-weight: 500;
            }
        }
        .templateUpdataTime {
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            color: #666;
        }
        .template-item-title {
            font-size: 14px;
            color: #333;
            // margin-top: 22px;
            // margin-bottom: 2px;
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
        // &:hover {
        //     &:before {
        //         opacity: 1;
        //     }
        //     box-shadow: 0 2px 4px @box-shadow;
        // }     
    }
    .day {
        &:before {
            content: '';
            width: 3px;
            position: absolute;
            // border-top-left-radius: 4px;
            // border-top-right-radius: 4px;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #ee3d4b;
            opacity: .85;
            transition: .4s ease all;
        }
        .fileSuffixName {
            background: url("../../../../assets/images/day.png") center center no-repeat;
            background-size: contain;
        }
    }
    .week {
        &:before {
            content: '';
            width: 3px;
            position: absolute;
            // border-top-left-radius: 4px;
            // border-top-right-radius: 4px;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #02c0a7;
            opacity: .85;
            transition: .4s ease all;
        }
        .fileSuffixName {
            background: url("../../../../assets/images/week.png") center center no-repeat;
            background-size: contain;
        }
    }
    .month {
        &:before {
            content: '';
            width: 3px;
            position: absolute;
            // border-top-left-radius: 4px;
            // border-top-right-radius: 4px;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #02c0a7;
            opacity: .85;
            transition: .4s ease all;
        }
        .fileSuffixName {
            background: url("../../../../assets/images/mouth.png") center center no-repeat;
            background-size: contain;
        }
    }
    .etc {
        &:before {
            content: '';
            width: 3px;
            position: absolute;
            // border-top-left-radius: 4px;
            // border-top-right-radius: 4px;
            top: 0;
            left: 0;
            height: 100%;
            background-color: rgba(51, 149, 255, 1);
            opacity: .85;
            transition: .4s ease all;
        }
        .fileSuffixName {
            background: url("../../../../assets/images/etc.png") center center no-repeat;
            background-size: contain;
        }
    }
    .bottomOperate {
        display: none;
        position: absolute;
        bottom: 0;
        left: 3px;
        height: 32px;
        width: 100%;
        background: #fafafa;
        .itemDisable {
            display: none;
        }
        & > div {
            height: 100%;
        }
        .del {
            background: url("../../../../assets/images/del.png") center center no-repeat;
            background-size: 18px 18px;
        }
        .del:hover {
            background: url("../../../../assets/images/del.png") center center no-repeat #e7e7e7;
            background-size: 18px 18px;
        }
        .enable {
            background: url("../../../../assets/images/enable.png") center center no-repeat;
            background-size: 18px 18px;
        }
        .enable:hover {
            background: url("../../../../assets/images/enable.png") center center no-repeat #e7e7e7;
            background-size: 18px 18px;
        }
        .disable {
            background: url("../../../../assets/images/disable.png") center center no-repeat;
            background-size: 18px 18px;
        }
        .disable:hover {
            background: url("../../../../assets/images/disable.png") center center no-repeat #e7e7e7;
            background-size: 18px 18px;
        }
        .edit {
            background: url("../../../../assets/images/edit.png") center center no-repeat;
            background-size: 18px 18px;
        }
        .edit:hover {
            background: url("../../../../assets/images/edit.png") center center no-repeat #e7e7e7;
            background-size: 18px 18px;
        }
        .copy {
            background: url("../../../../assets/images/copy.png") center center no-repeat;
            background-size: 18px 18px;  
        }
        .copy:hover {
            background: url("../../../../assets/images/copy.png") center center no-repeat #e7e7e7;
            background-size: 18px 18px;  
        }
    }
    &:hover .bottomOperate {
        display: block;
    }
    .enOrdisble {
        position: absolute;
        right: 0;
        top: 0;
        width: 52px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        color: #333;
        background: #f7f7f7;
    }
    .selectIcon {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 18px;
        background: url("../../../../assets/images/teplateUnSelected.png") center center no-repeat;
        background-size: contain;
    }
    .selectIcon.selected {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 18px;
        background: url("../../../../assets/images/teplateSelected.png") center center no-repeat;
        background-size: contain;
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
