import URLSearchParams from 'url-search-params';
import axios from 'axios';
import md5 from './md5';
import config from '../config/config';
var qs = require('qs');
URLSearchParams.prototype.add = function (para) { // axios post请求必须使用URLSearchParams
    if (para instanceof Object) {
        for (let k in para) {
            this.delete(k);
            this.append(k, para[k]);
        }
    }
}

function initString(params) {
    let paramsString = '';
    let keys = Object.keys(params);

    keys.sort();
    keys.forEach(function (it, index) {
        if (index == keys.length - 1) {
            paramsString += it + '=' + params[it];
        } else {
            paramsString += it + '=' + params[it] + '&';
        }
    });

    return paramsString;
}

function initParams(uri, newParams, type) {
    let getParams = { // 任何请求都带到url
        timestamp: (new Date).valueOf(),
        // version: config.v || '1.0',
        token: (storage.get('$sign') && storage.get('$sign').token) || config.token,
    }
    let signParams = { // 用于签名的对象
        ...getParams,
        ...newParams
    };

    let paramsString = initString(signParams);
    // let sign = md5((storage.get('$sign') && storage.get('$sign').sn || '') + uri + paramsString + config.salt); // 计算签名

    if (type && type === 'post') { // post时只带固定的参数在url上面
        paramsString = initString(getParams);
    }

    // paramsString = uri + '?' + paramsString + '&sign=' + sign;
    paramsString = uri + '?' + paramsString;
    return paramsString;
}

export default function ajax(opt) { //公用的ajax方法
    let type = opt.type || 'get',
        params = {}
    if (type === 'post' && !opt.requestBody) {
        params = new URLSearchParams();
        params.add(opt.data);
    } else if (opt.requestBody === true) { // form data
        params = qs.stringify(opt.data);
    } else { // payload
        params = opt.data
    }
    
    let uri = initParams(opt.url, opt.data || {}, opt.type || null);
    // let uri = initParams(opt.url, opt.data || {});
    axios[type](uri, params, opt.config || {}).then((res) => {
        opt.success(res.data);
    }).catch((error) => {
        opt.error && opt.error(error);
    });
}
