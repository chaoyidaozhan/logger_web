
import * as types from './mutations_types';
import ajax from '../../common/ajax';

module.exports = {
    update_template_app: ({ commit }, { app }) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_TEMPLATE_APP, { app });
            resolve()
        });
    },
    update_template_web: ({ commit }, { web }) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_TEMPLATE_WEB, { web });
            resolve()
        });
    },
};
