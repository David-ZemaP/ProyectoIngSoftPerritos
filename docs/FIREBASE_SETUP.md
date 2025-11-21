# Configuración de Firebase Authentication

## Error: `auth/configuration-not-found`

Este error indica que el método de autenticación no está habilitado en Firebase Console.

## Pasos para habilitar Email/Password Authentication:

1. **Ve a Firebase Console**: https://console.firebase.google.com/

2. **Selecciona tu proyecto**: `ing-soft-64481`

3. **Ve a Authentication**:
   - En el menú lateral, haz clic en "Authentication"
   - Haz clic en la pestaña "Sign-in method"

4. **Habilita Email/Password**:
   - Busca "Email/Password" en la lista de proveedores
   - Haz clic en el proveedor
   - Activa el switch para **"Enable"**
   - NO necesitas activar "Email link (passwordless sign-in)" a menos que lo desees
   - Haz clic en "Save"

5. **Verifica dominios autorizados**:
   - En la pestaña "Settings" → "Authorized domains"
   - Asegúrate de que `localhost` esté en la lista
   - Si usas Parcel, también agrega tu puerto si es necesario

## Otros métodos de autenticación (opcional)

Si deseas habilitar otros métodos:
- **Google Sign-in**: Para login con Google
- **Anonymous**: Para usuarios temporales
- **Facebook, Twitter, GitHub**: Otras opciones sociales

## Después de habilitar

1. Recarga tu aplicación
2. Intenta registrar un usuario nuevamente
3. Debería funcionar correctamente

## Verificar que funcionó

Después de registrar un usuario, puedes verificarlo en:
- Firebase Console → Authentication → Users
- Deberías ver el nuevo usuario listado

## Si el problema persiste

1. Verifica que estás usando el proyecto correcto de Firebase
2. Revisa que el `authDomain` en `firebase.js` sea correcto: `ing-soft-64481.firebaseapp.com`
3. Limpia el caché del navegador y recarga la página
4. Verifica en la consola del navegador si hay más detalles del error
