# CryptoPlatform

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 21.1.2.

## hecho por los estudiantes:

Fernando Marcano, C.I. V.- 29.752.386
Yhusleika Molina, C.I. V.- 27.401.354
Di mauro Vergara, C.I. V.- 26.498.909


## hecho por los estudiantes:

Fernando Marcano, C.I. V.- 29.752.386
Yhusleika Molina, C.I. V.- 27.401.354
Di mauro Vergara, C.I. V.- 26.498.909


## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

## Generación de código

Angular CLI incluye potentes herramientas para generar código. Para crear un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para ver la lista completa de esquemas disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

## Compilación

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y guardará los artefactos en el directorio `dist/`. Por defecto, la compilación de producción optimiza la aplicación para rendimiento y velocidad.

## Ejecutar pruebas unitarias

Para ejecutar las pruebas unitarias con el corredor de pruebas [Vitest](https://vitest.dev/), usa el siguiente comando:

```bash
ng test
```

## Ejecutar pruebas end-to-end

Para pruebas end-to-end (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no incluye un framework de pruebas end-to-end por defecto. Puedes elegir el que mejor se adapte a tus necesidades.

---

# Instrucciones para Windows

Este repositorio contiene una aplicación Angular (versión 21.x). A continuación tienes instrucciones precisas para ejecutar el proyecto en Windows.

**Requisitos previos:**
- **Node + npm:** Instala Node.js (recomendado v18+). El proyecto sugiere `npm@11.x` en `package.json` pero `npm` moderno también funciona.
- **Angular CLI (opcional):** puedes usar la `@angular/cli` instalada localmente vía `npm start`; no es obligatorio instalarla globalmente.

**Pasos para ejecutar (rápido)**

1. Abre una terminal en la raíz del proyecto (donde está `package.json`).

2. Instala dependencias:

```powershell
# PowerShell (comando normal)
npm install
```

Si PowerShell arroja un error sobre la ejecución de scripts (p. ej. "npm.ps1 porque la ejecución de scripts está deshabilitada"), usa una de estas opciones:

```cmd
:: Opción A (usar Command Prompt):
cmd /c "cd /d %CD% && npm install"

:: Opción B (permitir scripts en PowerShell, requiere permiso del usuario):
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
- Si `npm` informa que hay una versión más reciente, actualizar `npm` es opcional; no es obligatorio para ejecutar el proyecto.
- Si sigues viendo errores relacionados con PowerShell, abre una ventana de **Command Prompt** (cmd.exe) y ejecuta los comandos allí.
- Si falta `ng` en PATH, `npm start` usará la versión local (instalada en `node_modules`); por eso no es necesario instalar `@angular/cli` globalmente.

Archivo con scripts y configuración: [prueba 232/prueba 232/package.json](prueba 232/prueba 232/package.json)

Si quieres, puedo:
- ejecutar `npm audit fix` ahora para intentar resolver vulnerabilidades.
- añadir una sección adicional de troubleshooting más extensa.

--
Actualizado para incluir pasos claros de ejecución en Windows.
