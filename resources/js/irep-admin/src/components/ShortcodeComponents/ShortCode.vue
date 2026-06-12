<script setup lang="ts">
import ajaxAxios from "@/src/utils/axios";
import { ShortcodeData } from "@/types/components";

import { onMounted, ref } from "vue";
import Loading from "../UiComponents/common/Loading.vue";
import { Project } from "ire-preview";
import { setQuery } from "@/src/composables/helpers";

const props = defineProps<{
  projectId: string;
}>();

const shortcodeData = ref<ShortcodeData>();
const loading = ref(false);
const ire_plugin = ref();

const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_get_shortcode_data",
      nonce: irePlugin.nonce,
      project_id: props?.projectId
    });

    if (data.success) {
      shortcodeData.value = data.data;
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const keys = ["flatId", "floorId", "projectId"];

  keys.forEach((key) => {
    setQuery(key, "");
  });

  fetchData();

  ire_plugin.value = irePlugin;
});
</script>

<template>
  <div>
    <div v-if="loading" class="relative h-full overflow-hidden pt-[50%]">
      <div class="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    </div>

    <Project v-else-if="shortcodeData" :data="shortcodeData" :irePlugin="irePlugin" />
  </div>
</template>
