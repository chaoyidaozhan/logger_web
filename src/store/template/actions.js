
import * as types from './mutations_types';
import ajax from '../../common/ajax';


function getTemplateApp(call, type) {
    ajax({
        url: '/template/list',
        data: {
            pageNo: 1,
            pageSize: 1000,
            client: type || 'app'
        },
        success: (res) => {
            if (res && res.code == 0) {
                call && call(res.data || []);
            }
        }
    })
}
function getTemplateWeb(call) {
    ajax({
        url: '/template/list',
        data: {
            pageNo: 1,
            pageSize: 1000,
            client: 'web'
        },
        success: (res) => {
            if(res && res.code == 0) {
                call && call(res.data.list || []);
            }
        }
    });
}

module.exports = {
    update_template_app: ({ commit }, { templateType }) => {
        return new Promise((resolve, reject) => {
            getTemplateApp((app) => {
                commit(types.UPDATE_TEMPLATE_APP, { app });
                resolve()
            }, templateType);
        })
        
    },
    update_template_web: ({ commit }) => {
        return new Promise((resolve, reject) => {
            getTemplateWeb((web) => {
                commit(types.UPDATE_TEMPLATE_WEB, { web });
                resolve()
            });
        })
    },
    update_template_content: ({ commit }, { content }) => {
        return new Promise((resolve, reject) => {
            commit(types.UPDATE_TEMPLATE_CONTENT, { content });
            resolve()
        })
    },
};
