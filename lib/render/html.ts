import { WebsiteLayout, Section } from "@/lib/types/layout";

export function renderWebsiteToHtml(layout: WebsiteLayout): string {
  const page = layout.pages[0];

  if (!page) {
    return "<!doctype html><html><body><p>No content</p></body></html>";
  }

  const sectionsHtml = page.sections.map(sectionToHtml).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; background: #020617; color: #e5e7eb; }
    .container { max-width: 960px; margin: 0 auto; padding: 3rem 1.5rem; }
    .section { margin-bottom: 3rem; }
    .hero-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
    .hero-subtitle { font-size: 1.125rem; color: #9ca3af; margin-bottom: 1.5rem; }
    .btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 999px; font-weight: 600; text-decoration: none; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-secondary { border: 1px solid #4b5563; color: #e5e7eb; }
    ul { padding-left: 1.25rem; }
    li { margin-bottom: 0.5rem; }
    dl { margin: 0; }
    dt { font-weight: 700; margin-top: 1rem; }
    dd { margin: 0.25rem 0 0.5rem 0; color: #cbd5e1; }
    h2, h3 { margin: 0 0 0.75rem 0; }
    p { margin: 0 0 0.75rem 0; color: #cbd5e1; }
    .plan { border: 1px solid #1f2937; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; }
    .plans { display: grid; gap: 1rem; }
  </style>
</head>
<body>
  <main class="container">
    ${sectionsHtml}
  </main>
</body>
</html>`;
}

function sectionToHtml(section: Section): string {
  switch (section.type) {
    case "hero":
      return `
<section class="section">
  <div class="hero-title">${escapeHtml(section.headline)}</div>
  ${section.subheadline ? `<div class="hero-subtitle">${escapeHtml(section.subheadline)}</div>` : ""}
  <div>
    ${section.primaryCta ? `<a href="${section.primaryCta.href}" class="btn btn-primary">${escapeHtml(section.primaryCta.label)}</a>` : ""}
    ${section.secondaryCta ? `<a href="${section.secondaryCta.href}" class="btn btn-secondary" style="margin-left:0.75rem;">${escapeHtml(section.secondaryCta.label)}</a>` : ""}
  </div>
</section>`;
    case "features":
      return `
<section class="section">
  <h2>${escapeHtml(section.title)}</h2>
  ${section.subtitle ? `<p>${escapeHtml(section.subtitle)}</p>` : ""}
  <ul>
    ${section.items
      .map(
        (item) =>
          `<li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(
            item.description
          )}</li>`
      )
      .join("")}
  </ul>
</section>`;
    case "pricing":
      return `
<section class="section">
  <h2>${escapeHtml(section.title)}</h2>
  ${section.subtitle ? `<p>${escapeHtml(section.subtitle)}</p>` : ""}
  <div class="plans">
    ${section.plans
      .map(
        (plan) => `
      <div class="plan">
        <h3>${escapeHtml(plan.name)}</h3>
        <p>${escapeHtml(plan.price)}${plan.period ? ` / ${escapeHtml(plan.period)}` : ""}</p>
        ${plan.description ? `<p>${escapeHtml(plan.description)}</p>` : ""}
        <ul>
          ${plan.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
        </ul>
        ${plan.ctaLabel ? `<div style="margin-top:0.5rem;"><span class="btn btn-primary">${escapeHtml(plan.ctaLabel)}</span></div>` : ""}
      </div>`
      )
      .join("")}
  </div>
</section>`;
    case "cta":
      return `
<section class="section">
  <h2>${escapeHtml(section.title)}</h2>
  ${section.subtitle ? `<p>${escapeHtml(section.subtitle)}</p>` : ""}
  <a href="${section.primaryCta.href}" class="btn btn-primary">${escapeHtml(section.primaryCta.label)}</a>
</section>`;
    case "faq":
      return `
<section class="section">
  <h2>${escapeHtml(section.title)}</h2>
  <dl>
    ${section.items
      .map(
        (item) => `
      <dt><strong>${escapeHtml(item.question)}</strong></dt>
      <dd>${escapeHtml(item.answer)}</dd>`
      )
      .join("")}
  </dl>
</section>`;
    default:
      return "";
  }
}

function escapeHtml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
