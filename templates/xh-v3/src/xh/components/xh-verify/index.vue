<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { State, Emits } from "../../constants/components/verify.constant";
import { debounce, uuid } from "@/xh/utils/tools";
import { getConfig } from "@/api/common";
//#ifdef H5
import "../../libs/gt4.js";
//#endif

const emits = defineEmits<Emits>();

const state = reactive<State>({
  captchaObj: null,
  wv: null,
  appWv: null,
  lastTime: "",
  config: {
    challenge: "",
    riskType: "",
    captchaId: "",
    clientVersion: "",
    clientType: "",
    protocol: "https://",
    mi: {
      geeid: {
        bd: "",
        d: "",
        e: "",
        fp: "",
        ts: "",
        ver: "",
        client_type: "",
      },
      packageName: "",
      displayName: "",
      appVer: "",
      build: "",
      clientVersion: "",
      process_id: "",
      process_id_test: "",
      zid: "",
    },
  },
});

const captchaReady = () => {
  emits("ready");
  //#ifdef H5
  if (state.captchaObj) {
    state.captchaObj.showCaptcha();
  }
  //#endif
  //#ifdef APP
  state.wv?.show();
  state.wv?.evalJS("jsBridge.callback('showBox')");
  //#endif
};

const captchaError = (e: AnyObject) => {
  uni.showToast({
    title: JSON.stringify(e),
    icon: "none",
    duration: 2000,
  });
  //#ifdef APP
  emits("error", e);
  state.wv?.hide();
  //#endif
};

const captchaFail = () => {
  emits("fail");
};

const captchaClose = () => {
  emits("close");
  //#ifdef APP
  state.wv?.hide();
  //#endif
};

const captchaSuccess = (e?: AnyObject) => {
  //#ifdef H5
  if (state.captchaObj) {
    emits("success", state.captchaObj.getValidate());
  }
  //#endif
  //#ifdef APP
  emits("success", e);
  state.wv?.hide();
  //#endif
};

const showCaptcha = async () => {
  const res = await getConfig(["puzzle_captcha_id"]);
  state.config.captchaId = res.data.puzzle_captcha_id.value;
  //#ifdef H5
  if (state.captchaObj) {
    state.captchaObj.destroy();
  }
  window.initGeetest4(
    {
      captchaId: state.config.captchaId,
      product: "bind",
    },
    (captchaObj: AnyObject) => {
      state.captchaObj = captchaObj;
      captchaObj.onReady(captchaReady);
      captchaObj.onError(captchaError);
      captchaObj.onClose(captchaClose);
      captchaObj.onSuccess(captchaSuccess);
      captchaObj.onFail(captchaFail);
    }
  );
  //#endif

  //#ifdef APP
  if (state.wv) {
    state.appWv?.remove(state.wv);
    state.wv.close();
  }

  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  if (page && page.$getAppWebview) {
    state.appWv = page.$getAppWebview();
    state.config.challenge = uuid("xh-");
    state.wv = plus.webview.create(
      `hybrid/html/captcha4/index.html?data=${encodeURIComponent(
        JSON.stringify(state.config)
      )}`,
      "gt_webview",
      {
        background: "transparent",
        width: "100%", //String类型,窗口的宽度.支持百分比、像素值，默认为100%.未设置width属性值时,可同时设置left和right属性值改变窗口的默认宽度.
        height: "100%",
      }
    );

    state.appWv.append(state.wv);
    //@ts-ignore
    plus.globalEvent.addEventListener("plusMessage", (msg) => {
      const result = msg.data.args.data;
      if (result.name == "postMessage") {
        if (result.arg.time === state.lastTime) {
          // 处理uni连续推送bug
          return;
        }
        state.lastTime = result.arg.time;
        switch (result.arg.type) {
          case "ready":
            const debounceReady = debounce(captchaReady, 500);
            debounceReady();
            break;
          case "error":
            const debounceError = debounce(captchaError, 500);
            debounceError(result.arg.data);
            break;
          case "fail":
            captchaFail();
            break;
          case "close":
            captchaClose();
            break;
          case "result":
            const debounceSuccess = debounce(captchaSuccess, 500);
            debounceSuccess(result.arg.data);
            break;
          default:
            break;
        }
      }
    });
  }
  //#endif
};

defineExpose({
  showCaptcha,
});
</script>

<template>
  <view class="geetest_component"> </view>
</template>

<style lang="scss" scoped>
/* styles */
</style>
