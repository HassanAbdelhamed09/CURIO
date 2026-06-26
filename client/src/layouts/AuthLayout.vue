<script setup lang="ts">
// AuthLayout manages the visual backdrop for all credentials and auth pages.
</script>

<template>
  <div class="auth-layout">
    <!-- Left Panel: Brand Curation Editorial -->
    <section class="auth-brand-panel" aria-label="Aetheris Philosophy">
      <div class="ambient-glow"></div>
      <div class="brand-content">
        <span class="brand-eyebrow">THE ARCHIVE COLLECTION</span>
        <h1 class="brand-editorial-title">Objects of Refined Geometry</h1>
        <p class="brand-editorial-text">
          Welcome to the private registry of ÆTHERIS. We curate precision chronometry, sculptural accessories, and masterfully crafted leather goods. Access your archive to manage your personal portfolio.
        </p>
        
        <!-- Interactive Typographic/Monospace Grid (Signature details) -->
        <div class="coordinates-grid">
          <div class="coordinate-item">
            <span class="coord-label">LATITUDE //</span>
            <span class="coord-val">52.5200° N</span>
          </div>
          <div class="coordinate-item">
            <span class="coord-label">LONGITUDE //</span>
            <span class="coord-val">13.4050° E</span>
          </div>
          <div class="coordinate-item">
            <span class="coord-label">ARCHIVE STATUS //</span>
            <span class="coord-val text-success">ONLINE</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Right Panel: Credentials Form -->
    <section class="auth-form-panel" aria-label="Sign In Portal">
      <div class="kinetic-viewport form-container">
        <router-view />
      </div>
    </section>
  </div>
</template>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Left Brand Panel */
.auth-brand-panel {
  position: relative;
  display: flex;
  align-items: center;
  padding: 80px;
  background: linear-gradient(135deg, #090a0f 0%, #12141c 100%);
  border-right: 1px solid var(--color-border);
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 1;
  max-width: 540px;
  text-align: left;
}

.brand-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-primary);
}

.brand-editorial-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: var(--color-text-h);
  margin: 16px 0 24px;
  line-height: 1.1;
}

.brand-editorial-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 48px;
}

.coordinates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  border-top: 1px solid var(--color-border);
  padding-top: 32px;
}

.coordinate-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.coord-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.coord-val {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-h);
  font-weight: 500;
}

.text-success {
  color: var(--color-success);
}

/* Right Form Panel */
.auth-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: var(--color-bg);
}

.form-container {
  width: 100%;
  max-width: 440px;
  box-sizing: border-box;
}

/* Responsive adjustment */
@media (max-width: 1024px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
  
  .auth-brand-panel {
    display: none; /* Hide editorial on mobile for compact, fast form access */
  }
  
  .auth-form-panel {
    padding: 24px 16px;
  }
}
</style>
