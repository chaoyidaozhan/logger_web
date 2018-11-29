import axios from 'axios';
import config from './config';

export default {
    beforeCreate() {
        axios.defaults.timeout = 5000 * 4; // 默认放开到20s
        axios.interceptors.request.use(
            reqConfig => {
                let url = reqConfig.url;
                if (!/[http|https]:\/\//gi.test(url)) { // 全局拦截，传入api地址若不是全路径默认
                    if (__ENV__ === 'development') {
                        reqConfig.url = config[__ENV__].apiHost + url;
                    } else {
                        reqConfig.url = window.location.protocol + '//' + window.location.host + '/logger' + url;
                    }
                }
                return reqConfig;
            },
            error => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                return Promise.reject(error);
            }
        );
    }
};
