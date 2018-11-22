<template>
    <div class="file-list">
        <div class="file-item" 
            v-for="(item, key) in files" 
            :key="key">
            <span class="file-icon" 
                :class="classMap[getFileTypePath(item.fileExtension)]"></span>
            <span class="file-name">
                {{item.fileName}}{{item.fileExtension}}
            </span>
            <span class="file-download" 
                @click="downloadReplyFile(item.fileKey)">
                {{$t('operate.download')}}
            </span>
            <span class="file-size">
                {{item.fileSize | formatFileSize}}
            </span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        files: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            classMap: ["zip", "txt", "xsl", "doc", "ppt", "pdf", "other"]
        }
    },
    filters: {
        formatFileSize(size) {
            if (+size < 1024) {
                return size + " B"
            } else if (+size / 1024 < 1024) {
                return (+size / 1024).toFixed(1) + " KB"
            } else if (+size / 1024 / 1024 < 1024) {
                return (+size / 1024 / 1024).toFixed(1) + " MB"
            } else if (+size / 1024 / 1024 / 1024 < 1024) {
                return (+size / 1024 / 1024 / 1024).toFixed(1) + " GB"
            }
        }
    },
    methods: {
        downloadReplyFile(fileUrl) { // 下载附件
            window.open(fileUrl)
        },
        getFileTypePath(fileext) { // 文件类型图标
            if (!fileext) {
                return
            }
            let fileType = 6
            let fileTypeArr = [
                ["zip", "rar", "tar"],
                ["txt"],
                ["xsl", "xlsx"],
                ["doc", "docx"],
                ["ppt", "pptx"],
                ["pdf"]
            ]
            fileext = fileext.replace(".", "").toLowerCase()
            for (let i = 0, j = fileTypeArr.length; i < j; i++) {
                if (fileTypeArr[i].indexOf(fileext) >= 0) {
                    fileType = i
                    return fileType
                }
            }
            return fileType
        }
    }
}
</script>
<style lang="less" scoped>
    @import '../../../assets/css/var.less';
    @attachUrl: "../../../assets/images/reply_attach/";
    .file-list {
        .file-item {
            padding: 5px 20px 5px 6px;
            margin: 0 0 6px 0;
            line-height: 30px;
            background-color: #f5f5f5;
            & > span {
                color: @gray-color-dark;
            }
            .file-icon {
                display: inline-block;
                width: 30px;
                height: 30px;
                vertical-align: top;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                &.zip {
                    background-image: url("@{attachUrl}zip_file.png");
                }
                &.txt {
                    background-image: url("@{attachUrl}txt_file.png");
                }
                &.xsl {
                    background-image: url("@{attachUrl}excel.png");
                }
                &.doc {
                    background-image: url("@{attachUrl}word_file.png");
                }
                &.ppt {
                    background-image: url("@{attachUrl}ppt_file.png");
                }
                &.pdf {
                    background-image: url("@{attachUrl}pdf_file.png");
                }
                &.other {
                    background-image: url("@{attachUrl}file.png");
                }
            }
            .file-size,
            .file-download {
                float: right;
                font-size: 12px;
            }
            .file-size {
                color: #9e9e9e;
                margin-right: 20px;
            }
            .file-download {
                color: @primary-color;
                cursor: pointer;
            }
        }
    }
</style>

