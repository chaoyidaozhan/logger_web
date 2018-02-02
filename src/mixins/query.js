/**
 * 查询列表混合器
 * params对应各自查询列表具体数据
 * handleQuery查询
 * range区分哪种查询列表
 * **/
import FsFrame from 'app_src/view/frame/';
import FsQueryForm from 'app_component/common/query-form/'
import FsLoggerList from 'app_component/logger-list/';
export default {
    data() {
        return {
            params: {},
            range: '0'
        }
    },
    components: {
        FsFrame,
        FsLoggerList,
        FsQueryForm,
    },
    methods: {
        handleQuery(params) {
            this.params = params;
        }
    },
}
