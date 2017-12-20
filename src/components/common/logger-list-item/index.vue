<template>
    <div class="logger-list-item">
        <div class="logger-list-user">
            <fs-avatar
                :avatar="loggerItemData.avatar" 
                :name="loggerItemData.userName"
            />
            <div class="logger-list-row">
                <span class="label">{{loggerItemData.userName}}</span>
                <span class="caption">{{loggerItemData.createTime | filterDiaryUserTime}}</span>
            </div>
        </div>
        <div class="logger-list-range">
            <div class="ellipsis">
                {{renderRange(loggerItemData)}}
            </div>
            <div class="tool-tip">
                {{renderRange(loggerItemData)}}
            </div>
        </div>
        <div class="logger-list-tips">
            <span v-if="loggerItemData.templateName">
                {{loggerItemData.templateName}}
            </span>
            <span>
                {{dataSource[loggerItemData.dataType || 0]}}
            </span>
        </div>
        <div class="logger-list-time logger-list-row">
            <span class="label">日志日期</span>
            <span class="caption">{{loggerItemData.diaryTime | filterDiaryTime}}</span>
        </div>
        <div class="logger-list-content logger-list-row"
            v-for="(item, index) in JSON.parse(loggerItemData.content)"
            :key="index">
            <span class="label">{{item.title}}</span>
            <span class="caption">{{item.content || item.value}}</span>
        </div>
        <div class="logger-list-operate">
            <span class="reply">
                {{loggerItemData.commentNum}}个回复
            </span>
            <span class="collect" @click="handleCollect">
                {{loggerItemData.favorite && loggerItemData.favorite.favoriteNum}}收藏
            </span>
            <span class="like" @click="handleLike">
                {{loggerItemData.like && loggerItemData.like.likeNum}}个赞
            </span>
        </div>
    </div>
</template>
<script>
import FormatTime from '../../../filters/format-time';
import FsAvatar from '../../common/avatar/';
export default {
    props: {
        loggerItemData: {
            type: Object
        }
    },
    data() {
        return {
            dataSource: ["其他", "日报", "周报", "月报", "其他"]
        }
    },
    components: {
        FsAvatar
    },
    filters: {
        filterDiaryTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'YYYY-MM-DD')
        },
        filterDiaryUserTime(val) { // 格式化日志日期
            return FormatTime(new Date(val), 'MM-DD HH:mm')
        }
    },
    methods: {
        renderRange(loggerItemData) { // 可见范围控制
            let range = loggerItemData.range;
            let str = '可见范围：'
            if(!range.length) {
                if(loggerItemData.visibleRange === 0) {
                    str += '所有人可见';
                } else if (loggerItemData.visibleRange === 2) {
                    str += '仅自己可见';
                } else {
                    str = '';
                }
            } else {
                range.forEach(item=>{
                    switch(+item.dataType) {
                        case 1:
                            if(item.teamName) {
                                str += `${item.teamName } `
                            } else {
                                if(this.$store.state.userInfo.dept_id === 0) {
                                    str += `${item.spaceName } `
                                }
                            }
                            break;
                        case 4:
                            if(item.userName) {
                                str += `${item.userName } `
                            }
                            break;
                        case 3:
                            if(item.teamName) {
                                str += `${item.teamName } `
                            }
                    }
                })
            }
            
            return str;
        },
        handleCollect(e) {
            e.stopPropagation();
            let uri = this.loggerItemData.favorite.isFavorite ? 
                    '/logger/favorite/delete' : '/logger/favorite/add'
            this.$ajax({
                url: uri,
                type: 'post',
                data: {
                    diaryId: this.loggerItemData.id
                },
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.loggerItemData.favorite = res.data;
                    }
                },
                error: (res)=>{
                    this.$Message.warning('操作失败');
                }
            })
        },
        handleLike(e) {
            e.stopPropagation();
            this.$ajax({
                url: `/logger/diaryLike/${this.loggerItemData.id}`,
                type: 'post',
                success: (res)=>{
                    if(res && res.code == 0) {
                        this.loggerItemData.like.likeNum = res.data.likeTotal;
                        this.loggerItemData.like.isLike = !!this.loggerItemData.like.isLike?0:1;
                    } 
                },
                error: (res)=>{
                    this.$Message.warning('操作失败');
                }
            })
        },
    },
    created () {
        console.log(JSON.parse(this.loggerItemData.content))
    }
}
</script>
<style lang="less">
@import '../../../assets/css/var.less';
.logger-list-item {
    padding: 14px 20px;
    transition: .2s ease all;
    padding-left: 74px;
    position: relative;
    background-color: @white-color;
    &.fade-enter {
        opacity: 0;
    }
    &.fade-enter-in {
        opacity: 1;
    }
    &:after {
        position: absolute;
        left: 74px;
        height: 1px;
        right: 0;
        bottom: 0;
        content: '';
        background-color: @gray-color-elip;
    }
    &>div {
        margin-bottom: 8px;
    }
    .logger-list-row {
        line-height: 1.5;
        span {
            display: block;
            font-size: 14px;
        }
        .label {
            color: @gray-color-dark;
        }
        .caption {
            color: @gray-color-light;
        }
    }

    .logger-list-user {
        font-size: 0;
        margin-left: -54px;
        .logger-list-row {
            display: inline-block;
            padding-left: 10px;
            vertical-align: middle;
        }
        .caption {
            font-size: 12px;
        }
    }
    .logger-list-range {
        color: @gray-color-light;
        font-size: 12px;
        margin-top: 5px;
        position: relative;
        .ellipsis {
            padding: 1px 0;
            &::after {
               position: absolute;
               content: '';
               left: 0;
               right: 0;
               height: 10px;
               bottom: -10px;
            }
        }
       .tool-tip {
           visibility: hidden;
           position: absolute;
           opacity: 0;
           top: 23px;
           transition: .2s ease all;
           background-color: @white-color;
           border:1px solid @gray-color-normal;
           color: @gray-color-dark;
           font-size: 12px;
           line-height: 1.5;
           padding: 8px;
           border-radius: 6px;
           max-width: 100%;
           min-width: 100px;
           left:50%;
           margin-left: -50%;
           word-break: break-all;

           &:before, &:after {
               position: absolute;
               top: -10px;
               border-width: 0  10px 10px 10px;
               border-color: @gray-color-normal transparent @gray-color-normal transparent;
               border-style: solid;
               width: 0;
               left: 50%;
               content: '';
           }
           &:after {
               top: -9px;
               border-color: @white-color transparent @white-color transparent;
           }
       }
       &:hover {
        .tool-tip {
            opacity: 1;
            visibility: visible;
        }           
       }
    }
    .logger-list-tips {
        color: @white-color;
        font-size: 12px;
        span {
            border-radius: 2px;
            margin-right: 5px;
            padding: 3px 4px;
            display: inline-block;
            background-color: @primary-color;
        }
    }
    .logger-list-operate {
        color: @gray-color-light;
        font-size: 12px;
        margin-top: 10px;
        span {
            margin-right: 5px;
            cursor: pointer;
        }
    }
    &:hover {
        background-color: @white-color-light;
    }
}
</style>

