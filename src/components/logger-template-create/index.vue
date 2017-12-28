<template>
    <div class="logger-create">
        <Form :label-width="138" >
            <FormItem label="日志日期">
                 <DatePicker type="date"
                    placement="bottom-start"
                    placeholder="日期" 
                    class="date-wrap"
                    :options="dateOption"
                    :value="dateValue"
                    :clearable="false"
                    >
                </DatePicker>
            </FormItem>
            <FormItem label="可见范围" class="required-icon">
                <select-member-input 
                    :dept="deptRange"
                    :group="groupRange"
                    :member="memberRange"
                    title="选择可见范围"
                    placeholder="本部门可见"
                    @handleSelectMember="handleSelectRange"
                    :ellipsis="false" 
                    :showDept="true" 
                    :showGroup="true" 
                    ref="selectDept"
                    />
            </FormItem>
            <FormItem v-for="(item, index) in templateContent" :key="index" 
                :label="item.title" :class="item.isRequired==1?'required-icon':''">
                <template v-if="item.type == 'InputText'">
                    <Input v-model="inputTextValue[index]" type="textarea" :autosize="{ minRows: 5}"/>
                </template>
                <template v-if="item.type == 'InputTextNum'">
                    <InputNumber  v-model="item.value" size="large"></InputNumber>
                </template>
                <template v-if="item.type == 'InputRadio'">
                    <RadioGroup v-model="item.checked">
                        <Radio v-for="(val, key) in item.options" :key="key" :label="val.string" ></Radio>
                    </RadioGroup>
                </template>
                <template v-if="item.type == 'InputCheckbox'">
                    <CheckboxGroup v-model="item.checkedArr">
                        <Checkbox v-for="(val, key) in item.options" 
                            :key="key"
                            :label="`${key + 1}`">
                                {{val.string}}
                            </Checkbox>
                    </CheckboxGroup>
                </template>
                <template v-if="item.type == 'InputDate'">
                    <DatePicker type="date"
                        placement="bottom-start"
                        placeholder="日期" 
                        class="date-wrap"
                        v-model="item.dateValueSec"
                        :clearable="false"
                    >
                    </DatePicker>
                </template>
            </FormItem>

           
            <FormItem label="@TA查看">
                <select-member-input 
                    :member="member"
                    title="@TA查看"
                    placeholder="提醒关键人员查看您的日志"
                    @handleSelectMember="handleSelectMember"
                    :ellipsis="false" 
                    ref="selectMember"
                    />
            </FormItem>
            <FormItem label="附件">
                <template>
                    <Upload :action="uploadFile" :on-success="handleFileSuccess">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </template>
            </FormItem>
           
            <FormItem>
                <Button type="primary" class="submit-btn" @click="handleSubmit">
                    提交
                </Button>
                <Button type="ghost"  class="cancel-btn" @click="cancleSubmit">
                    取消
                </Button>
                <Button type="ghost"  class="draft-btn" @click="saveDraftFun">
                    保存为草稿
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import SelectMemberInput from '../common/select-member-input/';
import config from 'app_src/config/config';
import FormatTime  from 'app_src/filters/format-time';
export default {
    data(){
        return{
            templateContent: [],
            templateItemData:[],
            // formInfo: {

            // },
            deptRange: [],
            groupRange: [],
            memberRange: [],
            rangeArr:[],
            member: [],
            dateValue:new Date(),
            dateValueSec:new Date(),
            inputTextValue:[],
            dateOption: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            uploadFile:`${config[__ENV__].apiHost}/logger/diaryFile/?token=`+this.$store.state.userInfo.token,
            fileStr :[],  
            submitData:{}, 
            saveDraft:false,         
        }
    },
    components: {
        SelectMemberInput
    },
    methods: {
        handleSelectMember(res) { //选人
            let keys = Object.keys(res);
            keys.forEach(key=>{
                this[key] && (this[key] = res[key])
            })
            console.log(this.man,22)
        },
        handleSelectRange(res){ //选范围
            let keys = Object.keys(res);
            keys.forEach(key=>{
                this[`${key}Range`] && (this[`${key}Range`] = res[key])
            })
            console.log(this.deptRange,555)
        },
        getTemplateApp() {
            this.$store.dispatch('update_returndata', {
                returndata: {
                        starttime: decidetime.starttime,
                        endtime: decidetime.endtime
                }
            });
            this.$store.dispatch('update_template_app').then(()=>{
                this.setTempListData();
            })
        },
        setTempListData() {
            let templateId = this.$route.params.id;
            let template = this.$store.state.template.app || [];
            template.forEach((v,k) => {
                if(v.id == templateId){
                    this.templateContent = JSON.parse(v.content) || [];
                    this.templateItemData = v;
                }
            });
            // this.formInfo = {
            //     ...this.defautlFormInfo,
            //     content: this.templateContent
            // }
            this.templateContent.forEach((v,k)=>{
                console.log(v,k)
                if(v.type=='InputRadio'){
                    v.checked = v.value || v.options[0].string;
                }else if(v.type=='InputCheckbox'){
                    if(v.value){
                        v.checkedArr.push(v.value);
                    }
                }else if(v.type=='InputTextNum'){
                    v.value = parseInt(v.value)||0;
                }else if(v.type=='InputDate'){
                    v.dateValueSec = v.value?new Date(v.value):new Date();
                }
            })
            
        },
        loadData(){
            if(!this.$store.state.template.app.length) { 
                this.getTemplateApp();
            } else {
                this.setTempListData();
            }
        },
        getVisibleRange(){//可见范围
            this.$ajax({
                url: '/logger/diary/lastVisibleRange',
                data: {
                    templateId:this.$route.params.id||0
                },
                success: (res)=>{
                    if(res && res.code === 0) {
                        let datalist = res.data.ranges||[];
                        let teamArray = [], depArrar = [], manArray = [];
                        datalist.forEach((v,k)=>{
                            if(v.dataType==1){//部门
                                depArrar.push({
                                    'deptId': v.teamId,
                                    'deptName': v.teamName
                                });
                            }else if(v.dataType==3){//团队
                                teamArray.push({
                                    'groupId': v.teamId,
                                    'groupName': v.teamName
                                });
                            }else if(v.dataType==4){//个人
                                manArray.push({
                                    'memberId': v.memberId,
                                    'userName': v.userName
                                });
                            }
                        });
                        this.deptRange = depArrar;
                        this.groupRange = teamArray;
                        this.memberRange = manArray;
                    }else{
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                },
                error: (res)=>{
                    this.$Message.warning((res && res.msg) || '网络错误');
                }
            })
        },
        handleFileSuccess(res, file){//处理上传的文件数据
            let fileData = res.data[0]||[];
            this.fileStr.push({
                fileName:file.name,
                fileSize:fileData.fileSize,
                fileExtension:fileData.fileExtension,
                fileKey:fileData.fileKey
            });
        },    
        handleSubmitData(){//处理提交数据
            let visibleRangeStr = [],submitContent = [];
            this.deptRange.forEach((v,k)=>{
                visibleRangeStr.push({
                    'teamId': v.deptId,
                    'teamName': v.deptName,
                    'dataType':1
                })
            });
            this.groupRange.forEach((v,k)=>{
                visibleRangeStr.push({
                    'teamId': v.groupId||v.gid,
                    'teamName': v.groupName,
                    'dataType':3
                })
            });
            this.memberRange.forEach((v,k)=>{
                visibleRangeStr.push({
                    'memberId': v.memberId,
                    'userName': v.userName,
                    'dataType':4
                })
            });
            this.rangeArr = visibleRangeStr;

            this.templateContent.forEach((v,k)=>{
                if(v.type=='InputText'){
                    v.value = this.inputTextValue[k];
                    v.content = this.inputTextValue[k];
                }else if(v.type=='InputTextNum'){
                    v.content = v.value;
                }else if(v.type=='InputRadio'){
                    v.content = v.checked;
                    v.options&&v.options.forEach((value,key)=>{
                        if(value.string==v.checked){
                            v.value = key; 
                        }
                    })
                }else if(v.type=='InputCheckbox'){
                    let valueArr = [],contentArr = [];
                    v.checkedArr&&v.checkedArr.forEach((value,key)=>{
                        valueArr.push(value-1);
                        contentArr.push(v.options[value-1].string);
                    })
                    v.value = valueArr.toString();
                    v.content = contentArr.toString();
                }else if(v.type=='InputDate'){
                    v.value = FormatTime(v.dateValueSec, "YYYY-MM-DD");
                    v.content = FormatTime(v.dateValueSec, "YYYY-MM-DD");
                }
            })
        },  
        handleValidate(submitData,templateContent){//校验数据
            console.log(submitData,4,templateContent)
            if(!submitData.diaryTime){
                this.$Message.warning('日志日期不能为空');
                return false;
            }
            else if(submitData.visibleRangeStr=='[]'){
                this.$Message.warning('可见范围不能为空');
                return false;
            }
            else{
                for (let i = 0,l =templateContent.length ; i < l; i++) {
                    if(templateContent[i].isRequired==1){
                        if((templateContent[i].type!='InputRadio'&&templateContent[i].type!='InputTextNum'&&!templateContent[i].value)||
                        ((templateContent[i].type=='InputRadio'&&templateContent[i].type=='InputTextNum'&&templateContent[i].value==''))){
                            this.$Message.warning(templateContent[i].title+'不能为空');
                            return false;
                        }  
                    } 
                }
                
            }
            return true;
        },
        handleSubmit() {//提交
            this.handleSubmitData();
            this.submitData = {
                gather:0,
                diaryTime:FormatTime(new Date(this.dateValue), "YYYY-MM-DD"),
                templateName:this.templateItemData.title,
                version:'1514202355530',
                source:3,//1 安卓   2 ios    3web    4微信
                templateId:this.$route.params.id||0,
                visibleRange:this.saveDraft?3:1,
                visibleRangeStr:JSON.stringify(this.rangeArr),
                dataType:this.templateItemData.dataType,// ["其他", "日报", "周报", "月报"]
                fileStr:JSON.stringify(this.fileStr),
                content:JSON.stringify(this.templateContent),  
            };
            
            console.log(this.submitData,'submitData')
            if(!this.handleValidate(this.submitData,this.templateContent)){
                return 
            }else{
                this.templateContent.forEach((v,k)=>{
                    switch(v.type){
                        case 'InputRadio':
                            if(v.checked) {
                                delete v.checked;
                            }
                            break;
                        case 'InputCheckbox':
                            if(v.checkedArr) {
                                delete v.checkedArr;
                            }
                            break;
                        case 'InputDate':
                            if(v.dateValueSec){
                                delete v.dateValueSec
                            }
                        default:
                            break;
                    }
                   
                })  
            }
            this.$ajax({
                url: this.saveDraft?'/logger/diary/diaryCommitDraft':'/logger/diary/diaryCommit',
                data: this.submitData,
                type:'post',
                success: (res)=>{
                    if(res && res.code === 0) {
                        this.saveDraft?this.$Message.warning('日志草稿保存成功'):this.$Message.warning('日志创建成功');
                        this.$router.push({
                            path: '/LoggerQueryAll',
                            query:{
                                token:this.$store.state.userInfo.token
                            }
                        });
                    }else{
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                },
                error: (res)=>{
                    this.$Message.warning((res && res.msg) || '网络错误');
                }

            })
        },
        cancleSubmit(){//取消编辑
            this.$Modal.confirm({
                title: '取消编辑',
                content: '您的日志还没提交，确定要放弃编辑吗？',
                onOk: ()=>{
                    this.$router.push({
                        path: '/LoggerQueryAll',
                        query:{
                            token:this.$store.state.userInfo.token
                        }
                    });
                    
                }
            });
        },
        saveDraftFun(){// 保存草稿
            this.saveDraft = true;
            this.handleSubmit();
        }
    },
    created(){
        this.loadData();
        this.getVisibleRange();
       
    },
}
</script>
<style>
.required-icon .ivu-form-item-label::before{
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #fd838a;
}
</style>

<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-create{
    max-width: 900px;
    .ivu-btn {
        min-width: 65px;
        height: 31px;
    }
    .submit-btn{
        margin:0 5px 0 0;
    }
    .cancel-btn{
        margin:0 10px;
    }
    .draft-btn{
        margin:0 5px;
    }
}
</style>


