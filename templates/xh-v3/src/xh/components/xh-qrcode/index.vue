<script setup lang="ts">
import {
  BuildStatus,
  type QrcodeEmits,
  type QrcodeData,
  type QrcodeProps,
} from "../../constants/components/qrcode.constant";
import { defineProps, watch, reactive, ref, computed, nextTick } from "vue";
import { getQrcodeArr, uuid } from "../../utils/tools/index";

const props = withDefaults(defineProps<QrcodeProps>(), {
  size: 375,
  activeColor: "#000",
  padding: 16,
  bgColor: "#fff",
  logoSize: 30,
  logoRadius: 4,
});

const data = reactive<QrcodeData>({
  dataUrl: "",
  qrcodeArr: [],
  status: BuildStatus.unbuilt,
});

const emits = defineEmits<QrcodeEmits>();

watch(
  () => props.text,
  (value, oldValue) => {
    if (value !== oldValue && value) {
      console.log(1);
      nextTick(updateQrcode);
    }
  },
  { immediate: true, deep: true }
);

const qrcodeId = uuid("qrcode");

const qrcodeSize = ref(0);

const canvasId = "t" + new Date().getTime();

const canvasSize = ref(props.size);

const canvasSizeStyle = computed(() => {
  if (!canvasSize.value) {
    return {
      width: "",
      height: "",
    };
  }
  return {
    width: canvasSize.value + "px",
    height: canvasSize.value + "px",
  };
});

function getImageLocalPathByUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success: async (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

async function updateQrcode() {
  // console.log(data.status);
  if (data.status === BuildStatus.loading) return;
  data.status = BuildStatus.loading;
  try {
    data.qrcodeArr = getQrcodeArr(props.text);
  } catch (e) {
    console.log(e);
  }
  const res = await getQrCodeImg();
  canvasSize.value = props.size;
  fillReact(0, 0, canvasSize.value, canvasSize.value, 10, props.bgColor);
  await drawImage(
    res,
    props.padding,
    props.padding,
    canvasSize.value - props.padding * 2,
    canvasSize.value - props.padding * 2,
    0
  );
  if (props.logo) {
    const logo = await getImageLocalPathByUrl(props.logo);
    const distance = (props.size - props.logoSize) / 2;
    await drawImage(
      logo,
      distance,
      distance,
      props.logoSize,
      props.logoSize,
      props.logoRadius
    );
  }

  data.dataUrl = await buildImageData();
  emits("finish", data.dataUrl);
  data.status = BuildStatus.success;
}

function buildImageData(): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.canvasToTempFilePath({
      canvasId: canvasId,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

function drawImage(
  imgUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  return new Promise((resolve, reject) => {
    const ctx = uni.createCanvasContext(canvasId);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.clip();
    ctx.drawImage(imgUrl, x, y, width, height);
    ctx.draw(true, resolve);
    ctx.closePath();
  });
}

function fillReact(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string
) {
  const ctx = uni.createCanvasContext(canvasId);

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.lineTo(x + radius, y);

  ctx.closePath();
  ctx.clip();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.draw(false);
}

function getQrCodeImg(): Promise<string> {
  return new Promise((resolve, reject) => {
    const blockSize = 5;
    qrcodeSize.value = data.qrcodeArr.length * blockSize;
    nextTick(() => {
      const ctx = uni.createCanvasContext(qrcodeId);
      ctx.clearRect(0, 0, qrcodeSize.value, qrcodeSize.value);

      for (let i = 0; i < data.qrcodeArr.length; i++) {
        const row = data.qrcodeArr[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j].isBlack) {
            ctx.setFillStyle(props.activeColor);
            ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
          }
        }
      }
      ctx.draw(true, () => {
        uni.canvasToTempFilePath({
          canvasId: qrcodeId,
          x: 0,
          y: 0,
          width: blockSize * data.qrcodeArr.length,
          height: blockSize * data.qrcodeArr.length,
          success: (res) => {
            ctx.clearRect(
              0,
              0,
              blockSize * data.qrcodeArr.length,
              blockSize * data.qrcodeArr.length
            );
            resolve(res.tempFilePath);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    });
  });
}
</script>

<template>
  <view>
    <canvas
      class="qrcode-canvas"
      v-if="qrcodeSize"
      :canvas-id="qrcodeId"
      :style="{ width: qrcodeSize + 'px', height: qrcodeSize + 'px' }"
    ></canvas>
    <canvas
      :hidpi="true"
      :canvas-id="canvasId"
      :style="canvasSizeStyle"
    ></canvas>
  </view>
</template>

<style lang="scss" scoped>
.qrcode-canvas {
  position: fixed;
  top: -9999px;
}
</style>
