import * as types from './mutations_types'

module.exports = {
    [types.UPDATE_TEMPLATE](state, tem) {
        state.template = tem.template || {};
    },

    [types.REMOVE_TEMPLATE](state) {
        state.template = {};
    },
};
