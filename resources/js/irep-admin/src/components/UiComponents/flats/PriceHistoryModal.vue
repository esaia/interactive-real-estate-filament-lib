<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "@components/UiComponents/Modal.vue";
import Button from "@components/UiComponents/form/Button.vue";
import Input from "@components/UiComponents/form/Input.vue";
import ajaxAxios from "@/src/utils/axios";
import Delete from "../icons/Delete.vue";
import { showToast } from "@/src/composables/helpers";
import { useFlatsStore } from "@/src/stores/useFlats";

export type PriceHistoryEntry = { date: string; price: string; timestamp?: number };

/** One editable row: only price + when (datetime); `date` is derived on save from the chosen moment. */
type Row = { _id: string; price: string; recordedLocal: string };

const props = defineProps<{
  show: boolean;
  flatId: string;
  /** Refetch flats after save so Pinia has fresh `price_history` before closing. */
  projectId: number;
  initialEntries?: PriceHistoryEntry[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const flatStore = useFlatsStore();
const rows = ref<Row[]>([]);
const loading = ref(false);

/** Unix seconds → `datetime-local` value (browser local timezone). */
function tsToDatetimeLocal(ts: number): string {
  const d = new Date(ts * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Legacy row: only `date` (Y-m-d) → local midnight for that calendar day. */
function dateToDatetimeLocalStart(dateYmd: string): string {
  return `${dateYmd}T00:00`;
}

/** Calendar day Y-m-d in local time from an instant (used for API `date` field). */
function ymdFromMs(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function syncRowsFromProps() {
  const src = props.initialEntries?.length ? props.initialEntries : [];
  rows.value = src.map((e, i) => ({
    _id: `r-${i}-${e.date}-${e.price}-${e.timestamp ?? i}`,
    price: String(e.price),
    recordedLocal:
      e.timestamp != null && Number.isFinite(e.timestamp)
        ? tsToDatetimeLocal(e.timestamp)
        : dateToDatetimeLocalStart(e.date)
  }));
}

watch(
  () => props.show,
  (open) => {
    if (open) {
      syncRowsFromProps();
    }
  }
);

function addRow() {
  const nowSec = Math.floor(Date.now() / 1000);
  rows.value.push({
    _id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    price: "0.00",
    recordedLocal: tsToDatetimeLocal(nowSec)
  });
}

function removeRow(index: number) {
  rows.value.splice(index, 1);
}

async function save() {
  if (!props.flatId) {
    return;
  }

  const entries: { date: string; price: string; timestamp: number }[] = [];

  for (const r of rows.value) {
    if (!r.recordedLocal?.trim()) {
      showToast("error", "Each row needs a date and time.");
      return;
    }
    const ms = new Date(r.recordedLocal).getTime();
    if (Number.isNaN(ms)) {
      showToast("error", "Invalid date and time on one of the rows.");
      return;
    }
    const ts = Math.floor(ms / 1000);
    entries.push({
      date: ymdFromMs(ms),
      price: r.price,
      timestamp: ts
    });
  }

  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.set("action", "irepc_save_flat_price_history");
    params.set("nonce", irePlugin.nonce);
    params.set("flat_id", props.flatId);
    params.set("entries", JSON.stringify(entries));

    const { data } = await ajaxAxios.post("", params);

    if (data.success) {
      if (props.projectId) {
        await flatStore.fetchProjectFlats(props.projectId);
      }
      showToast("success", "Price history saved");
      emit("saved");
      emit("close");
    } else {
      showToast("error", typeof data.data === "string" ? data.data : "Could not save price history");
    }
  } catch {
    showToast("error", "Could not save price history");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="show" type="2" width="w-[560px]" @close="$emit('close')">
        <div class="flex max-h-[85vh] flex-col rounded-md border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 bg-white p-3 text-center">
            <h2 class="!text-lg">Price history — flat {{ flatId }}</h2>
          </div>

          <div class="flex flex-col gap-3 overflow-y-auto p-4">
            <p class="text-sm text-gray-500">
              Pick one date and time per change (your local time). Edit price or remove rows as needed.
            </p>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[400px] border-collapse text-left text-sm">
                <thead>
                  <tr class="border-b border-gray-200 text-gray-600">
                    <th class="min-w-[220px] py-2 pr-2 font-medium">Date and time</th>
                    <th class="py-2 pr-2 font-medium">Price (gross)</th>
                    <th class="w-10 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <div class="mb-1 mt-2">Entry:</div>

                  <tr
                    v-for="(row, index) in rows"
                    :key="row._id"
                    class="border-b border-gray-200 align-top"
                    :class="{ 'bg-[#ffffd4]': index === 0 }"
                  >
                    <td class="py-2 pr-2">
                      <Input v-model="row.recordedLocal" type="datetime-local" label="" class="h-[32px]" />
                    </td>
                    <td class="py-2 pr-2">
                      <Input v-model="row.price" type="number" is-float label="" placeholder="0.00" />
                    </td>
                    <td class="py-2 pr-0">
                      <button
                        type="button"
                        class="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                        title="Remove row"
                        @click="removeRow(index)"
                      >
                        <Delete class="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <Button type="button" outlined title="Add row" @click="addRow" />
            </div>

            <div class="mt-2 flex gap-2 border-t border-gray-200 pt-4">
              <Button type="button" outlined title="Cancel" :disabled="loading" @click="$emit('close')" />
              <Button type="button" title="Save history" :loading="loading" @click="save" />
            </div>
          </div>
        </div>
      </Modal>
    </Transition>
  </teleport>
</template>
