<script setup lang="ts">
import { ref } from 'vue';
import UserAvatar from '../../../components/shared/UserAvatar.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';

/**
 * AvatarUploader Component
 * Provides a highly polished interface for profile picture customization.
 */
interface Props {
  avatarUrl?: string;
  fullName?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'upload', file: File): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadLoading = ref(false);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    uploadLoading.value = true;
    
    // Simulate upload delay
    setTimeout(() => {
      uploadLoading.value = false;
      emit('upload', file);
    }, 1500);
  }
};
</script>

<template>
  <div class="avatar-uploader">
    <!-- Big Avatar Preview -->
    <UserAvatar
      :avatarUrl="avatarUrl"
      :fullName="fullName"
      size="xl"
      class="uploader-avatar-preview"
    />

    <!-- Control Buttons -->
    <div class="uploader-controls">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="sr-only"
        @change="handleFileChange"
      />
      
      <BaseButton
        variant="secondary"
        size="sm"
        :loading="uploadLoading"
        @click="triggerFileInput"
      >
        Change Picture
      </BaseButton>
      
      <p class="uploader-specs">
        JPG, PNG or WEBP. Max 2MB.
      </p>
    </div>
  </div>
</template>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  box-sizing: border-box;
}

.uploader-avatar-preview {
  border: 4px solid var(--color-surface);
  box-shadow: 0 4px 20px rgba(15, 61, 94, 0.15) !important;
}

.uploader-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.uploader-specs {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--color-muted);
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
