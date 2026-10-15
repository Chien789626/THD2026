<script setup lang="ts">
import { useHead } from '@vueuse/head';
import gameInfo from '../components/gameInfo.vue';
import runnerNameplate from '../components/runnerNameplate.vue';
import commentatorNameplate from '../components/commentatorNameplate.vue';
import timerAndEstimate from '../components/timerAndEstimate.vue';
useHead({ title: 'singleSDCom2' });
</script>

<template>
  <timerAndEstimate />
  <gameInfo />
  <runnerNameplate class="player1" :index="0" />
  <commentatorNameplate class="commentator1" :index="0" :index2="0" />
  <commentatorNameplate class="commentator2" :index="0" :index2="1" />
</template>

<style>
@import url('../css/reset.css');
@import url('../css/common.css');
@import url('../css/singleSdCom2.css');
</style>
