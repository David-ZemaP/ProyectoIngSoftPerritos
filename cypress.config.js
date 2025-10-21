// cypress.config.mjs
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // configurar eventos de Cypress aquí (reporters, tareas personalizadas, etc.)
      return config
    },
    baseUrl: "http://localhost:1234",
    screenshotsFolder: 'tests/reports/screenshots',
    videosFolder: 'tests/reports/videos',
  },
});
