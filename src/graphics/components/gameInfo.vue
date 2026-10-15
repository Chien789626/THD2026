<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { computed, ref, watch } from 'vue';
import { RunDataActiveRun } from '@THD2026/types/schemas/speedcontrol';

interface IfAdjustFontSizeOption {
  // フォントサイズの最大値
  max: number;
  // フォントサイズの最小値
  min: number;
  // フォントサイズの最大値になる文字数
  base: number;
}

const adjustFontSize = (text: string, { max, min, base }: IfAdjustFontSizeOption): number => {
  const textLength = text.length;

  // 基準の文字数に達しない場合は常に最大フォントサイズ
  if (textLength <= base) return max;

  // フォントサイズを可変
  const ratio = max / base;
  const diff = Math.ceil(textLength * ratio);

  // どちらか大きい方
  return Math.max(min, max - (diff - max));
};

const runTitleFS = ref<number>(0);
const runCategoryFS = ref<number>(0);

const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');

const runTitle = computed(() => runDataActiveRun?.data?.game ?? '');
const runCategory = computed(() => runDataActiveRun?.data?.category ?? '');
const runSystem = computed(() => runDataActiveRun?.data?.system ?? '');

watch(runTitle, (newValue: string) => {
  if (!newValue) return;

  runTitleFS.value = adjustFontSize(runTitle.value || '', {
    max: 50,
    min: 45,
    base: 32,
  });

  runCategoryFS.value = adjustFontSize(runCategory.value || '', {
    max: 33,
    min: 14,
    base: 21,
  });
});
</script>

<template>
  <div class="gametitle">
    <span :style="{ fontSize: runTitleFS + 'px' }">
      {{ runTitle }}
    </span>
  </div>
  <div class="runcategory">
    <span :style="{ fontSize: runCategoryFS + 'px' }">
      {{ runCategory }}
    </span>
  </div>
</template>
