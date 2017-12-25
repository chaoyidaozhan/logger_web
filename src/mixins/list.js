module.exports = {
    data() {
        return {
            list: [],
            pageNum: 1, 
            pageSize: 20, 
            params: {
                range: 0,
                dataStatus: 1 // 日志查询标记
            },
            loading: false,
            hasMore: true,
        }
    },
    created() {
        this.initList()
    },
    watch: {
        pageNum: 'loadData'
    },
    methods: {
        /**
         * 获取请求参数 默认只传递pageNo(页码) pageSize(每页条数) 可以由调用方传递指定对象合并(或者覆盖)原参数
         * @param params
         * @returns {*}
         */
        getParams(params) {
            return Object.assign({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }, params)
        },
        /**
         * 分页
         */
        onScroll(e) {
            if(!this.loading && this.hasMore) {
                let $target = e && e.target;
                let scrollHeight = $target.scrollHeight;
                let scrollTop = $target.scrollTop;
                let offsetHeight = $target.offsetHeight;
                if (offsetHeight == (scrollHeight - scrollTop)) {
                    this.pageNum++
                }
            }
        },
        /**
         * loadData成功之后更新数据
         * @param res
         * @param filter
         */
        updateList(res) {
            if(res && res.code === 0) {
                this.hasMore = true;
                if(this.pageNum == 1) {
                    this.list = res.data || [];
                } else {
                    this.list = this.list.concat(res.data || []);
                }
                if (res.data && res.data.length < this.pageSize) {
                    this.hasMore = false;
                }
            } else {
                this.list = [];
                this.$Message.warning((res && res.msg) || '网络错误');
            }
        },
        /**
         * 初始化列表
         */
        initList() {
            this.params.range = this.$route && this.$route.params && this.$route.params.range;
            this.pageNum = 1;
            this.list = [];
            this.loading = false;
            this.hasMore = true;
            this.loadData();
        },
        /**
         * @overwrite
         * 加载数据方法 用到该mixin的都应该重写该方法 否则无法实现加载数据
         */
        loadData() {
            // 每个列表自己的获取数据的方法需要重写
        }
    }
}