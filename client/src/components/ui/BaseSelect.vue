<script setup lang="ts">
/**
 * BaseSelect Component
 * A premium, fully customizable, reusable select/dropdown component.
 * Integrates with standard Vue v-model bindings and CURIO design system.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDown } from '@lucide/vue';

interface Option {
  label: string;
  value: any;
}

interface Props {
  modelValue: any;
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  error: '',
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const match = props.options.find(opt => opt.value === props.modelValue);
  return match ? match.label : '';
});

const hasSelection = computed(() => {
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '';
});

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="base-select-group" ref="selectRef" :class="{ 'select-disabled': disabled }">
    <!-- Dropdown Label -->
    <label v-if="label" class="select-label">
      {{ label }}
      <span v-if="required" class="required-indicator" aria-hidden="true">*</span>
    </label>

    <div class="select-relative-wrap">
      <!-- Selector Trigger Button -->
      <button
        type="button"
        class="select-trigger"
        :class="{ 'select-trigger-open': isOpen, 'select-has-error': !!error }"
        :disabled="disabled"
        @click="toggleDropdown"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
      >
        <span class="selected-text" :class="{ 'placeholder-active': !hasSelection }">
          {{ selectedLabel || placeholder }}
        </span>
        <ChevronDown class="chevron-icon" :class="{ 'chevron-rotated': isOpen }" aria-hidden="true" />
      </button>

      <!-- Dropdown Items Overlay Panel -->
      <Transition name="fade-slide">
        <ul v-if="isOpen" class="options-panel" role="listbox">
          <li
            v-for="option in options"
            :key="option.value"
            class="option-item"
            :class="{ 'option-item-selected': option.value === modelValue }"
            role="option"
            :aria-selected="option.value === modelValue"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </Transition>
    </div>

    <!-- Error Messaging -->
    <p v-if="error" class="select-error-msg" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.base-select-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  text-align: left;
}

.select-label {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
}

.required-indicator {
  color: var(--color-danger, #ef4444);
  margin-left: 2px;
}

.select-relative-wrap {
  position: relative;
  width: 100%;
}

.select-trigger {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md, 12px);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s var(--ease-out, ease);
  box-sizing: border-box;
}

.select-trigger:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(23, 20, 63, 0.08);
}

.select-trigger-open {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(23, 20, 63, 0.08);
}

.select-has-error {
  border-color: var(--color-danger, #e5484d) !important;
}

.selected-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.placeholder-active {
  color: var(--color-muted);
  opacity: 0.7;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: var(--color-muted);
  transition: transform 0.2s var(--ease-out, ease);
  flex-shrink: 0;
  margin-left: 8px;
}

.chevron-rotated {
  transform: rotate(180deg);
}

.options-panel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 100%;
  width: max-content;
  max-width: 320px;
  max-height: 240px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 10px);
  box-shadow: 0 12px 30px rgba(16, 16, 24, 0.08);
  overflow-y: auto;
  z-index: 100;
  padding: 6px 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
}

.option-item {
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s var(--ease-out, ease);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.option-item:hover {
  background-color: var(--color-bg-alt);
  color: var(--color-primary);
}

.option-item-selected {
  background-color: rgba(99, 102, 241, 0.08);
  color: var(--color-primary);
  font-weight: 700;
}

.select-error-msg {
  font-size: 0.8rem;
  color: var(--color-danger, #e5484d);
  font-weight: 500;
  margin: 0;
}

/* Disabled state */
.select-disabled {
  opacity: 0.6;
}

.select-trigger:disabled {
  background-color: var(--color-bg-alt);
  cursor: not-allowed;
}

/* Fade Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
