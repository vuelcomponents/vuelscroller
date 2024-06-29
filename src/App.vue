<script setup lang="ts">
import VirtualScroller from "./components/VuelScroller.vue";

const testArrayRenderOnly = Array.from({ length: 5000 }, (_, i) => i + 1);

</script>

<template>
  <div style="height: 700px; width: 300px">
    <!--
    :api="{
       requestUrl: 'https://localhost:44336/api/get/',
       requestStrategy: 'slash',
       listLength:getListLenght(), // stops scrolling when the list is exhausted.
          /* if your list updates on-the-fly, ignore this parameter */
     }"
      if you want to use the api prop,
      uncomment this line and the import statement at the top of the component
      instead of the renderOnly prop
                ↓↓↓↓↓↓
     -->
    <VirtualScroller

      :renderOnly="{ items: testArrayRenderOnly }"
      :settings="{ loadPerScroll: 2, initialQty:60 , maximumQty:100}"
    >
      <template v-slot="{ item }">
        <div
          style="
            background: darkblue;
            color: white;
            height: 20px;
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
