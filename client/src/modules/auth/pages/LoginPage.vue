<script setup lang="ts">
import { useRouter } from 'vue-router';
import AuthCard from '../components/AuthCard.vue';
import LoginForm from '../components/LoginForm.vue';
import GoogleLoginButton from '../components/GoogleLoginButton.vue';
import { useAuthStore } from '../../../stores/auth.store.js';

const authStore = useAuthStore();
const router = useRouter();

const handleSuccess = () => {
  router.push({ name: 'profile' });
};

const handleGoogleSignIn = async () => {
  try {
    // Trigger Google Sign-In logic
    await authStore.login({ email: 'google_user@example.com', password: 'GooglePasswordMock123!' });
    router.push({ name: 'profile' });
  } catch (err) {
    console.error('Google sign-in error', err);
  }
};
</script>

<template>
  <div class="login-page-view">
    <AuthCard>
      <!-- Title & Branding -->
      <header class="auth-header">
        <span class="auth-eyebrow">MEMBER PORTAL // SECURITY</span>
        <h1 class="auth-title">Access the Curation</h1>
        <p class="auth-subtitle">Establish secure handshake with your personal archive</p>
      </header>

      <!-- Modular Login Form -->
      <LoginForm @success="handleSuccess" />

      <!-- Divider -->
      <div class="divider" aria-hidden="true">
        <span class="divider-text">Verification Method B</span>
      </div>

      <!-- Social OAuth CTA -->
      <GoogleLoginButton
        :loading="authStore.loading"
        @click="handleGoogleSignIn"
      />

      <!-- Navigation Linkages -->
      <footer class="auth-footer">
        <p class="footer-text">
          Not registered in the archive? 
          <router-link to="/auth/register" class="auth-link">
            Establish Registry
          </router-link>
        </p>
      </footer>
    </AuthCard>
  </div>
</template>

<style scoped>
.login-page-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.auth-header {
  margin-bottom: 32px;
  text-align: left;
}

.auth-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-primary);
  display: block;
  margin-bottom: 8px;
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 400;
  color: var(--color-text-h);
  margin: 0 0 8px 0;
  line-height: 1.15;
}

.auth-subtitle {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-text);
  margin: 0;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: var(--color-border);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}

.divider:not(:empty)::before {
  margin-right: .75em;
}

.divider:not(:empty)::after {
  margin-left: .75em;
}

.divider-text {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.auth-footer {
  margin-top: 32px;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

.footer-text {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--color-text);
  margin: 0;
  text-align: left;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  transition: all 0.2s;
  border-bottom: 1px solid transparent;
  display: inline-block;
  margin-left: 4px;
}

.auth-link:hover {
  color: var(--color-text-h);
  border-bottom-color: var(--color-text-h);
}

.auth-link:focus-visible {
  outline: 1px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
