import * as types from './mutations_types'

module.exports = {
	[types.UPDATE_USERINFO](state, user) {
		state.userInfo = user.userInfo || {};
	},

	[types.REMOVE_USERINFO](state) {
		state.userInfo = {};
	},
};
