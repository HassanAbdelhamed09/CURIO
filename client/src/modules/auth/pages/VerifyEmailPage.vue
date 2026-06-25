<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AuthCard from '../components/AuthCard.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import BaseAlert from '../../../components/ui/BaseAlert.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';

const route = useRoute();
const verifying = ref(true);
const success = ref(false);
const message = ref('');
const resending = ref(false);
const resendSuccess = ref(false);

const verifyToken = async () => {
  const token = route.query.token as string;
  if (!token) {
    verifying.value = false;
    success.value = false;
    message.value = 'Verification token is missing or invalid.';
    return;
  }

  // Simulate verification call
  setTimeout(() => {
    verifying.value = false;
    success.value = true;
    message.value = 'Your email address has been successfully verified! You can now access all premium features.';
  }, 2000);
};

const handleResend = () => {
  resending.value = true;
  resendSuccess.value = false;
  
  // Simulate resend dispatch
  setTimeout(() => {
    resending.value = false;
    resendSuccess.value = true;
  }, 1500);
};

onMounted(() => {
  verifyToken();
});
</script>

<template>
  <div class="verify-email-view">
    <AuthCard>
      <header class="auth-header">
        <h1 class="auth-title">Email Verification</h1>
        <p class="auth-subtitle">Securing your premium account experience</p>
      </header>

      <!-- 1. Verifying State -->
      <div v-if="verifying" class="verifying-state">
        <BaseLoader text="Verifying your token with our servers..." />
      </div>

      <!-- 2. Result State -->
      <div v-else class="result-state">
        <BaseAlert
          :type="success ? 'success' : 'error'"
          :message="message"
          class="result-alert"
        />

        <!-- Success CTA -->
        <router-link v-if="success" to="/auth/login" class="action-link">
          <BaseButton variant="primary" fullWidth>
            Continue to Login
          </BaseButton>
        </router-link>

        <!-- Expired/Error Resend Actions -->
        <div v-else class="error-actions">
          <BaseAlert
            v-if="resendSuccess"
            type="success"
            message="A new email verification link has been successfully dispatched."
          />
          
          <p class="error-explanation">
            Verification links expire after 24 hours. Click below to receive a new secure verification link.
          </p>
          
          <BaseButton
            variant="secondary"
            :loading="resending"
            @click="handleResend"
            fullWidth
            class="resend-cta"
          >
            Resend Verification Email
          </BaseButton>
          
          <router-link to="/auth/login" class="back-to-login">
            Back to Login
          </router-link>
        </div>
      </div>
    </AuthCard>
  </div>
</template>

<style scoped>
.verify-email-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.auth-header {
  margin-bottom: 28px;
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-h);
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-muted);
  margin: 0;
}

.verifying-state {
  padding: 20px 0;
}

.result-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-alert {
  margin-bottom: 8px;
}

.action-link {
  text-decoration: none;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-explanation {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 145%;
  margin: 0;
  text-align: left;
}

.resend-cta {
  margin-top: 8px;
}

.back-to-login {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  margin-top: 12px;
  align-self: center;
}

.back-to-login:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
