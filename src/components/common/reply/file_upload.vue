<template>
    <Upload class="file-upload"
            multiple
            :max-size="102400"
            name="fileData"
            :on-exceeded-size="exceededSize"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :action="uploadUrl">
    </Upload>
</template>

<script>
    import config from 'app_src/config/config';
    export default {
        data() {
            return {
                uploadUrl: `${config[__ENV__].apiHost}/doc/doc/upload?token=${this.$store.state.userInfo.token}`
            }
        },
        methods: {
            exceededSize() {
                this.$Message.error("文件不能大于100M!");
            },
            uploadError() {
                this.$Message.error("网络错误,文件上传失败!");
            },
            uploadSuccess(response, file, fileList) {

            }
        }
    }
</script>

<style lang="less">
    .file-upload {
        line-height: 0;
        .ivu-upload-list-file {
            padding: 8px;
            background-color: #f5f5f5;
            margin-bottom: 6px;
        }
    }
</style>
