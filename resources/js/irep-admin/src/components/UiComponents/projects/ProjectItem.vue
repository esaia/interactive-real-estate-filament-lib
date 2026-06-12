<script setup lang="ts">
import { ref } from "vue";
import DeleteModal from "@/src/components/UiComponents/common/DeleteModal.vue";
import Button from "@/src/components/UiComponents/form/Button.vue";
import Delete from "@/src/components/UiComponents/icons/Delete.vue";
import Modal from "@/src/components/UiComponents/Modal.vue";
import { ProjectInterface } from "@/types/components";
import ajaxAxios from "@/src/utils/axios";
import { showToast } from "@/src/composables/helpers";
import { useProjectStore } from "@/src/stores/useProject";

const props = defineProps<{
  project: ProjectInterface;
}>();

const projectStore = useProjectStore();

const showDeleteModal = ref(false);

const deleteFlat = async () => {
  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_delete_project",
      nonce: irePlugin.nonce,
      project_id: props.project?.id
    });

    if (data?.success) {
      showToast("success", "Project deleted successfully!");
      showDeleteModal.value = false;
      projectStore.fetchProjects(null);
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }
};

const exportProject = async (id: number) => {
  if (!id) {
    return showToast("error", "Something went wrong!");
  }

  try {
    const response = await ajaxAxios.post(
      "",
      { action: "irep_export_zip", nonce: irePlugin.nonce, project_id: id },
      { responseType: "blob" }
    );

    const url = URL.createObjectURL(new Blob([response.data], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `project_${id}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    showToast("error", "Export failed.");
  }
};

const onExportClick = () => {
  if (!irePlugin.is_premium) {
    showToast("error", "Upgrade plan!");
    return;
  }
  exportProject(+props.project?.id || 0);
};
</script>

<template>
  <div
    class="rounded-xl border border-gray-200 bg-gray-50 p-3 focus-within:shadow-md focus-within:ring-2 focus-within:ring-gray-300 hover:shadow-md hover:shadow-gray-200/40"
  >
    <a
      :href="`${irePlugin.plugin_url}?project=${project?.id}`"
      class="group block overflow-hidden rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <div class="relative aspect-[2/1] w-full overflow-hidden">
        <img
          v-if="project.project_image?.length"
          :src="project.project_image[0]?.url"
          :alt="project.title"
          class="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02] group-hover:opacity-90"
        />
        <div v-else class="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
          No preview
        </div>
      </div>
    </a>

    <h3 class="line-clamp-2 py-2.5 text-base font-semibold leading-snug text-gray-900" :title="project.title">
      {{ project.title }}
    </h3>

    <div class="flex w-full items-stretch justify-between gap-2 sm:items-center sm:gap-3">
      <div class="flex min-w-0 flex-1 flex-wrap items-stretch gap-2 sm:gap-2.5">
        <div class="w-full min-w-0 sm:w-auto sm:shrink-0">
          <a :href="`${irePlugin.plugin_url}?project=${project?.id}`" class="block w-full sm:inline-block sm:w-auto">
            <Button title="View Project" />
          </a>
        </div>

        <div :class="!irePlugin?.is_premium ? 'opacity-60' : ''" class="inline-flex w-full min-w-0 sm:w-auto">
          <Button title="Export" :outlined="true" @click="onExportClick" />
        </div>
      </div>

      <button
        type="button"
        class="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-red-900/40 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
        aria-label="Delete project"
        @click.stop="showDeleteModal = true"
      >
        <Delete class="h-5 w-5" />
      </button>
    </div>
  </div>

  <Teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="showDeleteModal" @close="showDeleteModal = false">
        <DeleteModal
          :text="`Are you sure you want to delete project with id ${project?.id || ''}?`"
          @delete-action="deleteFlat()"
          @cancel-action="showDeleteModal = false"
        />
      </Modal>
    </Transition>
  </Teleport>
</template>
