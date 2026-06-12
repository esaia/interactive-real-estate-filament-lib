<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Table from "../components/UiComponents/common/table/Table.vue";
import TableTh from "../components/UiComponents/common/table/TableTh.vue";
import Pagination from "../components/UiComponents/common/Pagination.vue";
import ajaxAxios from "../utils/axios";
import Input from "../components/UiComponents/form/Input.vue";
import Modal from "../components/UiComponents/Modal.vue";
import DeleteModal from "../components/UiComponents/common/DeleteModal.vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "../stores/useProject";
import LicensePlanBadge from "../components/UiComponents/common/LicensePlanBadge.vue";

const projectStore = useProjectStore();
const { is_gold } = storeToRefs(projectStore);

const searchRecord = ref("");
const records = ref<any>();
const sortField = ref("created_at");
const sortOrder = ref<"ASC" | "DESC" | "">("DESC");
const currentPage = ref(1);
const perPage = ref(20);
const loading = ref(false);

const activeRecord = ref();
const showDeleteModal = ref(false);
const showRecord = ref(false);
const deleteRecordId = ref();

const sort = (field: string, sortOrderString: "ASC" | "DESC" | "") => {
  sortField.value = field;
  sortOrder.value = sortOrderString;

  fetchRecords();
};

const fetchRecords = async () => {
  try {
    loading.value = true;

    const { data } = await ajaxAxios.post("", {
      action: "irep_get_reservations",
      nonce: irePlugin.nonce,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
      page: currentPage.value,
      per_page: perPage.value,
      search: searchRecord.value
    });

    if (!data.success) {
      records.value = { data: [] } as any;
      return;
    }

    records.value = data.data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const submitForm = () => {
  currentPage.value = 1;
  fetchRecords();
};

const showDeleteRecordModal = (item: any) => {
  if (!item) return;
  deleteRecordId.value = Number(item.id);
  showDeleteModal.value = true;
};

const showEditRecordModal = (item: any) => {
  activeRecord.value = item;
  showRecord.value = true;
};

const handleDeleteRecord = async () => {
  await ajaxAxios.post("", {
    action: "irep_delete_reservation",
    nonce: irePlugin.nonce,
    record_id: deleteRecordId.value
  });
  showDeleteModal.value = false;
  fetchRecords();
};

const closeShowRecordModal = () => {
  showRecord.value = false;
};

watch(
  () => currentPage.value,
  () => {
    fetchRecords();
  }
);

onMounted(() => {
  fetchRecords();
});
</script>
<template>
  <div class="p-4 pl-0">
    <div class="mb-4">Responses</div>

    <div v-if="is_gold" class="space-y-3">
      <Input v-model="searchRecord" placeholder="Filter flats list..." @keyup.enter="submitForm" />

      <Table
        :data="records?.data"
        hideDuplicateAction
        @edit-action="(item: any) => showEditRecordModal(item)"
        @delete-action="(item: any) => showDeleteRecordModal(item)"
      >
        <template #header>
          <TableTh
            fieldTitle="created_at"
            field="created_at"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />
          <TableTh
            fieldTitle="id"
            field="id"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh fieldTitle="Flat" field="flat_name" :sortable="false" />

          <TableTh fieldTitle="Project" field="project_name" :sortable="false" />

          <TableTh
            fieldTitle="Name"
            field="name"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="Phone"
            field="phone"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="Email"
            field="email"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />
        </template>

        <template #default="item">
          <td>
            {{
              item.slotProps?.created_at
                ? new Date(item.slotProps.created_at)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false
                    })
                    .replace(",", "")
                : "—"
            }}
          </td>
          <td>{{ item.slotProps?.id }}</td>
          <td>{{ item.slotProps?.flat_name || "—" }}</td>
          <td>
            <div>{{ item.slotProps?.project_name || "—" }}</div>
            <div
              v-if="item.slotProps?.project_id != null && Number(item.slotProps.project_id) > 0"
              class="text-sm text-gray-400"
            >
              ID: {{ item.slotProps.project_id }}
            </div>
          </td>
          <td>{{ item.slotProps?.name }}</td>
          <td>{{ item.slotProps?.phone }}</td>
          <td>{{ item.slotProps?.email }}</td>
        </template>
      </Table>

      <pagination :totalItems="Number(records?.total)" :perPage="perPage" v-model="currentPage" />
    </div>

    <div
      v-else
      class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-6"
    >
      <div class="mb-3 flex items-center justify-between">
        <LicensePlanBadge plan="gold" />
        <span class="text-xl" aria-hidden="true">🔒</span>
      </div>
      <p class="mb-1 text-sm font-semibold text-gray-900">Reservation Responses requires Gold.</p>
      <p class="text-xs text-gray-500">
        Upgrade to view, search, and manage reservation form submissions from your flats.
      </p>
    </div>
  </div>

  <teleport to="#irep-vue-app-responses">
    <Transition name="fade">
      <Modal :show="showRecord" type="2" width="w-[480px]" @close="closeShowRecordModal">
        <div class="flex flex-col gap-6">
          <!-- Header -->
          <div class="border-b border-gray-200 pb-4">
            <div class="text-xs font-medium uppercase tracking-widest text-gray-500">
              Response #{{ activeRecord?.id }}
            </div>
            <div class="mt-1 text-lg font-semibold text-gray-800">{{ activeRecord?.name || "—" }}</div>
            <div class="mt-1 text-xs text-gray-500">
              {{
                activeRecord?.created_at
                  ? new Date(activeRecord.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })
                  : "—"
              }}
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Contact</div>
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-white p-3">
                <div class="text-xs text-gray-500">Email</div>
                <div class="mt-0.5 truncate text-sm font-medium text-gray-800">{{ activeRecord?.email || "—" }}</div>
              </div>
              <div class="rounded-lg bg-white p-3">
                <div class="text-xs text-gray-500">Phone</div>
                <div class="mt-0.5 text-sm font-medium text-gray-800">{{ activeRecord?.phone || "—" }}</div>
              </div>
            </div>
            <div v-if="activeRecord?.comment" class="mt-3 rounded-lg bg-white p-3">
              <div class="text-xs text-gray-500">Comment</div>
              <div class="mt-0.5 text-sm text-gray-600">{{ activeRecord.comment }}</div>
            </div>
          </div>

          <!-- Property Info -->
          <div>
            <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Property</div>
            <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
              <!-- Project row -->
              <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span class="text-xs text-gray-500">Project</span>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-800">{{ activeRecord?.project_name || "—" }}</div>
                  <div
                    v-if="activeRecord?.project_id && Number(activeRecord.project_id) > 0"
                    class="text-xs text-gray-500"
                  >
                    ID {{ activeRecord.project_id }}
                  </div>
                </div>
              </div>
              <!-- Flat row -->
              <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span class="text-xs text-gray-500">Flat</span>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-800">{{ activeRecord?.flat_name || "—" }}</div>
                  <div v-if="activeRecord?.flat_id && activeRecord?.flat_id !== ''" class="text-xs text-gray-500">
                    ID {{ activeRecord.flat_id }}
                  </div>
                </div>
              </div>
              <!-- Floor row -->
              <div
                v-if="activeRecord?.floor_number"
                class="flex items-center justify-between border-b border-gray-100 px-4 py-3"
              >
                <span class="text-xs text-gray-500">Floor</span>
                <span class="text-sm font-medium text-gray-800">{{ activeRecord.floor_number }}</span>
              </div>
              <!-- Config row -->
              <div
                v-if="activeRecord?.flat_conf"
                class="flex items-center justify-between border-b border-gray-100 px-4 py-3"
              >
                <span class="text-xs text-gray-500">Configuration</span>
                <span class="text-sm font-medium text-gray-800">{{ activeRecord.flat_conf }}</span>
              </div>
              <!-- Price row -->
              <div
                v-if="activeRecord?.flat_price != null"
                class="flex items-center justify-between border-b border-gray-100 px-4 py-3"
              >
                <span class="text-xs text-gray-500">Price</span>
                <div class="text-right">
                  <div v-if="activeRecord?.offer_price != null && Number(activeRecord.offer_price) > 0" class="text-xs text-gray-500 line-through">
                    {{ Number(activeRecord.flat_price).toLocaleString() }}
                  </div>
                  <div class="text-sm font-semibold text-gray-800">
                    {{ (activeRecord?.offer_price != null && Number(activeRecord.offer_price) > 0) ? Number(activeRecord.offer_price).toLocaleString() : Number(activeRecord.flat_price).toLocaleString() }}
                  </div>
                </div>
              </div>
              <!-- Status row -->
              <div class="flex items-center justify-between px-4 py-3">
                <span class="text-xs text-gray-500">Status</span>
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="activeRecord?.flat_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
                >
                  {{ activeRecord?.flat_active ? "Available" : "Inactive" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Transition>
  </teleport>

  <teleport to="#irep-vue-app-responses">
    <Transition name="fade">
      <modal :show="showDeleteModal" @close="showDeleteModal = false">
        <DeleteModal
          :text="`Are you sure you want to delete flat with id ${deleteRecordId || ''}?`"
          @delete-action="handleDeleteRecord()"
          @cancel-action="showDeleteModal = false"
        />
      </modal>
    </Transition>
  </teleport>
</template>
