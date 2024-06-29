<template>
  <div
    style="height: 100%;width:100%; position: relative; overflow-y: scroll"
    ref="componentContainer"
    @scroll="onScroll"
  >
    <div
      v-for="(item, index) in loadedItems.slice(0, sliceCount)"
      :key="`ev-${index}`"
      ref="slotContainer"
    >
      <slot :item="item"></slot>
    </div>
    <div v-if="isLoading" :style="{display:'flex', justifyContent:'center', width:'100%'}">
      <slot name="loading">
        <svg  xmlns="http://www.w3.org/2000/svg"    x="0px"    y="0px"    viewBox="0 0 100 100"       xml:space="preserve"    style="width: 50px; height: 50px;">    <rect fill="none" stroke="#000" stroke-width="4" x="25" y="25" width="50" height="50" rx="8" ry="8">        <animateTransform            attributeName="transform"            dur="0.5s"            from="0 50 50"            to="180 50 50"            type="rotate"            id="strokeBox"            attributeType="XML"            begin="rectBox.end"        />    </rect>    <rect x="27" y="27" fill="#000" width="46" height="50" rx="6" ry="6">        <animate            attributeName="height"            dur="1.3s"            attributeType="XML"            from="50"            to="0"            id="rectBox"            fill="freeze"            begin="0s;strokeBox.end"        />    </rect></svg>
      </slot>
    </div>
    <div
      style="
        position: absolute;
        bottom: -30px;
        width: 100%;
        height: 10px;
        background: transparent;
      "
    ></div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref, onMounted, defineProps } from "vue";
import {getFromApi} from "../utils/getFromApi.ts";

const props = defineProps<{
  renderOnly?:{
    items?: Array<any>;
  }
  settings?:{
    loadPerScroll?: number;
    initialQty:number;
  }
  api?: {
    requestUrl: string;
    requestStrategy?: "slash" | "query";
    queryNames?: { qty: string; offset: string };
  };
}>();
/* states */
const previousScrollTop = ref(0);
const isLoading = ref(false);

/* DOM refs */
const componentContainer = ref<HTMLElement | null>(null);
const slotContainer = ref<HTMLDivElement[]>([]);

/* data */
const elementHeight = ref(0);
const sliceCount = ref(1);
const loadedItems = ref(props.renderOnly?.items ?? []);

// reset scroll by 1px to trigger scroll event or reset to top
const resetScroll = (full?:boolean) =>{
  if (componentContainer.value) {
    if(full) {
      return componentContainer.value.scrollTop = 0;
    }
    return componentContainer.value.scrollTop = scrollsData().scrollTop - 1;
  }
}
// initialize slice count  based  initialQty or on the height of the first element
const initSliceCount = () => {
  nextTick(() => {
    // if initialQty is provided, set sliceCount to it and return
    if(props.settings?.initialQty){
       return sliceCount.value = props.settings?.initialQty;
    }
    // otherwise calculate sliceCount based on the height of the first element
    if (!slotContainer.value[0] || !componentContainer.value) {
      return;
    }
    // get the height of the first element
    const firstElement = slotContainer.value[0];
    elementHeight.value = firstElement.clientHeight;
    sliceCount.value =
      Math.ceil(componentContainer.value?.clientHeight! / elementHeight.value) +
      1; // +1 to avoid empty space at the bottom
  });
};
/* scroll data */
const scrollsData = () => {
  return {
    scrollTop: componentContainer.value!.scrollTop,
    scrollHeight: componentContainer.value!.scrollHeight,
    clientHeight: componentContainer.value!.clientHeight,
  };
};
/* scroll event */
const onScroll = () => {
  if (!componentContainer.value) {
    return;
  }
  const { scrollTop, scrollHeight, clientHeight } = scrollsData();

  // Check if scrolling upwards
  if (scrollTop < previousScrollTop.value) {
    previousScrollTop.value = scrollTop;
    return;
  }
  previousScrollTop.value = scrollTop;

  if (!(scrollTop + clientHeight >= scrollHeight - 10)) {
    return;
  }

  return scroll(props.settings?.loadPerScroll ?? 1);

};
/* scroll handling */
const scroll = async (qty: number) => {
  if (!props.api?.requestUrl) {
     sliceCount.value += qty;
     return resetScroll();
  }
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  await getDataFromApi(qty);
  sliceCount.value += qty;
  isLoading.value = false;
  return resetScroll();
};
/* function reserved for api calls when api prop (api mode) has been chosen */
const getDataFromApi = async (qty: number, offset?: number) => {
  return await getFromApi(
      {
        api:props.api,
        loadedItems:loadedItems
      },
      {
        qty,
        offset
      }
  );
}

onMounted(async () => {
  /* reset scroll */
  resetScroll(true);
  /* if api is provided, load initial data */
  if (props.api) {
    const qty = props.settings?.initialQty ?? 0;
    isLoading.value = true;
    await getDataFromApi(qty, 0).then(() => (sliceCount.value += qty));
    return isLoading.value = false;
  } else initSliceCount(); // if no api, calculate initial slice count
});
</script>
