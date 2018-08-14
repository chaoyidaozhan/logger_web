
export function getIsLeapYear(year) { // 判断是否是闰年
    year = year || (new Date()).getFullYear();
    if (year % 4 == 0 && year % 100 != 0) {
        return true;
    } else if (year % 400 == 0) {
        return true;
    } 
    return false;
}

export function getMonthNum(date) { // 获取当前月份天数
    date = date || new Date();
    let point = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let year = date.getFullYear();
    let month = date.getMonth();
    if (getIsLeapYear(year)) {
        point[1] = 29
    }
    return point[month];
}

export function getWeek(date) { // 获取当前星期
    date = date || new Date();
    return "日一二三四五六".charAt(date.getDay());
}
