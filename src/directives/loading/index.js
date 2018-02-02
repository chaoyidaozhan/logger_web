import Vue from 'vue';
let Spin = Vue.extend(require('./loading.vue'));

Vue.directive('loading', {
    bind: function (el, binding, vnode, oldVnode) {
        let spin = new Spin({
            el: document.createElement('div'),
            data: {
                text: binding.value.text || 'loading',
                size: binding.value.size || 30,
                fix: typeof binding.value.fix === 'boolean' ? binding.value.fix : true
            }
        });
        el.spin = spin.$el;
        el.appendChild(el.spin)
    },
    update: function (el, binding, vnode, oldVnode) {
        if (binding.value && binding.value.loading) {
            el.spin &&
            el.spin.parentNode &&
            el.spin.parentNode.removeChild(el.spin);
        } else {
            el.appendChild(el.spin)
        }
    }
})