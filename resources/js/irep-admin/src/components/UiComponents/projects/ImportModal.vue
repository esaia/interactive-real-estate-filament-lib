<script setup lang="ts">
import ajaxAxios from "@/src/utils/axios";
import { ref } from "vue";
import Button from "../form/Button.vue";
import { showToast } from "@/src/composables/helpers";
import { useProjectStore } from "@/src/stores/useProject";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const projectStore = useProjectStore();

const loading = ref(false);
const fileRef = ref();
const selectedFile = ref<File | null>(null);

const importProject = async () => {
  if (loading.value) return;

  if (!selectedFile.value) {
    showToast("error", "Please upload a .zip file!");
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("action", "irep_import");
  formData.append("nonce", irePlugin.nonce);

  const { data } = await ajaxAxios.post("", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  loading.value = false;

  if (data.success) {
    showToast("success", "Project imported successfully!");
    await projectStore.fetchProjects(null);
    emit("close");
  } else {
    showToast("error", data?.data ? data?.data : "Upgrade plan!");
  }
};

const handleFileChange = (event: any) => {
  const file = event.target?.files?.[0];

  if (file && file.name.endsWith(".zip")) {
    selectedFile.value = file;
  } else {
    showToast("error", "Please select a valid .zip file.");
    selectedFile.value = null;
    fileRef.value.value = null;
  }
};
</script>
<template>
  <div>
    <label>
      <p>Import project</p>
      <input ref="fileRef" type="file" name="project" accept=".zip" @change="handleFileChange" />
    </label>

    <p class="mt-4 max-w-[300px]">Images are bundled inside the ZIP and will be imported automatically.</p>

    <Button title="Import" :outlined="true" :loading="loading" :disabled="loading" @click="importProject" class="mt-4" />
  </div>
</template>
