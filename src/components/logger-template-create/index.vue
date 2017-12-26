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
                    <Input type="textarea" :autosize="{ minRows: 5}"/>
                </template>
                <template v-if="item.type == 'InputTextNum'">
                    <InputNumber  v-model="numberValue" size="large"></InputNumber>
                </template>
                <template v-if="item.type == 'InputRadio'">
                    <RadioGroup v-model="item.options.string">
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
                    <Upload :action="uploadFile">
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
export default {
    data(){
        return{
            templateContent: [],
            formInfo: {

            },
            hasLoaded: false,
            deptRange: [],
            groupRange: [],
            memberRange: [],
            member: [],
            dateValue:new Date(),
            dateValueSec:new Date(),
            numberValue: 0,
            dateOption: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            uploadFile:`${config[__ENV__].apiHost}/logger/diaryFile/?token=`+this.$store.state.userInfo.token,
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
                    this.templateContent = JSON.parse(v.content) || []
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
                    templateId:this.$route.params.id
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
                            }
                            else if(v.dataType==3){//团队
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
        handleSubmit() {
            console.log(this.formInfo);
            console.log(this.$refs.selectDept.dep,8888)

            this.deptRange.push({
                deptName: 1231,
                deptId: 1231
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


