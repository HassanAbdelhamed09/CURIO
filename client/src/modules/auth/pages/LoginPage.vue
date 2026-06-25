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
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to manage your premium account</p>
      </header>

      <!-- Modular Login Form -->
      <LoginForm @success="handleSuccess" />

      <!-- Divider -->
      <div class="divider" aria-hidden="true">
        <span class="divider-text">or</span>
      </div>

      <!-- Social OAuth CTA -->
      <GoogleLoginButton
        :loading="authStore.loading"
        @click="handleGoogleSignIn"
      />

      <!-- Navigation Linkages -->
      <footer class="auth-footer">
        <p class="footer-text">
          Don't have an account? 
          <router-link to="/auth/register" class="auth-link">
            Sign up
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

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
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
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.auth-footer {
  margin-top: 28px;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.footer-text {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--color-muted);
  margin: 0;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.auth-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
