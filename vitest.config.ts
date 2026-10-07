import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
    // Dummy values so modules that call createClient() at import time (e.g.
    // lib/adminEmails.ts) don't crash on missing env in CI — nothing in the
    // test suite actually performs a network call against these.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    },
  },
});
