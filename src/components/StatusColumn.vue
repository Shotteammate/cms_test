<template>
  <div>
    <div>
      <img
        v-for="icon in icons"
        :key="icon"
        :src="getIcon(icon)"
        alt="icon"
        style="width: 24px; margin: 0 4px"
      />
    </div>
    <div>
      <a-badge :color="StatusColor[status]" :text="statusEnum[status]" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { StatusColor } from "../constants/enums";

const props = defineProps({
  icons: Array,
  status: String,
  statusEnum: Object,
  getIcon: Function,
});
</script>
