import { getQueryString } from "../tools";
import type {
  RequestInterceptor,
  RequestInterceptorItem,
  ResponseData,
  ResponseInterceptor,
  ResponseInterceptorItem,
  SendRequest,
} from "../../constants/request.constant";

class Request {
  // 单例
  private static instance: Request;

  // 请求拦截器
  private requestInterceptors: RequestInterceptorItem[] = [];

  // 响应拦截器
  private responseInterceptors: ResponseInterceptorItem[] = [];

  private constructor() {}

  static getInstance(): Request {
    if (!this.instance) {
      this.instance = new Request();
    }
    return this.instance;
  }

  private async doRequestInterceptors(
    requestConfig: SendRequest
  ): Promise<SendRequest> {
    let result = requestConfig;
    for (let i = 0; i < this.requestInterceptors.length; i++) {
      const item = this.requestInterceptors[i];
      result = await item.interceptor(result);
    }
    return result;
  }

  /**
   * 添加请求拦截器
   * @param interceptor 拦截器
   * @param order
   */
  addRequestInterceptor(
    interceptor: RequestInterceptor,
    order: number = new Date().getTime()
  ) {
    this.requestInterceptors.push({
      interceptor,
      order,
    });
    this.requestInterceptors.sort((a, b) => a.order - b.order);
  }

  private doResponseInterceptors<T = any>(
    responseData: ResponseData<T>
  ): ResponseData<T> {
    let result = responseData;
    for (const item of this.responseInterceptors) {
      result = item.interceptor(result);
    }
    return result;
  }

  /**
   * 添加响应拦截器
   * @param interceptor 拦截器
   * @param order
   */
  addResponseInterceptor<T = any>(
    interceptor: ResponseInterceptor<T>,
    order: number = new Date().getTime()
  ) {
    this.responseInterceptors.push({
      interceptor,
      order,
    });
    this.responseInterceptors.sort((a, b) => a.order - b.order);
  }

  send<T = any>(requestConfig: SendRequest): Promise<T> {
    return new Promise(async (resolve, reject) => {
      requestConfig = await this.doRequestInterceptors(requestConfig);
      const host = requestConfig.host ?? import.meta.env.XH_HOST;
      const baseUrl = requestConfig.baseUrl ?? import.meta.env.XH_BASE_URL;
      let requestUrl = host + baseUrl + requestConfig.url;
      if (requestConfig.params) {
        requestUrl += "?" + getQueryString(requestConfig.params);
      }
      uni.request({
        url: requestUrl,
        method: requestConfig.method,
        data: requestConfig.data,
        header: requestConfig.headers,
        success: (res) => {
          const data = res as Record<string, any> as ResponseData<T>;
          try {
            const result = this.doResponseInterceptors(data);
            resolve(result.data);
          } catch {
            reject(res.data);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg || "系统繁忙",
            icon: "none",
          });
          uni.hideLoading();
          reject(err);
        },
      });
    });
  }
}

export default Request.getInstance();
