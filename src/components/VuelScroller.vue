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
const isLoading = ref(false);
const loadedItems = ref(props.renderOnly?.items ?? []);

/* dom refs */
const componentContainer = ref<HTMLElement | null>(null);
const slotContainer = ref<HTMLDivElement[]>([]);
/* data */
const elementHeight = ref(0);
const sliceCount = ref(1);

onMounted(() => {
  /* reset scroll */
  if (componentContainer.value) {
    componentContainer.value.scrollTop = 0;
  }
  /* if api is provided, load initial data */
  if (props.api) {
    const qty = props.settings?.initialQty ?? 0;
    return getDataFromApi(qty, 0).then(() => (sliceCount.value += qty));
  } else initSliceCount(); // if no api, calculate initial slice count
});

const initSliceCount = () => {
  nextTick(() => {
    if(props.settings?.initialQty){
       return sliceCount.value = props.settings?.initialQty;
    } // if initialQty is provided, set sliceCount to it and return

    // otherwise calculate sliceCount based on the height of the first element
    if (!slotContainer.value[0] || !componentContainer.value) {
      return;
    }
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
  if (!(scrollTop + clientHeight >= scrollHeight - 10)) {
    return;
  }

  return scroll(props.settings?.loadPerScroll ?? 1);

};
/* scroll handling */
const scroll = async (qty: number) => {
  if (!props.api?.requestUrl) {
    return (sliceCount.value += qty);
  }
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  await getDataFromApi(qty);
  sliceCount.value += qty;
  isLoading.value = false;
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
</script>
