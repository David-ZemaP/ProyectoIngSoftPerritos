// cypress.config.mjs
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // Tarea personalizada: eliminar mascotas por nombre usando Firebase Admin.
      // Requisitos (en entorno CI/Local):
      // - Instalar dependencia: `npm install firebase-admin` (si no está instalada).
      // - Proveer credenciales de servicio en la variable de entorno
      //   `FIREBASE_SERVICE_ACCOUNT` (JSON string) o
      //   `FIREBASE_SERVICE_ACCOUNT_PATH` (ruta a JSON file).
      on('task', {
        async deletePetsByName({ name }) {
          if (!name) return { deleted: [] };

          // Importar firebase-admin dinámicamente para no forzar dependencia en runtime del navegador
          const adminModule = await import('firebase-admin');
          const admin = adminModule.default ?? adminModule;

          // Inicializar la app de Admin si no está inicializada aún
          if (!admin.apps.length) {
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
              const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
              admin.initializeApp({ credential: admin.credential.cert(svc) });
            } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
              const fs = await import('fs');
              const raw = await fs.promises.readFile(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8');
              const svc = JSON.parse(raw);
              admin.initializeApp({ credential: admin.credential.cert(svc) });
            } else {
              // No credentials provided: do not throw to avoid failing tests in environments
              // where cleanup is optional. Return a warning to the spec instead.
              // The task will return { deleted: [], warning } so the spec can continue.
              return { deleted: [], warning: 'No Firebase service account provided' };
            }
          }

          const db = admin.firestore();
          const snaps = await db.collection('pets').where('name', '==', name).get();
          if (snaps.empty) return { deleted: [] };

          const batch = db.batch();
          const deleted = [];
          snaps.forEach((doc) => {
            batch.delete(doc.ref);
            deleted.push(doc.id);
          });
          await batch.commit();
          return { deleted };
        }
        ,
        async deletePetById({ id }) {
          if (!id) return { deleted: [] };
          const adminModule = await import('firebase-admin');
          const admin = adminModule.default ?? adminModule;

          if (!admin.apps.length) {
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
              const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
              admin.initializeApp({ credential: admin.credential.cert(svc) });
            } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
              const fs = await import('fs');
              const raw = await fs.promises.readFile(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8');
              const svc = JSON.parse(raw);
              admin.initializeApp({ credential: admin.credential.cert(svc) });
            } else {
              return { deleted: [], warning: 'No Firebase service account provided' };
            }
          }

          const db = admin.firestore();
          const ref = db.collection('pets').doc(id);
          const snap = await ref.get();
          if (!snap.exists) return { deleted: [] };
          await ref.delete();
          return { deleted: [id] };
        },
        async deleteUserById({ id }) {
          if (!id) return { deleted: [] };
          const adminModule = await import('firebase-admin');
          const admin = adminModule.default ?? adminModule;

          if (!admin.apps.length) {
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
              const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
              admin.initializeApp({ credential: admin.credential.cert(svc) });
            } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
              const fs = await import('fs');
              const raw = await fs.promises.readFile(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8');
              const svc = JSON.parse(raw);
              admin.initializeApp({ credential: admin.credential.cert(svc) });
            } else {
              return { deleted: [], warning: 'No Firebase service account provided' };
            }
          }

          const db = admin.firestore();
          const ref = db.collection('users').doc(id);
          const snap = await ref.get();
          if (!snap.exists) return { deleted: [] };
          await ref.delete();
          return { deleted: [id] };
        }
      });

      return config;
    },
    baseUrl: 'http://localhost:1234',
    screenshotsFolder: 'tests/reports/screenshots',
    videosFolder: 'tests/reports/videos',
  },
});
