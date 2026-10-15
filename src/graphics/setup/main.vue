<script setup lang="ts">
import { useHead } from '@vueuse/head';
import SetupSchedule from '../components/setupSchedule/setupSchedule.vue';

useHead({ title: 'Setup' });
</script>

<template>
  <div class="next_container" />
  <SetupSchedule />
</template>

<style>
@import url('../css/reset.css');
@import url('../css/common.css');
@import url('../css/setup.css');
</style>
