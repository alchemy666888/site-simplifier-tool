## 0. Product Vibe (North Star)

**“Make the web calmer, clearer, and easier — instantly.”**

The Site Simplifier Tool is a **lightweight, client-side Chrome extension** that automatically reduces website clutter, clarifies visual hierarchy, and improves navigation — without requiring users to configure anything.

The philosophy:
- Solve a **daily, universal annoyance**
- Stay **simple, fast, and invisible**
- No servers, no accounts, no friction
- Free by default, paid only for power

Think: *Reader Mode*, but for **entire websites**, not just articles.

---

## 1. Core Problem to Solve (User Reality)

Modern websites suffer from:
- Visual overload (ads, banners, popups, sidebars)
- Poor hierarchy (everything screams for attention)
- Navigation chaos (too many choices, hidden actions)
- Accessibility friction (tiny targets, low contrast)
- Cognitive fatigue (especially for mobile, elderly, neurodivergent users)

**User intent is simple**:
> “I just want to focus and get things done.”

---

## 2. Target Users (Who This Is For)

Primary:
- Professionals & students browsing content-heavy sites
- Power users who already install productivity extensions
- Developers / designers / researchers

Secondary:
- Accessibility-focused users
- Elderly users overwhelmed by modern UI
- Anyone tired of ad-heavy news & e-commerce sites

Key insight:
> Users expect extensions to “just work” with zero setup.

---

## 3. Product Scope (What We Build First)

### V1: Opinionated Simplicity (MVP)

**Default behavior (no configuration):**
- Remove obvious clutter
- Highlight primary content
- Calm the layout

**User control:**
- On / Off toggle
- “Simplify this site” button
- Temporary disable per page

No dashboards. No accounts. No onboarding flows.

---

## 4. Feature Breakdown by Vibe Level

### Tier 1 – Must Have (Launch MVP)

**Automatic Simplification Engine**
- Detect main content container
- De-emphasize or hide:
  - Sidebars
  - Sticky banners
  - Popups
  - Ads (non-blocking, layout-based)
- Increase spacing & readability
- Improve contrast and font sizing slightly

**Navigation Cleanup**
- Collapse oversized menus
- Reduce visual noise in headers
- Highlight primary call-to-action

**Extension UX**
- One-click toggle
- Per-site enable / disable
- “Reset page” option

---

### Tier 2 – Power User Delight (Post-MVP)

**Per-Site Profiles**
- Remember user preference per domain

**Manual Focus Mode**
- Click an element → make it the focus
- Everything else fades away

**Accessibility Enhancements**
- Larger click targets
- Optional high-contrast mode
- Reduced motion option

---

### Tier 3 – Pro Features (Monetization)

**Custom Rules**
- Hide / highlight specific elements
- CSS-like logic without writing CSS

**Smart Detection (Optional AI / Heuristics)**
- Better content prioritization on complex layouts
- Detect “junk zones” vs “task zones”

**Sync Settings**
- Export / import rules
- Optional future cross-device sync

---

## 5. What We Explicitly Do NOT Build

To keep the product sharp:
- ❌ No backend servers
- ❌ No user accounts
- ❌ No analytics-heavy tracking
- ❌ No ad blocking arms race
- ❌ No SEO or developer tooling
- ❌ No feature bloat

This is **not** a dev tool.
This is **not** an SEO tool.
This is a **daily-use calmness tool**.

---

## 6. Technical Philosophy (Vibe Coding Rules)

**Architecture Principles**
- 100% client-side
- Minimal permissions
- Manifest V3 compliant
- Fast injection, zero layout thrashing
- Fail silently if something breaks

**Heuristics over perfection**
- 80% correct for 90% of sites beats 100% correct for 10%

**Performance first**
- Never slow page load
- Never break core site functionality

---

## 7. Development Phases (Vibe Timeline)

### Phase 1 – Foundation (Weekend Build)
- Chrome extension skeleton
- Content script injection
- DOM scanning & classification
- Simple hide / deemphasize logic
- Toggle UI

Goal: *Works on news sites & blogs*

---

### Phase 2 – Layout Intelligence
- Better main-content detection
- Header / sidebar heuristics
- Safe element removal rules
- Visual polish

Goal: *Feels magical on most sites*

---

### Phase 3 – UX Polish & Stability
- Per-site memory
- Edge case handling
- Accessibility tuning
- Performance optimization

Goal: *“I forgot this was even running”*

---

### Phase 4 – Pro Layer
- Advanced rules UI
- Power-user controls
- Pricing & paywall logic

Goal: *Monetize without hurting free users*

---

## 8. Monetization Strategy (Low Friction)

**Freemium Model**
- Free: core simplification forever
- Pro ($3–5/month or $20/year):
  - Custom rules
  - Advanced control
  - Smart detection

**Why this works**
- Extensions are expected to be free
- Power users happily pay for control
- No servers = ~95% margins

Target conversion: **5–15%**

---

## 9. Distribution & Growth Plan

**Primary Channels**
- Chrome Web Store SEO
- Reddit (r/chrome_extensions, r/productivity)
- Indie Hacker & dev communities
- Word-of-mouth (“you NEED this” tool)

**Positioning**
- “Reader Mode for the entire web”
- “Make ugly websites usable again”
- “Instant calm for cluttered sites”

No paid ads at launch.

---

## 10. Success Metrics (What Good Looks Like)

Short-term:
- 1,000 installs
- 4.5★ rating
- Low uninstall rate

Mid-term:
- 10,000+ installs
- Organic growth
- First $500/month revenue

Long-term:
- Passive, low-maintenance income
- Cross-browser expansion
- Optional AI-native evolution

---

## 11. Risks & How We Mitigate Them

| Risk | Mitigation |
|----|----|
| Site breakage | Conservative rules, easy toggle |
| Browser changes | Stay close to platform primitives |
| Competition | Focus on simplicity, not features |
| User trust | Minimal permissions, no tracking |

---

## 12. Final Product Mantra

> **If users notice the extension, we failed.**  
> It should quietly make the web feel better — every day.

This is not about building a big startup.  
This is about building a **small, sharp, profitable tool** that people love.

---

