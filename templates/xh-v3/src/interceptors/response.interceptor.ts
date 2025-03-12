import { BaseResponse, ErrorCode } from "@/constants/api/common.constant";
import { Router } from "@/xh";
import { ResponseData } from "@/xh/constants/request.constant";
import useStore from "../xh/store/index";

export function responseErrorInterceptor(
  data: ResponseData<BaseResponse<any>>
) {
  uni.hideLoading();
  if (data.data.code == ErrorCode.success) return data;
  switch (data.data.code) {
    case ErrorCode.unauthorized:
      uni.removeStorageSync("token");
      Router.go({ name: "Login" });
      throw new Error("登录过期");
    case ErrorCode.receiveLimit:
      useStore("user").targetShowLimit(true);
      throw ErrorCode.receiveLimit;
    case ErrorCode.un_realname:
      Router.go({ name: "RealName" });
      throw ErrorCode.un_realname;
    case ErrorCode.goExchange:
      uni.showToast({
        title: data.data.msg,
        icon: "none",
        success() {
          setTimeout(() => {
            Router.go({ name: "Game", query: { showExchange: "1" } });
          }, 1500);
        },
      });

      throw ErrorCode.goExchange;
    case ErrorCode.aliverify:
      
      throw ErrorCode.aliverify;
    default:
      uni.showToast({ title: data.data.msg ?? "系统繁忙", icon: "none" });
      throw data.data;
  }
}
