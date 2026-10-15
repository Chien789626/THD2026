<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useReplicant } from 'nodecg-vue-composable';
import { RunDataActiveRun } from '@THD2026/types/schemas/speedcontrol';

const baseMessages = ref([
  {
    text: 'SNSハッシュタグ ',
    command: '＃ガストRTAリレー',
    end: ' で感想を送ろう！',
  },
  {
    text: 'イベントスケジュールが知りたい？ ',
    command: ' !schedule',
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
]);

const copyright: Record<string, string[]> = {
  '火竜娘': ['©コーエーテクモゲームス'],
  'ネルケと伝説の錬金術士たち ～新たな大地のアトリエ～': ['©コーエーテクモゲームス'],
  'よるのないくに': ['©コーエーテクモゲームス'],
  'ユーディーのアトリエ 〜グラムナートの錬金術士〜': ['©コーエーテクモゲームス'],
  'BLUE REFLECTION TIE/帝': [
    '©2021 コーエーテクモゲームス All rights reserved.',
    '©2021 EXNOA LLC / コーエーテクモゲームス All rights reserved.',
    '©コーエーテクモゲームス/AASA',
  ],
  'ライザのアトリエ2 〜失われた伝承と秘密の妖精〜': ['©コーエーテクモゲームス'],
};

const currentIndex = ref(0);
let timer: ReturnType<typeof setTimeout>;

const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
const runTitle = computed(() => {
  const title = runDataActiveRun?.data?.game ?? '';
  return title;
});

const messages = ref([...baseMessages.value]);
const updateMessages = (title: string) => {
  messages.value = [...baseMessages.value]; // Reset to base messages
  const copyrightTexts = copyright[title];

  if (copyrightTexts) {
    for (const text of copyrightTexts) {
      messages.value.push({
        text: text,
        command: '',
        end: '',
      });
    }
  }
  currentIndex.value = 0; // Reset index when messages are updated
  startMessageTimer(); // Restart the timer when messages are updated
};

const startMessageTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(changeMessage, 30000);
};

const changeMessage = () => {
  currentIndex.value = (currentIndex.value + 1) % messages.value.length;
  startMessageTimer();
};

onMounted(() => {
  startMessageTimer(); // フェードアウトの時間に合わせる
});

onUnmounted(() => {
  clearTimeout(timer);
});

watch(runTitle, (newTitle) => {
  if (!newTitle) return;

  updateMessages(newTitle);
  currentIndex.value = 0; // Reset index when messages are updated
});
</script>

<template>
  <div class="marquee">
    <transition name="message" mode="out-in">
      <div class="item" :key="currentIndex">
        <span>{{ messages[currentIndex].text }}</span>
        <span class="command"> {{ messages[currentIndex].command }} </span>
        <span> {{ messages[currentIndex].end }} </span>
      </div>
    </transition>
  </div>
</template>

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
