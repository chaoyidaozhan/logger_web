<template>
    <Upload class="file-upload"
        ref="upload"
        :max-size="102400"
        name="fileData"
        :with-credentials="true"
        :on-exceeded-size="exceededSize"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :on-remove="handleRemoveFile"
        :action="uploadUrl">
    </Upload>
</template>

<script>
    import config from 'app_src/config/config';
    export default {
        data() {
            return {
                uploadUrl: '',
                uploadFilesArr: []
            }
        },
        methods: {
            clearFiles() {
                this.$refs.upload.clearFiles();
            },
            getFileType(fileext) {
                fileext = fileext.substring(fileext.lastIndexOf('.')+1).toLowerCase();
                let type = "file";
                let fileTypeObj = {
                    video: ['mp4', 'ogg', 'webm'],
                    img: ['jpg', 'jpeg', 'png', 'gif', 'bmp']
                };
                for (var property of Object.keys(fileTypeObj)){
                    if(fileTypeObj[property].indexOf(fileext) >= 0){
                        type = property;
                        return type;
                    }
                }
                return type;
            },
            exceededSize() {
                this.$YYMessage.error("文件不能大于100M!");
            },
            uploadError() {
                this.$YYMessage.error("网络错误, 文件上传失败!");
            },
            uploadSuccess(res, file, fileList) {
                let data = res && res.data
                file && this.uploadFilesArr.push({
                    fid: data.fid,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    fileUrl: data.fileUrl,
                    type: this.getFileType(data.fileName)
                });
                this.$emit("sendFileData", this.uploadFilesArr);
            },
            handleRemoveFile(file, fileList) { // 移除
                this.uploadFilesArr = [];
                fileList && fileList.forEach((item)=>{
                    let data = item && item.response && item.response.data;
                    this.uploadFilesArr.push({
                        fid: data.fid,
                        fileName: data.fileName,
                        fileSize: data.fileSize,
                        fileUrl: data.fileUrl,
                        type: this.getFileType(data.fileName)
                    });
                })
                this.$emit("sendFileData", this.uploadFilesArr);
            }
        },
        mounted () {
            let uploadHost = `${config[__ENV__].uploadHost}`;
            this.uploadUrl = `${uploadHost}/doc/upload?v=1.0`;
        }
    }
</script>

<style lang="less">
@import '../../../assets/css/var.less';
.file-upload {
    .ivu-upload-select {
        display: block;
        padding: 3px;
    }
    .ivu-upload-list-file {
        padding: 8px;
        background-color: @white-color-light;
        margin-bottom: 6px;
        color: @gray-color-medium;
        > span > i {
            color: @gray-color-medium;
        }
    }
    .ivu-upload-list {
        margin-top: 0;
    }
}
</style>
