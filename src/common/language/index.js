import Vue from 'vue'
import { locale } from 'iview';

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import zhs from './zhs'
import zht from './zht'
import en from './en'

import locale_cn from 'iview/dist/locale/zh-CN';
import locale_tw from 'iview/dist/locale/zh-TW';
import locale_en from 'iview/dist/locale/en-US';

// zh-tw 中文（台湾）
// zh-hk 中文（香港特区）
// zh-cn 中文（中华人民共和国）
// zh-sg 中文（新加坡）

export function setLocale(lang = 'zhs') {
    const iviewLang = {
        'zhs': locale_cn,
        'zht': locale_tw,
        'en': locale_en,
    }
    const title = {
        'zhs': '汇报',
        'zht': '匯報',
        'en': 'Report'
    }
    window.lang = lang
    Vue.prototype.lang = lang
    document.title = title[lang]
    locale(iviewLang[lang])
}

export const i18n = new VueI18n({
    locale: 'zhs',
    messages: {
        zhs: zhs,
        zht: zht,
        en: en
    }
})
export default {
    setLocale,
    i18n
}
