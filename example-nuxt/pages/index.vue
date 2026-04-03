<template>
  <section class="landing-shell">
    <div class="hero-card">
      <p class="eyebrow">a2ui-vue</p>
      <h1>Library-first AG-UI rendering for Vue.</h1>
      <p class="hero-copy">
        The package renders dynamic widgets from the component library in <code>src/</code>.
        The reference LangGraph agent can ask HIL questions, collect answers with widgets, and then render the final surface.
      </p>

      <div class="hero-actions">
        <NuxtLink to="/gallery" class="primary-link">
          Browse Gallery
        </NuxtLink>
        <NuxtLink to="/designer" class="secondary-link">
          Open Designer
        </NuxtLink>
      </div>
    </div>

    <div class="info-grid">
      <article class="info-card">
        <span class="material-icons">device_hub</span>
        <h2>Request -&gt; HIL -&gt; UI</h2>
        <p>
          The backend asks for missing input or confirmation through A2UI widgets instead of duplicating the same question in plain chat.
        </p>
      </article>

      <article class="info-card">
        <span class="material-icons">widgets</span>
        <h2>Library-driven output</h2>
        <p>
          Generated payloads are constrained by the exported component catalog and validated before the renderer mutates state.
        </p>
      </article>

      <article class="info-card">
        <span class="material-icons">rule</span>
        <h2>Runtime validation</h2>
        <p>
          Invalid component names, props, actions, and message sequences are rejected with explicit errors so the last valid surface stays intact.
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.landing-shell {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  padding: 48px 24px;
  max-width: 980px;
  margin: 0 auto;
}

.hero-card,
.info-card {
  border: 1px solid var(--a2ui-card-border);
  background: var(--a2ui-card-bg);
  border-radius: 24px;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
}

.hero-card {
  padding: 32px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--a2ui-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-card h1 {
  margin: 0;
  color: var(--a2ui-text);
  font-size: clamp(2rem, 3vw, 3.25rem);
  line-height: 1.05;
}

.hero-copy {
  margin: 18px 0 0;
  max-width: 720px;
  color: var(--a2ui-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.hero-copy code {
  background: rgba(124, 58, 237, 0.08);
  color: var(--a2ui-primary);
  border-radius: 6px;
  padding: 2px 6px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.primary-link,
.secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-link {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: white;
}

.secondary-link {
  color: var(--a2ui-text);
  border: 1px solid var(--a2ui-card-border);
}

.primary-link:hover,
.secondary-link:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.info-card {
  padding: 22px;
}

.info-card .material-icons {
  font-size: 26px;
  color: var(--a2ui-primary);
}

.info-card h2 {
  margin: 12px 0 8px;
  color: var(--a2ui-text);
  font-size: 1rem;
}

.info-card p {
  margin: 0;
  color: var(--a2ui-muted);
  line-height: 1.6;
  font-size: 0.92rem;
}

@media (max-width: 840px) {
  .landing-shell {
    padding: 32px 16px;
  }

  .hero-card {
    padding: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }
}
</style>
