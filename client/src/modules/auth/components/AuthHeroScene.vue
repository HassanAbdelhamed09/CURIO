<script setup lang="ts">
import { Sparkles, ShieldCheck, ArrowUpRight } from '@lucide/vue';
</script>

<template>
  <div class="hero-scene-wrapper">
    <!-- Editorial Branding -->
    <header class="hero-header">
      <router-link to="/" class="logo" aria-label="Curio Home">
        curio<span class="logo-dot">.</span>
      </router-link>
      <span class="brand-eyebrow">THE JOY OF DISCOVERY</span>
      <h1 class="brand-editorial-title">Curated Objects.<br>Exquisite Design.</h1>
      <p class="brand-editorial-text">
        A sanctuary for those who appreciate character, craftsmanship, and the beauty of physical forms. We partner with independent ateliers to bring you unique, limited-run creations.
      </p>
    </header>

    <!-- Curator's Showcase Frame (Neo-brutalist Luxury Placard) -->
    <div class="showcase-frame" aria-hidden="true">
      <div class="image-container">
        <img 
          src="https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=600&q=80" 
          alt="Minimalist Design Object" 
          class="showcase-img"
        />
        <div class="showcase-tag">CURATOR'S SELECTION // OBJECT 042</div>
      </div>
      
      <div class="showcase-meta">
        <div class="meta-header">
          <h3 class="meta-title">Atelier Brass Incense Burner</h3>
          <span class="meta-collection">Collection 02</span>
        </div>
        <div class="meta-footer">
          <p class="meta-desc">Solid cast brass with a hand-polished organic finish, crafted in Kyoto.</p>
          <div class="meta-cta">
            <span class="cta-text">View Curation</span>
            <ArrowUpRight class="cta-icon" />
          </div>
        </div>
      </div>
    </div>

    <!-- Curator's Manifesto Grid -->
    <div class="manifesto-grid">
      <div class="manifesto-card">
        <div class="manifesto-header">
          <Sparkles class="manifesto-icon text-orange" />
          <h4 class="manifesto-title">Tactile Character</h4>
        </div>
        <p class="manifesto-desc">Every piece is selected for its physical texture, weight, and material integrity.</p>
      </div>

      <div class="manifesto-card">
        <div class="manifesto-header">
          <ShieldCheck class="manifesto-icon text-mint" />
          <h4 class="manifesto-title">Verified Ateliers</h4>
        </div>
        <p class="manifesto-desc">Direct provenance checks and exclusive collaborations with independent creators.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-scene-wrapper {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-sizing: border-box;
}

.hero-header {
  text-align: left;
}

/* Brand logo */
.logo {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-surface);
  text-decoration: none;
  letter-spacing: -0.04em;
  display: inline-block;
  margin-bottom: 20px;
  transition: transform var(--duration-fast) var(--ease-spring);
}

.logo:hover {
  transform: scale(1.05) rotate(-2deg);
}

.logo-dot {
  color: var(--color-accent);
}

.brand-eyebrow {
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: var(--color-accent-2);
  display: block;
  margin-bottom: 8px;
}

.brand-editorial-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--color-surface);
  margin: 0 0 16px 0;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.brand-editorial-text {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
  margin: 0;
}

/* Curator's Showcase Frame (Neo-brutalist Premium Placard) */
.showcase-frame {
  background-color: var(--color-surface);
  border: 3px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: 10px 10px 0px var(--color-accent);
  transition: all var(--duration-base) var(--ease-spring);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.showcase-frame:hover {
  transform: translate(-2px, -2px);
  box-shadow: 12px 12px 0px var(--color-primary);
}

.image-container {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid var(--color-primary);
}

.showcase-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease-out);
}

.showcase-frame:hover .showcase-img {
  transform: scale(1.05);
}

.showcase-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: var(--color-primary);
  color: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.showcase-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.meta-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-primary);
  margin: 0;
}

.meta-collection {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
  white-space: nowrap;
}

.meta-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.meta-desc {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-muted);
  margin: 0;
  flex-grow: 1;
}

.meta-cta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 2px;
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-spring);
}

.showcase-frame:hover .meta-cta {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.cta-icon {
  width: 14px;
  height: 14px;
}

/* Curator's Manifesto Grid */
.manifesto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 24px;
}

.manifesto-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.manifesto-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.manifesto-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.text-orange {
  color: var(--color-accent);
}

.text-mint {
  color: var(--color-accent-3);
}

.manifesto-title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-surface);
  margin: 0;
}

.manifesto-desc {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

@media (max-width: 768px) {
  .manifesto-grid {
    grid-template-columns: 1fr;
  }
}
</style>
