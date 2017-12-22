
import * as types from './mutations_types';

module.exports = {
    update_template: ({ commit }, { template }) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_TEMPLATE, { template });
            resolve()
        });
    },

    remove_template: ({ commit }) => {
        return new Promise((resolve, reject) => {
            commit(types.REMOVE_TEMPLATE);
            resolve()
        });
    },
};
