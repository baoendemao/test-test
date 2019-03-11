import { article } from './modules/article';

export default {
  install(Vue) {    
    Vue.prototype.$api = Vue.Api = {
      article: article
    };
  }
}