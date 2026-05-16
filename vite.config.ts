import { defineConfig, PluginOption } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

function fullReloadOnServerChanges(): PluginOption {
  return {
    name: "full-reload-on-server-changes",
    handleHotUpdate({ file, server }) {
      if (
        file.includes("/routes/") ||
        file.includes("/components/") ||
        file.endsWith("/main.ts") ||
        file.endsWith("/main.tsx")
      ) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [fresh(), fullReloadOnServerChanges(), tailwindcss()],
});
