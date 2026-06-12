<script setup lang="ts">
import { ref } from "vue";
import ProjectItem from "@components/UiComponents/projects/ProjectItem.vue";
import AddProjectModal from "@components/UiComponents/projects/AddProjectModal.vue";
import Modal from "@components/UiComponents/Modal.vue";
import Plus from "@components/UiComponents/icons/Plus.vue";
import { pushToPlansPage, showToast } from "../composables/helpers";
import LicensePlanBadge from "@components/UiComponents/common/LicensePlanBadge.vue";
import Import from "@components/UiComponents/icons/Import.vue";
import ImportModal from "@components/UiComponents/projects/ImportModal.vue";
import Button from "@components/UiComponents/form/Button.vue";
import AddFlatCustomFieldsModal from "@components/UiComponents/projects/AddFlatCustomFieldsModal.vue";
import AddTableFieldsModal from "../components/UiComponents/projects/AddTableFieldsModal.vue";

defineProps<{
  projects: any;
}>();

const addProjectModal = ref(false);
const importModal = ref(false);
const flatCustomFieldsModal = ref(false);
const tableFieldsModal = ref(false);

const handleImportClick = () => {
  if (irePlugin.is_premium) {
    importModal.value = true;
  } else {
    showToast("error", "Upgrade plan!");
  }
};
</script>

<template>
  <div class="container-fluid py-3">
    <div class="flex items-center justify-between gap-10">
      <h2 class="!my-4 !text-2xl">Projects</h2>

      <div class="flex items-center gap-5">
        <Button title="Add table fields" class="min-w-max" @click="tableFieldsModal = true" />
        <Button title="Add Flat custom fields" class="min-w-max" @click="flatCustomFieldsModal = true" />
        <div
          class="ire-cursor-pointer inline-flex items-center rounded bg-gray-100 px-4 py-2 font-bold text-gray-800 hover:bg-gray-200"
          @click="handleImportClick"
        >
          <Import class="mr-2 h-4 w-4" />
          <span>import</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 lg:grid-cols-4">
      <div
        v-if="!irePlugin.is_premium && projects?.length >= 1"
        class="relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4"
        @click="pushToPlansPage()"
      >
        <div class="mb-3 flex items-center justify-between">
          <LicensePlanBadge plan="premium" />
          <span class="text-xl" aria-hidden="true">🔒</span>
        </div>
        <p class="mb-1 text-sm font-semibold text-gray-900">Add more projects with Premium.</p>
        <p class="text-xs text-gray-500">Upgrade to create unlimited projects.</p>
      </div>

      <div
        v-else
        class="flex h-60 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 text-gray-900 transition-all duration-200 hover:bg-gray-100"
        @click="addProjectModal = true"
      >
        <Plus />
        <p class="!text-lg">New Project</p>
      </div>

      <ProjectItem v-for="project in projects" :key="project.id" :project="project"> </ProjectItem>
    </div>

    <teleport to="#irep-vue-app">
      <transition name="fade-in-out">
        <Modal :show="addProjectModal" @close="addProjectModal = false">
          <AddProjectModal @close="addProjectModal = false" />
        </Modal>
      </transition>
    </teleport>

    <teleport to="#irep-vue-app">
      <transition name="fade-in-out">
        <Modal :show="importModal" @close="importModal = false">
          <ImportModal @close="importModal = false" />
        </Modal>
      </transition>
    </teleport>

    <teleport to="#irep-vue-app">
      <transition name="fade-in-out">
        <Modal :show="flatCustomFieldsModal" @close="flatCustomFieldsModal = false">
          <AddFlatCustomFieldsModal @close="flatCustomFieldsModal = false" />
        </Modal>
      </transition>
    </teleport>

    <teleport to="#irep-vue-app">
      <transition name="fade-in-out">
        <Modal :show="tableFieldsModal" @close="tableFieldsModal = false">
          <AddTableFieldsModal @close="tableFieldsModal = false" />
        </Modal>
      </transition>
    </teleport>
  </div>
</template>
