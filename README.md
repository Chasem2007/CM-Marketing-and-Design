# CM Marketing & Design

Your website + brand portal + built-in CMS, all in one React app.

---

## What's In This Project

```
cm-marketing/
├── index.html             ← The HTML page that loads your app
├── vite.config.js         ← Build tool config (Vite)
├── package.json           ← Project dependencies and commands
├── src/
│   ├── main.jsx           ← Entry point (boots up React)
│   ├── App.jsx            ← Your entire website + portal + CMS
│   └── storage.js         ← Saves data to browser localStorage
└── README.md              ← You're reading this!
```

---

## How To Deploy (Step by Step)

### Step 1: Install Node.js

Go to https://nodejs.org and download the **LTS** version.
Install it (just click Next through the installer).

### Step 2: Install dependencies & build

Open **Command Prompt** (Windows) or **Terminal** (Mac).
Navigate to the project folder and run:

```bash
cd cm-marketing
npm install
npm run build
```

> **IMPORTANT:** Do NOT run `npm audit fix --force` — it can break things.
> The audit warnings are about dev tools only and don't affect your live site.

This creates a `dist/` folder — that's your ready-to-deploy website.

### Step 3: Deploy to Netlify (free)

1. Go to https://app.netlify.com and sign up
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the **`dist`** folder onto the upload area
4. Your site is live at a random Netlify URL!

### Step 4: Connect your domain

1. In Netlify, go to **Site settings → Domain management → Add custom domain**
2. Type: `cmmarketingdesign.com`
3. Netlify will show you DNS records to set up
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Update the DNS records to match what Netlify shows
6. Wait 5-30 minutes — then your site is live on your domain!

---

## How To Use The Site

### Admin Login
- Username: **admin**
- Password: **admin123**
- ⚠️ **Change this before going live!** Search for `admin123` in `src/App.jsx`

### Admin Portal (3 tabs)
| Tab | What it does |
|---|---|
| **Brands** | Upload brands with images, assign to specific clients |
| **Users** | Create client login accounts |
| **Site Editor** | Change ALL text on public pages — no code needed |

### Client Login
- Clients use accounts you create in the Users tab
- They only see brands you've assigned to them
- They cannot edit, upload, or delete anything

---

## Making Changes Later

1. Edit files in the `src/` folder
2. Run `npm run build` again
3. Re-upload the `dist/` folder to Netlify

Or for the Site Editor content — just log in as admin, change the text, and hit Save.
That updates instantly without rebuilding.

---

## Customization Cheat Sheet

| What to change | Where in App.jsx |
|---|---|
| Brand colors | The `C = { ... }` object near the top |
| Fonts | The `F` and `D` constants |
| Default page text | The `DEFAULT_CONTENT` object |
| Admin password | The `DEFAULT_ADMIN` object |
| Brand categories | The dropdown array in the brand form |

---

## Testing Locally

Want to preview before deploying? Run:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

---

Built with React + Vite. Designed for CM Marketing & Design.
