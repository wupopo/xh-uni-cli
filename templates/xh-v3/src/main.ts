import { createSSRApp } from "vue";
import App from "./App.vue";
import XhPlugin, { Router } from '@/xh/index'
import Request from '@/xh/utils/request/index'
import { baseRequestInterceptor } from "./interceptors/request.interceptor";
import { responseErrorInterceptor } from './interceptors/response.interceptor';
import baseRouterInterceptor from "./interceptors/router.interceptor";

export function createApp() {
  const app = createSSRApp(App);
  app.use(XhPlugin())
  Request.addRequestInterceptor(baseRequestInterceptor)
  Request.addResponseInterceptor(responseErrorInterceptor);
  Router.addInterceptor(baseRouterInterceptor);
  return {
    app,
  };
}
