<script lang="ts" setup>
import {type XhCanvasProps } from "@/xh/constants/components/canvas.constant";
import { uuid } from "@/xh/utils/tools";
import { computed, nextTick, ref, watch } from "vue";
import XhCanvas from "./XhCanvas";

const props = defineProps<XhCanvasProps>();

const canvasId = ref(uuid());

watch(() => props.data, ()=>nextTick(updateCanvas), { immediate: true, deep: true });

const size = ref({
  width: props.width,
  height: props.height,
});

const sizeStyle = computed(() => ({
  width: size.value.width + "px",
  height: size.value.height + "px",
}));

function updateCanvas() {
  canvasId.value = uuid();
  const canvas = new XhCanvas(props.data, canvasId.value);
  canvas.onSourceReady=()=>{
    canvas.draw();
  }
  size.value = canvas.updateCanvasSize();
}
</script>

<template>
  <canvas :canvas-id="canvasId" :style="sizeStyle"></canvas>
</template>
