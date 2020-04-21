<template>
    <div class="logger-summary-content">
        <div class="tableList" v-if="list.length" ref="loggerSummaryPageRef">
            <div class="tableItem" v-for="(itemA, indexA) in list">
                <div class="itemHeader mb-flex mb-flex-pack-justify mb-flex-align-center">
                    <div>
                        <YYCheckbox v-model="itemA.isWorkReportChecked" @on-change="someItemCheckChange(itemA)"></YYCheckbox>
                        <span>{{itemA.userName + $t('summary.submitted') + itemA.templateName}}</span>
                    </div>
                    <div>{{$t('noun.submitTime') + '：' + itemA.workReportCreateTime}}</div>
                </div>
                <div class="itemBody">
                    <div class="mb-flex mb-flex-align-center bodyContent" v-for="(itemB, indexB) in JSON.parse(itemA.content)">
                        <div class="mb-flex mb-flex-align-center">
                            <div class="mb-flex-1">{{itemB.title}}</div>
                        </div>
                        <div class="mb-flex-1 secondLevel" v-if="itemB.children">
                            <div class="mb-flex mb-flex-align-center bodyContent" v-for="(itemB, indexB) in itemB.children">
                                <div class="mb-flex mb-flex-align-center">
                                    <div class="mb-flex-1">{{itemB.title}}</div>
                                </div>
                                <div class="mb-flex-1">
                                    {{itemB.content}}
                                </div>
                            </div>
                        </div>
                        <div class="mb-flex-1" v-else>
                            {{itemB.content}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="content-bar" v-if="list.length">
            <Table :loading="loading" border ref="selection" :columns="columnsData" :data="listTemplate" @on-selection-change="handleSelectChange"></Table>
            <Table :columns="footerData" border :show-header="false" :data="countData" class="table-count"></Table>
        </div> -->
        <div class="content-footer" v-if="list.length">
            <div class="content-bottom mb-flex mb-flex-align-center" v-if="list.length">
                <div class="bottom-left">
                    <YYCheckbox v-model="isAllChecked" @on-change="allCheck(isAllChecked)">
                        {{$t('operate.checkAll')}}
                    </YYCheckbox>
                    <span class="checkout-note">
                        {{$t('operate.selected')}}
                        <span class="check-num">{{checkNum}}</span>
                        {{$t('noun.uLog')}}
                    </span>
                </div>
                <div class="bottom-right mb-flex mb-flex-pack-justify">
                    <YYButton type="primary" @click="loggerSummary">
                        {{$t('noun.summary')}}{{$t('noun.log')}}
                    </YYButton>
                    <YYButton type="ghost" @click="exportECL">{{$t('operate.export')}} EXCEL</YYButton>
                </div>
            </div>
            <!-- <pagination :totalCount="totalCount" @handleChangePage="handleChangePage" :pageSize="pageSize" :pageNo="pageNo" /> -->
        </div>
        <YYEmpty v-else vertical="top" :text="!list.length&&iconFlag ? $t('toast.selectTheDataThatExport') : emptyMsg" />
    </div>
</template>
<script>
import Pagination from 'app_component/common/pagination'
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
            allCheckedItems: [],
            isAllChecked: false,
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
            loading: false,
            loggerSummaryPageRef: null,
            isStopScrollPage: false
        }
    },
    components: {
        Pagination
    },
    watch: {
        params: 'initList',
    },
    methods: {
        allCheck(isAllChecked) {
            this.list.forEach((item, index) => {
                item.isWorkReportChecked = isAllChecked;
            });
            this.checkCountNum();
        },
        checkCountNum() {
            let num = 0;
            let allCheckedItems = [];
            let selectContent = [];
            this.list.forEach((item, index) => {
                if(item.isWorkReportChecked) {
                    ++num;
                    allCheckedItems.push(item);
                    selectContent.push(JSON.parse(item.content));
                }
            });
            this.checkNum = num;
            if(num == 0) {
                this.isAllChecked = false;
            }else if(num === this.list.length) {
                this.isAllChecked = true;
            }
            this.allCheckedItems = allCheckedItems;
            this.selectContent = selectContent;
        },
        someItemCheckChange(item) {
            this.checkCountNum();
        },
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
        workReportSummaryData() {
            let contentArr = []
            let maxContent = []
            this.allCheckedItems.forEach(l => {
                let curContent = (JSON.parse(l.content) || [])
                if(curContent.length > maxContent.length) {
                    curContent[0].version = l.version
                    curContent[0].dataType = l.isWorkReportChecked ? 1 : 0
                    maxContent = curContent
                }
            })
            this.templateItemData = maxContent[0]||{}
            this.selectContent.forEach(s => {
                let curContent = s || []
                if(curContent.length > contentArr.length) {
                    contentArr = curContent
                }
            });
            this.selectContent.forEach((v,k)=>{
                v.forEach((item, index)=>{
                    if(item.id == contentArr[index].id && k !== 0) {
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
            this.templateItemData.content = JSON.stringify(contentArr);
        },
        handleSummaryData(){ // 汇总数据
            let contentArr = []
            let maxContent = []
            this.selectList.forEach(l => {
                let curContent = (JSON.parse(l.content) || [])
                if(curContent.length > maxContent.length) {
                    curContent[0].version = l.version
                    curContent[0].dataType = l.dataType
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
            this.selectContent.forEach((v,k)=>{
                v.forEach((item, index)=>{
                    if(item.id == contentArr[index].id && k !== 0) {
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
            this.templateItemData.content = JSON.stringify(contentArr);
        },
        loggerSummary() { // 日志汇总
            if (this.checkNum <= 0) {
                this.$YYMessage.warning(this.$t('toast.pleaseSelectTheSummaryLog'));
            } else {
                // this.handleSummaryData();
                this.workReportSummaryData();
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
                let listLen = (res.data.list || []).length;
                if(listLen < this.pageSize) {
                    this.isStopScrollPage = true;
                }
                if(!listLen) {
                    return listLen;
                }
                let tempList = res.data.list;
                tempList.forEach((item, index) => {
                    item.workReportCreateTime = formatTime(new Date(item.createTime), 'YYYY-MM-DD HH:mm');
                });
                this.list = this.list.concat(tempList || []);
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
                            width: 1
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
                        width: 1
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
                this.$YYMessage.warning((res && res.msg) || this.$t('noun.networkError'));
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
            if(this.isStopScrollPage) {
                return;
            }
            let data = this.getParams();
            if (!data.templateId) {
                this.$YYMessage.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.template')}`);
                return false;
            } else if (!data.beginDate || !data.endDate) {
                this.$YYMessage.warning(`${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.date')}`);
                return false;
            } else {
                this.loading = true;
                this.$ajax({
                    url: '/diaryQuery/getDiaryStatistics',
                    data: data,
                    success: (res) => {
                        let listLen = this.updateList(res);
                        this.loading = false;
                        this.$nextTick(() => {
                            if(listLen === 0) {
                                return;
                            }
                            this.loggerSummaryPage(res);
                        }, 1000);
                    },
                    error: (res) => {
                        this.loading = false;
                        this.$YYMessage.warning((res && res.msg) || this.$t('status.networkError'));
                    }
                })
            }
        },
        loggerSummaryPage() {
            if(this.loggerSummaryPageRef) {
                return;
            }
            let throttle = function(method, delay, duration) {
                let timer = null;
                let begin = new Date();    
                return function(){                
                    let context = this, args=arguments;
                    let current = new Date();        
                    clearTimeout(timer);
                    if(current-begin >= duration){
                        method.apply(context,args);
                        begin = current;
                    }else{
                        timer = setTimeout(() => {
                            method.apply(context,args);
                        },delay);
                    }
                }
            };
            this.loggerSummaryPageRef = this.$refs.loggerSummaryPageRef;
            let loggerSummaryPageRef = this.loggerSummaryPageRef;
            if(!loggerSummaryPageRef) {
                return;
            }
            loggerSummaryPageRef.onscroll = throttle(() => {
                //变量scrollTop是滚动条滚动时，距离顶部的距离
                let scrollTop = loggerSummaryPageRef.scrollTop;
                //变量windowHeight是可视区的高度
                let windowHeight = loggerSummaryPageRef.clientHeight;
                //变量scrollHeight是滚动条的总高度
                let scrollHeight = loggerSummaryPageRef.scrollHeight;
                //滚动条到底部的条件
                if(scrollTop + windowHeight == scrollHeight) {
                    ++this.pageNo;
                    this.loadData();
                }   
            } , 100, 500);
        },
        initList() { // 初始化列表
            this.pageNo = 1;
            this.dataType = false;
            this.checkNum = 0;
            this.isStopScrollPage = false;
            this.list = [];
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
    // position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 12px 0 64px 0px;
    overflow-y: auto;
    padding-bottom: 64px;
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
        // position: absolute;
        // left: 20px;
        // right: 20px;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 64px;
        box-sizing: border-box;
        padding: 16px;
        background: rgba(255,255,255,0.9);
    }
    .content-bottom {
        height: 32px;
        line-height: 32px;
        .bottom-left {
            margin-right: 24px;
            font-size: 12px;
            color: #333;
            // display: inline-block;
            .checkout-note {
                font-size: 12px;
                .check-num {
                    color: @primary-color
                }
            }
            /deep/ .yy-checkbox-wrapper {
                margin-right: 12px;
            }
        }
        .bottom-right {
            // float: right;
            :first-child {
                margin-right: 12px;
            }
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
.tableList {
    border-top: 1px solid #aaa;
}
.tableItem {
    .itemHeader {
        height: 34px;
        padding: 0 16px;
        font-size: 12px;
        border-bottom: 1px solid #F0F0F0;
        background: rgba(247, 249, 253, 1);
        & > div:first-of-type {
            span {
                color: #333;
                font-weight:500;
            }
        }
        & > div:last-of-type {
            color: #666;
        }
        /deep/ .yy-checkbox-wrapper {
            margin-right: 4px;
        }
    }
    .itemBody {
        color: #333;
        font-weight: 400;
    }
    .bodyContent {
        line-height: 22px;
        border-bottom: 1px solid #F0F0F0;
        font-size: 12px;
        color: #333;
        & > div {
            padding: 8px 16px;
        }
        & > div.secondLevel {
            padding: 0;
            & > div:last-of-type {
                border-bottom: 0;
            }
        }
        & > div:first-of-type {
            width: 140px;
            border-right: 1px solid #F0F0F0;
            align-self: stretch;
        }
        & > div:first-of-type div {
            text-align: right;
            line-height: 22px;
        }
    }
}
</style>
