import { useState, useRef, useEffect, useCallback } from "react";
import storage from "./storage";
import { FloatingPaths } from "./components/ui/background-paths";
import { motion } from "framer-motion";

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
// THEME COLORS — Matched to the CM logo: charcoal + warm cream
// ═══════════════════════════════════════════════════════════════════
const DARK = {
  bg: "#141414", bgAlt: "#1c1c1c", card: "#222222",
  accent: "#ddd2be", accentLight: "#eee6d6",
  accentGlow: "rgba(221,210,190,0.1)", accentGlow2: "rgba(221,210,190,0.05)",
  text: "#c5c0b8", textDim: "#7a756d", white: "#ece5d8",
  border: "#333333", success: "#6ec98f", successBg: "rgba(110,201,143,0.1)",
  danger: "#e05555", dangerBg: "rgba(224,85,85,0.1)",
  blue: "#7aabe0", purple: "#a890d6",
  navBg: "rgba(20,20,20,0.94)",
};
const LIGHT = {
  bg: "#f5f0e8", bgAlt: "#ebe5da", card: "#ffffff",
  accent: "#3a3a3a", accentLight: "#555555",
  accentGlow: "rgba(58,58,58,0.08)", accentGlow2: "rgba(58,58,58,0.04)",
  text: "#3a3a3a", textDim: "#8a8478", white: "#1e1e1e",
  border: "#d6cfc2", success: "#3a8a5c", successBg: "rgba(58,138,92,0.08)",
  danger: "#c0392b", dangerBg: "rgba(192,57,43,0.08)",
  blue: "#2e6da4", purple: "#6b4fa0",
  navBg: "rgba(245,240,232,0.94)",
};
const F = "'Space Grotesk',sans-serif";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [brandKitTab, setBrandKitTab] = useState("colors");
  const [copiedHex, setCopiedHex] = useState(null);
  const [projects, setProjects] = useState([]);
  const fileRef = useRef(null);
  const brandFileRef = useRef(null);
  const projectFileRef = useRef(null);

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
        try { const d = await storage.get("cm-projects"); if (d?.value) setProjects(JSON.parse(d.value)); } catch(e) {}
        try { const d = await storage.get("cm-session"); if (d?.value) setCurrentUser(JSON.parse(d.value)); } catch(e) {}
        try { const d = await storage.get("cm-content"); if (d?.value) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(d.value) }); } catch(e) {}
      } catch(e) {}
      setLoading(false);
    })();
  }, []);

  // ── Save helpers ───────────────────────────────────────────────
  const saveUsers = async (v) => { setUsers(v); try { await storage.set("cm-users", JSON.stringify(v)); } catch(e) {} };
  const saveBrands = async (v) => { setBrands(v); try { await storage.set("cm-brands", JSON.stringify(v)); } catch(e) {} };
  const saveProjects = async (v) => { setProjects(v); try { await storage.set("cm-projects", JSON.stringify(v)); } catch(e) {} };
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

  // ── Brand Kit helpers ──────────────────────────────────────────
  /*
    BRAND KIT DATA STRUCTURE — each brand now has these extra fields:
    - brandColors: [{ id, hex, name }]           → color palette with hex codes
    - logoFiles: [{ id, name, type, data }]       → logo images in various formats
    - moodBoard: [{ id, name, data }]             → inspiration images
    - fonts: [{ id, name, role, weight, url }]    → font information
    
    All stored as part of the brand object in cm-brands storage.
  */
  const openBrand = (id) => { setSelectedBrandId(id); setBrandKitTab("colors"); setPage("brand"); window.scrollTo({ top: 0 }); };
  const selectedBrand = brands.find(b => b.id === selectedBrandId);

  const updateBrand = async (id, updates) => {
    const updated = brands.map(b => b.id === id ? { ...b, ...updates } : b);
    await saveBrands(updated);
  };

  // Colors
  const addBrandColor = async (brandId, hex, name) => {
    const b = brands.find(x => x.id === brandId);
    const colors = b?.brandColors || [];
    await updateBrand(brandId, { brandColors: [...colors, { id: `c-${Date.now()}`, hex: hex.startsWith("#") ? hex : `#${hex}`, name: name || "" }] });
    showToast("Color added");
  };
  const removeBrandColor = async (brandId, colorId) => {
    const b = brands.find(x => x.id === brandId);
    await updateBrand(brandId, { brandColors: (b?.brandColors || []).filter(c => c.id !== colorId) });
  };
  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex).then(() => { setCopiedHex(hex); setTimeout(() => setCopiedHex(null), 1500); showToast(`Copied ${hex}`); });
  };

  // Logo files
  const addLogoFile = (brandId, file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const b = brands.find(x => x.id === brandId);
      const logos = b?.logoFiles || [];
      const ext = file.name.split(".").pop().toUpperCase();
      await updateBrand(brandId, { logoFiles: [...logos, { id: `l-${Date.now()}`, name: file.name, type: ext, data: reader.result }] });
      showToast(`Logo "${file.name}" added`);
    };
    reader.readAsDataURL(file);
  };
  const removeLogoFile = async (brandId, logoId) => {
    const b = brands.find(x => x.id === brandId);
    await updateBrand(brandId, { logoFiles: (b?.logoFiles || []).filter(l => l.id !== logoId) });
  };

  // Mood board
  const addMoodImage = (brandId, file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const b = brands.find(x => x.id === brandId);
      const mood = b?.moodBoard || [];
      await updateBrand(brandId, { moodBoard: [...mood, { id: `m-${Date.now()}`, name: file.name, data: reader.result }] });
      showToast("Image added to mood board");
    };
    reader.readAsDataURL(file);
  };
  const removeMoodImage = async (brandId, imgId) => {
    const b = brands.find(x => x.id === brandId);
    await updateBrand(brandId, { moodBoard: (b?.moodBoard || []).filter(m => m.id !== imgId) });
  };

  // Fonts
  const addFont = async (brandId, fontData) => {
    const b = brands.find(x => x.id === brandId);
    const fonts = b?.fonts || [];
    await updateBrand(brandId, { fonts: [...fonts, { id: `f-${Date.now()}`, ...fontData }] });
    showToast("Font added");
  };
  const removeFont = async (brandId, fontId) => {
    const b = brands.find(x => x.id === brandId);
    await updateBrand(brandId, { fonts: (b?.fonts || []).filter(f => f.id !== fontId) });
  };

  // Download helper — triggers a browser download from a data URL
  const downloadFile = (dataUrl, filename) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Projects helpers ───────────────────────────────────────────
  /*
    PROJECT DATA STRUCTURE:
    {
      id, title, description, category, url,
      coverImage (data URL), 
      gallery: [{ id, name, data }],
      files: [{ id, name, type, data }],
      featured: boolean,
      createdAt
    }
  */
  const addProject = async (proj) => {
    await saveProjects([{ id: `p-${Date.now()}`, ...proj, createdAt: new Date().toISOString() }, ...projects]);
    showToast(`Project "${proj.title}" added!`);
  };
  const deleteProject = async (id) => {
    await saveProjects(projects.filter(p => p.id !== id));
    showToast("Project deleted");
  };
  const updateProject = async (id, updates) => {
    await saveProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const addProjectImage = (projId, file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const p = projects.find(x => x.id === projId);
      const gallery = p?.gallery || [];
      await updateProject(projId, { gallery: [...gallery, { id: `gi-${Date.now()}`, name: file.name, data: reader.result }] });
    };
    reader.readAsDataURL(file);
  };
  const removeProjectImage = async (projId, imgId) => {
    const p = projects.find(x => x.id === projId);
    await updateProject(projId, { gallery: (p?.gallery || []).filter(g => g.id !== imgId) });
  };
  const addProjectFile = (projId, file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const p = projects.find(x => x.id === projId);
      const files = p?.files || [];
      const ext = file.name.split(".").pop().toUpperCase();
      await updateProject(projId, { files: [...files, { id: `pf-${Date.now()}`, name: file.name, type: ext, data: reader.result }] });
    };
    reader.readAsDataURL(file);
  };
  const removeProjectFile = async (projId, fileId) => {
    const p = projects.find(x => x.id === projId);
    await updateProject(projId, { files: (p?.files || []).filter(f => f.id !== fileId) });
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
      // ALWAYS submit to Netlify Forms first — this is what shows in the dashboard
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
      // ALSO try SMTP function for email notification (fire and forget)
      fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contactForm.firstName, lastName: contactForm.lastName,
          email: contactForm.email, phone: contactForm.phone,
          company: contactForm.company, services: contactForm.services.join(", "),
        }),
      }).catch(() => {}); // silently ignore if SMTP not configured
      setContactSubmitted(true);
      setContactForm({ firstName: "", lastName: "", email: "", phone: "", company: "", services: [] });
    } catch (e) {
      showToast("Something went wrong. Please try again.", "error");
    }
    setContactSubmitting(false);
  };

  // ── Nav & helpers ──────────────────────────────────────────────
  const nav = (p) => { setPage(p); setMenuOpen(false); setContactSubmitted(false); window.scrollTo({ top: 0 }); };
  const isAdmin = currentUser?.role === "admin";
  const isClient = currentUser?.role === "client";
  const clientBrands = brands.filter(b => (b.assignedTo || []).includes(currentUser?.id));
  const clientUsers = users.filter(u => u.role === "client");
  const ct = content; // shorthand for reading content in JSX

  // ── Styles ─────────────────────────────────────────────────────
  const inp = { width: "100%", padding: "12px 16px", background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, fontSize: 15, fontFamily: F, outline: "none", transition: "all .2s" };
  const lbl = { display: "block", color: C.textDim, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: "1px", textTransform: "uppercase" };
  const btn = { background: C.accent, border: "none", color: dark ? "#141414" : "#f5f0e8", padding: "12px 26px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, transition: "all .25s ease", letterSpacing: "0.01em" };
  const crd = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ fontFamily: F, background: C.bg, color: C.white, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
        @keyframes gradientPulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        button:active{transform:scale(0.97)!important}
        button{cursor:pointer}
        input:focus,textarea:focus,select:focus{border-color:${C.accent}!important;outline:none;box-shadow:0 0 0 3px ${C.accentGlow}}
        textarea{font-family:${F}}
        a{cursor:pointer}
        /* Desktop nav links — hidden on mobile */
        .nav-desktop { display: flex; gap: 3; align-items: center; }
        .nav-hamburger { display: none; }
        /* Mobile menu panel — hidden on desktop */
        .nav-mobile-panel { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-panel { display: flex !important; }
        }
        .svc-card:hover{border-color:${C.accent}!important;transform:translateY(-3px)!important;box-shadow:0 12px 40px ${C.accentGlow}!important}
        .stat-card{transition:all .3s ease}
        .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px ${C.accentGlow}}
        .nav-link:hover{color:${C.accent}!important;background:${C.accentGlow}!important}
        .footer-link:hover{color:${C.accent}!important}
        .val-card:hover{border-color:${C.accent}!important;box-shadow:0 4px 24px ${C.accentGlow}!important}
      `}</style>

      {/* Toast */}
      {toast && <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 9999, padding: "10px 24px", borderRadius: 9, background: toast.type === "error" ? C.dangerBg : C.successBg, border: `1px solid ${toast.type === "error" ? C.danger : C.success}`, color: toast.type === "error" ? C.danger : C.success, fontWeight: 600, fontSize: 13, animation: "slideDown .3s ease", backdropFilter: "blur(12px)" }}>{toast.msg}</div>}

      {/* ══════ NAV ══════ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: C.navBg, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <div onClick={() => nav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="CM" style={{ width: 36, height: 36, borderRadius: 9 }} />
            <div><div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>CM Marketing</div><div style={{ fontSize: 9, color: C.accent, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 700 }}>& Design</div></div>
          </div>

          {/* ── Desktop nav (hidden on mobile via CSS) ── */}
          <div className="nav-desktop" style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {["home","services","projects","about","contact"].map(k => (
              <button key={k} onClick={() => nav(k)} className="nav-link" style={{ background: page===k ? C.accentGlow : "transparent", border: "none", color: page===k ? C.accent : C.textDim, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F, textTransform: "capitalize", transition: "all .2s" }}>{k}</button>
            ))}
            <button onClick={toggleTheme} title={dark ? "Switch to light mode" : "Switch to dark mode"} style={{ width: 34, height: 34, borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}`, color: C.accent, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s ease", marginLeft: 2 }}>{dark ? "☀" : "☽"}</button>
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                <button onClick={() => nav("portal")} style={{ background: page==="portal" ? C.accentGlow : "transparent", border: `1px solid ${page==="portal" ? C.accent : C.border}`, color: page==="portal" ? C.accent : C.textDim, padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: F, transition: "all .2s" }}>{isAdmin ? "Admin" : "My Brands"}</button>
                <button onClick={handleLogout} title={`Logout (${currentUser.displayName})`} style={{ width: 32, height: 32, borderRadius: 8, background: isAdmin ? C.accentGlow : "rgba(59,130,246,0.12)", border: `1px solid ${isAdmin ? C.accent : C.blue}`, color: isAdmin ? C.accent : C.blue, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>{currentUser.displayName.charAt(0).toUpperCase()}</button>
              </div>
            ) : (
              <button onClick={() => nav("login")} style={{ ...btn, padding: "8px 20px", fontSize: 13, marginLeft: 6 }}>Log In</button>
            )}
          </div>

          {/* ── Mobile: theme toggle + hamburger button (hidden on desktop via CSS) ── */}
          <div className="nav-hamburger" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}`, color: C.accent, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? "☀" : "☽"}</button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 40, height: 40, borderRadius: 8,
                background: menuOpen ? C.accentGlow : C.bgAlt,
                border: `1px solid ${menuOpen ? C.accent : C.border}`,
                color: menuOpen ? C.accent : C.textDim,
                fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s",
              }}
            >
              {/* Hamburger icon (☰) or close icon (✕) */}
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ── Mobile menu panel (slides down when open) ── */}
        <div
          className="nav-mobile-panel"
          style={{
            display: "none",
            flexDirection: "column",
            maxHeight: menuOpen ? 500 : 0,
            overflow: "hidden",
            transition: "max-height .35s ease, padding .35s ease",
            padding: menuOpen ? "12px 20px 20px" : "0 20px",
            borderTop: menuOpen ? `1px solid ${C.border}` : "none",
            background: C.navBg,
          }}
        >
          {["home","services","projects","about","contact"].map(k => (
            <button
              key={k}
              onClick={() => nav(k)}
              style={{
                background: page===k ? C.accentGlow : "transparent",
                border: "none",
                color: page===k ? C.accent : C.textDim,
                padding: "14px 16px",
                borderRadius: 10, cursor: "pointer",
                fontSize: 16, fontWeight: 600, fontFamily: F,
                textTransform: "capitalize", textAlign: "left",
                transition: "all .2s",
                borderBottom: `1px solid ${C.border}`,
              }}
            >{k}</button>
          ))}
          {/* Portal / Login button in mobile menu */}
          <div style={{ paddingTop: 12, display: "flex", gap: 8 }}>
            {currentUser ? (<>
              <button onClick={() => nav("portal")} style={{ ...btn, flex: 1, padding: "12px", fontSize: 14, textAlign: "center" }}>{isAdmin ? "Admin Portal" : "My Brands"}</button>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, color: C.textDim, padding: "12px 16px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F }}>Log Out</button>
            </>) : (
              <button onClick={() => nav("login")} style={{ ...btn, flex: 1, padding: "12px", fontSize: 14, textAlign: "center" }}>Log In</button>
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
        {/* ── HERO ── */}
        <section style={{ minHeight: "95vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: dark ? "#0a0a0a" : "#fafaf8" }}>
          {/* FloatingPaths background */}
          <div style={{ position: "absolute", inset: 0, opacity: dark ? 0.4 : 0.15 }}>
            <FloatingPaths position={1} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: dark ? 0.25 : 0.1 }}>
            <FloatingPaths position={-1} />
          </div>
          {/* Subtle radial vignette */}
          <div style={{ position: "absolute", inset: 0, background: dark ? "radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)" : "radial-gradient(ellipse at center, transparent 40%, #fafaf8 100%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}
            >
              <img src="/logo.png" alt="CM" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 99, background: dark ? "rgba(221,210,190,0.08)" : "rgba(58,58,58,0.06)", border: `1px solid ${dark ? "rgba(221,210,190,0.2)" : "rgba(58,58,58,0.15)"}` }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: F }}>{ct.heroTagline}</span>
              </div>
            </motion.div>

            {/* Main heading — animated letter-by-letter */}
            <div style={{ marginBottom: 32, overflow: "hidden" }}>
              {[ct.heroTitle1, ct.heroTitleAccent].map((line, lineIdx) => (
                <div key={lineIdx} style={{ overflow: "hidden", display: "block" }}>
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: lineIdx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: "block" }}
                  >
                    <span style={{
                      fontFamily: D,
                      fontSize: "clamp(52px,8vw,96px)",
                      fontWeight: 700,
                      lineHeight: 1.0,
                      letterSpacing: "-0.03em",
                      color: lineIdx === 1 ? C.accent : C.white,
                      fontStyle: lineIdx === 1 ? "italic" : "normal",
                      display: "block",
                    }}>{line}</span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Subtitle + CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}
            >
              <p style={{ fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.8, color: C.textDim, maxWidth: 420, fontFamily: F, margin: 0, flex: "1 1 300px" }}>{ct.heroSubtitle}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: "0 0 auto" }}>
                <button
                  onClick={() => nav("contact")}
                  style={{ background: C.accent, border: "none", color: dark ? "#0a0a0a" : "#f5f0e8", padding: "16px 40px", borderRadius: 6, cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: F, letterSpacing: "0.02em", transition: "all .25s ease", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${C.accentGlow}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
                >Get a Free Consultation</button>
                <button
                  onClick={() => nav("services")}
                  style={{ background: "transparent", border: "none", color: C.textDim, padding: "8px 0", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: F, textAlign: "left", transition: "all .2s", letterSpacing: "0.01em" }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.textDim; }}
                >View Services →</button>
              </div>
            </motion.div>

            {/* Bottom scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              style={{ position: "absolute", bottom: -60, left: 0, display: "flex", alignItems: "center", gap: 10 }}
            >
              <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.accent}, transparent)` }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", fontFamily: F }}>Scroll</span>
            </motion.div>
          </div>
        </section>

        {/* ── MARQUEE STRIP ── */}
        <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "16px 0", background: C.bgAlt, marginBottom: 0 }}>
          <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content", gap: 0 }}>
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", gap: 0 }}>
                {["Brand Identity", "Web Design", "Social Media", "Marketing Strategy", "Content Creation", "SEO & Ads", "Brand Identity", "Web Design", "Social Media", "Marketing Strategy", "Content Creation", "SEO & Ads"].map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "0 32px", fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: C.textDim, whiteSpace: "nowrap" }}>
                    <span style={{ color: C.accent, fontSize: 8 }}>◆</span>{item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[{n: ct.stat1Num, l: ct.stat1Label},{n: ct.stat2Num, l: ct.stat2Label},{n: ct.stat3Num, l: ct.stat3Label},{n: ct.stat4Num, l: ct.stat4Label}].map((s,i) => (
              <div key={i} style={{ padding: "44px 32px", borderRight: i < 3 ? `1px solid ${C.border}` : "none", textAlign: "center" }}>
                <div style={{ fontFamily: D, fontSize: "clamp(36px,4vw,56px)", fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em" }}>{s.n}</div>
                <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", fontFamily: F }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES PREVIEW on Home ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16, fontFamily: F }}>What We Do</div>
              <h2 style={{ fontFamily: D, fontSize: "clamp(32px,5vw,58px)", fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>Services Built to<br />Grow Your Brand</h2>
            </div>
            <button
              onClick={() => nav("services")}
              style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, padding: "12px 24px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F, transition: "all .2s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
            >All Services →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, border: `1px solid ${C.border}` }}>
            {[
              { num: "01", t: "Branding", d: "Complete brand systems — logos, color palettes, typography, and guidelines." },
              { num: "02", t: "Web Design", d: "Beautiful, fast, mobile-friendly websites built to convert visitors." },
              { num: "03", t: "Social Media", d: "Strategic content creation and community management across all platforms." },
              { num: "04", t: "Strategy", d: "Data-driven marketing plans tailored to your goals and audience." },
              { num: "05", t: "Content", d: "Compelling copy and visuals that tell your brand story and convert." },
              { num: "06", t: "SEO & Ads", d: "Get found online with targeted campaigns that maximize your ROI." },
            ].map((s,i) => (
              <div key={i} onClick={() => nav("services")} style={{ padding: "36px 32px", background: C.card, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "all .25s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.bgAlt; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.card; }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "1px", fontFamily: F, marginBottom: 16, opacity: 0.6 }}>{s.num}</div>
                <h3 style={{ fontFamily: D, fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 10, letterSpacing: "-0.01em" }}>{s.t}</h3>
                <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.75, fontFamily: F, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY CM ── */}
        <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 80, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: D, fontSize: "clamp(36px,4vw,52px)", fontWeight: 700, color: C.white, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 28 }}>
                "We don't do<br /><span style={{ color: C.accent, fontStyle: "italic" }}>cookie-cutter.</span>"
              </div>
              <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.85, fontFamily: F, margin: "0 0 36px" }}>
                Every brand we build is researched, strategized, and crafted specifically for your business and audience. Let's create something worth remembering.
              </p>
              <button
                onClick={() => nav("contact")}
                style={{ background: C.accent, border: "none", color: dark ? "#0a0a0a" : "#f5f0e8", padding: "15px 36px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: F, transition: "all .25s ease", letterSpacing: "0.02em" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${C.accentGlow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
              >Start Your Project</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { n: "100+", l: "Brands Built", d: "From startups to established companies, we've shaped identities that last." },
                { n: "5★", l: "Client Satisfaction", d: "Our clients come back — and they bring their friends." },
                { n: "ROI", l: "Driven Results", d: "Beautiful work is great. Work that grows your revenue is better." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 24, borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontFamily: D, fontSize: 28, fontWeight: 700, color: C.accent, letterSpacing: "-0.02em", flexShrink: 0, minWidth: 60 }}>{item.n}</div>
                  <div>
                    <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.textDim, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>{item.l}</div>
                    <div style={{ fontFamily: F, fontSize: 14, color: C.textDim, lineHeight: 1.65 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>)}

      {/* ══════ SERVICES ══════ */}
      {page === "services" && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 80px" }}>
          <div style={{ marginBottom: 80 }}>
            <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20, fontFamily: F }}>What We Do</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 24, maxWidth: 700 }}>{ct.servicesHeading}</h2>
            <p style={{ color: C.textDim, fontSize: 17, maxWidth: 500, lineHeight: 1.8, fontFamily: F }}>{ct.servicesSubheading}</p>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {[
              { num: "01", t: ct.svc1Title, d: ct.svc1Desc, tag: "Branding" },
              { num: "02", t: ct.svc2Title, d: ct.svc2Desc, tag: "Web" },
              { num: "03", t: ct.svc3Title, d: ct.svc3Desc, tag: "Social" },
              { num: "04", t: ct.svc4Title, d: ct.svc4Desc, tag: "Strategy" },
              { num: "05", t: ct.svc5Title, d: ct.svc5Desc, tag: "Content" },
              { num: "06", t: ct.svc6Title, d: ct.svc6Desc, tag: "Growth" },
            ].map((s,i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 32, alignItems: "start", padding: "40px 0", borderBottom: `1px solid ${C.border}`, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.paddingLeft = "12px"; }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}
              >
                <div style={{ fontFamily: D, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.5px", opacity: 0.5, paddingTop: 4 }}>{s.num}</div>
                <div>
                  <h3 style={{ fontFamily: D, fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: C.white, marginBottom: 12, letterSpacing: "-0.02em" }}>{s.t}</h3>
                  <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.8, fontFamily: F, maxWidth: 600 }}>{s.d}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", opacity: .4, paddingTop: 6, fontFamily: F }}>{s.tag}</span>
              </div>
            ))}
          </div>
          {/* CTA at bottom */}
          <div style={{ marginTop: 80, padding: "64px 0", borderTop: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: D, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: "-0.02em" }}>Not Sure What You Need?</h3>
            <p style={{ color: C.textDim, fontSize: 16, marginBottom: 36, maxWidth: 460, lineHeight: 1.75, fontFamily: F }}>We'll help you figure out the right strategy. No pressure, no commitment — just a conversation.</p>
            <button
              onClick={() => nav("contact")}
              style={{ background: C.accent, border: "none", color: dark ? "#0a0a0a" : "#f5f0e8", padding: "16px 40px", borderRadius: 6, cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: F, transition: "all .25s ease", letterSpacing: "0.02em" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${C.accentGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
            >Book a Free Consultation →</button>
          </div>
        </section>
      )}

      {/* ══════ ABOUT ══════ */}
      {page === "about" && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 80px" }}>
          <div style={{ marginBottom: 80 }}>
            <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20, fontFamily: F }}>Who We Are</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.0, maxWidth: 700 }}>{ct.aboutHeading}</h2>
          </div>
          {/* Story section - two col */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginBottom: 80, paddingBottom: 80, borderBottom: `1px solid ${C.border}` }}>
            <div>
              <h3 style={{ fontFamily: D, fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 24, opacity: 0.7 }}>Our Story</h3>
              <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.9, fontFamily: F, marginBottom: 20 }}>{ct.aboutStory1}</p>
              <p style={{ color: C.textDim, fontSize: 16, lineHeight: 1.9, fontFamily: F }}>{ct.aboutStory2}</p>
            </div>
            <div style={{ paddingTop: 40 }}>
              <p style={{ color: C.text, fontSize: 18, lineHeight: 1.85, fontFamily: D, fontStyle: "italic", marginBottom: 32, borderLeft: `3px solid ${C.accent}`, paddingLeft: 24 }}>"{ct.aboutStory3}"</p>
              <div style={{ display: "flex", gap: 40 }}>
                <div>
                  <div style={{ fontFamily: D, fontSize: 40, fontWeight: 700, color: C.accent, letterSpacing: "-0.03em" }}>100+</div>
                  <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: F }}>Brands Created</div>
                </div>
                <div>
                  <div style={{ fontFamily: D, fontSize: 40, fontWeight: 700, color: C.accent, letterSpacing: "-0.03em" }}>5★</div>
                  <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: F }}>Client Rating</div>
                </div>
              </div>
            </div>
          </div>
          {/* Values */}
          <div style={{ marginBottom: 80 }}>
            <h3 style={{ fontFamily: D, fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 48, opacity: 0.7 }}>What We Stand For</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, border: `1px solid ${C.border}` }}>
              {[
                { num: "01", t: ct.val1Title, d: ct.val1Text },
                { num: "02", t: ct.val2Title, d: ct.val2Text },
                { num: "03", t: ct.val3Title, d: ct.val3Text },
                { num: "04", t: ct.val4Title, d: ct.val4Text },
              ].map((v,i) => (
                <div key={i} style={{ padding: "36px 32px", borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: "1px", marginBottom: 20, opacity: 0.5 }}>{v.num}</div>
                  <h4 style={{ fontFamily: D, fontSize: 20, color: C.white, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>{v.t}</h4>
                  <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, fontFamily: F, margin: 0 }}>{v.d}</p>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <div style={{ paddingTop: 64, borderTop: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: D, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: "-0.02em" }}>Let's Build Something Great Together</h3>
            <p style={{ color: C.textDim, fontSize: 16, marginBottom: 36, maxWidth: 440, lineHeight: 1.75, fontFamily: F }}>Ready to take your brand to the next level? Reach out and let's talk about your vision.</p>
            <button
              onClick={() => nav("contact")}
              style={{ background: C.accent, border: "none", color: dark ? "#0a0a0a" : "#f5f0e8", padding: "16px 40px", borderRadius: 6, cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: F, transition: "all .25s ease", letterSpacing: "0.02em" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${C.accentGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}
            >Get In Touch →</button>
          </div>
        </section>
      )}

      {/* ══════ PROJECTS ══════ */}
      {page === "projects" && (
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "100px 20px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 14 }}>Portfolio</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, color: C.white, marginBottom: 14, letterSpacing: "-0.02em" }}>Our Projects</h2>
            <p style={{ color: C.textDim, fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>A selection of brands, websites, and campaigns we've brought to life.</p>
          </div>

          {/* Admin: Add Project form */}
          {isAdmin && (
            <div style={{ ...crd, padding: "32px 28px", marginBottom: 32 }}>
              <h3 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 20 }}>+ Add Project</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 14 }}>
                <div><label style={lbl}>Project Title *</label><input id="projTitle" style={inp} placeholder="e.g. Summit Coffee Rebrand" /></div>
                <div><label style={lbl}>Category</label><select id="projCategory" style={{ ...inp, cursor: "pointer" }}>
                  <option value="Branding">Branding</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Print">Print</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Other">Other</option>
                </select></div>
                <div><label style={lbl}>External URL <span style={{ opacity: .5, fontWeight: 400, textTransform: "none" }}>(optional)</span></label><input id="projUrl" style={inp} placeholder="https://client-site.com" /></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Description</label>
                <textarea id="projDesc" style={{ ...inp, resize: "vertical" }} rows={3} placeholder="Brief overview of the project, goals, and results..." />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Cover Image</label>
                <input type="file" id="projCoverInput" accept="image/*" onChange={e => {
                  const f = e.target.files[0]; if (!f) return;
                  const r = new FileReader(); r.onloadend = () => { window._projCover = r.result; e.target.nextElementSibling && (e.target.nextElementSibling.src = r.result); }; r.readAsDataURL(f);
                }} style={{ display: "none" }} />
                <div onClick={() => document.getElementById("projCoverInput").click()} style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: 28, textAlign: "center", cursor: "pointer", background: C.bgAlt }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📁</div>
                  <div style={{ color: C.textDim, fontSize: 12 }}>Click to upload a cover image</div>
                </div>
              </div>
              <button onClick={() => {
                const title = document.getElementById("projTitle").value.trim();
                if (!title) return;
                addProject({
                  title,
                  category: document.getElementById("projCategory").value,
                  description: document.getElementById("projDesc").value.trim(),
                  url: document.getElementById("projUrl").value.trim(),
                  coverImage: window._projCover || null,
                  gallery: [], files: [], featured: false,
                });
                document.getElementById("projTitle").value = "";
                document.getElementById("projDesc").value = "";
                document.getElementById("projUrl").value = "";
                window._projCover = null;
              }} style={btn}>Add Project</button>
            </div>
          )}

          {/* Project cards grid */}
          {projects.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
              {projects.map((p, i) => (
                <div key={p.id} style={{ ...crd, overflow: "hidden", animation: `fadeUp .4s ease ${i * .06}s forwards`, opacity: 0, transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                  {/* Cover image */}
                  <div style={{ height: p.coverImage ? "auto" : 160, background: p.coverImage ? "transparent" : `linear-gradient(135deg,${C.accent}15,${C.accent}05)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {p.coverImage ? (
                      <img src={p.coverImage} alt={p.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                    ) : (
                      <div style={{ fontSize: 40, fontFamily: D, fontWeight: 700, color: C.accent, opacity: .2 }}>{p.title.charAt(0)}</div>
                    )}
                  </div>
                  <div style={{ padding: "22px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <h3 style={{ fontFamily: D, fontSize: 20, color: C.white, fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: C.accentGlow, color: C.accent }}>{p.category}</span>
                      </div>
                      {isAdmin && <button onClick={() => deleteProject(p.id)} style={{ background: C.dangerBg, border: "none", color: C.danger, width: 26, height: 26, borderRadius: 5, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>}
                    </div>
                    {p.description && <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, marginTop: 10, marginBottom: 12 }}>{p.description}</p>}

                    {/* External URL */}
                    {p.url && (
                      <a href={p.url.startsWith("http") ? p.url : `https://${p.url}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.accent, fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 12 }}>
                        View Live ↗
                      </a>
                    )}

                    {/* Gallery preview */}
                    {(p.gallery || []).length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
                          {(p.gallery || []).map(g => (
                            <div key={g.id} style={{ position: "relative", flexShrink: 0 }}>
                              <img src={g.data} alt={g.name} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, border: `1px solid ${C.border}` }} />
                              {isAdmin && <button onClick={() => removeProjectImage(p.id, g.id)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 16, height: 16, borderRadius: 3, cursor: "pointer", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files */}
                    {(p.files || []).length > 0 && (
                      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {(p.files || []).map(f => (
                          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 11 }}>
                            <span style={{ color: C.accent, fontWeight: 700 }}>{f.type}</span>
                            <button onClick={() => downloadFile(f.data, f.name)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 11, fontFamily: F }}>↓ {f.name}</button>
                            {isAdmin && <button onClick={() => removeProjectFile(p.id, f.id)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 10 }}>✕</button>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Admin: add images/files to this project */}
                    {isAdmin && (
                      <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div>
                          <input type="file" id={`gallery-${p.id}`} accept="image/*" multiple onChange={e => { Array.from(e.target.files).forEach(f => addProjectImage(p.id, f)); e.target.value = ""; }} style={{ display: "none" }} />
                          <button onClick={() => document.getElementById(`gallery-${p.id}`).click()} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, color: C.textDim, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>+ Images</button>
                        </div>
                        <div>
                          <input type="file" id={`files-${p.id}`} multiple onChange={e => { Array.from(e.target.files).forEach(f => addProjectFile(p.id, f)); e.target.value = ""; }} style={{ display: "none" }} />
                          <button onClick={() => document.getElementById(`files-${p.id}`).click()} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, color: C.textDim, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>+ Files</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...crd, padding: "60px 36px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.accentGlow, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.accent }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 13.5V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6.5"/><path d="M12 2v13M8 6l4-4 4 4"/></svg>
              </div>
              <h3 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>{isAdmin ? "No Projects Yet" : "Projects Coming Soon"}</h3>
              <p style={{ color: C.textDim, fontSize: 13 }}>{isAdmin ? "Add your first project above to showcase your work." : "Check back soon to see our latest work."}</p>
            </div>
          )}

          {/* CTA at bottom */}
          <div style={{ textAlign: "center", marginTop: 48, ...crd, padding: "48px 36px", borderColor: C.accent, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.accent }} />
            <h3 style={{ fontFamily: D, fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: C.white, marginBottom: 12 }}>Like What You See?</h3>
            <p style={{ color: C.textDim, fontSize: 15, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>Your brand could be next. Let's talk about what we can create for you.</p>
            <button onClick={() => nav("contact")} style={{ ...btn, padding: "15px 36px", fontSize: 15 }}>Start Your Project →</button>
          </div>
        </section>
      )}

      {/* ══════ LOGIN ══════ */}
      {page === "login" && !currentUser && (
        <section style={{ maxWidth: 420, margin: "0 auto", padding: "130px 20px 80px", animation: "fadeUp .4s ease" }}>
          <div style={{ ...crd, padding: "48px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.accent} 40%, ${C.accent} 60%, transparent)` }} />
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <img src="/logo.png" alt="CM" style={{ width: 56, height: 56, borderRadius: 15, margin: "0 auto 18px", display: "block", boxShadow: `0 0 0 1px ${C.border}` }} />
              <h2 style={{ fontFamily: D, fontSize: 26, color: C.white, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>Welcome Back</h2>
              <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.6 }}>Sign in to access your portal</p>
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
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "100px 20px 80px" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 10 }}>Admin Dashboard</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>Brand Portal</h2>
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
                    <button onClick={() => openBrand(b.id)} style={{ ...btn, width: "100%", padding: "10px", fontSize: 12, marginTop: 12, background: C.bgAlt, color: C.accent, border: `1px solid ${C.border}` }}>Edit Brand Kit →</button>
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
                <div key={b.id} onClick={() => openBrand(b.id)} style={{ ...crd, overflow: "hidden", animation: `fadeUp .4s ease ${i*.06}s forwards`, opacity: 0, cursor: "pointer", transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ height: b.image ? "auto" : 90, background: b.image ? "transparent" : `linear-gradient(135deg,${b.color}20,${b.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {b.image ? <img src={b.image} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} /> : <div style={{ fontSize: 36, fontFamily: D, fontWeight: 700, color: b.color, opacity: .35 }}>{b.name.charAt(0)}</div>}
                  </div>
                  <div style={{ padding: "22px" }}>
                    <h4 style={{ fontFamily: D, fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 5 }}>{b.name}</h4>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: `${b.color}10`, color: b.color }}>{b.category}</span>
                    {b.notes && <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7, marginTop: 10 }}>{b.notes}</p>}
                    <div style={{ marginTop: 12, fontSize: 12, color: C.accent, fontWeight: 600 }}>View Brand Kit →</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════ BRAND KIT DETAIL PAGE ══════ */}
      {page === "brand" && selectedBrand && (
        <section style={{ maxWidth: 1140, margin: "0 auto", padding: "92px 20px 72px" }}>
          {/* Header with back button */}
          <div style={{ marginBottom: 32 }}>
            <button onClick={() => nav("portal")} style={{ background: "none", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer", fontFamily: F, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>← Back to {isAdmin ? "Admin Portal" : "My Brands"}</button>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {selectedBrand.image ? (
                <img src={selectedBrand.image} alt="" style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg,${selectedBrand.color}30,${selectedBrand.color}10)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontSize: 24, fontWeight: 700, color: selectedBrand.color }}>{selectedBrand.name.charAt(0)}</div>
              )}
              <div>
                <h2 style={{ fontFamily: D, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: C.white, marginBottom: 2 }}>{selectedBrand.name}</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: `${selectedBrand.color}12`, color: selectedBrand.color }}>{selectedBrand.category}</span>
                  {selectedBrand.notes && <span style={{ color: C.textDim, fontSize: 12 }}>· {selectedBrand.notes}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Kit tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
            {[{ k: "colors", l: "Colors", i: "◆" }, { k: "logos", l: "Logos", i: "◈" }, { k: "mood", l: "Mood Board", i: "◉" }, { k: "fonts", l: "Fonts", i: "Aa" }].map(t => (
              <button key={t.k} onClick={() => setBrandKitTab(t.k)} style={{ background: brandKitTab===t.k ? C.accentGlow : C.card, border: `1px solid ${brandKitTab===t.k ? C.accent : C.border}`, color: brandKitTab===t.k ? C.accent : C.textDim, padding: "10px 20px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F }}>{t.i} {t.l}</button>
            ))}
          </div>

          {/* ── COLORS TAB ── */}
          {brandKitTab === "colors" && (<>
            {/* Admin: add color form */}
            {isAdmin && (
              <div style={{ ...crd, padding: "28px 24px", marginBottom: 24 }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 16 }}>+ Add Color</h4>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div>
                    <label style={lbl}>Hex Code *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="color" id="colorPicker" defaultValue="#c9952c" style={{ width: 40, height: 38, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }} />
                      <input id="hexInput" style={{ ...inp, width: 120 }} placeholder="#c9952c" defaultValue="#c9952c"
                        onChange={e => { const c = document.getElementById("colorPicker"); if (c && /^#[0-9a-fA-F]{6}$/.test(e.target.value)) c.value = e.target.value; }} />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Color Name <span style={{ opacity: .5, fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                    <input id="colorNameInput" style={{ ...inp, width: 180 }} placeholder="e.g. Brand Gold" />
                  </div>
                  <button onClick={() => {
                    const hex = document.getElementById("hexInput").value.trim();
                    const name = document.getElementById("colorNameInput").value.trim();
                    if (hex) { addBrandColor(selectedBrand.id, hex, name); document.getElementById("hexInput").value = "#c9952c"; document.getElementById("colorNameInput").value = ""; document.getElementById("colorPicker").value = "#c9952c"; }
                  }} style={{ ...btn, padding: "10px 22px", fontSize: 13 }}>Add</button>
                </div>
                <p style={{ color: C.textDim, fontSize: 11, marginTop: 10 }}>Use the color picker or type a hex code. Add as many colors as needed.</p>
              </div>
            )}
            {/* Color swatches */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
              {(selectedBrand.brandColors || []).map(c => (
                <div key={c.id} style={{ ...crd, overflow: "hidden", position: "relative" }}>
                  <div style={{ height: 100, background: c.hex, borderRadius: "14px 14px 0 0" }} />
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <button onClick={() => copyHex(c.hex)} style={{ background: "none", border: "none", color: copiedHex === c.hex ? C.success : C.white, fontSize: 14, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", padding: 0, transition: "color .2s" }}>{copiedHex === c.hex ? "Copied!" : c.hex}</button>
                      {isAdmin && <button onClick={() => removeBrandColor(selectedBrand.id, c.id)} style={{ background: "none", border: "none", color: C.danger, fontSize: 12, cursor: "pointer", padding: "2px 4px" }}>✕</button>}
                    </div>
                    {c.name && <div style={{ color: C.textDim, fontSize: 12 }}>{c.name}</div>}
                  </div>
                </div>
              ))}
              {!(selectedBrand.brandColors || []).length && <div style={{ gridColumn: "1/-1", ...crd, padding: "48px 24px", textAlign: "center", color: C.textDim, fontSize: 14 }}>{isAdmin ? "No colors yet. Add your first color above." : "No colors have been added to this brand yet."}</div>}
            </div>
          </>)}

          {/* ── LOGOS TAB ── */}
          {brandKitTab === "logos" && (<>
            {isAdmin && (
              <div style={{ ...crd, padding: "28px 24px", marginBottom: 24 }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 16 }}>+ Upload Logo Files</h4>
                <p style={{ color: C.textDim, fontSize: 12, marginBottom: 14 }}>Upload logo versions in different formats — PNG, SVG, PDF, AI, EPS, etc.</p>
                <input type="file" ref={brandFileRef} accept="image/*,.svg,.pdf,.ai,.eps,.psd" multiple onChange={e => { Array.from(e.target.files).forEach(f => addLogoFile(selectedBrand.id, f)); e.target.value = ""; }} style={{ display: "none" }} />
                <button onClick={() => brandFileRef.current.click()} style={{ ...btn, padding: "10px 22px", fontSize: 13, background: C.bgAlt, color: C.accent, border: `1px solid ${C.border}` }}>📁 Choose Files</button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {(selectedBrand.logoFiles || []).map(l => (
                <div key={l.id} style={{ ...crd, overflow: "hidden" }}>
                  <div style={{ height: 140, background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    {l.data.startsWith("data:image") ? (
                      <img src={l.data} alt={l.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 4 }}>📄</div>
                        <div style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>{l.type}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, color: C.white, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => downloadFile(l.data, l.name)} style={{ background: C.accentGlow, border: `1px solid ${C.accent}`, color: C.accent, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F, flex: 1 }}>↓ Download</button>
                      {isAdmin && <button onClick={() => removeLogoFile(selectedBrand.id, l.id)} style={{ background: C.dangerBg, border: "none", color: C.danger, padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>}
                    </div>
                  </div>
                </div>
              ))}
              {!(selectedBrand.logoFiles || []).length && <div style={{ gridColumn: "1/-1", ...crd, padding: "48px 24px", textAlign: "center", color: C.textDim, fontSize: 14 }}>{isAdmin ? "No logos yet. Upload logo files above." : "No logo files have been added yet."}</div>}
            </div>
          </>)}

          {/* ── MOOD BOARD TAB ── */}
          {brandKitTab === "mood" && (<>
            {isAdmin && (
              <div style={{ ...crd, padding: "28px 24px", marginBottom: 24 }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 16 }}>+ Add to Mood Board</h4>
                <p style={{ color: C.textDim, fontSize: 12, marginBottom: 14 }}>Upload inspiration images, style references, or design concepts.</p>
                <input type="file" id="moodInput" accept="image/*" multiple onChange={e => { Array.from(e.target.files).forEach(f => addMoodImage(selectedBrand.id, f)); e.target.value = ""; }} style={{ display: "none" }} />
                <button onClick={() => document.getElementById("moodInput").click()} style={{ ...btn, padding: "10px 22px", fontSize: 13, background: C.bgAlt, color: C.accent, border: `1px solid ${C.border}` }}>📁 Upload Images</button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
              {(selectedBrand.moodBoard || []).map(m => (
                <div key={m.id} style={{ ...crd, overflow: "hidden", position: "relative" }}>
                  <img src={m.data} alt={m.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                  <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{m.name}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => downloadFile(m.data, m.name)} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>↓</button>
                      {isAdmin && <button onClick={() => removeMoodImage(selectedBrand.id, m.id)} style={{ background: "none", border: "none", color: C.danger, fontSize: 12, cursor: "pointer" }}>✕</button>}
                    </div>
                  </div>
                </div>
              ))}
              {!(selectedBrand.moodBoard || []).length && <div style={{ gridColumn: "1/-1", ...crd, padding: "48px 24px", textAlign: "center", color: C.textDim, fontSize: 14 }}>{isAdmin ? "No mood board images yet. Upload some inspiration above." : "No mood board images have been added yet."}</div>}
            </div>
          </>)}

          {/* ── FONTS TAB ── */}
          {brandKitTab === "fonts" && (<>
            {isAdmin && (
              <div style={{ ...crd, padding: "28px 24px", marginBottom: 24 }}>
                <h4 style={{ fontFamily: D, fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 16 }}>+ Add Font</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 14 }}>
                  <div><label style={lbl}>Font Name *</label><input id="fontName" style={inp} placeholder="e.g. Montserrat" /></div>
                  <div><label style={lbl}>Usage / Role</label><select id="fontRole" style={{ ...inp, cursor: "pointer" }}>
                    <option value="Primary">Primary / Headings</option>
                    <option value="Secondary">Secondary / Body</option>
                    <option value="Accent">Accent / Display</option>
                    <option value="Monospace">Monospace / Code</option>
                    <option value="Other">Other</option>
                  </select></div>
                  <div><label style={lbl}>Weight(s)</label><input id="fontWeight" style={inp} placeholder="e.g. 400, 600, 700" /></div>
                  <div><label style={lbl}>Source URL <span style={{ opacity: .5, fontWeight: 400, textTransform: "none" }}>(optional)</span></label><input id="fontUrl" style={inp} placeholder="fonts.google.com/..." /></div>
                </div>
                <button onClick={() => {
                  const name = document.getElementById("fontName").value.trim();
                  if (!name) return;
                  addFont(selectedBrand.id, {
                    name,
                    role: document.getElementById("fontRole").value,
                    weight: document.getElementById("fontWeight").value.trim(),
                    url: document.getElementById("fontUrl").value.trim(),
                  });
                  document.getElementById("fontName").value = "";
                  document.getElementById("fontWeight").value = "";
                  document.getElementById("fontUrl").value = "";
                }} style={{ ...btn, padding: "10px 22px", fontSize: 13 }}>Add Font</button>
              </div>
            )}
            <div style={{ display: "grid", gap: 12 }}>
              {(selectedBrand.fonts || []).map(f => (
                <div key={f.id} style={{ ...crd, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: D, fontSize: 22, color: C.white, fontWeight: 700 }}>{f.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: C.accentGlow, color: C.accent, textTransform: "uppercase", letterSpacing: "1px" }}>{f.role}</span>
                    </div>
                    <div style={{ fontSize: 30, color: C.white, fontWeight: 300, opacity: .7, marginBottom: 8, letterSpacing: "1px" }}>Aa Bb Cc Dd Ee 123</div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {f.weight && <div style={{ fontSize: 12, color: C.textDim }}><span style={{ fontWeight: 600 }}>Weights:</span> {f.weight}</div>}
                      {f.url && <a href={f.url.startsWith("http") ? f.url : `https://${f.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: "none", fontWeight: 600 }}>View Source ↗</a>}
                    </div>
                  </div>
                  {isAdmin && <button onClick={() => removeFont(selectedBrand.id, f.id)} style={{ background: C.dangerBg, border: "none", color: C.danger, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: F }}>Remove</button>}
                </div>
              ))}
              {!(selectedBrand.fonts || []).length && <div style={{ ...crd, padding: "48px 24px", textAlign: "center", color: C.textDim, fontSize: 14 }}>{isAdmin ? "No fonts added yet. Add font information above." : "No font information has been added yet."}</div>}
            </div>
          </>)}
        </section>
      )}
      {/* Brand not found fallback */}
      {page === "brand" && !selectedBrand && (
        <section style={{ maxWidth: 500, margin: "0 auto", padding: "150px 20px 72px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
          <h2 style={{ fontFamily: D, fontSize: 26, color: C.white, fontWeight: 700, marginBottom: 10 }}>Brand Not Found</h2>
          <button onClick={() => nav("portal")} style={{ ...btn, padding: "13px 32px", fontSize: 15 }}>Back to Portal</button>
        </section>
      )}

      {/* ══════ CONTACT ══════ */}
      {page === "contact" && (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "100px 20px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 14 }}>Get In Touch</div>
            <h2 style={{ fontFamily: D, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, color: C.white, marginBottom: 14, letterSpacing: "-0.02em" }}>Let's Work Together</h2>
            <p style={{ color: C.textDim, fontSize: 17, maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>Tell us about your project and we'll get back to you within 24 hours.</p>
          </div>

          {contactSubmitted ? (
            <div style={{ ...crd, padding: "72px 48px", textAlign: "center", animation: "scaleIn .4s ease" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.successBg, border: `1px solid ${C.success}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: C.success }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ fontFamily: D, fontSize: 28, color: C.white, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>Message Sent!</h3>
              <p style={{ color: C.textDim, fontSize: 16, marginBottom: 36, lineHeight: 1.75 }}>Thanks for reaching out. We'll get back to you shortly.</p>
              <button onClick={() => { setContactSubmitted(false); nav("home"); }} style={{ ...btn, padding: "14px 36px", fontSize: 15, boxShadow: `0 4px 20px ${C.accentGlow}` }}>Back to Home</button>
            </div>
          ) : (
            <div style={{ ...crd, padding: "44px 40px", animation: "fadeUp .5s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.accent} 40%, ${C.accent} 60%, transparent)` }} />
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
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.accentGlow, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: C.accent }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 style={{ fontFamily: D, fontSize: 26, color: C.white, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>Login Required</h2>
          <p style={{ color: C.textDim, fontSize: 14, marginBottom: 24 }}>Sign in to access the brand portal.</p>
          <button onClick={() => nav("login")} style={{ ...btn, padding: "13px 32px", fontSize: 15 }}>Go to Login</button>
        </section>
      )}

      {/* ══════ FOOTER ══════ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "48px 20px 36px", marginTop: 60, background: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <img src="/logo.png" alt="CM" style={{ width: 32, height: 32, borderRadius: 9, boxShadow: `0 0 0 1px ${C.border}` }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>CM Marketing</div>
                  <div style={{ fontSize: 9, color: C.accent, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>& Design</div>
                </div>
              </div>
              <p style={{ color: C.textDim, fontSize: 13, maxWidth: 280, lineHeight: 1.7 }}>Strategic branding, web design, and marketing for businesses ready to grow.</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Navigation</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["home","services","projects","about","contact"].map(k => (
                  <button key={k} onClick={() => nav(k)} className="footer-link" style={{ background: "none", border: "none", color: C.textDim, fontSize: 14, cursor: "pointer", fontFamily: F, textTransform: "capitalize", textAlign: "left", padding: 0, transition: "color .2s", width: "fit-content" }}>{k}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Ready to Start?</div>
              <p style={{ color: C.textDim, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>Let's talk about your brand goals.</p>
              <button onClick={() => nav("contact")} style={{ ...btn, padding: "11px 24px", fontSize: 13 }}>Get a Free Quote</button>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ color: C.textDim, fontSize: 12, opacity: .6 }}>© {new Date().getFullYear()} CM Marketing & Design. All rights reserved.</div>
            <button onClick={toggleTheme} title={dark ? "Switch to light mode" : "Switch to dark mode"} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 12px", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>{dark ? "☀ Light Mode" : "☽ Dark Mode"}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
