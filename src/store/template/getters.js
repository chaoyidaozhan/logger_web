module.exports = {
    getTemplate(state) {
        return state.template;
    },
    getTemplateApp(state) {
        return state.template && state.template.app ? state.template.app : '';
    },
    getTemplateWeb(state) {
        return state.template && state.template.web ? state.template.web : '';
    },
};
