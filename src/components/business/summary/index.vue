<template>
    <div class="logger-summary-content">
        <div class="content-bar" v-if="list.length">
            <Table :loading="loading" border ref="selection" :columns="columnsData" :data="listTemplate" @on-selection-change="handleSelectChange"></Table>
            <Table :columns="footerData" border :show-header="false" :data="countData" class="table-count"></Table>
        </div>
        <div class="content-footer" v-if="list.length">
            <div class="content-bottom" v-if="list.length">
                <span class="bottom-left">
                    <Checkbox v-model="dataType" @on-change="handleSelectAll(dataType)">
                        {{$t('operate.checkAll')}}
                    </Checkbox>
                    <span class="checkout-note">
                        {{$t('operate.selected')}}
                        <span class="check-num">{{checkNum}}</span>
                        {{$t('noun.uLog')}}
                    </span>
                </span>
                <span class="bottom-right">
                    <Button type="success" @click="loggerSummary">
                        {{$t('noun.summary')}}{{$t('noun.log')}}
                    </Button>
                    <Button type="ghost" @click="exportECL">{{$t('operate.export')}} EXCEL</Button>
                </span>
            </div>
            <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" />
        </div>
        <fs-empty-tips v-else :iconType="iconType" :emptyMsg="emptyMsg" />
        <span class="nodata" v-if="!list.length&&iconFlag">{{$t('toast.selectTheDataThatExport')}}</span>
    </div>
</template>
<script>
import Pagination from 'app_component/common/pagination'
import FsEmptyTips from 'app_component/common/empty-tips'
import config from 'app_src/config/config'
import formatTime from'app_src/filters/format-time'
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
            pageSize: 9999,
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
            let contentArr = []
            let maxContent = []
            this.selectList.forEach(l => {
                let curContent = (JSON.parse(l.content) || [])
                if(curContent.length > maxContent.length) {
                    maxContent = curContent
                }
            })

            this.templateItemData = maxContent[0]||{}
            this.selectContent.forEach(s => {
                let curContent = s || []
                if(curContent.length > contentArr.length) {
                    contentArr = curContent
                }
            })
            console.log(contentArr)
            this.selectContent.forEach((v,k)=>{
                v.forEach((item, index)=>{
                    if(item.id != contentArr[index].id) {
                        if(item.type == 'InputText') {
                            if(!!item.content.trim()) {
                                contentArr[index].content += `\n${item.content}`
                                contentArr[index].value += `\n${item.value}`
                            }
                        }
                        if(item.type == 'InputTextNum') {
                            if(!!item.content && typeof +item.content == 'number') {
                                contentArr[index].content = (+contentArr[index].content) + (+item.content)
                                contentArr[index].value = (+contentArr[index].value) + (+item.value)
                            }
                        }
                    }
                })
            })
            console.log(contentArr);
            
            this.templateItemData.content = JSON.stringify(contentArr);
        },
        loggerSummary() { // 日志汇总
            console.log(this.selectContent)
            if (this.checkNum <= 0) {
                this.$Message.warning(this.$t('toast.pleaseSelectTheSummaryLog'));
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
            let host = `${window.location.protocol}//${window.location.host}/logger`
            let url = `${host}/diaryQuery/exportDiaryStatistics?timestamp=${(new Date()).valueOf()}&beginDate=${this.params.beginDate}&language=${window.lang}
            &endDate=${this.params.endDate}&token=${this.$store.state.userInfo.token}&templateId=${templateId}&memberIds=${this.params.memberIds || ""}&groupIds=${this.params.groupId || ""}&deptIds=${this.params.deptId || ""}`;
            window.open(url, '_blank');
        },
        updateList(res) { // 更新列表
            if (res && res.code === 0) {
                this.list = res.data.list || [];
                this.totalCount = this.list.length;
                if (this.list.length <= 0) {
                    this.iconFlag = 0;
                    this.iconType = '';
                    this.emptyMsg = this.$t('status.noRelevantData');
                } else {
                    this.listTemplate = [];
                    this.countData = [];
                    this.columnsData = [{ //固定的前三列
                            type: 'selection',
                            width: this.lang == 'en' ? 100 : 60,
                            align: 'center'
                        },
                        {
                            title: 'id',
                            key: 'id',
                            className:'id-column',
                        },
                        {
                            title: this.$t('noun.submitTime'),
                            key: 'column1',
                            width: 150
                        },
                        {
                            title: this.$t('noun.logDate'),
                            key: 'column2',
                            width: 150
                        },
                        {
                            title: this.$t('noun.author'),
                            key: 'column3',
                            width: 80
                        }
                    ];
                    this.footerData = [{
                        title: '',
                        key: 'column1',
                        width: this.lang == 'en' ? 100 : 60
                    }, 
                    {
                        title: 'id',
                        key: 'id',
                        className:'id-column',
                    },
                    {
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
                    }]

                    // 获取当前表格最长的内容
                    let columnArr = []
                    this.list.forEach(l => {
                        let curArr = (JSON.parse(l.content) || [])
                        if(curArr.length > columnArr.length) {
                            columnArr = curArr
                        }
                    })
                    columnArr && columnArr.forEach((item, key) => { //循环构建表头
                        this.columnsData.push({
                            title: columnArr[key].title || '',
                            key: 'column' + (this.columnsData.length - 1),
                            type: 'html'
                        });
                        this.footerData.push({ //循环构建表foot
                            title: '',
                            key: 'column' + (this.footerData.length + 1)
                        })
                    });

                    let countNumArr = [];
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
                            if (v.type === 'InputRadio' || v.type === 'InputCheckbox') {
                                data['column' + i] = ['number', 'string'].indexOf(typeof v.content) !== -1 ? v.content: "";
                            } else {
                                data['column' + i] = ['number', 'string'].indexOf(typeof v.value) !== -1 ? v.value: "";
                            }
                            if(v.type === 'InputContainer') {
                                v.children.forEach(c=>{
                                    data['column' + i] += `${c.title}:${c.content}<br>`
                                })
                            }
                            if(v.type === 'InputTextNum') {
                                if(!isNaN(+v.value)) {
                                    if(countNumArr[k] === undefined) {
                                        countNumArr[k] = [];
                                    }
                                    countNumArr[k].push(+v.value);
                                }
                            }
                        });
                        data.id = item.id;
                        this.listTemplate.push(data);
                    });
                    let tmp = {
                        column1: this.$t('noun.summary')
                    };
                    countNumArr.forEach((item, index) => {
                        tmp['column' + (5 + index)] = item.reduce((prev, curr) => {
                            return prev + curr;
                        });
                    });
                    this.countData.push(tmp);
                }

            } else {
                this.$Message.warning((res && res.msg) || this.$t('noun.networkError'));
            }
        },
        getParams() { // 合并参数
            let data = Object.assign({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                range: this.range,
                memberIds: this.params.memberIds || '',
                deptIds: this.params.deptId || '',
                groupIds: this.params.groupId || '',
            }, this.params);
            delete data.deptId;
            delete data.groupId;
            return data;
        },
        loadData() { // 加载数据
            let data = this.getParams();
            if (!data.templateId) {
                this.$Message.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.template')}`);
                return false;
            } else if (!data.beginDate || !data.endDate) {
                this.$Message.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.date')}`);
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
                        this.$Message.warning((res && res.msg) || this.$t('status.networkError'));
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
@import '../../../assets/css/var.less';
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
@import '../../../assets/css/var.less';
.logger-summary-content {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px 20px 150px 20px;
    .table-count {
        border-top: none;
    }
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
            .ivu-btn-success {
                border-color: @primary-color;
                background-color: @primary-color;
            }
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
