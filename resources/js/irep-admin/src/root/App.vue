<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProjectStore } from "../stores/useProject";
import { storeToRefs } from "pinia";
import Project from "../pages/Project.vue";
import Loading from "../components/UiComponents/common/Loading.vue";
import Projects from "../pages/Projects.vue";
const projectStore = useProjectStore();

const { projects, project } = storeToRefs(projectStore);

const urlParams = new URLSearchParams(window.location.search);
const projectID = ref(urlParams.get("project"));
const loading = ref(true);

onMounted(async () => {
  loading.value = true;

  try {
    await projectStore.fetchProjects(projectID.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading" class="p-3">
      <Loading />
    </div>

    <div v-else>
      <template v-if="projectID">
        <Project v-if="project" />
        <div v-else>not found</div>
      </template>
      <Projects v-else :projects="projects" />
    </div>
  </div>
</template>
