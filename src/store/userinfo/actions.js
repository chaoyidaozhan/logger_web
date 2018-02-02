import * as types from './mutations_types';

module.exports = {
    update_userinfo: ({commit}, {userInfo}) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_USERINFO, { userInfo});
            resolve()
        });
    },

    remove_userinfo: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.REMOVE_USERINFO);
            resolve()
        });
    },
};
