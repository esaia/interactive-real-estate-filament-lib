<script setup lang="ts">
import { ref, computed, watch } from "vue";

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const props = defineProps<{
  modelValue: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  defaultColor?: string;
}>();

// ── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function parseColor(val: string): { hex: string; alpha: number } {
  if (!val) return { hex: props.defaultColor || "#000000", alpha: 1 };
  // rgba(r, g, b, a)
  const rgba = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) {
    const hex = rgbToHex(+rgba[1], +rgba[2], +rgba[3]);
    const alpha = rgba[4] !== undefined ? parseFloat(rgba[4]) : 1;
    return { hex, alpha: Math.round(alpha * 100) / 100 };
  }
  // hex
  let h = val.trim();
  if (/^[0-9a-fA-F]{6}$/.test(h)) h = "#" + h;
  if (/^#[0-9a-fA-F]{3}$/.test(h)) h = "#" + h[1]+h[1]+h[2]+h[2]+h[3]+h[3];
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return { hex: h, alpha: 1 };
  return { hex: props.defaultColor || "#000000", alpha: 1 };
}

function buildOutput(hex: string, alpha: number): string {
  const norm = normalizeHex(hex);
  if (alpha >= 1) return norm;
  const [r, g, b] = hexToRgb(norm);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeHex(val: string): string {
  const raw = val.trim();
  if (!raw) return props.defaultColor || "#000000";
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) return "#" + raw[1]+raw[1]+raw[2]+raw[2]+raw[3]+raw[3];
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw;
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return "#" + raw;
  return raw;
}

// ── State ─────────────────────────────────────────────────────────────────────
const parsed = parseColor(props.modelValue);
const hexInput = ref(parsed.hex);
const alpha = ref(parsed.alpha);
const colorInputRef = ref<HTMLInputElement | null>(null);

// swatch background handles alpha visually
const swatchBg = computed(() => buildOutput(hexInput.value, alpha.value));
// alpha track gradient
const alphaTrackBg = computed(() => {
  const norm = normalizeHex(hexInput.value);
  const [r, g, b] = hexToRgb(norm);
  return `linear-gradient(to right, rgba(${r},${g},${b},0), rgb(${r},${g},${b}))`;
});

// ── Events ────────────────────────────────────────────────────────────────────
function emitCurrent() {
  emit("update:modelValue", buildOutput(hexInput.value, alpha.value));
}

function onSwatchClick() {
  if (props.disabled) return;
  colorInputRef.value?.click();
}

function onNativeChange(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  hexInput.value = val;
  emitCurrent();
}

function onTextInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  hexInput.value = val;
  const norm = normalizeHex(val);
  if (/^#[0-9a-fA-F]{6}$/.test(norm)) {
    hexInput.value = norm;
    emitCurrent();
  }
}

function onTextBlur() {
  hexInput.value = normalizeHex(hexInput.value);
  emitCurrent();
}

function onAlphaChange(e: Event) {
  alpha.value = Math.round(+(e.target as HTMLInputElement).value) / 100;
  emitCurrent();
}

function onReset() {
  const d = parseColor(props.defaultColor || "#000000");
  hexInput.value = d.hex;
  alpha.value = d.alpha;
  emitCurrent();
}

const alphaPercent = computed(() => Math.round(alpha.value * 100));
const isChanged = computed(() => {
  if (!props.defaultColor) return false;
  return buildOutput(hexInput.value, alpha.value) !== buildOutput(...(() => { const p = parseColor(props.defaultColor); return [p.hex, p.alpha] as [string, number]; })());
});

// ── Sync from outside ─────────────────────────────────────────────────────────
watch(() => props.modelValue, (val) => {
  const p = parseColor(val);
  if (p.hex !== hexInput.value) hexInput.value = p.hex;
  if (p.alpha !== alpha.value) alpha.value = p.alpha;
});
</script>

<template>
  <div class="cp-wrap">
    <p v-if="label" class="cp-label">
      {{ label }}<span v-if="required" class="cp-req">*</span>
    </p>

    <!-- Disabled -->
    <div v-if="disabled" class="cp-disabled" :style="{ background: modelValue || defaultColor }" />

    <!-- Active -->
    <div v-else class="cp-body">
      <!-- Row 1: swatch + hex + reset -->
      <div class="cp-row">
        <button type="button" class="cp-swatch" :style="{ background: swatchBg }" @click="onSwatchClick" title="Pick colour">
          <input ref="colorInputRef" type="color" class="cp-native" :value="normalizeHex(hexInput)" @input="onNativeChange" />
        </button>

        <input
          type="text"
          class="cp-text"
          :value="hexInput"
          spellcheck="false"
          maxlength="7"
          @input="onTextInput"
          @blur="onTextBlur"
        />

        <button v-if="isChanged" type="button" class="cp-reset" title="Reset to default" @click="onReset">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M10 2.5A4.5 4.5 0 1 0 11 6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 1v2h-2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Row 2: opacity slider -->
      <div class="cp-alpha-row">
        <div class="cp-alpha-slider-wrap">
          <div class="cp-alpha-track">
            <div class="cp-alpha-checker" />
            <div class="cp-alpha-gradient" :style="{ background: alphaTrackBg }" />
          </div>
          <input
            type="range"
            class="cp-alpha-range"
            min="0"
            max="100"
            step="1"
            :value="alphaPercent"
            @input="onAlphaChange"
          />
        </div>
        <span class="cp-alpha-badge">{{ alphaPercent }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp-wrap { display: flex; flex-direction: column; gap: 5px; }

.cp-label {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  margin: 0;
}
.cp-req { color: #ef4444; margin-left: 2px; }

.cp-disabled {
  width: 32px; height: 32px;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,0.1);
}

.cp-body { display: flex; flex-direction: column; gap: 6px; }

.cp-row { display: flex; align-items: center; gap: 6px; }

/* ── Swatch ── */
.cp-swatch {
  position: relative;
  width: 30px; height: 30px;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,0.15);
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0;
  /* checkerboard base */
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  transition: box-shadow 120ms;
}
.cp-swatch:hover { box-shadow: 0 0 0 2px rgba(99,102,241,0.4); }

.cp-native {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  opacity: 0; cursor: pointer;
  border: none; padding: 0;
}

/* ── Hex text ── */
.cp-text {
  flex: 1; min-width: 0; height: 30px;
  padding: 0 7px;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #374151;
  background: #fff;
  outline: none;
  transition: border-color 120ms;
}
.cp-text:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }

.cp-alpha-badge {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: #9ca3af;
  flex-shrink: 0;
  min-width: 30px;
  text-align: right;
}

.cp-reset {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  border-radius: 4px; border: none;
  background: none; color: #9ca3af;
  cursor: pointer; flex-shrink: 0;
  transition: color 120ms, background 120ms;
}
.cp-reset:hover { color: #6366f1; background: #eef2ff; }
.cp-reset svg { width: 11px; height: 11px; }

/* ── Alpha slider ── */
.cp-alpha-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cp-alpha-slider-wrap {
  flex: 1;
  position: relative;
  height: 18px;
  display: flex;
  align-items: center;
}

/* visual track — clipped, purely decorative */
.cp-alpha-track {
  position: absolute;
  left: 0; right: 0;
  top: 50%; transform: translateY(-50%);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
}

.cp-alpha-checker,
.cp-alpha-gradient {
  position: absolute;
  inset: 0;
}

.cp-alpha-checker {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #d1d5db 25%, transparent 25%),
    linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d1d5db 75%),
    linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
  background-size: 6px 6px;
  background-position: 0 0, 0 3px, 3px -3px, -3px 0;
}

/* range input sits on top, full height of wrapper, transparent track */
.cp-alpha-range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
}

/* webkit track — transparent so our visual track shows through */
.cp-alpha-range::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: transparent;
}

/* webkit thumb */
.cp-alpha-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid rgba(0,0,0,0.2);
  box-shadow: 0 1px 4px rgba(0,0,0,0.22), 0 0 0 1.5px rgba(255,255,255,0.8) inset;
  cursor: pointer;
  margin-top: -4px; /* (16 - 8) / 2 */
  transition: box-shadow 120ms, transform 100ms;
}
.cp-alpha-range::-webkit-slider-thumb:hover {
  box-shadow: 0 1px 6px rgba(0,0,0,0.28), 0 0 0 3px rgba(99,102,241,0.2);
  transform: scale(1.1);
}
.cp-alpha-range:active::-webkit-slider-thumb {
  transform: scale(0.95);
}

/* firefox track */
.cp-alpha-range::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: transparent;
}

/* firefox thumb */
.cp-alpha-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid rgba(0,0,0,0.2);
  box-shadow: 0 1px 4px rgba(0,0,0,0.22);
  cursor: pointer;
}

.cp-alpha-badge {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: #9ca3af;
  flex-shrink: 0;
  min-width: 32px;
  text-align: right;
}
</style>
