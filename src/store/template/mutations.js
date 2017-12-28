import * as types from './mutations_types'

module.exports = {
    [types.UPDATE_TEMPLATE_APP](state, template) {
        state.app = template.app || [];
    },
    [types.UPDATE_TEMPLATE_WEB](state, template) {
        state.web = template.web || [];
    },
    [types.UPDATE_TEMPLATE_CONTENT](state, template) {
        state.content = template.content || [];
    },
};
