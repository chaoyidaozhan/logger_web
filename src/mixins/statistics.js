/**
 * 统计列表混合器
 * params对应各自查询列表具体数据
 * handleQuery查询
 * validateString查询验证字段
 * orderType时间类型 0:按月,1:按季度,2:按日,3:自定义,
 * **/
import FsFrame from 'app_src/view/frame/';
import FsQueryForm from 'app_component/common/query-form/';
import FsLoggerStatistics from 'app_component/logger-statistics/common-statistics/';
import FsMemberStatistics from 'app_component/logger-statistics/member-statistics/';

const validateMsg = {
    deptId: '请先选择部门',
    groupId: '请先选择团队',
    memberId: '请先选择提交人',
}

export default {
    data() {
        return {
            params: {
                orderType: '0'
            },
            validateString: null
        }
    },
    components: {
        FsFrame,
        FsQueryForm,
        FsLoggerStatistics,
        FsMemberStatistics
    },
    methods: {
        handleQuery(params) {
            if (!!this.validateString && 
                !(!!params[this.validateString] || params[this.validateString] == 0)) {
                this.$Message.warning(validateMsg[this.validateString]);
            } 
            this.params = params;
        }
    }
}