<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type {
  RunDataActiveRunSurrounding,
  RunDataArray,
} from '@THD2026/types/schemas/speedcontrol';
import UpnextSchedule from './upNextSchedule.vue';
import OndeckSchedule from './OndeckSchedule.vue';
import * as util from '../../util/format';

const runDataArray = useReplicant<RunDataArray>('runDataArray', 'nodecg-speedcontrol');

const runDataActiveRunSurrounding = useReplicant<RunDataActiveRunSurrounding>(
  'runDataActiveRunSurrounding',
  'nodecg-speedcontrol',
);

const speedcontrolActiveRunIndex = computed(() => {
  const activeRunIndex = runDataArray?.data?.findIndex(
    (runData) => runData.id === runDataActiveRunSurrounding?.data?.current,
  );
  return activeRunIndex;
});

const upcomingRuns = computed(() => {
  const index = speedcontrolActiveRunIndex.value || 0;
  return runDataArray?.data?.slice(index, index + 3);
});

const upnextRun = computed(() => upcomingRuns?.value?.[0]);
const ondeckRuns = computed(() => upcomingRuns.value?.slice(1));
const upcomingStartIn = computed(() => {
  if (!upcomingRuns.value || !upcomingRuns.value[1]) {
    return [];
  }

  const startInArray = [];
  const secondRunStartIn =
    (upcomingRuns.value[0].estimateS || 0) + (upcomingRuns.value[1].setupTimeS || 0);
  startInArray.push(util.formatSecondsToStartInTime(secondRunStartIn));

  if (!upcomingRuns.value[2]) {
    return startInArray;
  }
  const thirdRunStartIn =
    secondRunStartIn +
    (upcomingRuns.value[1].estimateS || 0) +
    (upcomingRuns.value[2].setupTimeS || 0);
  startInArray.push(util.formatSecondsToStartInTime(thirdRunStartIn));
  return startInArray;
});

/*
const baseMessages = [
  {
    text: 'SNSハッシュタグ ',
    command: '＃ガストRTAリレー',
    end: ' で感想を送ろう！',
  },
  {
    text: 'イベントスケジュールが知りたい？ ',
    command: '!schedule',
    end: ' をチャットに送信！',
  },
  {
    text: '"ガスト"作品のRTAに興味がある？ ',
    command: ' !discord',
    end: ' でサーバーに参加しよう！',
  },
  {
    text: 'Gust series RTA Relayは全てのタイトル中、サブスク・サブスクギフト・ビッツ禁止です。',
    command: '',
    end: '',
  },
  {
    text: '待機画面の素敵なBGMはこちら！ RYU ITO - ',
    command: 'https://ryu110.com/',
    end: '',
  },
];


let timer: ReturnType<typeof setTimeout>;
const currentIndex = ref(0);

const changeMessage = () => {
  currentIndex.value = (currentIndex.value + 1) % baseMessages.length;
  timer = setTimeout(changeMessage, 30000);
};

onMounted(() => {
  timer = setTimeout(changeMessage, 30000); // フェードアウトの時間に合わせる
});

onUnmounted(() => {
  clearTimeout(timer);
});
*/
</script>

<template>
  <!--<div id="next">NEXT</div>-->
  <div class="mokuji">
    <UpnextSchedule :run-data="upnextRun" />
    <OndeckSchedule
      v-for="(run, index) in ondeckRuns"
      :key="run.id"
      :class="`next${index + 2}`"
      :run-data="run"
      :upcoming-start-in="upcomingStartIn[index]"
      :show-category-runner="index < 2"
    />
  </div>
  <!--
  <div class="marquee">
    <transition name="message" mode="out-in">
      <div class="item" :key="currentIndex">
        <span>{{ baseMessages[currentIndex].text }}</span>
        <span class="command"> {{ baseMessages[currentIndex].command }} </span>
        <span> {{ baseMessages[currentIndex].end }} </span>
      </div>
    </transition>
  </div>
--></template>

<style>
.marquee {
  position: absolute;
  overflow: hidden;
  width: 1500px;
  height: 50px;
  left: 20px;
  bottom: 0;
  font-size: 36px;
  font-family: 'KomorebiGothic';
}

.item {
  display: flex;
  white-space: pre;
  flex-shrink: 0;
  margin-top: 7px;
  opacity: 1;
  transition: opacity 1s;
}

.command {
  color: red;
}

.message-enter-active {
  transition: all 1s 1s;
}

.message-leave-active {
  transition: all 1s;
}

.message-enter-from,
.message-leave-to {
  /* transform: translateX(-20px); */
  transform: translateY(20px);
  opacity: 0;
}
</style>
