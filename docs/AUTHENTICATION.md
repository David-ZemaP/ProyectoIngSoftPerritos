
# Sistema de Autenticación MatchPet

## 📋 Descripción

Se ha implementado un sistema completo de autenticación con Firebase para MatchPet. Ahora los usuarios deben iniciar sesión antes de acceder a las funcionalidades principales de la aplicación.

## 🔐 Funcionalidades Implementadas

### 1. **Registro de Usuarios** (`/src/signing_up/`)
- Formulario de registro con validación
- Campos: Nombre completo, Email, Contraseña, Confirmar contraseña
- Guarda datos en Firebase Authentication y Firestore
- Tests unitarios y E2E incluidos

### 2. **Inicio de Sesión** (`/src/login/`)
- Formulario de login con validación
- Campos: Email, Contraseña
- Autenticación con Firebase
- Manejo de errores específicos
- Tests unitarios y E2E incluidos

### 3. **Protección de Rutas**
Las siguientes páginas ahora requieren autenticación:
- `/index.html` - Página principal
- `/src/Register_Pet/Register.html` - Registrar mascota
- `/src/Search_for_pet/Search.html` - Buscar mascota
- `/src/Match/match.html` - Match de mascotas

Si un usuario no autenticado intenta acceder, será redirigido automáticamente a `/src/login/login.html`.

### 4. **Página Principal Protegida**
- Muestra información del usuario autenticado
- Botones de navegación a todas las funcionalidades
- Botón de cerrar sesión

## 🚀 Cómo Usar

### Iniciar el Servidor
```bash
npm start
```

### Flujo de Usuario

1. **Primera vez (sin cuenta)**:
   - Accede a `http://localhost:1234/src/signing_up/signing_up.html`
   - Completa el formulario de registro
   - Serás redirigido automáticamente a la página principal

2. **Usuario existente**:
   - Accede a `http://localhost:1234/src/login/login.html`
   - Ingresa tu email y contraseña
   - Serás redirigido a la página principal

3. **Navegación**:
   - Desde la página principal (`/index.html`) puedes acceder a:
     - Registrar Mascota
     - Buscar Mascota
     - Match de Mascotas
   - Para cerrar sesión, haz clic en "Cerrar Sesión"

### Intentar Acceder Sin Autenticación
Si intentas acceder directamente a cualquier página protegida sin estar autenticado:
```
http://localhost:1234/index.html
```
Serás redirigido automáticamente a:
```
http://localhost:1234/src/login/login.html
```

## 🧪 Ejecutar Tests

### Tests Unitarios (Jest)
```bash
npm test
```

### Tests E2E (Cypress)
```bash
# Modo interactivo
npm run cypress

# Modo headless
npm run cypress-run
```

## 📁 Estructura de Archivos

```
src/
├── login/
│   ├── login.html              # Página de inicio de sesión
│   ├── login.css               # Estilos del login
│   ├── login.js                # Lógica de negocio del login
│   ├── login.presenter.js      # Presenter del login
│   ├── login.spec.js          # Tests unitarios
│   └── login.test.js          # Tests de integración
├── signing_up/
│   ├── signing_up.html         # Página de registro
│   ├── signing_up.css          # Estilos del registro
│   ├── signing_up.js           # Lógica de negocio del registro
│   ├── signing_up.presenter.js # Presenter del registro
│   ├── signing_up.spec.js     # Tests unitarios
│   └── signing_up.test.js     # Tests de integración
├── services/
│   ├── auth-guard.service.js   # Servicio de protección de rutas
│   ├── page-guard.js           # Guard para páginas protegidas
│   └── main-guard.js           # Guard y lógica del index
└── firebase.js                 # Configuración de Firebase
```

## 🔑 Datos de Usuario para Pruebas

Para pruebas E2E, puedes crear un usuario de prueba o usar credenciales existentes.

### Crear Usuario de Prueba
1. Ve a `/src/signing_up/signing_up.html`
2. Completa el formulario con:
   - Nombre: Test User
   - Email: test@matchpet.com
   - Contraseña: password123
   - Confirmar: password123

## ⚠️ Manejo de Errores

El sistema maneja los siguientes errores de Firebase:

### Login
- `auth/user-not-found` - Usuario no existe
- `auth/wrong-password` - Contraseña incorrecta
- `auth/invalid-email` - Email inválido
- `auth/user-disabled` - Cuenta deshabilitada
- `auth/too-many-requests` - Demasiados intentos fallidos
- `auth/invalid-credential` - Credenciales inválidas

### Registro
- `auth/email-already-in-use` - Email ya registrado
- `auth/invalid-email` - Email inválido
- `auth/weak-password` - Contraseña muy débil

## 🔄 Flujo de Autenticación

```
┌─────────────────┐
│  Usuario no     │
│  autenticado    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirigido a   │
│  /login         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  ¿Tiene cuenta? │────▶│  Ir a registro  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │ Sí                    │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Iniciar sesión │     │  Crear cuenta   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────┬───────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Autenticado    │
        │  Acceso a todas │
        │  las funciones  │
        └─────────────────┘
```

## 📝 Notas Importantes

1. **Firebase debe estar configurado**: Asegúrate de que el archivo `src/firebase.js` tiene la configuración correcta.

2. **Persistencia de sesión**: Firebase mantiene la sesión del usuario incluso después de cerrar el navegador.

3. **Redirecciones**: 
   - Después del login exitoso → `/index.html`
   - Después del registro exitoso → `/index.html`
   - Sin autenticación → `/src/login/login.html`

4. **Cerrar sesión**: El botón de cerrar sesión está disponible en la página principal.

## 🐛 Solución de Problemas

### El usuario no es redirigido después del login
- Verifica que Firebase esté correctamente configurado
- Revisa la consola del navegador para errores
- Asegúrate de que el servidor está corriendo en `localhost:1234`

### Error "Usuario no autenticado"
- Cierra sesión y vuelve a iniciar
- Limpia las cookies del navegador
- Verifica que Firebase Authentication esté habilitado en tu proyecto

### Tests de Cypress fallan
- Asegúrate de tener el servidor corriendo (`npm start`)
- Verifica que existe un usuario de prueba en Firebase
- Actualiza las credenciales en los tests si es necesario
