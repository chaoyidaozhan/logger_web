<template>
    <div class="logger-creat">
        <!-- <div class="select-date-bar">
            <div class="creat-left">日志日期</div>
            <div class="creat-right"> 
                <DatePicker type="date"
                    placement="bottom-start"
                    placeholder="日期" 
                    class="date-wrap"
                    >
                </DatePicker>
            </div>
        </div>
        <div class="select-range-bar">
            <div class="creat-left">可见范围</div>
            <div class="creat-right">
                <div class="select-range">
                    <select-member-body :info="info"/>
                    <i class="select-range-icon" @click="selectRange">fff</i>
                </div>
            </div>
        </div> -->
        <Form :label-width="138">
            <FormItem label="日志日期">
                <Input/>
            </FormItem>
            <FormItem v-for="(item, index) in templateContent" :key="index" 
                :label="item.title">
                <template v-if="item.type == 'InputText'">
                    <Input type="textarea" :autosize="{ minRows: 5}"/>
                </template>
                <template v-if="item.type == 'InputTextNum'">
                    <Input/>
                </template>
                <template v-if="item.type == 'InputRadio'">
                    <CheckboxGroup>
                        <Checkbox v-for="(val, key) in item.options" :key="key" :label="val.string"></Checkbox>
                    </CheckboxGroup>
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
                    <Input/>
                </template>
            </FormItem>

            <FormItem label="可见范围">
                <Input/>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit">
                    提交
                </Button>
            </FormItem>
        </Form>
        <!-- <div class="week-summary">
            <div class="creat-left">本周工作总结</div>
            <div class="creat-right">
                <textarea placeholder="汇报本周主要工作内容" rows="5" maxlength="200" class="week-content"></textarea>
            </div>
        </div> -->


    </div>
</template>
<script>
import SelectMemberBody from '../common/select-member/select-member-body';
export default {
    data(){
        return{
            templateContent: [],
            formInfo: {

            }
        }
    },
    components: {
        SelectMemberBody
    },
    methods: {
        selectRange(){
            var info={
                title:'选择可见范围',  
                dep:true,
                team:true,
                man:true,    
                selected : selected
            };
            this.$selectMember.show( info ,(res)=>{
    			console.log(res)
 		    })
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
            // for(var i in template){
            //     // templateList[i] = i.id;
            //     console.log(i)
               
            // }
            //  console.log(templateList)
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
        }
    },
    created(){
        this.loadData();
        console.log(this.$store.state,4444444,this.$route.path)
    },
}
</script>
<style lang="less" scoped>
@import '../../assets/css/var.less';
.logger-creat{
    .creat-left{
        width: 22%;
        height:48px;
        line-height: 48px;
        float: left;
        font-size: 14px;
        color: @gray-color-dark;
        text-align: right;
    }
    .creat-right{
        width: 100%;
        height:48px;
        line-height: 48px;
        padding-left: 24%;
        padding-right: 17%;
        box-sizing: border-box;
        color:@gray-color-dark;
    }
    .select-date-bar{
        .date-wrap{
            width: 100%;
            .ivu-input{
                height: 37px;
            }
        }
    }
    .select-range-bar{
        .select-range{
            height:37px;
            line-height: 37px; 
            border:1px solid  @border-color-base;
            border-radius: 4px;
        }
    }
    .week-summary{
        .week-content{
            display: block;
            width: 100%;
            font-size: 14px;
            border:1px solid  @border-color-base;
            border-radius: 4px;
            line-height: 1.5;
            outline: none;
            padding: 7px 8px;
            box-sizing: border-box;
        }
    }

    

}
</style>


