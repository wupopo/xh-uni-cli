import { sendSms } from "@/api/common";
import {
  BaseResponse,
  SmsCodeForm,
  SmsType,
} from "@/constants/api/common.constant";

export interface SmsStatus {
  isSend: boolean;
  tips: string;
}

const prefix = "verifycode-";

export function checkSendStatus(type: SmsType) {
  const isSend = uni.getStorageSync(prefix + type) ?? Date.now() - 1;
  if (isSend < Date.now()) {
    return {
      isSend: false,
      tips: "发送验证码",
    };
  }
  const scends = Math.floor((isSend - Date.now()) / 1000);

  return {
    isSend: true,
    tips: `${scends}秒后重新发送`,
  };
}

export default function (data: SmsCodeForm): Promise<BaseResponse<any>> {
  uni.showLoading({
    title: "发送中",
    mask: true,
  });
  return new Promise((resolve, reject) => {
    sendSms(data)
      .then((res) => {
        uni.setStorageSync(prefix + data.event, Date.now() + 60 * 1000 * 2);
        resolve(res);
      })
      .then((res) => {
        reject(res);
      });
  });
}
