import { defineStore } from "pinia";

import { UserState } from "../constants/store/user.constant";
import { Router } from "@/xh";

export default defineStore("user", {
  state: (): UserState => ({
    userInfo: null,
    token: null,
    config: null,
    showRabbitLimit: false,
    showLogin: false,
  }),
  actions: {
    targetShowLimit(v: boolean) {
      this.showRabbitLimit = v;
    },
    setShowLogin(value: boolean) {
      this.showLogin = value;
    },

    login(data: any) {},
    loginByMobile(data: any) {},
    register(data: any) {},
    logout() {
      uni.removeStorageSync("token");
      this.token = null;
      this.userInfo = null;
      Router.go({ name: "Login" });
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {});
    },
    async getConfig() {},
  },
});
