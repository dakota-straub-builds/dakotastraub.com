.hero {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  min-height: 80vh;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 5rem);
}

.hero-left {
  min-width: 0;
  max-width: 780px;
}

.hero-right {
  justify-self: end;
}

.boot-log {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: #7ee787;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.boot-log p {
  margin: 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
  opacity: 0.75;
  margin-bottom: 1rem;
}

.hero h1 {
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
  margin: 0 0 1.5rem;
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.7;
  max-width: 620px;
  opacity: 0.78;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
}

.btn.primary {
  background: #7ee787;
  color: #07110a;
}

.btn.secondary {
  border: 1px solid rgba(255,255,255,0.2);
  color: inherit;
}

.sys-card {
  width: min(360px, 90vw);
  padding: 1.25rem;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.045);
  box-shadow: 0 24px 80px rgba(0,0,0,0.35);
  backdrop-filter: blur(16px);
}

.sys-card-top {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.sys-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #7ee787;
  box-shadow: 0 0 18px #7ee787;
}

.sys-title {
  opacity: 0.8;
}

.sys-avatar {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 22px;
  background: rgba(126,231,135,0.12);
  border: 1px solid rgba(126,231,135,0.35);
  color: #7ee787;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1.25rem;
}

.sys-lines {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
}

.sys-lines p {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin: 0;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.sys-lines span {
  color: #7ee787;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-right {
    justify-self: start;
  }
}