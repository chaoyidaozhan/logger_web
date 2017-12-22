module.exports = {
	getUserInfo(state) {
		return state.userInfo;
	},
	getToken(state) {
		return state.userInfo && state.userInfo.token ? state.userInfo.token : '';
	},
};
