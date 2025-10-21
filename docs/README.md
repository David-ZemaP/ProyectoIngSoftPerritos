## Proyecto: ProyectoIngSoftPerritos

Propósito
--------
Este repositorio contiene una pequeña aplicación de ejemplo usada en la materia Ingeniería de Software para practicar TDD, integración y despliegue local.

Instalación
-----------
1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar servidor de desarrollo:

```bash
npm start
```

Testing
-------

- Pruebas unitarias (Jest / script preparado):

```bash
npm test
```

- Pruebas E2E (Cypress):

Abrir UI interactiva:

```bash
npm run cypress
```

Ejecutar en modo headless y guardar resultados:

```bash
npm run cypress-run
```

Los reportes se guardarán en `tests/reports/`.

Contribución y flujo de ramas
----------------------------

- Crear una rama por tarea: `git switch -c feature/mi-descripcion`.
- Hacer commits claros (usar Conventional Commits si es posible).
- Abrir PR hacia `main`, asignar al menos 1 revisor y no mergear hasta que CI pase.
- Mantener la rama actualizada con `main` antes del merge (rebase o merge).

Plantillas útiles
-----------------
- Se incluye `.github/PULL_REQUEST_TEMPLATE.md` y `CONTRIBUTING.md` en la raíz para guiar PRs y commits.
