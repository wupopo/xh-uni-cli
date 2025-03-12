import { SendRequest } from "@/xh/constants/request.constant";

export function baseRequestInterceptor(options: SendRequest) {
  const token = uni.getStorageSync("token");
  if (token) {
    const headers = options.headers ?? {};
    headers.token = token;
    headers.deviceId = uni.getSystemInfoSync().deviceId;
    headers.deviceType = uni.getSystemInfoSync().platform; 
    options.headers = headers;
  }
  return Promise.resolve(options);
}
