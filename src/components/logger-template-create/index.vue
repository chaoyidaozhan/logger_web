<template>
    <div class="logger-create">
        <Form :label-width="138" ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <FormItem label="日志日期">
                 <DatePicker type="date"
                    placement="bottom-start"
                    placeholder="日期" 
                    class="date-wrap"
                    :options="dateOption"
                    :value="dateValue"
                    >
                </DatePicker>
            </FormItem>
            <FormItem label="可见范围" prop="range" >
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
                :label="item.title" :prop="item.isRequired==1?'requiredFlag':''">
                <template v-if="item.type == 'InputText'">
                    <Input v-model="inputTextValue" type="textarea" :autosize="{ minRows: 5}"/>
                </template>
                <template v-if="item.type == 'InputTextNum'">
                    <InputNumber  v-model="numberValue" size="large"></InputNumber>
                </template>
                <template v-if="item.type == 'InputRadio'">
                    <RadioGroup v-model="inputRadioValue" :key="index"  @on-change="handleChangeRadio(inputRadioValue,index)">
                        <Radio v-for="(val, key) in item.options" :key="key" :label="val.string" @on-change="handleRadio(inputRadioValue,index)"></Radio>
                    </RadioGroup>
                </template>
                <template v-if="item.type == 'InputCheckbox'">
                    <CheckboxGroup v-model="inputCheckboxValue" @on-change="handleChangeCheckbox(inputCheckboxValue)">
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
                        :value="dateValueSec"
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
                <Button @click="handleSubmit">
                    提交
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
            formInfo: {

            },
            deptRange: [],
            groupRange: [],
            memberRange: [],
            member: [],
            dateValue:new Date(),
            dateValueSec:new Date(),
            numberValue: 0,
            inputTextValue:'',
            inputRadioValue:'',
            inputCheckboxValue:[],
            dateOption: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            uploadFile:`${config[__ENV__].apiHost}/logger/diaryFile/?token=`+this.$store.state.userInfo.token,
            fileStr :[],            
            formValidate: {
                range:'',
                requiredFlag:''
            },
            ruleValidate:{
                range:[
                        { required: true, message: '范围不能为空', trigger: 'blur' }
                    ],
                requiredFlag:[{
                     required: true, message: '不能为空', trigger: 'blur' 
                }]
            }
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
            this.formInfo = {
                ...this.defautlFormInfo,
                content: this.templateContent
            }
            console.log(this.formInfo);

        },
        loadData(){
            if(!this.$store.state.template.app.length) { 
                this.getTemplateApp();
            } else {
                this.setTempListData();
            }
        },
        getVisibleRange(){
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
                    console.log(res)
                },
                error: (res)=>{
                    this.$Message.warning((res && res.msg) || '网络错误');
                }
            })
        },
        handleChecked(value) {
            console.log(value)
        },
        handleRadio(inputRadioValue,index){
            console.log(1,inputRadioValue,index)
        },
        handleChangeRadio(inputRadioValue,index){
            console.log(inputRadioValue,54,index)
        },
        handleChangeCheckbox(inputCheckboxValue){
            console.log(inputCheckboxValue,34)
        },
        handleFileSuccess(res, file){//处理上传的文件数据
            let fileData = res.data||[];
            fileData.forEach((v,k)=>{
                this.fileStr.push({
                    fileName:v.fileName,
                    fileSize:v.fileSize,
                    fileExtension:v.fileExtension,
                    fileKey:v.fileKey
                });
            })
        },      
        handleSubmit() {
            console.log(this.formInfo,99999);

          
            let deptRangeStr = [];
            this.deptRange.forEach((v,k)=>{
                deptRangeStr.push({
                    'teamId': v.deptId,
                    'teamName': v.deptName,
                    'dataType':1
                })
            });
            this.groupRange.forEach((v,k)=>{
                deptRangeStr.push({
                    'teamId': v.groupId||v.gid,
                    'teamName': v.groupName,
                    'dataType':3
                })
            });
            this.memberRange.forEach((v,k)=>{
                deptRangeStr.push({
                    'memberId': v.memberId,
                    'userName': v.userName,
                    'dataType':4
                })
            });
            console.log(this.templateContent,9)
            console.log(this.inputCheckboxValue,555)
            let submitContent = [];
            let templateContentClone = this.templateContent.slice(0);
            templateContentClone.forEach((v,k)=>{
                if(v.type=='InputText'){
                    v.value = this.inputTextValue;
                    v.content = this.inputTextValue;
                }else if(v.type=='InputTextNum'){
                    v.value = this.numberValue;
                    v.content = this.numberValue;
                }else if(v.type=='InputRadio'){
                    

                }else if(v.type=='InputCheckbox'){

                }else if(v.type=='InputDate'){
                    v.value = FormatTime(new Date(this.dateValueSec), "YYYY-MM-DD");
                    v.content = FormatTime(new Date(this.dateValueSec), "YYYY-MM-DD");
                }
            })
           
            let submitData = {
                gather:0,
                diaryTime:FormatTime(new Date(this.dateValue), "YYYY-MM-DD"),
                templateName:this.templateItemData.title,
                version:'1514202355530',
                source:3,//1 安卓   2 ios    3web    4微信
                templateId:this.$route.params.id||0,
                visibleRange:1,
                visibleRangeStr:deptRangeStr,
                dataType:this.templateItemData.dataType,// ["其他", "日报", "周报", "月报"]
                fileStr:this.fileStr,
                content:[],
                
            };
            console.log(submitData,'submitData')
            this.$ajax({
                url: '/logger/diary/lastVisibleRange',
                data: submitData,
                success: (res)=>{
                    if(res && res.code === 0) {

                    }else{
                        this.$Message.warning((res && res.msg) || '网络错误');
                    }
                },
                error: (res)=>{
                    this.$Message.warning((res && res.msg) || '网络错误');
                }

            })
        }
    },
    created(){
        this.loadData();
        this.getVisibleRange();
       
    },
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';

</style>


