<script setup lang="ts">
import { computed } from 'vue';

/**
 * UserAvatar Component
 * Renders user profile images, falling back to custom colored initials if missing.
 */
interface Props {
  avatarUrl?: string;
  fullName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: '',
  fullName: 'User',
  size: 'md',
});

// Compute initials
const initials = computed(() => {
  const parts = props.fullName.trim().split(/\s+/);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

// Generate consistent background color based on name string
const avatarBgStyle = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.fullName.length; i++) {
    hash = props.fullName.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert to beautiful pastel HSL color
  const hue = Math.abs(hash % 360);
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 65%, 45%) 0%, hsl(${(hue + 40) % 360}, 65%, 35%) 100%)`,
  };
});
</script>

<template>
  <div :class="['user-avatar', `avatar-${size}`]">
    <!-- Custom Image Component -->
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="`${fullName}'s avatar`"
      class="avatar-image"
      loading="lazy"
    />
    <!-- Initials Fallback -->
    <div
      v-else
      class="avatar-fallback"
      :style="avatarBgStyle"
      aria-hidden="true"
    >
      {{ initials }}
    </div>
  </div>
</template>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(15, 61, 94, 0.08);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: var(--font-sans);
  font-weight: 700;
}

/* Size Tiers */
.avatar-sm {
  width: 32px;
  height: 32px;
}
.avatar-sm .avatar-fallback {
  font-size: 0.75rem;
}

.avatar-md {
  width: 48px;
  height: 48px;
}
.avatar-md .avatar-fallback {
  font-size: 1rem;
}

.avatar-lg {
  width: 80px;
  height: 80px;
}
.avatar-lg .avatar-fallback {
  font-size: 1.75rem;
}

.avatar-xl {
  width: 112px;
  height: 112px;
}
.avatar-xl .avatar-fallback {
  font-size: 2.5rem;
}
</style>
