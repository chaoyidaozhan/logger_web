<template>
    <div class="logger-creat">
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
                    :dep="dep"
                    title="选择可见范围"
                    placeholder="本部门可见"
                    @handleSelectMember="handleSelectRange"
                    :ellipsis="false" 
                    :showDept="true" 
                    :showMember="false"
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
                    <RadioGroup v-model="item.options[0].string">
                        <Radio v-for="(val, key) in item.options" :key="key" :label="val.string"></Radio>
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
                    :man="man"
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
            dep: [],
            man: [],
            value1:[],
            // radioCheck:
            dateValue:new Date(),
            dateValueSec:new Date(),
            numberValue:1,
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
        handleSelectMember(member) {
            let keys = Object.keys(member);
            keys.forEach(key=>{
                this[key] = res[key]
            })
            
        },
        handleSelectRange(range){
            // console.log(res,777)
            let keys = Object.keys(range);
             console.log(keys,122223)
            keys.forEach(key=>{
                this[key] = res[key]
            })
            console.log(this.dep)
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
            console.log(this.templateContent,888)
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
        handleChecked(value) {
            console.log(value)
        },
        handleSubmit() {
            console.log(this.formInfo);
            console.log(this.$refs.selectDept.dep,8888)

        }
    },
    created(){
        this.loadData();
       
    },
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';

</style>


