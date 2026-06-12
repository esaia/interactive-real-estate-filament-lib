<script setup lang="ts">
import Delete from "../../icons/Delete.vue";
import Duplicate from "../../icons/Duplicate.vue";
import Edit from "../../icons/Edit.vue";

defineEmits<{
  (e: "editAction", item: (typeof props.data)[0]): void;
  (e: "duplicateAction", item: (typeof props.data)[0]): void;
  (e: "deleteAction", item: (typeof props.data)[0]): void;
}>();

const props = defineProps<{ data: any; hideDuplicateAction?: boolean }>();
</script>

<template>
  <div class="overflow-hidden rounded-md border border-gray-200">
    <table class="w-full overflow-hidden text-left text-sm text-gray-900 rtl:text-right">
      <thead
        class="bg-white text-xs capitalize text-gray-500 [&_th]:border [&_th]:border-r-0 [&_th]:border-t-0 [&_th]:border-gray-200 [&_th]:px-2 [&_th]:py-2 first-of-type:[&_th]:border-l-0"
      >
        <tr>
          <th scope="col" class="w-20">
            <p>Actions</p>
          </th>

          <slot name="header" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          class="bg-gray-50 hover:bg-gray-100 [&_td]:border [&_td]:border-b-0 [&_td]:border-r-0 [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1 first-of-type:[&_td]:border-l-0"
        >
          <td class="w-20 items-center text-right">
            <div class="flex">
              <div
                class="table-list-actions group"
                title="edit"
                @click="$emit('editAction', item)"
              >
                <Edit />
              </div>

              <div
                v-if="!hideDuplicateAction"
                class="table-list-actions group"
                title="duplicate"
                @click="$emit('duplicateAction', item)"
              >
                <Duplicate />
              </div>

              <div
                class="table-list-actions group"
                title="delete"
                @click="$emit('deleteAction', item)"
              >
                <Delete />
              </div>
            </div>
          </td>

          <slot :slotProps="item" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.table-list-actions {
  @apply bg-white h-fit cursor-pointer border border-r-0 border-gray-300 p-1 transition-all first:rounded-l-sm last-of-type:rounded-r-sm last-of-type:border-r [&_path]:fill-gray-400 [&_svg]:h-4 [&_svg]:w-4 hover:bg-gray-100 group-hover:[&_path]:fill-gray-700;
}
</style>
