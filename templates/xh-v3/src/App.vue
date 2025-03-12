<script setup lang="ts">
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import { Router } from "./xh";
import Voice from "./utils/Voice";

let timer: any;
function stepRouter() {
  const route = Router.getCurrentPageRoute();
  if (!route) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      stepRouter();
    }, 10);
  }
}

onLaunch((e) => {
  uni.removeStorageSync("isReady");
  uni.removeStorageSync("fontLoaded");
  stepRouter();
});
onShow(() => {
  Voice.playBg();
});

onHide(() => {
  Voice.stopBg();
});
</script>

<style lang="scss">
@import "animate.css";

* {
  font-family: "pingfang";
}
.hover-class {
  transform: scale(0.95);
}
#u-a-t {
  uni-toast {
    z-index: 1001;
  }
}
</style>
