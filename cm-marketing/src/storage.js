/*
  STORAGE HELPER — wraps localStorage for persistent data.
  
  localStorage is built into every browser:
  - Stores strings (we JSON.stringify objects)
  - Survives page reloads and browser restarts
  - Each domain gets its own private storage
  - ~5-10MB limit per domain
  
  For multi-user production, replace with Firebase/Supabase.
*/

const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return null;
      return { key, value };
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      return null;
    }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      return null;
    }
  },
};

export default storage;
