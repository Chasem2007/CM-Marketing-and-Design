import { useState, useRef, useEffect, useCallback } from "react";
import storage from "./storage";

/*
  =====================================================================
  CM MARKETING & DESIGN — Website + Brand Portal + Built-in CMS
  =====================================================================
  
  LEARNING GUIDE — Here's what each major system does:
  
  💾 PERSISTENT STORAGE (storage)
     Data that survives page reloads. We store 4 things:
     - "cm-users"    → all user accounts (admin + clients)
     - "cm-brands"   → all brand entries with assignments
     - "cm-session"  → who's currently logged in
     - "cm-content"  → all editable page text (the CMS data)
  
  🔑 AUTHENTICATION
     - "admin" role → full access: brands, users, site editor
     - "client" role → can only see their assigned brands
     - Not logged in → public pages only (Home, Services, About)
  
  ✏️ CMS (Content Management System)
     The admin "Site Editor" tab lets you change ANY text on the
     public pages without touching code. It saves to storage and
     the public pages read from that same storage.
     
     How it works:
     1. DEFAULT_CONTENT has all the starter text
     2. When admin edits text, it saves to "cm-content" in storage
     3. Public pages read from the "content" state variable
     4. If no saved content exists, it falls back to defaults
  
  📄 PAGES
     Home → hero banner, stats strip
     Services → 6 service cards  
     About → story + value cards
     Login → username/password form
     Portal → 3 admin tabs OR client brand view
  =====================================================================
*/

// ═══════════════════════════════════════════════════════════════════
// THEME COLORS — Two complete palettes. The app switches between them.
// ═══════════════════════════════════════════════════════════════════
const DARK = {
  bg: "#05090f", bgAlt: "#0b1120", card: "#0f172a",
  accent: "#c9952c", accentLight: "#e2b44e",
  accentGlow: "rgba(201,149,44,0.13)", accentGlow2: "rgba(201,149,44,0.06)",
  text: "#cbd5e1", textDim: "#5e6e82", white: "#f1f5f9",
  border: "#1a2740", success: "#22c55e", successBg: "rgba(34,197,94,0.1)",
  danger: "#ef4444", dangerBg: "rgba(239,68,68,0.1)",
  blue: "#3b82f6", purple: "#a78bfa",
  navBg: "rgba(5,9,15,0.92)",
};
const LIGHT = {
  bg: "#f8f6f1", bgAlt: "#efece5", card: "#ffffff",
  accent: "#b07d1a", accentLight: "#c9952c",
  accentGlow: "rgba(176,125,26,0.1)", accentGlow2: "rgba(176,125,26,0.05)",
  text: "#3d3929", textDim: "#7a7462", white: "#1a1708",
  border: "#ddd8cc", success: "#16a34a", successBg: "rgba(22,163,74,0.08)",
  danger: "#dc2626", dangerBg: "rgba(220,38,38,0.08)",
  blue: "#2563eb", purple: "#7c3aed",
  navBg: "rgba(248,246,241,0.92)",
};
const F = "'DM Sans',sans-serif";
const D = "'Fraunces',serif";

// ═══════════════════════════════════════════════════════════════════
// DEFAULT CONTENT — This is what shows before the admin edits anything.
// The CMS saves overrides to storage; if a field has been edited,
// the stored version is used instead of these defaults.
// ═══════════════════════════════════════════════════════════════════
const DEFAULT_CONTENT = {
  // Hero section
  heroTagline: "Marketing · Design · Branding",
  heroTitle1: "Your Brand Deserves",
  heroTitleAccent: "to Be Seen",
  heroSubtitle: "CM Marketing & Design creates strategic branding, stunning websites, and marketing campaigns that help businesses stand out and grow. Every brand has a story — we make sure the right people hear it.",
  heroCta1: "Explore Services",
  heroCta2: "About Us →",
  // Stats
  stat1Num: "100+", stat1Label: "Brands Created",
  stat2Num: "5★", stat2Label: "Client Satisfaction",
  stat3Num: "24/7", stat3Label: "Ongoing Support",
  stat4Num: "ROI", stat4Label: "Driven Results",
  // Services
  servicesHeading: "Our Services",
  servicesSubheading: "Full-service marketing and design solutions built to grow your brand, engage your audience, and deliver measurable results.",
  svc1Title: "Brand Identity & Logo Design",
  svc1Desc: "Complete brand systems — logos, color palettes, typography, guidelines, and everything your business needs to look polished and professional.",
  svc2Title: "Website Design & Development",
  svc2Desc: "Beautiful, fast, mobile-friendly websites built to convert visitors into paying customers. From concept through launch and beyond.",
  svc3Title: "Social Media Marketing",
  svc3Desc: "Strategic content creation, scheduling, and community management across all major platforms. We grow your audience with content that resonates.",
  svc4Title: "Marketing Strategy",
  svc4Desc: "Data-driven marketing plans tailored to your goals. Market analysis, competitor research, and a clear roadmap for sustainable growth.",
  svc5Title: "Content & Copywriting",
  svc5Desc: "Compelling copy and visuals that tell your brand story — blog posts, email campaigns, ad creative, and promotional materials that convert.",
  svc6Title: "SEO & Paid Advertising",
  svc6Desc: "Get found online. Search engine optimization and targeted ad campaigns on Google and social platforms to maximize your ROI.",
  // About
  aboutHeading: "About CM Marketing & Design",
  aboutStory1: "CM Marketing & Design was born from a simple belief: every business — no matter its size — deserves marketing that's strategic, creative, and built for real results. We're not just designers or marketers. We're partners invested in your growth.",
  aboutStory2: "We work with small and mid-sized businesses to build brands from the ground up, redesign digital experiences, and craft campaigns that actually connect with the people who matter most to your business.",
  aboutStory3: "Our approach is straightforward: we listen, we research, we plan, and then we execute with precision. No fluff, no guesswork — just intentional work that moves your business forward.",
  val1Title: "Strategy First", val1Text: "Every decision is backed by research, data, and proven frameworks. We build plans, not guesses.",
  val2Title: "Radical Transparency", val2Text: "You'll always know what we're doing, why, and how it's performing. No jargon, no hidden agendas.",
  val3Title: "Results That Matter", val3Text: "Beautiful work is great — but we measure success by what it does for your bottom line.",
  val4Title: "Your Brand, Our Priority", val4Text: "We take time to understand your story, your values, and your audience. That's how we create work that feels authentically you.",
};

const DEFAULT_ADMIN = {
  id: "admin-001", username: "admin", password: "admin123",
  role: "admin", displayName: "CM Admin", createdAt: new Date().toISOString(),
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  // ── State ──────────────────────────────────────────────────────
  /*
    DARK MODE: The 'dark' state variable controls which color palette is active.
    It defaults to true (dark mode) and loads the saved preference from localStorage.
    When toggled, it saves the new preference so it persists between visits.
  */
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("cm-theme") !== "light"; } catch(e) { return true; }
  });
  const C = dark ? DARK : LIGHT;  // ← This is the magic line. Everything reads from C.

  const toggleTheme = () => {
    setDark(prev => {
      const next = !prev;
      try { localStorage.setItem("cm-theme", next ? "dark" : "light"); } catch(e) {}
      return next;
    });
  };

  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [editContent, setEditContent] = useState(null); // temp copy while editing
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [newUserForm, setNewUserForm] = useState({ username: "", password: "", displayName: "" });
  const [brandForm, setBrandForm] = useState({ name: "", category: "Logo Design", notes: "", assignedTo: "" });
  const [brandImage, setBrandImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [adminTab, setAdminTab] = useState("brands");
  const [cmsSection, setCmsSection] = useState("hero");
  const [cmsUnsaved, setCmsUnsaved] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", services: [] });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const fileRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Load from storage on mount ─────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        let u;
        try { const d = await storage.get("cm-users"); u = d?.value ? JSON.parse(d.value) : null; } catch(e) { u = null; }
        if (!u) { u = [DEFAULT_ADMIN]; try { await storage.set("cm-users", JSON.stringify(u)); } catch(e) {} }
        setUsers(u);

        try { const d = await storage.get("cm-brands"); if (d?.value) setBrands(JSON.parse(d.value)); } catch(e) {}
        try { const d = await storage.get("cm-session"); if (d?.value) setCurrentUser(JSON.parse(d.value)); } catch(e) {}
        try { const d = await storage.get("cm-content"); if (d?.value) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(d.value) }); } catch(e) {}
      } catch(e) {}
      setLoading(false);
    })();
  }, []);

  // ── Save helpers ───────────────────────────────────────────────
  const saveUsers = async (v) => { setUsers(v); try { await storage.set("cm-users", JSON.stringify(v)); } catch(e) {} };
  const saveBrands = async (v) => { setBrands(v); try { await storage.set("cm-brands", JSON.stringify(v)); } catch(e) {} };
  const saveContent = async (v) => { setContent(v); try { await storage.set("cm-content", JSON.stringify(v)); } catch(e) {} };

  // ── Auth ───────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError("");
    const u = users.find(x => x.username.toLowerCase() === loginForm.username.toLowerCase() && x.password === loginForm.password);
    if (!u) { setLoginError("Invalid username or password"); return; }
    setCurrentUser(u);
    try { await storage.set("cm-session", JSON.stringify(u)); } catch(e) {}
    setLoginForm({ username: "", password: "" }); setPage("portal");
    showToast(`Welcome, ${u.displayName}!`);
  };
  const handleLogout = async () => {
    setCurrentUser(null); try { await storage.delete("cm-session"); } catch(e) {}
    setPage("home"); showToast("Logged out");
  };

  // ── Admin: users ───────────────────────────────────────────────
  const handleCreateUser = async () => {
    if (!newUserForm.username.trim() || !newUserForm.password.trim()) return;
    if (users.some(u => u.username.toLowerCase() === newUserForm.username.toLowerCase())) { showToast("Username taken", "error"); return; }
    const nu = { id: `u-${Date.now()}`, username: newUserForm.username.trim(), password: newUserForm.password, role: "client", displayName: newUserForm.displayName.trim() || newUserForm.username.trim(), createdAt: new Date().toISOString() };
    await saveUsers([...users, nu]); setNewUserForm({ username: "", password: "", displayName: "" });
    showToast(`User "${nu.displayName}" created!`);
  };
  const handleDeleteUser = async (id) => {
    if (id === "admin-001") return;
    await saveUsers(users.filter(u => u.id !== id));
    await saveBrands(brands.map(b => ({ ...b, assignedTo: (b.assignedTo || []).filter(x => x !== id) })));
    showToast("User deleted");
  };

  // ── Admin: brands ──────────────────────────────────────────────
  const handleImageUpload = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onloadend = () => setBrandImage(r.result); r.readAsDataURL(f); };
  const handleAddBrand = async () => {
    if (!brandForm.name.trim()) return;
    const cols = [C.accent, C.blue, C.purple, "#f97316", C.success, "#ec4899"];
    const nb = { id: `b-${Date.now()}`, name: brandForm.name.trim(), category: brandForm.category, notes: brandForm.notes.trim(), assignedTo: brandForm.assignedTo ? [brandForm.assignedTo] : [], image: brandImage, color: cols[Math.floor(Math.random() * cols.length)], createdAt: new Date().toISOString() };
    await saveBrands([...brands, nb]); setBrandForm({ name: "", category: "Logo Design", notes: "", assignedTo: "" }); setBrandImage(null);
    showToast(`Brand "${nb.name}" added!`);
  };
  const handleDeleteBrand = async (id) => { await saveBrands(brands.filter(b => b.id !== id)); showToast("Brand deleted"); };
  const toggleAssign = async (bid, uid) => {
    await saveBrands(brands.map(b => { if (b.id !== bid) return b; const c = b.assignedTo || []; return { ...b, assignedTo: c.includes(uid) ? c.filter(x => x !== uid) : [...c, uid] }; }));
  };

  // ── CMS: start/save/cancel editing ─────────────────────────────
  const startEditing = () => { setEditContent({ ...content }); setCmsUnsaved(false); };
  const cancelEditing = () => { setEditContent(null); setCmsUnsaved(false); };
  const saveEditing = async () => {
    await saveContent(editContent); setEditContent(null); setCmsUnsaved(false);
    showToast("Site content saved!");
  };
  const updateField = (key, val) => {
    setEditContent(prev => ({ ...prev, [key]: val })); setCmsUnsaved(true);
  };

  // ── Contact form ────────────────────────────────────────────────
  /*
    HOW NETLIFY FORMS WORK:
    Netlify automatically detects HTML forms with a "data-netlify" attribute.
    When someone submits the form, Netlify captures the data and emails you.
    We submit it via JavaScript fetch() so the page doesn't reload.
    You'll get email notifications at your Netlify account email.
    To change the notification email: Netlify dashboard → Forms → Notifications
  */
  const toggleService = (svc) => {
    setContactForm(prev => ({
      ...prev,
      services: prev.services.includes(svc)
        ? prev.services.filter(s => s !== svc)
        : [...prev.services, svc]
    }));
  };

  const handleContactSubmit = async () => {
    if (!contactForm.firstName.trim() || !contactForm.lastName.trim() || !contactForm.email.trim()) return;
    setContactSubmitting(true);
    try {
      // Encode form data for Netlify Forms
      const encode = (data) => Object.keys(data).map(k => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          "firstName": contactForm.firstName,
          "lastName": contactForm.lastName,
          "email": contactForm.email,
          "phone": contactForm.phone,
          "company": contactForm.company,
          "services": contactForm.services.join(", "),
        }),
      });
      setContactSubmitted(true);
      setContactForm({ firstName: "", lastName: "", email: "", phone: "", company: "", services: [] });
    } catch (e) {
      showToast("Something went wrong. Please try again.", "error");
    }
    setContactSubmitting(false);
  };

  // ── Nav & helpers ──────────────────────────────────────────────
  const nav = (p) => { setPage(p); setContactSubmitted(false); window.scrollTo({ top: 0 }); };
  const isAdmin = currentUser?.role === "admin";
  const isClient = currentUser?.role === "client";
  const clientBrands = brands.filter(b => (b.assignedTo || []).includes(currentUser?.id));
  const clientUsers = users.filter(u => u.role === "client");
  const ct = content; // shorthand for reading content in JSX

  // ── Styles ─────────────────────────────────────────────────────
  const inp = { width: "100%", padding: "11px 14px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 14, fontFamily: F, outline: "none" };
  const lbl = { display: "block", color: C.textDim, fontSize: 11, fontWeight: 700, marginBottom: 5, letterSpacing: "0.8px", textTransform: "uppercase" };
  const btn = { background: `linear-gradient(135deg, ${C.accent}, #a37a1e)`, border: "none", color: DARK.bg, padding: "12px 26px", borderRadius: 9, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F };
  const crd = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ fontFamily: F, background: C.bg, color: C.white, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <img src="/logo.png" alt="CM" style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 14px", display: "block" }} />
        <div style={{ color: C.textDim, fontSize: 13 }}>Loading…</div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: F, background: C.bg, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes glow{0%,100%{box-shadow:0 0 24px ${C.accentGlow}}50%{box-shadow:0 0 48px ${C.accentGlow}}}
        button:active{transform:scale(0.97)!important}
        input:focus,textarea:focus,select:focus{border-color:${C.accent}!important}
        textarea{font-family:${F}}
      `}</style>

      {/* Toast */}
      {toast && <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 9999, padding: "10px 24px", borderRadius: 9, background: toast.type === "error" ? C.dangerBg : C.successBg, border: `1px solid ${toast.type === "error" ? C.danger : C.success}`, color: toast.type === "error" ? C.danger : C.success, fontWeight: 600, fontSize: 13, animation: "slideDown .3s ease", backdropFilter: "blur(12px)" }}>{toast.msg}</div>}

      {/* ══════ NAV ══════ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: C.navBg, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div onClick={() => nav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="CM" style={{ width: 36, height: 36, borderRadius: 9 }} />
            <div><div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>CM Marketing</div><div style={{ fontSize: 9, color: C.accent, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 700 }}>& Design</div></div>
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
            {["home","services","about","contact"].map(k => (
              <button key={k} onClick={() => nav(k)} style={{ background: page===k ? C.accentGlow : "transparent", border: "none", color: page===k ? C.accent : C.textDim, padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F, textTransform: "capitalize" }}>{k}</button>
            ))}
            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: C.bgAlt, border: `1px solid ${C.border}`,
                color: C.accent, fontSize: 16,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .3s ease", marginLeft: 2,
              }}
            >{dark ? "☀" : "☽"}</button>
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                <button onClick={() => nav("portal")} style={{ background: page==="portal" ? C.accentGlow : "transparent", border: `1px solid ${page==="portal" ? C.accent : C.border}`, color: page==="portal" ? C.accent : C.textDim, padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>{isAdmin ? "⚙ Admin" : "📁 Brands"}</button>
                <button onClick={handleLogout} title={`Logout (${currentUser.displayName})`} style={{ width: 30, height: 30, borderRadius: 7, background: isAdmin ? C.accentGlow : "rgba(59,130,246,0.12)", border: `1px solid ${isAdmin ? C.accent : C.blue}`, color: isAdmin ? C.accent : C.blue, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{currentUser.displayName.charAt(0).toUpperCase()}</button>
              </div>
            ) : (
              <button onClick={() => nav("login")} style={{ ...btn, padding: "7px 18px", fontSize: 12, marginLeft: 6 }}>Log In</button>
            )}
          </div>
        </div>
      </nav>
      <div style={{ height: 64 }} />

      {/* ══════════════════════════════════════════════════════════
           HOME
           All text comes from "ct" (content state) so the CMS works.
           ══════════════════════════════════════════════════════════ */}
      {page === "home" && (<>
        <section style={{ minHeight: "86vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "70px 20px" }}>
          <div style={{ position: "absolute", width: 650, height: 650, borderRadius: "50%", background: `radial-gradient(circle,${C.accentGlow},transparent 65%)`, top: "-15%", right: "-12%", animation: "glow 6s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.05),transparent 65%)", bottom: "8%", left: "-8%" }} />
          <div style={{ textAlign: "center", maxWidth: 740, position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, background: C.accentGlow, border: "1px solid rgba(201,149,44,0.18)", color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 32, animation: "fadeUp .5s ease" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />{ct.heroTagline}
            </div>
            <h1 style={{ fontFamily: D, fontSize: "clamp(38px,6vw,70px)", fontWeight: 700, lineHeight: 1.06, color: C.white, marginBottom: 24, animation: "fadeUp .7s ease" }}>
              {ct.heroTitle1}{" "}<span style={{ background: `linear-gradient(90deg,${C.accent},${C.accentLight},${C.accent})`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite", fontStyle: "italic" }}>{ct.heroTitleAccent}</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: C.textDim, maxWidth: 540, margin: "0 auto 40px", animation: "fadeUp .9s ease" }}>{ct.heroSubtitle}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1.1s ease" }}>
              <button onClick={() => nav("services")} style={{ ...btn, padding: "15px 34px", fontSize: 15, boxShadow: "0 4px 24px rgba(201,149,44,0.22)" }}>{ct.heroCta1}</button>
              <button onClick={() => nav("about")} style={{ background: "transparent", border: `1.5px solid ${C.border}`, color: C.white, padding: "14px 34px", borderRadius: 9, cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: F }}>{ct.heroCta2}</button>
            </div>
          </div>
        </section>
        <section style={{ maxWidth: 860, margin: "0 auto 72px", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 16 }}>
          {[{n: ct.stat1Num, l: ct.stat1Label},{n: ct.stat2Num, l: ct.stat2Label},{n: ct.stat3Num, l: ct.stat3Label},{n: ct.stat4Num, l: ct.stat4Label}].map((s,i) => (
            <div key={i} style={{ textAlign: "center", padding: "24px 16px", ...crd, animation: `fadeUp .5s ease ${i*.08}s forwards`, opacity: 0 }}>
              <div style={{ fontFamily: D, fontSize: 28, fontWeight: 700, color: C.accent, marginBottom: 3 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: C.textDim, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </section>
      </>)}

      {/* ══════ SERVICES ══════ */}
      {page === "services" && (
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "92px 20px 72px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 12 }}>What We Do</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: C.white, marginBottom: 12 }}>{ct.servicesHeading}</h2>
            <p style={{ color: C.textDim, fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{ct.servicesSubheading}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {[
              { icon: "✦", t: ct.svc1Title, d: ct.svc1Desc, tag: "Branding" },
              { icon: "◈", t: ct.svc2Title, d: ct.svc2Desc, tag: "Web" },
              { icon: "◉", t: ct.svc3Title, d: ct.svc3Desc, tag: "Social" },
              { icon: "△", t: ct.svc4Title, d: ct.svc4Desc, tag: "Strategy" },
              { icon: "□", t: ct.svc5Title, d: ct.svc5Desc, tag: "Content" },
              { icon: "◇", t: ct.svc6Title, d: ct.svc6Desc, tag: "Growth" },
            ].map((s,i) => (
              <div key={i} style={{ ...crd, padding: "32px 28px", cursor: "default", animation: `fadeUp .45s ease ${i*.06}s forwards`, opacity: 0, position: "relative", overflow: "hidden", transition: "all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ position: "absolute", top: 14, right: 18, fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "1.5px", textTransform: "uppercase", opacity: .4 }}>{s.tag}</div>
                <div style={{ fontSize: 24, marginBottom: 16, color: C.accent }}>{s.icon}</div>
                <h3 style={{ fontFamily: D, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 8 }}>{s.t}</h3>
                <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.75 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ ABOUT ══════ */}
      {page === "about" && (
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "92px 20px 72px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 12 }}>Who We Are</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: C.white }}>{ct.aboutHeading}</h2>
          </div>
          <div style={{ ...crd, padding: "40px 36px", maxWidth: 760, margin: "0 auto 36px", animation: "fadeUp .5s ease" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${C.accent},#a37a1e)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 24 }}>💡</div>
            <h3 style={{ fontFamily: D, fontSize: 23, color: C.white, fontWeight: 700, marginBottom: 18 }}>Our Story</h3>
            {[ct.aboutStory1, ct.aboutStory2, ct.aboutStory3].map((p,i) => <p key={i} style={{ color: C.textDim, fontSize: 15, lineHeight: 1.85, marginBottom: i < 2 ? 14 : 0 }}>{p}</p>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, maxWidth: 760, margin: "0 auto" }}>
            {[
              { icon: "🎯", t: ct.val1Title, d: ct.val1Text },
              { icon: "🤝", t: ct.val2Title, d: ct.val2Text },
              { icon: "🚀", t: ct.val3Title, d: ct.val3Text },
              { icon: "💛", t: ct.val4Title, d: ct.val4Text },
            ].map((v,i) => (
              <div key={i} style={{ ...crd, padding: "24px 20px", display: "flex", gap: 14, alignItems: "flex-start", animation: `fadeUp .4s ease ${i*.08}s forwards`, opacity: 0, transition: "all .3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ fontSize: 22, flexShrink: 0, width: 40, height: 40, borderRadius: 9, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>{v.icon}</div>
                <div>
                  <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 3 }}>{v.t}</h4>
                  <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7 }}>{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ LOGIN ══════ */}
      {page === "login" && !currentUser && (
        <section style={{ maxWidth: 400, margin: "0 auto", padding: "130px 20px 72px", animation: "fadeUp .4s ease" }}>
          <div style={{ ...crd, padding: "40px 32px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <img src="/logo.png" alt="CM" style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 14px", display: "block" }} />
              <h2 style={{ fontFamily: D, fontSize: 22, color: C.white, fontWeight: 700, marginBottom: 4 }}>Welcome Back</h2>
              <p style={{ color: C.textDim, fontSize: 13 }}>Sign in to access your portal</p>
            </div>
            {loginError && <div style={{ background: C.dangerBg, border: `1px solid ${C.danger}`, borderRadius: 7, padding: "9px 12px", marginBottom: 16, color: C.danger, fontSize: 12, fontWeight: 600 }}>{loginError}</div>}
            <div style={{ marginBottom: 14 }}><label style={lbl}>Username</label><input style={inp} placeholder="Enter username" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} onKeyDown={e => e.key==="Enter" && handleLogin()} /></div>
            <div style={{ marginBottom: 22 }}><label style={lbl}>Password</label><input type="password" style={inp} placeholder="Enter password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} onKeyDown={e => e.key==="Enter" && handleLogin()} /></div>
            <button onClick={handleLogin} style={{ ...btn, width: "100%", padding: "13px" }}>Sign In</button>
          </div>
        </section>
      )}
      {page === "login" && currentUser && (
        <section style={{ maxWidth: 420, margin: "0 auto", padding: "140px 20px 72px", textAlign: "center" }}>
          <p style={{ color: C.textDim, marginBottom: 16 }}>Already logged in as <b style={{ color: C.white }}>{currentUser.displayName}</b></p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => nav("portal")} style={btn}>Go to Portal</button>
            <button onClick={handleLogout} style={{ ...btn, background: "transparent", border: `1.5px solid ${C.border}`, color: C.white }}>Log Out</button>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
           ADMIN PORTAL — 3 tabs: Brands, Users, Site Editor
           ══════════════════════════════════════════════════════════ */}
      {page === "portal" && isAdmin && (
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "92px 20px 72px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 8 }}>Admin Dashboard</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, color: C.white }}>Brand Portal</h2>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
            {[{ k: "brands", l: `Brands (${brands.length})`, i: "✦" }, { k: "users", l: `Users (${clientUsers.length})`, i: "◉" }, { k: "editor", l: "Site Editor", i: "✏" }].map(t => (
              <button key={t.k} onClick={() => { setAdminTab(t.k); if (t.k === "editor" && !editContent) startEditing(); }} style={{ background: adminTab===t.k ? C.accentGlow : C.card, border: `1px solid ${adminTab===t.k ? C.accent : C.border}`, color: adminTab===t.k ? C.accent : C.textDim, padding: "9px 20px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F }}>{t.i} {t.l}</button>
            ))}
          </div>

          {/* ── BRANDS TAB ── */}
          {adminTab === "brands" && (<>
            <div style={{ ...crd, padding: "32px 28px", marginBottom: 28 }}>
              <h3 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 20 }}>+ Add New Brand</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 14 }}>
                <div><label style={lbl}>Brand Name *</label><input style={inp} placeholder="e.g. Summit Coffee" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} /></div>
                <div><label style={lbl}>Category</label><select style={{...inp, cursor: "pointer"}} value={brandForm.category} onChange={e => setBrandForm({...brandForm, category: e.target.value})}>{["Logo Design","Full Branding","Website","Social Media","Print Design","Packaging","Other"].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label style={lbl}>Assign to Client</label><select style={{...inp, cursor: "pointer"}} value={brandForm.assignedTo} onChange={e => setBrandForm({...brandForm, assignedTo: e.target.value})}><option value="">— None —</option>{clientUsers.map(u => <option key={u.id} value={u.id}>{u.displayName}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={lbl}>Notes</label><textarea style={{...inp, resize: "vertical"}} rows={2} placeholder="Project details…" value={brandForm.notes} onChange={e => setBrandForm({...brandForm, notes: e.target.value})} /></div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Image / Logo</label>
                <input type="file" ref={fileRef} onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
                <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${brandImage ? C.accent : C.border}`, borderRadius: 10, padding: brandImage ? 10 : 28, textAlign: "center", cursor: "pointer", background: brandImage ? "transparent" : C.bgAlt }}>
                  {brandImage ? <img src={brandImage} alt="" style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 6, objectFit: "contain" }} /> : <div><div style={{ fontSize: 24, marginBottom: 4 }}>📁</div><div style={{ color: C.textDim, fontSize: 12 }}>Click to upload</div></div>}
                </div>
              </div>
              <button onClick={handleAddBrand} disabled={!brandForm.name.trim()} style={{ ...btn, opacity: brandForm.name.trim() ? 1 : .4, cursor: brandForm.name.trim() ? "pointer" : "not-allowed" }}>Add Brand</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {brands.map((b,i) => (
                <div key={b.id} style={{ ...crd, overflow: "hidden", animation: `fadeUp .35s ease ${i*.04}s forwards`, opacity: 0 }}>
                  <div style={{ height: b.image ? "auto" : 70, background: b.image ? "transparent" : `linear-gradient(135deg,${b.color}20,${b.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {b.image ? <img src={b.image} alt="" style={{ width: "100%", height: 130, objectFit: "cover" }} /> : <div style={{ fontSize: 28, fontFamily: D, fontWeight: 700, color: b.color, opacity: .35 }}>{b.name.charAt(0)}</div>}
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 3 }}>{b.name}</h4>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: `${b.color}10`, color: b.color }}>{b.category}</span>
                      </div>
                      <button onClick={() => handleDeleteBrand(b.id)} style={{ background: C.dangerBg, border: "none", color: C.danger, width: 26, height: 26, borderRadius: 5, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                    {b.notes && <p style={{ color: C.textDim, fontSize: 11, lineHeight: 1.6, margin: "6px 0" }}>{b.notes}</p>}
                    {clientUsers.length > 0 && (
                      <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Assigned To</div>
                        {clientUsers.map(u => { const on = (b.assignedTo||[]).includes(u.id); return (
                          <div key={u.id} onClick={() => toggleAssign(b.id, u.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", cursor: "pointer", fontSize: 12, color: on ? C.white : C.textDim }}>
                            <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${on ? C.accent : C.border}`, background: on ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.bg, fontWeight: 700 }}>{on ? "✓" : ""}</div>{u.displayName}
                          </div>
                        ); })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!brands.length && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 50, color: C.textDim }}>No brands yet.</div>}
            </div>
          </>)}

          {/* ── USERS TAB ── */}
          {adminTab === "users" && (<>
            <div style={{ ...crd, padding: "32px 28px", marginBottom: 28 }}>
              <h3 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 20 }}>+ Create Client Account</h3>
              <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>Clients log in and see only brands you assign to them.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 18 }}>
                <div><label style={lbl}>Username *</label><input style={inp} placeholder="johndoe" value={newUserForm.username} onChange={e => setNewUserForm({...newUserForm, username: e.target.value})} /></div>
                <div><label style={lbl}>Password *</label><input style={inp} placeholder="Create password" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} /></div>
                <div><label style={lbl}>Display Name</label><input style={inp} placeholder="John Doe" value={newUserForm.displayName} onChange={e => setNewUserForm({...newUserForm, displayName: e.target.value})} /></div>
              </div>
              <button onClick={handleCreateUser} disabled={!newUserForm.username.trim()||!newUserForm.password.trim()} style={{ ...btn, opacity: (newUserForm.username.trim()&&newUserForm.password.trim()) ? 1 : .4 }}>Create Account</button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {users.map((u,i) => { const ac = brands.filter(b => (b.assignedTo||[]).includes(u.id)).length; return (
                <div key={u.id} style={{ ...crd, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", animation: `fadeUp .35s ease ${i*.04}s forwards`, opacity: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: u.role==="admin" ? C.accentGlow : "rgba(59,130,246,0.1)", border: `1px solid ${u.role==="admin" ? C.accent : C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: u.role==="admin" ? C.accent : C.blue }}>{u.displayName?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.white }}>{u.displayName} <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: u.role==="admin" ? C.accentGlow : "rgba(59,130,246,0.1)", color: u.role==="admin" ? C.accent : C.blue, textTransform: "uppercase", letterSpacing: "1px" }}>{u.role}</span></div>
                      <div style={{ fontSize: 12, color: C.textDim }}>@{u.username} · {ac} brand{ac!==1?"s":""}</div>
                    </div>
                  </div>
                  {u.role !== "admin" && <button onClick={() => handleDeleteUser(u.id)} style={{ background: C.dangerBg, border: "none", color: C.danger, padding: "5px 12px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>Delete</button>}
                </div>
              ); })}
            </div>
          </>)}

          {/* ══════════════════════════════════════════════════════
               SITE EDITOR TAB (CMS)
               
               This is the built-in content editor. Each section
               (hero, services, about, stats) has its own panel
               with text fields that map directly to the "content"
               state object. When you save, it writes to storage
               and the public pages update instantly.
               ══════════════════════════════════════════════════════ */}
          {adminTab === "editor" && editContent && (<>
            {/* Save / cancel bar */}
            <div style={{ ...crd, padding: "16px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderColor: cmsUnsaved ? C.accent : C.border }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>✏️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>Site Content Editor</div>
                  <div style={{ fontSize: 11, color: cmsUnsaved ? C.accent : C.textDim }}>{cmsUnsaved ? "You have unsaved changes" : "All changes saved"}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={cancelEditing} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, padding: "8px 18px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>Cancel</button>
                <button onClick={saveEditing} disabled={!cmsUnsaved} style={{ ...btn, padding: "8px 22px", fontSize: 12, opacity: cmsUnsaved ? 1 : .4 }}>Save Changes</button>
              </div>
            </div>

            {/* Section tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {[{k:"hero",l:"Hero"},{k:"stats",l:"Stats"},{k:"services",l:"Services"},{k:"about",l:"About"}].map(s => (
                <button key={s.k} onClick={() => setCmsSection(s.k)} style={{ background: cmsSection===s.k ? C.bgAlt : "transparent", border: `1px solid ${cmsSection===s.k ? C.border : "transparent"}`, color: cmsSection===s.k ? C.white : C.textDim, padding: "7px 16px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F }}>{s.l}</button>
              ))}
            </div>

            {/* ── Hero fields ── */}
            {cmsSection === "hero" && (
              <div style={{ ...crd, padding: "28px 24px" }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 18 }}>Hero Section</h4>
                <div style={{ display: "grid", gap: 14 }}>
                  <div><label style={lbl}>Top Tagline</label><input style={inp} value={editContent.heroTagline} onChange={e => updateField("heroTagline", e.target.value)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div><label style={lbl}>Title (Line 1)</label><input style={inp} value={editContent.heroTitle1} onChange={e => updateField("heroTitle1", e.target.value)} /></div>
                    <div><label style={lbl}>Title (Gold Text)</label><input style={inp} value={editContent.heroTitleAccent} onChange={e => updateField("heroTitleAccent", e.target.value)} /></div>
                  </div>
                  <div><label style={lbl}>Subtitle</label><textarea style={{...inp, resize: "vertical"}} rows={3} value={editContent.heroSubtitle} onChange={e => updateField("heroSubtitle", e.target.value)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div><label style={lbl}>Button 1 Text</label><input style={inp} value={editContent.heroCta1} onChange={e => updateField("heroCta1", e.target.value)} /></div>
                    <div><label style={lbl}>Button 2 Text</label><input style={inp} value={editContent.heroCta2} onChange={e => updateField("heroCta2", e.target.value)} /></div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Stats fields ── */}
            {cmsSection === "stats" && (
              <div style={{ ...crd, padding: "28px 24px" }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 18 }}>Stats Strip</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{ padding: "16px", borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}` }}>
                      <div style={{ marginBottom: 10 }}><label style={lbl}>Stat {n} Number</label><input style={inp} value={editContent[`stat${n}Num`]} onChange={e => updateField(`stat${n}Num`, e.target.value)} /></div>
                      <div><label style={lbl}>Stat {n} Label</label><input style={inp} value={editContent[`stat${n}Label`]} onChange={e => updateField(`stat${n}Label`, e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Services fields ── */}
            {cmsSection === "services" && (
              <div style={{ ...crd, padding: "28px 24px" }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 18 }}>Services Page</h4>
                <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
                  <div><label style={lbl}>Section Heading</label><input style={inp} value={editContent.servicesHeading} onChange={e => updateField("servicesHeading", e.target.value)} /></div>
                  <div><label style={lbl}>Section Subheading</label><textarea style={{...inp, resize: "vertical"}} rows={2} value={editContent.servicesSubheading} onChange={e => updateField("servicesSubheading", e.target.value)} /></div>
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                  {[1,2,3,4,5,6].map(n => (
                    <div key={n} style={{ padding: "16px", borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 10, letterSpacing: "1px" }}>SERVICE {n}</div>
                      <div style={{ marginBottom: 10 }}><label style={lbl}>Title</label><input style={inp} value={editContent[`svc${n}Title`]} onChange={e => updateField(`svc${n}Title`, e.target.value)} /></div>
                      <div><label style={lbl}>Description</label><textarea style={{...inp, resize: "vertical"}} rows={2} value={editContent[`svc${n}Desc`]} onChange={e => updateField(`svc${n}Desc`, e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── About fields ── */}
            {cmsSection === "about" && (
              <div style={{ ...crd, padding: "28px 24px" }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 18 }}>About Page</h4>
                <div style={{ display: "grid", gap: 14 }}>
                  <div><label style={lbl}>Page Heading</label><input style={inp} value={editContent.aboutHeading} onChange={e => updateField("aboutHeading", e.target.value)} /></div>
                  <div><label style={lbl}>Story Paragraph 1</label><textarea style={{...inp, resize: "vertical"}} rows={3} value={editContent.aboutStory1} onChange={e => updateField("aboutStory1", e.target.value)} /></div>
                  <div><label style={lbl}>Story Paragraph 2</label><textarea style={{...inp, resize: "vertical"}} rows={3} value={editContent.aboutStory2} onChange={e => updateField("aboutStory2", e.target.value)} /></div>
                  <div><label style={lbl}>Story Paragraph 3</label><textarea style={{...inp, resize: "vertical"}} rows={3} value={editContent.aboutStory3} onChange={e => updateField("aboutStory3", e.target.value)} /></div>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{ padding: "16px", borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 10, letterSpacing: "1px" }}>VALUE {n}</div>
                      <div style={{ marginBottom: 10 }}><label style={lbl}>Title</label><input style={inp} value={editContent[`val${n}Title`]} onChange={e => updateField(`val${n}Title`, e.target.value)} /></div>
                      <div><label style={lbl}>Description</label><textarea style={{...inp, resize: "vertical"}} rows={2} value={editContent[`val${n}Desc`]} onChange={e => updateField(`val${n}Desc`, e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>)}
        </section>
      )}

      {/* ══════ CLIENT PORTAL ══════ */}
      {page === "portal" && isClient && (
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "92px 20px 72px" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 8 }}>Client Portal</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 700, color: C.white, marginBottom: 6 }}>Welcome, {currentUser.displayName}</h2>
            <p style={{ color: C.textDim, fontSize: 14 }}>Brands assigned to your account.</p>
          </div>
          {!clientBrands.length ? (
            <div style={{ ...crd, padding: "56px 36px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <h3 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 6 }}>No Brands Yet</h3>
              <p style={{ color: C.textDim, fontSize: 13 }}>Your admin hasn't assigned any brands to your account yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {clientBrands.map((b,i) => (
                <div key={b.id} style={{ ...crd, overflow: "hidden", animation: `fadeUp .4s ease ${i*.06}s forwards`, opacity: 0 }}>
                  <div style={{ height: b.image ? "auto" : 90, background: b.image ? "transparent" : `linear-gradient(135deg,${b.color}20,${b.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {b.image ? <img src={b.image} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} /> : <div style={{ fontSize: 36, fontFamily: D, fontWeight: 700, color: b.color, opacity: .35 }}>{b.name.charAt(0)}</div>}
                  </div>
                  <div style={{ padding: "22px" }}>
                    <h4 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 5 }}>{b.name}</h4>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: `${b.color}10`, color: b.color }}>{b.category}</span>
                    {b.notes && <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7, marginTop: 10 }}>{b.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════ CONTACT ══════ */}
      {page === "contact" && (
        <section style={{ maxWidth: 700, margin: "0 auto", padding: "92px 20px 72px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 12 }}>Get In Touch</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, color: C.white, marginBottom: 12 }}>Let's Work Together</h2>
            <p style={{ color: C.textDim, fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Tell us about your project and we'll get back to you within 24 hours.</p>
          </div>

          {contactSubmitted ? (
            <div style={{ ...crd, padding: "60px 40px", textAlign: "center", animation: "fadeUp .5s ease" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontFamily: D, fontSize: 24, color: C.white, fontWeight: 700, marginBottom: 10 }}>Message Sent!</h3>
              <p style={{ color: C.textDim, fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Thanks for reaching out. We'll get back to you shortly.</p>
              <button onClick={() => { setContactSubmitted(false); nav("home"); }} style={{ ...btn, padding: "13px 32px" }}>Back to Home</button>
            </div>
          ) : (
            <div style={{ ...crd, padding: "36px 32px", animation: "fadeUp .5s ease" }}>
              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>First Name *</label>
                  <input style={inp} placeholder="Jane" value={contactForm.firstName} onChange={e => setContactForm({...contactForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label style={lbl}>Last Name *</label>
                  <input style={inp} placeholder="Smith" value={contactForm.lastName} onChange={e => setContactForm({...contactForm, lastName: e.target.value})} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Email *</label>
                <input type="email" style={inp} placeholder="jane@company.com" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
              </div>

              {/* Phone & Company row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Phone <span style={{ opacity: .5, fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                  <input type="tel" style={inp} placeholder="(555) 123-4567" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                </div>
                <div>
                  <label style={lbl}>Company <span style={{ opacity: .5, fontWeight: 400, textTransform: "none" }}>(if applicable)</span></label>
                  <input style={inp} placeholder="Company name" value={contactForm.company} onChange={e => setContactForm({...contactForm, company: e.target.value})} />
                </div>
              </div>

              {/* Service checkboxes */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ ...lbl, marginBottom: 10 }}>Type of Service</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Website", "Logo", "Marketing Material", "Social Media Posts"].map(svc => {
                    const checked = contactForm.services.includes(svc);
                    return (
                      <div
                        key={svc}
                        onClick={() => toggleService(svc)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 14px", borderRadius: 9, cursor: "pointer",
                          background: checked ? C.accentGlow : C.bgAlt,
                          border: `1px solid ${checked ? C.accent : C.border}`,
                          transition: "all .2s",
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                          border: `2px solid ${checked ? C.accent : C.border}`,
                          background: checked ? C.accent : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, color: C.bg, fontWeight: 700,
                          transition: "all .2s",
                        }}>{checked ? "✓" : ""}</div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: checked ? C.white : C.textDim }}>{svc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleContactSubmit}
                disabled={!contactForm.firstName.trim() || !contactForm.lastName.trim() || !contactForm.email.trim() || contactSubmitting}
                style={{
                  ...btn, width: "100%", padding: "15px",
                  fontSize: 16,
                  opacity: (!contactForm.firstName.trim() || !contactForm.lastName.trim() || !contactForm.email.trim() || contactSubmitting) ? .4 : 1,
                  cursor: (!contactForm.firstName.trim() || !contactForm.lastName.trim() || !contactForm.email.trim() || contactSubmitting) ? "not-allowed" : "pointer",
                }}
              >
                {contactSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Not logged in → portal */}
      {page === "portal" && !currentUser && (
        <section style={{ maxWidth: 460, margin: "0 auto", padding: "150px 20px 72px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔒</div>
          <h2 style={{ fontFamily: D, fontSize: 26, color: C.white, fontWeight: 700, marginBottom: 10 }}>Login Required</h2>
          <p style={{ color: C.textDim, fontSize: 14, marginBottom: 24 }}>Sign in to access the brand portal.</p>
          <button onClick={() => nav("login")} style={{ ...btn, padding: "13px 32px", fontSize: 15 }}>Go to Login</button>
        </section>
      )}

      {/* ══════ FOOTER ══════ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "40px 20px", marginTop: 50 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/logo.png" alt="CM" style={{ width: 28, height: 28, borderRadius: 7 }} />
            <span style={{ fontWeight: 600, fontSize: 13, color: C.textDim }}>CM Marketing & Design</span>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {["home","services","about","contact"].map(k => <button key={k} onClick={() => nav(k)} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: F, textTransform: "capitalize" }}>{k}</button>)}
          </div>
          <div style={{ color: C.textDim, fontSize: 10, opacity: .4 }}>© {new Date().getFullYear()} CM Marketing & Design</div>
        </div>
      </footer>
    </div>
  );
}
