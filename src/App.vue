<script setup lang="ts">
import VirtualScroller from "./components/VuelScroller.vue";

const testArrayRenderOnly = Array.from({ length: 5000 }, (_, i) => i + 1);

</script>

<template>
  <div style="height: 700px; width: 300px">
    <VirtualScroller
        :api="{
        requestUrl: 'https://localhost:44336/api/get/',
        requestStrategy: 'slash',
      }"
      :settings="{ loadPerScroll: 10, initialQty:10 }"
    >
      <template v-slot="{ item }">
        <div
          style="
            background: darkblue;
            color: white;
            height: 220px;
            width: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          {{ item }}
        </div>
      </template>
    </VirtualScroller>
  </div>
</template>
