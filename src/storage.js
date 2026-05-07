/*
  STORAGE HELPER — writes to Netlify Blobs (shared, server-side) so all
  users see the same data. Falls back to localStorage if the Netlify
  function is unavailable (local dev without `netlify dev`).

  On first deploy, any existing localStorage data is automatically
  migrated to Netlify Blobs so nothing is lost.
*/

const KV = "/.netlify/functions/kv";

const callKV = async (action, key, value) => {
  const body = { action, key };
  if (value !== undefined) body.value = value;
  const res = await fetch(KV, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  return res.json();
};

const storage = {
  async get(key) {
    try {
      const data = await callKV("get", key);
      if (data.value !== null && data.value !== undefined) {
        try { localStorage.setItem(key, data.value); } catch(e) {}
        return { key, value: data.value };
      }
      // Netlify Blobs has no value — check for localStorage data to migrate
      const localVal = localStorage.getItem(key);
      if (localVal) {
        callKV("set", key, localVal).catch(() => {});
        return { key, value: localVal };
      }
      return null;
    } catch(e) {
      // Function unavailable (local dev) — use localStorage
      try {
        const value = localStorage.getItem(key);
        if (value === null) return null;
        return { key, value };
      } catch(e2) { return null; }
    }
  },

  async set(key, value) {
    try {
      await callKV("set", key, value);
      try { localStorage.setItem(key, value); } catch(e) {}
      return { key, value };
    } catch(e) {
      try { localStorage.setItem(key, value); } catch(e2) {}
      return { key, value };
    }
  },

  async delete(key) {
    try {
      await callKV("delete", key);
      try { localStorage.removeItem(key); } catch(e) {}
      return { key, deleted: true };
    } catch(e) {
      try { localStorage.removeItem(key); } catch(e2) {}
      return { key, deleted: true };
    }
  },
};

export default storage;
