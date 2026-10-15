<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { computed } from 'vue';
import { RunDataActiveRun, Timer } from '@THD2026/types/schemas/speedcontrol';
import * as util from '../util/format';

const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');

const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');

const estimate = computed(() => {
  const estimateS = runDataActiveRun?.data?.estimateS ?? 0;
  return util.formatSeconds(estimateS);
});

const time = computed(() => {
  if (!timer?.data) {
    return 0;
  }
  const { milliseconds } = timer.data;
  return util.formatSeconds(Math.trunc(milliseconds / 1000));
});

const runState = computed(() => {
  if (!timer?.data) {
    return 0;
  }

  const { state } = timer.data;
  return state;
});
</script>

<template>
  <div class="time">
    <span :class="`runState ${runState}`">{{ time }}</span>
  </div>
  <div class="estimate">
    <span>予定タイム：　</span>
    <span id="est">{{ estimate }}</span>
  </div>
</template>
