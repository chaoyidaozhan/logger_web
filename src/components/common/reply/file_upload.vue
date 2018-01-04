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
                uploadUrl: `${config[__ENV__].apiHost}/doc/doc/upload?token=${this.$store.state.userInfo.token}`,
                uploadFilesArr: []
            }
        },
        methods: {
            getFileType(fileext) {
                fileext = fileext && fileext.replace(".", "").toLowerCase();
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
                this.$Message.error("文件不能大于100M!");
            },
            uploadError() {
                this.$Message.error("网络错误, 文件上传失败!");
            },
            uploadSuccess(response, file, fileList) {
                file && this.uploadFilesArr.push({
                    fid: file.fid,
                    fileName: file.fileName,
                    fileSize: file.fileSize,
                    fileUrl: file.img,
                    type: this.getFileType(file.fileExtension)
                });
                this.$emit("sendFileData", this.uploadFilesArr);
            }
        }
    }
</script>

<style lang="less">
    .file-upload {
        .ivu-upload-list-file {
            padding: 8px;
            background-color: #f5f5f5;
            margin-bottom: 6px;
        }
    }
</style>
