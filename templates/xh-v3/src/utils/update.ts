// import function from './VerifyCode';

import { getConfig } from "@/api/common";

type Callback = (tips: string) => void;

class Update {
  private static instance: Update;

  private localVersion: string = "";

  private localPkgVersion: string = "";

  private platform = uni.getSystemInfoSync().platform;

  private constructor() {}

  public static getInstance(): Update {
    if (!Update.instance) {
      Update.instance = new Update();
    }
    return Update.instance;
  }

  async checkVersion(callback: Callback) {
    await this.getWgtVersion();
    callback("正在获取最新版本");
    getConfig(["wgt_version", "wgt_version", "base_apk_version", "base_apk"]).then(res=>{
        callback("版本比对中");
    })
  }

  update() {}

  install() {}

  private getWgtVersion() {
    return new Promise((resolve, reject) => {
      plus.runtime.getProperty(plus.runtime.appid!, (wgtInfo) => {
        this.localVersion = wgtInfo.version!;
        resolve(this.localVersion);
      });
    });
  }

  private getPackageVersion() {
    this.localPkgVersion = uni.getSystemInfoSync().appVersion;
  }
}

export default Update.getInstance();
