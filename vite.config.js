import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
  VITE CONFIG
  
  This tells Vite (your build tool) two things:
  1. Use the React plugin so it understands JSX syntax
  2. That's it! Vite handles everything else automatically.
  
  Vite replaces the older "Create React App" tooling.
  It's much faster and doesn't have the security warnings.
*/

export default defineConfig({
  plugins: [react()],
});
