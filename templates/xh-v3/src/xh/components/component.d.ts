import "@vue/runtime-core";

export {};

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    xhIcon: typeof import("./xh-icon/index.vue")["default"];
    xhContainer: typeof import("./xh-container/index.vue")["default"];
    xhQrcode: typeof import("./xh-qrcode/index.vue")["default"];
    xhParse: typeof import("./xh-parse/index.vue")["default"];
    xhVerify: typeof import("./xh-verify/index.vue")["default"];
  }
}
