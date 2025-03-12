<script lang="ts" setup>
import { Props } from "@/xh/constants/components/icon.constant";
import { computed } from "vue";

const props = withDefaults(defineProps<Props>(), {
  size: 16,
});

const iconPath = computed(() => {
  return `/static/icon/${props.name}.png`;
});

const style = computed(() => {
  return {
    width: `${props.size * 2}rpx`,
    height: `${props.size * 2}rpx`,
  };
});
</script>

<template>
  <image class="xh-icon" :src="iconPath" :style="style"></image>
</template>
