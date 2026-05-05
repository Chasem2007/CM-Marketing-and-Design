// ═══════════════════════════════════════════════════════════
// CM MARKETING & DESIGN — Brand Guide
// 10-page brand manual: identity, color, type, voice, sub-brand
// ═══════════════════════════════════════════════════════════

export default function BrandGuide({ C, F, D, dark, nav }) {

  // ── Shared layout helpers ───────────────────────────────
  const PAGE = {
    minHeight: "100vh",
    borderBottom: `1px solid ${C.border}`,
    position: "relative",
    overflow: "hidden",
  };

  const INNER = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 32px",
  };

  const TAG = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: C.accent,
    fontFamily: F,
    marginBottom: 18,
  };

  const RULE = {
    width: "100%",
    height: 1,
    background: C.border,
    border: "none",
    margin: "0 0 64px",
  };

  // ── Color swatches for palette page ────────────────────
  const palettePrimary = [
    { name: "Midnight", hex: "#141414", role: "Primary background. The bedrock of every layout." },
    { name: "Charcoal",  hex: "#222222", role: "Card surfaces. Elevates content off the base." },
    { name: "Warm Cream", hex: "#ddd2be", role: "Signature accent. Headlines, CTAs, logo mark." },
    { name: "Parchment", hex: "#ece5d8", role: "Body text on dark. Soft, legible, warm." },
  ];
  const paletteSecondary = [
    { name: "Linen",   hex: "#f5f0e8", role: "Light-mode background." },
    { name: "Sand",    hex: "#ebe5da", role: "Light-mode card surface." },
    { name: "Slate",   hex: "#3a3a3a", role: "Light-mode accent / text." },
    { name: "Stone",   hex: "#8a8478", role: "Muted text, captions, labels." },
  ];

  // ── Type scale examples ─────────────────────────────────
  const typeScale = [
    { label: "Display",    size: "clamp(52px,6vw,80px)", weight: 700, family: D,   sample: "Your Brand, Seen." },
    { label: "Heading 1",  size: "clamp(32px,4vw,52px)", weight: 700, family: D,   sample: "Strategic. Creative. Real." },
    { label: "Heading 2",  size: "clamp(22px,3vw,34px)", weight: 700, family: D,   sample: "Design That Works" },
    { label: "Body Large", size: 18,                       weight: 400, family: F,   sample: "We build brands that stand out, hold attention, and drive real growth." },
    { label: "Body",       size: 15,                       weight: 400, family: F,   sample: "Every business deserves marketing that's strategic, creative, and built for results." },
    { label: "Caption",    size: 11,                       weight: 700, family: F,   sample: "BRAND IDENTITY · WEB DESIGN · STRATEGY" },
  ];

  // ── Voice do / don't pairs ──────────────────────────────
  const voicePairs = [
    { bad: "We leverage synergistic solutions to optimise your brand ecosystem.", good: "We build brands that actually work — and we can prove it." },
    { bad: "Our team is passionate about delivering world-class deliverables.", good: "We care about your numbers as much as we care about the craft." },
    { bad: "Please don't hesitate to reach out if you have any inquiries.", good: "Have questions? Let's talk." },
    { bad: "We utilise cutting-edge design methodologies.", good: "We design with purpose — not just aesthetics." },
  ];

  // ── IRONLOG palette ─────────────────────────────────────
  const ironColors = [
    { name: "Iron Black",  hex: "#0d0d0d", role: "Primary background." },
    { name: "Steel",       hex: "#1a1a1f", role: "Card / panel surface." },
    { name: "Forge",       hex: "#e8460a", role: "Primary accent. Energy, intensity, action." },
    { name: "Ember",       hex: "#ff7a45", role: "Hover states, highlights." },
    { name: "Chrome",      hex: "#c8c8d0", role: "Body text, labels." },
    { name: "Rust",        hex: "#8b3a1f", role: "Secondary accent, depth." },
  ];

  // ── Do / Don'ts for logo ────────────────────────────────
  const logoDonts = [
    "Don't stretch or distort the letterform",
    "Don't place on a patterned or busy background",
    "Don't change the cream/charcoal color relationship",
    "Don't outline, stroke, or add drop shadows",
    "Don't rotate or apply effects",
    "Don't use at sizes below 24px",
  ];

  return (
    <div style={{ background: C.bg, fontFamily: F, minHeight: "100vh" }}>

      {/* ══════════════════════════════════════════
           PAGE 1 — COVER
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, display: "flex", alignItems: "center", background: "#141414" }}>
        {/* Background grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.35 }} />
        {/* Accent glow blob */}
        <div style={{ position: "absolute", top: "30%", left: "60%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(221,210,190,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ ...INNER, position: "relative", zIndex: 1, padding: "120px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 760 }}>
            <div style={{ ...TAG, marginBottom: 40 }}>Brand Identity System · 2025</div>

            {/* Logo lockup */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 56 }}>
              <img src="/logo.png" alt="CM" style={{ width: 72, height: 72, borderRadius: 18 }} />
              <div>
                <div style={{ fontFamily: D, fontSize: 28, fontWeight: 700, color: "#ece5d8", letterSpacing: "-0.02em", lineHeight: 1 }}>CM Marketing</div>
                <div style={{ fontSize: 10, color: "#ddd2be", letterSpacing: "3.5px", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>&amp; Design</div>
              </div>
            </div>

            <h1 style={{ fontFamily: D, fontSize: "clamp(52px,7vw,92px)", fontWeight: 700, color: "#ece5d8", lineHeight: 1.0, letterSpacing: "-0.04em", margin: "0 0 28px" }}>
              Brand<br />
              <span style={{ color: "#ddd2be", fontStyle: "italic" }}>Guide.</span>
            </h1>

            <p style={{ color: "#7a756d", fontSize: 17, lineHeight: 1.8, maxWidth: 520, margin: "0 0 64px" }}>
              This document defines the visual and verbal identity of CM Marketing &amp; Design — how we look, how we speak, and how we show up for every client.
            </p>

            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[["Version","1.0"],["Established","2025"],["Sub-brand","IRONLOG"]].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7a756d", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontFamily: D, fontSize: 20, fontWeight: 700, color: "#ddd2be" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Page number */}
          <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: "#ddd2be", opacity: 0.05, lineHeight: 1, userSelect: "none" }}>01</div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 2 — BRAND STORY
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>02 · Brand Story</div>
          <hr style={RULE} />

          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: D, fontSize: "clamp(36px,4vw,56px)", fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 36 }}>
                Why we<br />
                <span style={{ color: C.accent, fontStyle: "italic" }}>exist.</span>
              </h2>
              <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.9, marginBottom: 24 }}>
                CM Marketing &amp; Design was built on one conviction: every business — no matter its size — deserves marketing that's strategic, creative, and built for real results.
              </p>
              <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.9, marginBottom: 24 }}>
                We're not just designers or marketers. We're partners invested in your growth. We work with small and mid-sized businesses to build brands from the ground up, redesign digital experiences, and craft campaigns that connect with the right people.
              </p>
              <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.9 }}>
                No fluff. No guesswork. Intentional work that moves businesses forward.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Mission", icon: "◆", text: "To make professional, strategic marketing accessible to every business — and to deliver work that actually grows brands." },
                { label: "Vision",  icon: "◇", text: "A world where every business, regardless of size, has the branding and marketing presence it deserves." },
                { label: "Promise", icon: "◈", text: "We listen first. Then we research, plan, and execute with precision. Your story will be seen by the right people." },
                { label: "Values",  icon: "◉", text: "Strategy before aesthetics. Radical transparency. Results that matter. Your brand, our priority." },
              ].map(({ label, icon, text }) => (
                <div key={label} style={{ padding: "28px 32px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: C.accent, fontSize: 14 }}>{icon}</span>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: "2px", textTransform: "uppercase" }}>{label}</div>
                  </div>
                  <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>02</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 3 — LOGO
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>03 · Logo System</div>
          <hr style={RULE} />

          {/* Primary logo display */}
          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 72, alignItems: "center" }}>
            {/* Dark version */}
            <div style={{ background: "#141414", border: `1px solid ${C.border}`, borderRadius: 16, padding: "64px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
              <img src="/logo.png" alt="CM Logo" style={{ width: 96, height: 96, borderRadius: 24 }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: D, fontSize: 20, fontWeight: 700, color: "#ece5d8" }}>CM Marketing</div>
                <div style={{ fontSize: 9, color: "#ddd2be", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700 }}>&amp; Design</div>
              </div>
              <div style={{ fontSize: 10, color: "#7a756d", letterSpacing: "2px", textTransform: "uppercase" }}>Dark Background · Primary Use</div>
            </div>
            {/* Light version */}
            <div style={{ background: "#f5f0e8", border: `1px solid #d6cfc2`, borderRadius: 16, padding: "64px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
              <img src="/logo.png" alt="CM Logo" style={{ width: 96, height: 96, borderRadius: 24 }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: D, fontSize: 20, fontWeight: 700, color: "#1e1e1e" }}>CM Marketing</div>
                <div style={{ fontSize: 9, color: "#3a3a3a", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700 }}>&amp; Design</div>
              </div>
              <div style={{ fontSize: 10, color: "#8a8478", letterSpacing: "2px", textTransform: "uppercase" }}>Light Background · Reversed Use</div>
            </div>
          </div>

          {/* Construction notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 64 }}>
            {[
              { title: "Lettermark", desc: "The 'CM' monogram is set in Fraunces Bold, a high-contrast serif that signals craft, character, and elegance." },
              { title: "Container", desc: "A circular container at 100% background-fill. The circle conveys wholeness, continuity, and trustworthiness." },
              { title: "Clear Space", desc: "Always maintain a minimum clear space equal to the height of the 'C' letterform on all sides." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: "24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                <div style={{ fontFamily: D, fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 10 }}>{title}</div>
                <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Don'ts */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "36px 40px" }}>
            <div style={{ fontFamily: D, fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 24 }}>Logo Don'ts</div>
            <div className="bg-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {logoDonts.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(224,85,85,0.15)", border: "1px solid rgba(224,85,85,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: "#e05555", fontSize: 10, fontWeight: 700 }}>✕</span>
                  </div>
                  <span style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>03</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 4 — COLOR PALETTE
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>04 · Color Palette</div>
          <hr style={RULE} />

          <h2 style={{ fontFamily: D, fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: "-0.03em" }}>
            Warm. Confident. Refined.
          </h2>
          <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.8, maxWidth: 600, marginBottom: 64 }}>
            The CM palette draws from warm charcoals and aged cream — a nod to timeless craftsmanship. It works equally well in dark and light contexts.
          </p>

          {/* Primary palette */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 20 }}>Primary Colors</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
              {palettePrimary.map(({ name, hex, role }) => (
                <div key={hex}>
                  <div style={{ height: 160, background: hex, borderRadius: "12px 12px 0 0", border: `1px solid ${C.border}` }} />
                  <div style={{ padding: "16px 18px", background: C.card, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
                    <div style={{ fontFamily: D, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 3 }}>{name}</div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: C.accent, marginBottom: 6 }}>{hex.toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.6 }}>{role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary palette */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 20 }}>Secondary Colors</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
              {paletteSecondary.map(({ name, hex, role }) => (
                <div key={hex}>
                  <div style={{ height: 80, background: hex, borderRadius: "8px 8px 0 0", border: `1px solid ${C.border}` }} />
                  <div style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ fontFamily: D, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 2 }}>{name}</div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: C.accent, marginBottom: 4 }}>{hex.toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage rules */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { rule: "Warm Cream (#DDD2BE) is the signature accent — use it for headlines, active states, and brand moments." },
              { rule: "Never use Midnight (#141414) as text on light backgrounds. It reads as pure black and loses warmth." },
              { rule: "Functional colors (success green #6EC98F, danger red #E05555) are system-use only — not brand decoration." },
              { rule: "Maintain a minimum contrast ratio of 4.5:1 for body text. Warm Cream on Midnight exceeds WCAG AA." },
            ].map(({ rule }, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "18px 20px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <span style={{ color: C.accent, fontSize: 14, flexShrink: 0, marginTop: 1 }}>◆</span>
                <span style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>04</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 5 — TYPOGRAPHY
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>05 · Typography</div>
          <hr style={RULE} />

          {/* Font introductions */}
          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 72 }}>
            {/* Fraunces */}
            <div style={{ padding: "40px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Display · Headings</div>
              <div style={{ fontFamily: D, fontSize: "clamp(42px,5vw,68px)", fontWeight: 700, color: C.white, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 20 }}>Fraunces</div>
              <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
                A high-contrast, optical serif typeface with character and warmth. Use Fraunces for all display text, headings, and moments that demand presence. The italic cut adds editorial sophistication.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Light 300","Regular 400","Bold 700","Black 900"].map(w => (
                  <div key={w} style={{ padding: "6px 12px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textDim }}>{w}</div>
                ))}
              </div>
            </div>

            {/* Space Grotesk */}
            <div style={{ padding: "40px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Body · UI · Labels</div>
              <div style={{ fontFamily: F, fontSize: "clamp(36px,4vw,58px)", fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 20 }}>Space Grotesk</div>
              <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
                A geometric sans-serif with a quirky personality. Use Space Grotesk for body copy, navigation, buttons, labels, and any UI element. Its slightly irregular forms prevent it from feeling sterile.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Regular 400","Medium 500","SemiBold 600","Bold 700"].map(w => (
                  <div key={w} style={{ padding: "6px 12px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textDim }}>{w}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Type scale */}
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 24 }}>Type Scale</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {typeScale.map(({ label, size, weight, family, sample }) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 24, alignItems: "center", padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: C.accent, opacity: 0.7 }}>{typeof size === "number" ? `${size}px` : size} / {weight}</div>
                </div>
                <div style={{ fontFamily: family, fontSize: size, fontWeight: weight, color: C.white, lineHeight: 1.2 }}>{sample}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>05</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 6 — BRAND VOICE
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>06 · Brand Voice &amp; Tone</div>
          <hr style={RULE} />

          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginBottom: 72, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: D, fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, color: C.white, marginBottom: 28, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                We speak like a
                <span style={{ color: C.accent, fontStyle: "italic" }}> trusted expert</span>
                , not a corporate machine.
              </h2>
              <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
                Our voice is the same whether we're writing a homepage headline, a client proposal, or a social media caption. Confident without being arrogant. Direct without being cold. Human without being unprofessional.
              </p>
              <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.85 }}>
                We talk about real outcomes. We don't oversell. We don't use jargon as a shield. If we can't explain it plainly, we haven't thought it through enough.
              </p>
            </div>

            {/* Personality traits */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { trait: "Confident", opp: "Not Arrogant",  desc: "We state things with certainty, backed by evidence." },
                { trait: "Direct",    opp: "Not Blunt",     desc: "We get to the point. Short sentences. Real talk." },
                { trait: "Strategic", opp: "Not Cold",      desc: "Every word serves a purpose. No filler." },
                { trait: "Human",     opp: "Not Casual",    desc: "Warm and real, but always professional." },
                { trait: "Curious",   opp: "Not Pedantic",  desc: "We ask good questions and share what we learn." },
                { trait: "Optimistic","opp": "Not Naive",   desc: "We believe in growth, but we're honest about effort." },
              ].map(({ trait, opp, desc }) => (
                <div key={trait} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                  <div style={{ fontFamily: D, fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 2 }}>{trait}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>not {opp.replace("Not ","")}</div>
                  <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Do / Don't examples */}
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 24 }}>Voice in Practice</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {voicePairs.map(({ bad, good }, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <div style={{ padding: "20px 24px", background: "rgba(224,85,85,0.06)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "10px 0 0 10px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#e05555", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>✕ Don't say</div>
                  <div style={{ color: "#7a756d", fontSize: 13, lineHeight: 1.7, fontStyle: "italic" }}>"{bad}"</div>
                </div>
                <div style={{ padding: "20px 24px", background: "rgba(110,201,143,0.06)", border: "1px solid rgba(110,201,143,0.25)", borderRadius: "0 10px 10px 0" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#6ec98f", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>✓ Say this instead</div>
                  <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>"{good}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>06</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 7 — VISUAL STYLE
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>07 · Visual Style &amp; Imagery</div>
          <hr style={RULE} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginBottom: 64, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: D, fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 700, color: C.white, marginBottom: 24, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Purposeful. Textured. <span style={{ color: C.accent, fontStyle: "italic" }}>Real.</span>
              </h2>
              <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
                CM imagery is never stock-photo generic. We favor photography and visuals that feel authentic — slightly imperfect, full of texture, and rooted in real environments and real people.
              </p>
              <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.85 }}>
                Desaturated tones, warm shadows, and natural grain are our signatures. The overall feeling should echo our palette: warm, refined, and grounded.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { cat: "Photography", rules: ["Warm, slightly desaturated tones","Natural, available lighting — avoid harsh flash","Real environments: offices, studios, workshops","People in action — not posed lookbook shots"] },
                { cat: "Illustration", rules: ["Minimal line work only, no cartoon or clip art","Monochromatic — single-color on transparent","Purposeful use: diagrams, icons, infographics only"] },
                { cat: "Motion & Animation", rules: ["Subtle and functional — never decorative for its own sake","Ease-in-out curves, 200–400ms durations","No spinning, bouncing, or looping background videos"] },
              ].map(({ cat, rules }) => (
                <div key={cat} style={{ padding: "24px 28px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                  <div style={{ fontFamily: D, fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 12 }}>{cat}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {rules.map((r, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: C.textDim, fontSize: 13, lineHeight: 1.65 }}>
                        <span style={{ color: C.accent, fontSize: 10, marginTop: 3 }}>◆</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Visual examples / mockups using pure CSS */}
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 20 }}>Design Principles</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { title: "Grid-First", desc: "Every layout follows an invisible grid. Alignment is discipline, not decoration." },
              { title: "Whitespace", desc: "Generous spacing creates breathing room and signals confidence — not emptiness." },
              { title: "Contrast",   desc: "The Warm Cream / Midnight pairing creates strong visual hierarchy by default." },
              { title: "Restraint",  desc: "Use no more than two typefaces, two accent colors, and one visual texture per piece." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: "24px 20px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                <div style={{ width: 36, height: 3, background: C.accent, borderRadius: 2, marginBottom: 16 }} />
                <div style={{ fontFamily: D, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 10 }}>{title}</div>
                <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>07</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 8 — IRONLOG SUB-BRAND
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0", background: "#0d0d0d" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG, color: "#e8460a" }}>08 · Sub-brand · IRONLOG</div>
          <hr style={{ ...RULE, background: "#1f1f1f" }} />

          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center", marginBottom: 72 }}>
            <div>
              {/* IRONLOG wordmark */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 0, background: "#1a1a1f", border: "1px solid #2a2a30", borderRadius: 12, padding: "20px 28px", marginBottom: 24 }}>
                  {/* Iron bar icon */}
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginRight: 12 }}>
                    <rect x="2" y="15" width="32" height="6" rx="3" fill="#e8460a"/>
                    <rect x="0" y="10" width="8" height="16" rx="4" fill="#c8c8d0"/>
                    <rect x="28" y="10" width="8" height="16" rx="4" fill="#c8c8d0"/>
                  </svg>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "#c8c8d0", letterSpacing: "-0.02em", lineHeight: 1 }}>IRON<span style={{ color: "#e8460a" }}>LOG</span></div>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#4a4a55", marginTop: 3 }}>by CM Marketing</div>
                  </div>
                </div>
              </div>

              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: "#c8c8d0", marginBottom: 20, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Track every lift.<br />
                <span style={{ color: "#e8460a", fontStyle: "italic" }}>Own every PR.</span>
              </h2>
              <p style={{ color: "#6a6a75", fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
                IRONLOG is a gym performance tracker built for lifters who are serious about progress. Log workouts, track PRs, visualize progression — no fluff, just data and discipline.
              </p>
              <p style={{ color: "#6a6a75", fontSize: 15, lineHeight: 1.85 }}>
                As a CM Marketing &amp; Design sub-brand, IRONLOG shares our commitment to purposeful design — but expresses it through a harder, more visceral aesthetic that matches its audience.
              </p>
            </div>

            {/* IRONLOG palette */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#4a4a55", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 20 }}>IRONLOG Color System</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {ironColors.map(({ name, hex, role }) => (
                  <div key={hex} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: "#1a1a1f", border: "1px solid #2a2a30", borderRadius: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: hex, flexShrink: 0, border: "1px solid #333" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#c8c8d0", marginBottom: 2 }}>{name}</div>
                      <div style={{ fontSize: 10, color: "#e8460a", fontFamily: "'Courier New',monospace", marginBottom: 2 }}>{hex.toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: "#4a4a55" }}>{role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* IRONLOG brand rules */}
          <div className="bg-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { title: "Typography", body: "Space Grotesk Bold for all UI elements. No serif typefaces in the IRONLOG UI — the brand must feel precise and technical." },
              { title: "Voice",      body: "Blunt, motivated, no-nonsense. IRONLOG doesn't inspire with poetry — it inspires with numbers and honest feedback." },
              { title: "Relationship to CM", body: "IRONLOG is a product of CM, not a department. It has its own visual system but carries the 'by CM Marketing' lockup in co-branded contexts." },
            ].map(({ title, body }) => (
              <div key={title} style={{ padding: "28px 28px", background: "#1a1a1f", border: "1px solid #2a2a30", borderRadius: 12 }}>
                <div style={{ width: 28, height: 3, background: "#e8460a", borderRadius: 2, marginBottom: 14 }} />
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#c8c8d0", marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#6a6a75", lineHeight: 1.75 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: "'Fraunces',serif", fontSize: 120, fontWeight: 700, color: "#e8460a", opacity: 0.04, lineHeight: 1, userSelect: "none" }}>08</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 9 — BRAND APPLICATIONS
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>09 · Brand Applications</div>
          <hr style={RULE} />

          <h2 style={{ fontFamily: D, fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: "-0.03em" }}>How the brand lives in the world.</h2>
          <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.8, maxWidth: 600, marginBottom: 64 }}>These specifications ensure consistency across every touchpoint — digital, print, and social.</p>

          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>

            {/* Business Card mockup */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Business Card</div>
              <div style={{ background: "#141414", border: `1px solid ${C.border}`, borderRadius: 14, padding: "40px 36px", aspectRatio: "1.75", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(135deg, rgba(221,210,190,0.04) 25%, transparent 25%)`, backgroundSize: "8px 8px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
                  <img src="/logo.png" alt="CM" style={{ width: 32, height: 32, borderRadius: 8 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#ece5d8" }}>CM Marketing</div>
                    <div style={{ fontSize: 7, color: "#ddd2be", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 700 }}>&amp; Design</div>
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontFamily: D, fontSize: 18, fontWeight: 700, color: "#ece5d8", marginBottom: 2 }}>Chase McLean</div>
                  <div style={{ fontSize: 9, color: "#ddd2be", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>Founder &amp; Creative Director</div>
                  <div style={{ fontSize: 10, color: "#7a756d" }}>hello@cmmarketingdesign.com</div>
                </div>
              </div>
            </div>

            {/* Email signature mockup */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Email Signature</div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "32px 36px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 20, borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
                  <img src="/logo.png" alt="CM" style={{ width: 44, height: 44, borderRadius: 10 }} />
                  <div>
                    <div style={{ fontFamily: D, fontSize: 16, fontWeight: 700, color: C.white }}>Chase McLean</div>
                    <div style={{ fontSize: 10, color: C.accent, letterSpacing: "1px", marginBottom: 4 }}>Founder · CM Marketing &amp; Design</div>
                    <div style={{ fontSize: 11, color: C.textDim }}>hello@cmmarketingdesign.com</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Website","LinkedIn","Instagram"].map(s => (
                    <div key={s} style={{ padding: "5px 12px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 10, fontWeight: 600, color: C.textDim, fontFamily: F }}>{s}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social post mockup */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Social Media Post (1:1)</div>
              <div style={{ background: "#141414", border: `1px solid ${C.border}`, borderRadius: 14, aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #141414 0%, #1c1c1c 100%)" }} />
                <div style={{ position: "absolute", top: "20%", right: "10%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(221,210,190,0.1) 0%, transparent 70%)" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontFamily: D, fontSize: 28, fontWeight: 700, color: "#ece5d8", lineHeight: 1.15, marginBottom: 12 }}>Your brand<br /><span style={{ color: "#ddd2be", fontStyle: "italic" }}>deserves</span><br />to be seen.</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src="/logo.png" alt="CM" style={{ width: 20, height: 20, borderRadius: 4 }} />
                    <div style={{ fontSize: 10, color: "#7a756d", fontWeight: 600 }}>@cmmarketingdesign</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Website hero section mini mockup */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Web · Hero Section</div>
              <div style={{ background: "#141414", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                {/* Mini nav */}
                <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: "#222" }} />
                  <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                    {[60,48,52,56].map((w,i) => <div key={i} style={{ width: w, height: 8, background: "#333", borderRadius: 4 }} />)}
                  </div>
                </div>
                {/* Hero content */}
                <div style={{ padding: "28px 24px 32px" }}>
                  <div style={{ width: 90, height: 7, background: "#ddd2be", borderRadius: 3, marginBottom: 12, opacity: 0.4 }} />
                  <div style={{ width: "75%", height: 18, background: "#ece5d8", borderRadius: 3, marginBottom: 6 }} />
                  <div style={{ width: "55%", height: 18, background: "#ddd2be", borderRadius: 3, marginBottom: 16 }} />
                  <div style={{ width: "85%", height: 7, background: "#333", borderRadius: 3, marginBottom: 4 }} />
                  <div style={{ width: "70%", height: 7, background: "#333", borderRadius: 3, marginBottom: 20 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ width: 100, height: 28, background: "#ddd2be", borderRadius: 5 }} />
                    <div style={{ width: 80, height: 28, background: "#222", border: "1px solid #333", borderRadius: 5 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>09</div>
      </section>

      {/* ══════════════════════════════════════════
           PAGE 10 — BRAND RULES & CLOSE
          ══════════════════════════════════════════ */}
      <section style={{ ...PAGE, padding: "100px 0", borderBottom: "none" }}>
        <div style={{ ...INNER }}>
          <div style={{ ...TAG }}>10 · Brand Rules &amp; Quick Reference</div>
          <hr style={RULE} />

          <h2 style={{ fontFamily: D, fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, color: C.white, marginBottom: 60, letterSpacing: "-0.03em" }}>The short version.</h2>

          <div className="bg-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 80 }}>
            {/* Always */}
            <div style={{ padding: "36px 36px", background: "rgba(110,201,143,0.05)", border: "1px solid rgba(110,201,143,0.2)", borderRadius: "16px 0 0 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6ec98f", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 24 }}>Always</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Use Fraunces for display headings and Space Grotesk for body copy",
                  "Keep the logo in its original Warm Cream / Charcoal colorway",
                  "Maintain generous whitespace — crowding kills the brand's confidence",
                  "Write in active voice with direct, specific language",
                  "Lead with outcomes and value — not features and processes",
                  "Apply the grid and maintain consistent spacing increments",
                  "Use the IRONLOG separate visual system in IRONLOG contexts",
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "#6ec98f", fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ color: C.textDim, fontSize: 14, lineHeight: 1.65 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Never */}
            <div style={{ padding: "36px 36px", background: "rgba(224,85,85,0.05)", border: "1px solid rgba(224,85,85,0.2)", borderRadius: "0 16px 16px 0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#e05555", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 24 }}>Never</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Mix IRONLOG's orange forge accent into CM Marketing materials",
                  "Use the logo at any size below 24px or on busy backgrounds",
                  "Apply drop shadows, glows, or gradients to the logo",
                  "Use more than two typefaces in a single layout",
                  "Use corporate jargon, passive voice, or filler phrases",
                  "Introduce new colors outside the defined palette without sign-off",
                  "Compress, stretch, or rotate the logo or wordmark",
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "#e05555", fontSize: 12, marginTop: 2, flexShrink: 0 }}>✕</span>
                    <span style={{ color: C.textDim, fontSize: 14, lineHeight: 1.65 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="bg-2col" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: D, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: C.white, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 20 }}>
                "A brand is only as strong as the consistency behind it."
              </div>
              <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>
                Every decision made under this guide exists to protect and amplify the trust we build with every client. When in doubt — refer back to the story, the voice, and the palette.
              </p>
              <button
                onClick={() => nav("contact")}
                style={{ background: C.accent, border: "none", color: dark ? "#0a0a0a" : "#f5f0e8", padding: "15px 36px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, letterSpacing: "0.02em" }}
              >Start Your Project →</button>
            </div>

            {/* Quick reference card */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 36px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 24 }}>Quick Reference</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Display Font",  val: "Fraunces · Bold 700" },
                  { label: "Body Font",     val: "Space Grotesk · Regular 400" },
                  { label: "Primary BG",    val: "#141414 · Midnight" },
                  { label: "Signature Accent", val: "#DDD2BE · Warm Cream" },
                  { label: "Light BG",      val: "#F5F0E8 · Linen" },
                  { label: "IRONLOG Accent", val: "#E8460A · Forge" },
                  { label: "Sub-brand",     val: "IRONLOG by CM Marketing" },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, letterSpacing: "0.5px" }}>{label}</div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: C.accent }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 48, right: 32, fontFamily: D, fontSize: 120, fontWeight: 700, color: C.accent, opacity: 0.04, lineHeight: 1, userSelect: "none" }}>10</div>
      </section>

    </div>
  );
}
