<script lang="ts" setup>
import { Router, useStore } from "@/xh";
import { computed, onMounted, ref } from "vue";

// import { POPUP_TYPE } from "../Popup";
import {
  RectSize,
  RectColorType,
  SpecialBtnType,
} from "@/constants/components/button.constant";
import { POPUP_TYPE } from "@/components/Popup";
import RectButton from "@/components/Button/rect.vue";
import Popup from "@/components/Popup/index.vue";
import { Exports } from "@/xh/constants/components/verify.constant";
import { Puzzle } from "@/constants/api/common.constant";
import { uuid } from "@/xh/utils/tools";

interface Props {
  loading?: boolean;
  containerHeight?: string;
}

const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  containerHeight: "revert-layer",
});

function toLogin() {
  useStore("user").setShowLogin(false);
  Router.go({ name: "Login" });
}

const limitModel = computed({
  get() {
    return useStore("user").showRabbitLimit;
  },
  set(v) {
    useStore("user").targetShowLimit(v);
  },
});

const loginModel = computed({
  get() {
    return useStore("user").showLogin;
  },
  set(v) {
    useStore("user").setShowLogin(v);
  },
});

let eventKey = "";

onMounted(() => {
  const route = Router.getCurrentPageRoute();
  if (route) {
    eventKey = route.fullPath;
  }
});

const captchaRef = ref<Exports>();
uni.$on("showCaptcha", (key?: string) => {
  if (key) {
    eventKey = key;
  }
  captchaRef.value?.showCaptcha();
});

const captchaSuccess = (e: AnyObject) => {
  uni.$emit("captchaSuccess", { ...e, eventKey: eventKey } as Puzzle);
};
</script>
<template>
  <view class="xh-container" :style="{ height: containerHeight }">
    <view class="loading-box" v-if="props.loading">
      <view class="loading" />
    </view>
    <slot v-else></slot>

    <Popup v-model="loginModel" title="温馨提示" :type="POPUP_TYPE.SMALL_SIZED">
      <template #body>
        <view class="limit-popup">
          <!-- <view class="title">请登录</view> -->
          <view class="tips">您还未登录，是否立即登录</view>
          <view class="flex-ai-center">
            <RectButton
              :color="RectColorType.ORANGE"
              :size="RectSize.MEDIUM"
              @click="loginModel = false"
              class="mt-56 mr-4"
              >暂不登录</RectButton
            >
            <RectButton :size="RectSize.MEDIUM" @click="toLogin" class="mt-56"
              >立即登录</RectButton
            >
          </view>
        </view>
      </template>
    </Popup>

    <Popup v-model="limitModel" title="领取提示" :type="POPUP_TYPE.SMALL_SIZED">
      <template #body>
        <view class="limit-popup">
          <view class="title">您的兔子已满</view>
          <view class="tips">需要等待消耗后才可领取</view>
          <RectButton
            :size="RectSize.MEDIUM"
            @click="limitModel = false"
            class="mt-56"
            >确定</RectButton
          >
        </view>
      </template>
    </Popup>

    <xh-verify ref="captchaRef" @success="captchaSuccess"></xh-verify>
  </view>
</template>
<style lang="scss" scoped>
.xh-container {
  min-height: 100vh;
  box-sizing: border-box;

  .limit-popup {
    @extend .flex-dir-col, .flex-center, .pt-50;

    .title {
      font-weight: bold;
      font-size: 32rpx;
      color: #f8eed1;
      @include textShadow(2rpx, #2f2e2d);
    }

    .tips {
      @extend .mt-4;
      font-weight: 400;
      font-size: 28rpx;
      color: #40332f;
      @include textShadow(2rpx, #f3e9d5);
    }
  }
}

.loading-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;

  .loading {
    width: 80rpx;
    height: 80rpx;
    padding: 12rpx;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffa516;
    flex-shrink: 0;
    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
  }
}

@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
