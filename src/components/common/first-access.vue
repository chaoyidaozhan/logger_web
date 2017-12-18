<template>
    <Modal
        v-model="isFirstAccess"
        class-name="signin-modal identity vertical-center-modal"
        :closable="false"
        :mask-closable="false"
        width="480"
    >
        <div slot="title"></div>
        <div class="header">
            <img src="../../assets/images/dia_head.jpg" />
        </div>
        <div class="content">
            <h3>新版本更新</h3>
            <p>1、支持指定时间段补考勤与统计，补考勤时间与实际打卡时间一并判断考勤状态</p>
            <p>2、完善考勤状态统计逻辑</p>
            <p>3、可设置考勤周期的补考勤截止日</p>
            <p>4、可设置非工作日签到是否需要部门负责人确认</p>
            <p>5、更多新功能说明请下载使用指南</p>
        </div>
        <div slot="footer" class="footer" @click="()=>{ this.isFirstAccess = false }">
            <span>知道了</span>
        </div>
    </Modal>
</template>
<script>
export default {
    data() {
        return {
            isFirstAccess: true
        }
    }
}
</script>
<style lang="less">
.identity {
    .ivu-modal-content {
        overflow: hidden;
    }
    .ivu-modal-footer {
        padding: 0;
    }
    .footer {
        width: 480px;
        height: 50px;
        font-size: 16px;
        color: rgb(92, 161, 255);
        line-height: 50px;
        text-align: center;
        cursor: pointer;
    }
    .ivu-modal-body {
        padding: 0;
        .header {
            width: 480px;
            height: 180px;
        }
        .content {
            padding: 40px;
            h3 {
                font-size: 18px;
                color: rgb(102, 102, 102);
                margin-bottom: 13px;
            }
            p {
                font-size: 14px;
                line-height: 24px;
                color: rgb(153, 153, 153);
                margin-bottom: 5px;
            }
        }
    }
}
</style>

