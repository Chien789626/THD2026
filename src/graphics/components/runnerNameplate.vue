<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import { computed, Ref, ref, watch } from 'vue';
import { RunDataActiveRun, Timer } from '@THD2026/types/schemas/speedcontrol';
import { SNS } from '@THD2026/types/schemas/Sns';
import * as util from '../util/format';

interface Props {
  index: number;
}

const sns: SNS = {
  name: 0,
  twitch: 1,
  twitter: 2,
  youtube: 3,
};

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

const NameFS = ref<number>(0);
const TwitchFS = ref<number>(0);
const TwitterFS = ref<number>(0);
const YoutubeFS = ref<number>(0);

const stringArray: (string | undefined)[] = [];
const player = ref(stringArray);
let isShow: Ref<number> = ref(0);

let timerID: ReturnType<typeof setInterval>;

let startTimer = () => {
  clearInterval(timerID);

  isShow.value = 0;

  timerID = setInterval(() => {
    if (name.value == '-') {
      return;
    }

    if (twitch.value == '' && twitter.value == '' && youtube.value == '') {
      isShow.value = 0;
      clearInterval(timerID);
      return;
    }

    switch (isShow.value) {
      case sns.name:
        if (twitch.value !== '') {
          isShow.value++;
        } else if (twitter.value !== '') {
          isShow.value = 2;
        } else if (youtube.value !== '') {
          isShow.value = 3;
        }
        break;
      case sns.twitch:
        if (twitter.value !== '') {
          isShow.value++;
        } else if (youtube.value !== '') {
          isShow.value = 3;
        } else {
          isShow.value = 0;
        }
        break;
      case sns.twitter:
        if (youtube.value !== '') {
          isShow.value = 3;
        } else {
          isShow.value = 0;
        }
        break;
      case sns.youtube:
        isShow.value = 0;
        break;
      default:
        isShow.value++;
    }
  }, 5000);
  //30000 = 30秒
};

const props = defineProps<Props>();
const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');

const name = computed(() => {
  if (!runDataActiveRun?.data || !runDataActiveRun?.data.teams[props.index]) {
    return '';
  }
  return runDataActiveRun?.data.teams[props.index].players[0].name;
});

const twitch = computed(() => {
  if (!runDataActiveRun?.data || !runDataActiveRun?.data.teams[props.index]) {
    return '';
  }
  if (!runDataActiveRun?.data.teams[props.index].players[0].social.twitch) {
    return '';
  }
  return runDataActiveRun?.data.teams[props.index].players[0].social.twitch;
});

const twitter = computed(() => {
  if (!runDataActiveRun?.data || !runDataActiveRun?.data.teams[props.index]) {
    return '';
  }
  if (!runDataActiveRun?.data.teams[props.index].players[0].customData.player_twitter) {
    return '';
  }
  return runDataActiveRun?.data.teams[props.index].players[0].customData.player_twitter;
});

const youtube = computed(() => {
  if (!runDataActiveRun?.data || !runDataActiveRun?.data.teams[props.index]) {
    return '';
  }
  if (!runDataActiveRun?.data.teams[props.index].players[0].customData.player_youtube) {
    return '';
  }
  return runDataActiveRun?.data.teams[props.index].players[0].customData.player_youtube;
});

const finishTime = computed(() => {
  if (!runDataActiveRun?.data || !runDataActiveRun?.data.teams[props.index]) {
    return '';
  }
  const teamId = runDataActiveRun?.data.teams[props.index].id;
  if (!timer?.data?.teamFinishTimes[teamId]) {
    return '';
  }
  const finish = timer?.data?.teamFinishTimes[teamId];
  if (finish.state === 'forfeit') {
    return '';
  }
  if (finish.state === 'completed') {
    return util.formatSeconds(Math.trunc(finish.milliseconds / 1000));
  }
  return '';
});

watch(name, (newValue: string) => {
  if (!newValue) return;

  player.value.push(name.value);
  player.value.push(twitch.value);
  player.value.push(twitter.value);
  player.value.push(youtube.value);

  NameFS.value = adjustFontSize(name.value || '', {
    max: 35,
    min: 28,
    base: 12,
  });

  TwitchFS.value = adjustFontSize(twitch.value || '', {
    max: 35,
    min: 28,
    base: 16,
  });

  TwitterFS.value = adjustFontSize(twitter.value || '', {
    max: 35,
    min: 28,
    base: 16,
  });

  YoutubeFS.value = adjustFontSize(youtube.value || '', {
    max: 35,
    min: 28,
    base: 16,
  });

  startTimer();
});
</script>

<template>
  <div :class="{ clear: finishTime }">
    <div class="player_time" v-if="finishTime">
      {{ finishTime }}
    </div>
    <transition name="social" mode="out-in">
      <div
        v-if="sns.name === isShow && player.includes(name)"
        key="name"
        class="player_name"
        :style="{ fontSize: NameFS + 'px' }"
      >
        <span> {{ name }}</span>
      </div>
      <div
        v-else-if="sns.twitch === isShow && player.includes(twitch)"
        key="twitch"
        class="sns"
        :style="{ fontSize: TwitchFS + 'px' }"
      >
        <span class="sns_icon twitch_icon">
          <img src="../images/icon/twitch.png" />
        </span>
        <span class="sns_id">{{ twitch }}</span>
      </div>

      <div
        v-else-if="sns.twitter === isShow && player.includes(twitter)"
        key="twitter"
        class="sns"
        :style="{ fontSize: TwitterFS + 'px' }"
      >
        <span class="sns_icon twitter_icon">
          <img src="../images/icon/twitter.png" />
        </span>
        <span class="sns_id">{{ twitter }}</span>
      </div>

      <div
        v-else-if="sns.youtube === isShow && player.includes(youtube)"
        key="youtube"
        class="sns"
        :style="{ fontSize: YoutubeFS + 'px' }"
      >
        <span class="sns_icon youtube_icon">
          <img src="../images/icon/youtube.png" />
        </span>
        <span class="sns_id">{{ youtube }}</span>
      </div>
    </transition>
  </div>
</template>

<style>
.social-enter-active {
  transition: all 1s 1s;
}

.social-leave-active {
  transition: all 1s;
}

.social-enter-from,
.social-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
