# CryptoPlatform

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

# CryptoPlatform

Este repositorio contiene una aplicación Angular (versión 21.x). A continuación tienes instrucciones precisas para ejecutar el proyecto en Windows.

**Requisitos previos:**
- **Node + npm:** Instala Node.js (recomendado v18+). El proyecto sugiere `npm@11.x` en `package.json` pero `npm` moderno funciona también.
- **Angular CLI (opcional):** puedes usar la `@angular/cli` instalada localmente vía `npm start`, no es obligatorio instalarla globalmente.

**Pasos para ejecutar (rápido)**

1. Abre una terminal en la raíz del proyecto (donde está `package.json`).

2. Instala dependencias:

```powershell
# PowerShell (comando normal)
npm install
```

Si PowerShell arroja un error sobre ejecución de scripts (p. ej. "npm.ps1 porque la ejecución de scripts está deshabilitada"), usa una de estas opciones:

```cmd
:: Opción A (usar Command Prompt):
cmd /c "cd /d %CD% && npm install"

:: Opción B (permitir scripts enPowerShell, requiere permiso del usuario):
PowerShell -Command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force"
npm install
```

3. Arrancar el servidor de desarrollo:

```powershell
npm start
# o directamente (equivalente)
ng serve
```

4. Abrir la aplicación en el navegador en:

```
http://localhost:4200/
```

5. Parar el servidor: usa `Ctrl+C` en la terminal donde se está ejecutando.

**Comandos útiles adicionales**
- `npm run build` — Compila la app para producción y genera `dist/`.
- `npm run watch` — Reconstruye en modo desarrollo cuando hay cambios.
- `npm test` — Ejecuta tests (Vitest) si están configurados.
- `npm audit` / `npm audit fix` — Revisa y corrige vulnerabilidades de dependencias.

**Notas y soluciones de problemas**
- Si `npm` informa que hay una versión más reciente, actualizar `npm` es opcional; no es mandatorio para ejecutar el proyecto.
- Si sigues viendo errores relacionados con PowerShell, abre una ventana de **Command Prompt** (cmd.exe) y ejecuta los comandos allí.
- Si falta `ng` en PATH, `npm start` usará la versión local (instalada en `node_modules`) — por eso no es necesario instalar `@angular/cli` globalmente.

Archivo con scripts y configuración: [prueba 232/prueba 232/package.json](prueba 232/prueba 232/package.json)

Si quieres, puedo:
- ejecutar `npm audit fix` ahora para intentar resolver vulnerabilidades.
- añadir una sección adicional de troubleshooting más extensa.

--
Actualizado para incluir pasos claros de ejecución en Windows.
