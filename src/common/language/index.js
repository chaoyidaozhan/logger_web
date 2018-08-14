import Vue from 'vue'
import iView from 'iview';
import VueI18n from 'vue-i18n'
import cn from './cn'
import tw from './tw'
import en from './en'

import locale_cn from 'iview/dist/locale/zh-CN';
import locale_tw from 'iview/dist/locale/zh-TW';
import locale_en from 'iview/dist/locale/en-US';

// zh-tw 中文（台湾）
// zh-hk 中文（香港特区）
// zh-cn 中文（中华人民共和国）
// zh-sg 中文（新加坡）
let lang = navigator.language || navigator.userLanguage;
lang = lang.toLocaleLowerCase();
if (lang.indexOf('zh') != -1) {
    if (lang.indexOf('cn') != -1) {
        lang = 'cn'
    } else {
        lang = 'tw'
    }
} else {
    lang = 'en'
}
window.lang = lang
let locale
switch (lang) {
    case 'en':
        locale = locale_en
        document.title = 'Log'
        break;
    case 'tw':
        locale = locale_tw
        document.title = '日誌2.0'
        break;
    default:
        locale = locale_cn
        document.title = '日志2.0'
        break;
}
Vue.use(iView, {
    locale: locale
});

Vue.prototype.lang = lang || 'cn'

Vue.use(VueI18n)
export default new VueI18n({
    locale: lang,
    messages: {
        cn: cn,
        tw: tw,
        en: en
    }
})
