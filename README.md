#### Proyeto base para proyectos tddlab:

#### Creado a partir de proyecto usado en IngSoftware: parcel-jest-base

https://github.com/israelantezana/parcel-jest-base

#### Comandos creados en package json:

#### Para instalar las dependencias:

npm install

#### Comandos de uso:

Ejecutar web-sever local parcel:
npm start

Ejecutar pruebas de unidad de forma continua --watch:
npm test

Ejecutar pruebas de unidad solo una vez:
npm run test-once

## Ejecutar Cypress con credenciales de Firebase (limpieza de datos)

La suite E2E usa una tarea Node que puede eliminar documentos de la colección `pets`.
Para que la limpieza funcione en tu entorno (local o CI) exporta UNA de las siguientes variables antes de ejecutar Cypress:

- `FIREBASE_SERVICE_ACCOUNT_PATH`: ruta al archivo JSON del service account.
- `FIREBASE_SERVICE_ACCOUNT`: contenido del JSON (string).

Ejemplos (PowerShell):

1) Usando la ruta al JSON y arrancando el servidor Parcel:
```powershell
# iniciar el servidor en background y correr Cypress con la variable de ruta
.\script\run-cypress-with-sa.ps1 -ServiceAccountPath 'C:\keys\serviceAccount.json' -StartServer
```

2) Usando el contenido JSON (por ejemplo en CI donde el secret es inyectado):
```powershell
#$json = Get-Content -Raw 'C:\keys\serviceAccount.json'
#.\script\run-cypress-with-sa.ps1 -ServiceAccountJson $json
```

Si no configuras ninguna variable, la tarea de limpieza no fallará: devolverá un resultado inofensivo y los tests seguirán ejecutándose, pero no se eliminarán documentos en Firestore.
