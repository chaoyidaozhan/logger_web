<template>
    <div class="logger-summary-content">
        <div class="content-bar" v-if="list.length">
            <Table :loading="loading" border ref="selection" :columns="columnsData" :data="listTemplate" @on-selection-change="handleSelectChange"></Table>
            <Table :columns="footerData" border :show-header="false" :data="countData"></Table>
        </div>
        <div class="content-footer" v-if="list.length">
            <div class="content-bottom" v-if="list.length">
                <span class="bottom-left">
                    <Checkbox v-model="dataType" @on-change="handleSelectAll(dataType)">全选</Checkbox>
                    <span class="checkout-note">已选中
                        <span class="check-num">{{checkNum}}</span>日志</span>
                </span>
                <span class="bottom-right">
                    <Button type="success" @click="loggerSummary">汇总日志</Button>
                    <Button type="ghost" @click="exportECL">导出EXCEL</Button>
                </span>
            </div>
            <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
        </div>
        <fs-empty-tips v-else :iconType="iconType" :emptyMsg="emptyMsg" />
        <span class="nodata" v-if="!list.length&&iconFlag">选择提交人查询需要汇总的数据 ，可导出Excel</span>
    </div>
</template>
<script>
import Pagination from 'app_component/common/pagination';
import FsEmptyTips from 'app_component/common/empty-tips';
import config from 'app_src/config/config'
import formatTime from'../../filters/format-time'
export default {
    props: {
        params: { // 暴露的对象字段
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            dataType: false,
            checkNum: 0,
            iconFlag: 1,
            list: [],
            pageNo: 1,
            pageSize: 20,
            range: 0,
            totalCount: 0,
            iconType: 'member',
            emptyMsg: '',
            columnsData: [], //表头
            listTemplate: [], //表bod
            footerData:[], // 表foot
            countData: [], // 总计
            templateContent:[],
            templateItemData:[],
            selectList:[],
            selectContent:[],
            loading: false
        }
    },
    components: {
        Pagination,
        FsEmptyTips,
    },
    watch: {
        params: 'initList',
    },
    methods: {
        handleSelectAll(dataType) { // 全选
            this.$refs.selection.selectAll(dataType);
        },
        handleSelectChange(selection,index) { //选项发生变化
            let ids = [],summaryList = [],summaryarr = [];
            this.checkNum = selection.length;
            this.dataType = selection.length < this.list.length ? false : (selection.length == this.list.length ? true : this.dataType);
            selection&&selection.forEach((v,k)=>{
                ids.push(v.id);
            })
            this.list.forEach((v,k)=>{
                if(ids.indexOf(v.id) >= 0){
                    summaryList.push(v);
                    summaryarr.push(JSON.parse(v.content));
                }
            })
            this.selectList = summaryList;
            this.selectContent = summaryarr;
        },
        handleChangePage(pageNo) { // 改变页数
            this.pageNo = pageNo;
            this.loadData();
        },
        handleSummaryData(){ // 汇总数据
            let contentArr = [];
            this.templateItemData = this.selectList[0]||{};
            this.selectContent.forEach((v,k)=>{
                if(k == 0) {
                    contentArr = v;
                } else {
                    v.forEach((item, index)=>{
                        if(item.type == 'InputText') {
                            if(!!item.content.trim()) {
                                contentArr[index].content += `\n${item.content}`;
                                contentArr[index].value += `\n${item.value}`;
                            }
                        }
                        if(item.type == 'InputTextNum') {
                            if(!!item.content && typeof +item.content == 'number') {
                                contentArr[index].content = (+contentArr[index].content) + (+item.content);
                                contentArr[index].value = (+contentArr[index].value) + (+item.value);
                            }
                        }
                    })
                }
            });
            this.templateItemData.content = JSON.stringify(contentArr);
        },
        loggerSummary() { // 日志汇总
            if (this.checkNum <= 0) {
                this.$Message.warning('请选择汇总的日志');
            } else {
                this.handleSummaryData();
                this.$store.dispatch('update_template_content', {
                    content: this.templateItemData
                });
                this.$router.push({
                    path: `LoggerDetail/operate/summary/${this.params.templateId}`,
                    query: {
                        token: this.$store.state.userInfo.token
                    }
                });
            }
        },
        exportECL() { // 导出
            let templateId = this.params.templateId == null ? 0 : this.params.templateId;
            let url = `${config[__ENV__].apiHost}/diaryQuery/exportDiaryStatistics?timestamp=${(new Date()).valueOf()}&beginDate=${this.params.beginDate}
            &endDate=${this.params.endDate}&token=${this.$store.state.userInfo.token}&templateId=${templateId}` 
            window.open(url, '_blank');
        },
        updateList(res) { // 更新列表
            if (res && res.code === 0) {
                this.list = res.data.list || [];
                this.totalCount = this.list.length;
                if (this.list.length <= 0) {
                    this.iconFlag = 0;
                    this.iconType = '';
                    this.emptyMsg = '没有相关数据';
                } else {
                    this.listTemplate = [];
                    this.countData = [];
                    this.columnsData = [{ //固定的前三列
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: 'id',
                            key: 'id',
                            className:'id-column',
                        },
                        {
                            title: '提交时间',
                            key: 'column1',
                            width: 150
                        },
                        {
                            title: '日志日期',
                            key: 'column2',
                            width: 150
                        },
                        {
                            title: '提交人',
                            key: 'column3',
                            width: 80
                        }
                    ];
                    this.footerData = [{
                        title: '',
                        key: 'column1',
                        width: 60
                    }, {
                        title: '',
                        key: 'column2',
                        width: 150
                    }, {
                        title: '',
                        key: 'column3',
                        width: 150
                    }, {
                        title: '',
                        key: 'column4',
                        width: 80
                    }];

                    let columnArr = JSON.parse(this.list[0].content) || [];
                    columnArr && columnArr.forEach((item, key) => { //循环构建表头
                        this.columnsData.push({
                            title: columnArr[key].title || '',
                            key: 'column' + (this.columnsData.length - 1)
                        });
                        this.footerData.push({ //循环构建表foot
                            title: '',
                            key: 'column' + (this.footerData.length + 1)
                        })
                    });

                    let inputTextNumKey,
                        countNum = 0;
                    this.list.forEach((item, key) => { //循环构建表body
                        let contentObj = JSON.parse(item.content) || [];
                        let data = {
                            column1: formatTime(new Date(item.createTime), 'YYYY-MM-DD HH:mm'),
                            column2: formatTime(new Date(item.diaryTime), 'YYYY-MM-DD'),
                            column3: item.userName
                        };
                        let columnLength = this.columnsData.length; //总列数
                        let contentLength = contentObj.length; //返回的列数
                        contentObj && contentObj.forEach((v, k) => {
                            let i = columnLength - contentLength - 1 + k;
                            data['column' + i] = v.value || '';
                            if(v.type === 'InputTextNum') {
                                inputTextNumKey = k;
                                if(!isNaN(+v.value)) {
                                    countNum += +v.value;
                                }
                            }
                        });
                        data.id = item.id;
                        this.listTemplate.push(data);
                    });
                    let tmp = {
                        column1: "总计"
                    };
                    if(inputTextNumKey >= 0) {
                        tmp['column' + (5 + inputTextNumKey)] = countNum;
                    }
                    this.countData.push(tmp);
                }

            } else {
                this.$Message.warning((res && res.msg) || '网络错误');
            }
        },
        getParams() { // 合并参数
            let data = Object.assign({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                range: this.range,
                memberIds: this.params.memberIds || '',
                deptIds: this.params.deptId || '',
                teamIds: this.params.groupId || '',
            }, this.params);
            delete data.deptId;
            delete data.groupId;
            return data;
        },
        loadData() { // 加载数据
            let data = this.getParams();
            if (!data.templateId) {
                this.$Message.warning('请选择模版');
                return false;
            } else if (!data.beginDate || !data.endDate) {
                this.$Message.warning('请选择日期');
                return false;
            } else {
                this.loading = true;
                this.$ajax({
                    url: '/diaryQuery/getDiaryStatistics',
                    data: data,
                    success: (res) => {
                        this.updateList(res);
                        this.loading = false;
                    },
                    error: (res) => {
                        this.loading = false;
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                })
            }
        },
        initList() { // 初始化列表
            this.pageNo = 1;
            this.dataType = false;
            this.checkNum = 0;
            this.loadData();
        }
    },
}
</script>
<style  lang="less">
@import '../../assets/css/var.less';
.content-bar{
    .ivu-table{
        overflow: auto;
        .ivu-checkbox-wrapper {
            margin-right: 0;
        }
    }
    .ivu-table-cell{
        padding-top: 10px;
        padding-bottom: 10px;
        line-height: 1.3;
    }
    .ivu-table:before{
        height: 0px;
    }
    .ivu-table:after{
        width: 0px;
    }
    .ivu-table-row-hover td{
        background-color:@white-color-light;
    }
    .ivu-table-header .ivu-checkbox{
        display: none;
    }
    .id-column{
       visibility: hidden;
       width: 0;
       overflow: hidden;
       font-size: 0;
    }
}
</style>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-summary-content {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px 20px 150px 20px;
    .note {
        font-size: 12px;
        padding: 20px 0px;
        color: @orange-color;
        position: absolute;
        top: 0;
        left: 20px;
        right: 20px;
    }
    .content-bar {
        max-height: 100%;
        overflow: auto;
        padding: 1px;
    }
    .content-footer {
        position: absolute;
        left: 20px;
        right: 20px
    }
    .content-bottom {
        height: 50px;
        line-height: 50px;
        .bottom-left {
            display: inline-block;
            .checkout-note {
                font-size: 12px;
                .check-num {
                    color: @primary-color
                }
            }
        }
        .bottom-right {
            float: right;
        }
    }
    .nodata {
        display: block;
        color: #adadad;
        font-size: 14px;
        text-align: center;
        line-height: 1.6;
        margin-top: 5px;
    }
}
</style>
