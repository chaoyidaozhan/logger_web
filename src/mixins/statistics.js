/**
 * 统计列表混合器
 * params对应各自查询列表具体数据
 * handleQuery查询
 * validateString查询验证字段
 * orderType时间类型 0:按月,1:按季度,2:按日,3:自定义,
 * **/
import FsFrame from 'app_src/view/frame/'
import FsQueryForm from 'app_component/common/query-form/'
import FsCommonStatistics from 'app_component/business/statistics/common/'
import FsMemberStatistics from 'app_component/business/statistics/member/'

export default {
    data() {
        return {
            params: {
                orderType: '0'
            },
            minDate: '',
            maxDate: '',
            validateString: null,
            validateMsg: {
                deptId: `${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.department')}`,
                groupId: `${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.internalGroup')}`,
                memberIds: `${this.$t('operate.please')}${this.$t('operate.select')}${this.$t('noun.author')}`,
            }
        }
    },
    components: {
        FsFrame,
        FsQueryForm,
        FsCommonStatistics,
        FsMemberStatistics
    },
    methods: {
        handleQuery(params) {
            if (!!this.validateString && 
                !(!!params[this.validateString] || params[this.validateString] == 0)) {
                return this.$Message.warning(this.validateMsg[this.validateString])
            } 
            this.minDate = params.minDate || ''
            this.maxDate = params.maxDate || ''
            delete params.minDate
            delete params.maxDate
            this.params = params
        }
    }
}
