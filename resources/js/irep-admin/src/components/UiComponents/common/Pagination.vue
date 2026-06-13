<script setup lang="ts">
import { computed } from "vue";
import { VueAwesomePaginate } from "vue-awesome-paginate";
import ArrowRight from "../icons/ArrowRight.vue";

const emit = defineEmits<{
    (e: "update:modelValue", params: typeof props.modelValue): void;
}>();

const props = defineProps<{
    modelValue: number;
    totalItems: number;
    perPage: number;
}>();

const inputModel = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
    },
});
</script>

<template>
    <div
        v-if="totalItems > perPage"
        class="flex w-full items-center justify-between py-5"
    >
        <p class="text-sm">
            {{ (inputModel - 1) * perPage }} to {{ perPage * inputModel }} of
            {{ totalItems }} entries
        </p>

        <VueAwesomePaginate
            :total-items="totalItems"
            :items-per-page="perPage"
            :max-pages-shown="5"
            v-model="inputModel"
        >
            <template #prev-button>
                <div
                    class="flex h-full rotate-180 items-center justify-center [&_svg]:h-4 [&_svg]:w-4"
                >
                    <ArrowRight />
                </div>
            </template>

            <template #next-button>
                <div
                    class="flex items-center justify-center [&_svg]:h-4 [&_svg]:w-4"
                >
                    <ArrowRight />
                </div>
            </template>
        </VueAwesomePaginate>
    </div>
</template>

<style>
/* ── Layout ── */
.pagination-container {
    display: flex;
    border: 1px solid #e5e7eb;
    height: 32px;
    border-radius: 6px;
    overflow: hidden;
    background-color: #ffffff;
}

.paginate-buttons {
    height: 30px;
    width: 30px;
    cursor: pointer;
    color: #6b7280;
    background-color: #ffffff;
}

.paginate-buttons:hover,
.paginate-buttons:hover svg path {
    background-color: #f3f4f6;
    color: #111827;
    fill: #111827;
    overflow: hidden;
}

.active-page {
    background-color: #2563eb;
    color: white;
}
</style>
