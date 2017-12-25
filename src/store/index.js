import Vue from 'vue';
import Vuex from 'vuex';

import userInfo from './userinfo/';
import template from './template/';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        template,
    },
    ...userInfo
})
