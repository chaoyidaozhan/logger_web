/**
 * 查询列表混合器
 * params对应各自查询列表具体数据
 * handleQuery查询
 * range区分哪种查询列表
 * **/
import FsFrame from 'app_src/view/frame/'
import FsQueryList from 'app_component/business/query/'
import FsQueryForm from 'app_component/common/query-form/'
export default {
    data() {
        return {
            params: {},
            range: '0'
        }
    },
    components: {
        FsFrame,
        FsQueryList,
        FsQueryForm
    },
    methods: {
        handleQuery(params) {
            this.params = params
        }
    }
}
