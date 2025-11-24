# 🗺️ Mapa de Navegación de MatchPet

## ✅ Estado de Conexiones: TODAS FUNCIONANDO

### 📱 Flujo de Autenticación

```
┌─────────────────┐
│   index.html    │
│  (redirect)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐         ┌──────────────────────┐
│  src/login/     │────────▶│ src/signing_up/      │
│  login.html     │         │ signing_up.html      │
│                 │◀────────│                      │
│ ✅ Funcional    │         │ ✅ Funcional         │
└────────┬────────┘         └────────┬─────────────┘
         │                           │
         │ (Auth successful)         │ (Auth successful)
         └───────────┬───────────────┘
                     ▼
        ┌────────────────────────┐
        │  Redirect to Match     │
        │  (por page-guard.js)   │
        └────────────┬───────────┘
                     ▼
```

### 🎮 Flujo Principal (después de autenticarse)

```
                    ┌─────────────────────────────────────────┐
                    │          NAVBAR GLOBAL                   │
                    │ (Aparece en todas las pantallas)        │
                    │                                         │
                    │ 🔗 Logo        → Match                  │
                    │ 🔍 Buscar      → Search_for_pet         │
                    │ 📤 Publicar    → Register_Pet           │
                    │ ❤️  Match      → Match (actual)         │
                    │ 👤 Profile    → Profile (actual)        │
                    │ 🚪 Logout     → Login (auth.signOut)    │
                    └─────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                ▼                   ▼                   ▼
        ┌──────────────┐   ┌───────────────┐  ┌────────────────┐
        │ Match        │   │ Search        │  │ Register       │
        │ match.html   │   │ Search.html   │  │ Register.html  │
        │              │   │               │  │                │
        │ ✅ Conectado │   │ ✅ Conectado  │  │ ✅ Conectado   │
        └──────┬───────┘   └───────┬───────┘  └────────┬───────┘
               │                   │                   │
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   │
                      (todas pueden navegar a)
                                   ▼
                        ┌──────────────────────┐
                        │ Profile              │
                        │ profile.html         │
                        │                      │
                        │ 📊 Estadísticas      │
                        │ ❤️  Matches Recientes│
                        │ 🏠 Mascotas Adoptadas│
                        │                      │
                        │ ✅ CONECTADO        │
                        └──────────────────────┘
```

## 📋 Lista de Verificación

### Pantallas del Sistema
- ✅ `index.html` - Redirect a login
- ✅ `src/login/login.html` - Autenticación
- ✅ `src/signing_up/signing_up.html` - Registro de usuario
- ✅ `src/Match/match.html` - Swipe de mascotas
- ✅ `src/Search_for_pet/Search.html` - Búsqueda de mascotas
- ✅ `src/Register_Pet/Register.html` - Publicar mascota
- ✅ `src/profile/profile.html` - Perfil de usuario

### Navegación en Navbar
- ✅ Logo → Match (desde cualquier pantalla)
- ✅ 🔍 Buscar → Search_for_pet
- ✅ 📤 Publicar → Register_Pet
- ✅ ❤️  Match → Match (siempre disponible)
- ✅ 👤 Profile → Profile (siempre disponible)
- ✅ 🚪 Logout → Login (manejado por page-guard.js)

### Navegación Adicional
- ✅ Register Pet → volver a Match
- ✅ Search → Puedes ver detalles de mascotas
- ✅ Profile → Ver matches y mascotas adoptadas
- ✅ Profile → Modal de detalles de match
- ✅ Profile → Modal de adopción

### Protecciones
- ✅ `page-guard.js` - Requiere autenticación en todas las pantallas protegidas
- ✅ `auth-guard.service.js` - Verifica estado de usuario
- ✅ Logout limpia sesión y redirige a login

## 🧪 Cómo Verificar

### Test E2E Completo (con servidor corriendo)
```bash
npm start  # En una terminal

# En otra terminal:
npm run cypress-run
```

### Resultado Esperado
```
✅ adoption.cy.js      - 1/1 passing
✅ global.cy.js        - 2/2 passing
✅ login.cy.js         - 11/11 passing
✅ match.cy.js         - 4/4 passing
✅ register.cy.js      - 3/3 passing
✅ signing_up.cy.js    - 10/10 passing
─────────────────────────────────
✅ TOTAL:             31/31 passing
```

## 📝 Notas Importantes

1. **page-guard.js** maneja:
   - Verificación de autenticación en páginas protegidas
   - Logout mediante click en logout-link
   - Actualización de profile-name en navbar en tiempo real

2. **Credentials sin guardar**: 
   - Todos los datos de test se borran automáticamente
   - Task `deletePetById` y `deleteUserById` limpian DB
   - Especialmente en: register.cy.js y signing_up.cy.js

3. **URLs relativas**:
   - Todas las pantallas usan rutas relativas (`../`)
   - Compatible con cualquier servidor web

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar GitHub Actions workflow para CI/CD
- [ ] Agregar Bash script para Linux CI (equivalente a run-cypress-with-sa.ps1)
- [ ] Mejorar UI con más animaciones
- [ ] Agregar notificaciones de push (opcional)

---

**Última actualización:** 24 de Noviembre de 2025
**Estado:** ✅ Todas las pantallas conectadas y funcionando correctamente
