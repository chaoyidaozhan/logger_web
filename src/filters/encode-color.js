import md5 from 'app_src/common/md5';
export default function(str) {
    str = str || '';
    let char = md5(str).charAt(0).toLowerCase();
    let colors = ['#709fff', '#1594ff', '#ffa92f', '#b587fa', '#06cf86', '#fa6771', '#73d51c', '#8991ff'];
    let background = color['abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(char) % colors.length];
    return background;
}