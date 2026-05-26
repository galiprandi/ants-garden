# Guía de Verificación de Frontend con Playwright (Video + Captura de pantalla)

Después de realizar cualquier cambio en el frontend, debes intentar verificarlo visualmente siguiendo este flujo de trabajo. El objetivo es iniciar la aplicación, escribir un script temporal de Playwright para demostrar tu cambio en uno o más trayectos de usuario (CUJs), grabar un video del trayecto relevante Y tomar una captura de pantalla, y confirmar que se ve correctamente antes de finalizar. Los usuarios también podrán ver los videos y capturas de pantalla que generes, por lo que es una forma de mostrar tus cambios y demostrarles que lo que construiste es correcto.

## Flujo de Trabajo de Verificación Paso a Paso

Sigue estos pasos en orden para probar y verificar tus cambios en el frontend.

### 1. Inicia la Aplicación 🚀

Antes de poder verificar tus cambios, debes iniciar el servidor de desarrollo local. O, si realizaste cambios estáticos que no requieren una construcción, es posible que puedas navegar a ellos directamente usando `filepath://` en tu script.

- Busca un comando en el `package.json` o en la documentación del proyecto, como `npm run dev`, `npm start` o `yarn dev`.
- Ejecuta este comando. Es posible que necesites ejecutarlo como un proceso en segundo plano para poder seguir emitiendo otros comandos.

### 2. Identifica los CUJs y flujos de trabajo a verificar

Piensa en trayectos de usuario importantes que probarían o demostrarían que tu cambio está funcionando según lo previsto, sin regresiones. Tómate un momento para hablar contigo mismo sobre los posibles trayectos de usuario y toma algunas notas sobre lo que deberían ser estos trayectos detallados, y lo que te gustaría resaltar en el video y las capturas de pantalla.

- Elige los 1 a 3 trayectos de usuario más importantes que demuestren que cumpliste con la tarea del usuario, para el siguiente paso donde escribiremos scripts de Playwright para generar videos y capturas de pantalla.

**Diseño del CUJ:** Tu video debe servir como prueba de que la tarea se completó con éxito. Piensa en lo que un usuario o revisor necesitaría ver para estar convencido. Navega a través del flujo relevante, interactúa con los elementos de la interfaz de usuario que cambiaste y demuestra la funcionalidad de extremo a extremo.

**Integridad:** Tu video DEBE mostrar que la funcionalidad alcanza su estado terminal o final. Una demostración parcial no es suficiente. Ejemplos:

- **Juego:** Juega una partida completa hasta ganar o perder — no te limites a cargar la página y hacer un clic.
- **Formulario/Asistente:** Completa todos los campos, envía y muestra la confirmación de éxito.
- **Dashboard/Visualización de datos:** Poblalo con datos y muéstralo completamente renderizado.
- **Funcionalidad interactiva:** Ejercita todos los estados y transiciones clave (ej. activar/desactivar, agregar/eliminar elementos, expandir/colapsar).

Si un flujo completo toma muchos pasos, está bien — los videos más largos y completos son mejores que los cortos e incompletos.

### 3. Crea un Script de Verificación con Video 🎬 y Captura de Pantalla 📸

Primero, crea directorios temporales para tu trabajo:

```bash
mkdir -p screenshots videos
```

⚠️ **CRÍTICO:** DEBES usar `browser.new_context(record_video_dir=...)` — NO `browser.new_page()` — para grabar video. El video es una característica a nivel de contexto. DEBES llamar a `context.close()` antes de `browser.close()` o el archivo de video NO se guardará.

Comienza desde esta plantilla y completa tus acciones específicas de CUJ donde se indica:

```python
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")  # TODO: ajustar URL
    page.wait_for_timeout(500)

    # TODO: Agrega tus pasos de CUJ aquí. Después de cada acción, agrega:
    #   page.wait_for_timeout(500)
    #
    # Lleva la funcionalidad a su ESTADO FINAL — no te detengas antes.
    # Ejemplo:
    #   page.get_by_role("button", name="Start").click()
    #   page.wait_for_timeout(500)
    #   page.get_by_role("textbox").fill("test input")
    #   page.wait_for_timeout(500)

    # Toma una captura de pantalla en el momento clave
    page.screenshot(path="screenshots/verification.png")
    page.wait_for_timeout(1000)  # Mantén el estado final para el video

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # DEBE cerrar el contexto para guardar el video
            browser.close()
```

**Ritmo y Tiempo:** El video será visto por usuarios y revisores de IA, por lo que debe ser fácil de ver e informativo:

- Agrega pausas de `page.wait_for_timeout(500)` (500 ms) después de cada acción significativa (carga de página, clic, completar formulario) para que el espectador pueda ver el resultado antes del siguiente paso.
- Agrega una pausa de 1 segundo (`page.wait_for_timeout(1000)`) en el estado final para mostrar claramente el resultado final.
- Apunta a una duración total del video de 10 a 15 segundos, pero más tiempo está bien si el CUJ lo requiere — la integridad es más importante que la brevedad.

Guarda el script con un nombre como `verify_<nombre_cuj>.py`.

Puedes ejecutar tu script con: `python verify_<nombre_cuj>.py`.

El script debe ejecutarse con éxito, de lo contrario, depúralo.

### 4. Inspecciona Visualmente Tu Trabajo 👀

Utiliza mis herramientas de visualización para cargar la captura de pantalla que acabas de crear.

También puedes revisar el video grabado desde `videos/` para inspeccionar la grabación de la sesión.

Analiza y reflexiona sobre lo que ves en la imagen. ¿La funcionalidad se ve exactamente como se pretendía? ¿El estilo es correcto? ¿Se cumplen los requisitos del usuario?

**Nota:** por ahora, solo puedes "ver" el video a 1 fps, así que tenlo en cuenta al evaluar el video. Si necesitas inspeccionar cosas con más detalle, puedes tomar capturas de pantalla en momentos críticos de tu script de Playwright e inspeccionarlas.

Si no se ve correcto, actualiza el plan y vuelve a verificar.

### 5. Adjunta Screenshots al PR como Comentario 📎

Una vez que hayas confirmado visualmente que la captura de pantalla se ve perfecta, DEBES adjuntarla al PR como comentario para evidencia visual:

1. **Guarda el screenshot en el repositorio** (ej: `public/screenshots/` o `screenshots/`)
2. **Commit y push el screenshot** al PR
3. **Adjunta el screenshot como comentario** usando `gh api`:

```bash
# Obtener el número del PR actual
PR_NUMBER=$(gh pr view --json number --jq '.number')

# Adjuntar el screenshot como comentario con descripción
gh api repos/galiprandi/ants-garden/issues/$PR_NUMBER/comments \
  -f body='### Validación visual: [DESCRIPCIÓN DEL CAMBIO]\n\n\n![screenshot](https://raw.githubusercontent.com/galiprandi/ants-garden/$(git branch --show-current)/public/screenshots/nombre.png)'
```

**Ejemplo concreto:**
```bash
gh api repos/galiprandi/ants-garden/issues/6/comments \
  -f body='### Validación visual: Nuevo componente de input de número para Sudoku\n\n\n![screenshot](https://raw.githubusercontent.com/galiprandi/ants-garden/uma-refactor-sudoku-implement-core-gameplay/screenshots/number-pad.png)'
```

**⚠️ IMPORTANTE:**
- Usa comillas simples (`'`) en el body para evitar que zsh interprete los corchetes `[]`
- La descripción debe explicar QUÉ cambió y PARA QUÉ
- La URL debe apuntar a la rama actual del PR
- Reemplaza `PR_NUMBER` con el número real del PR

### 6. Confirma la Finalización ✅

Una vez que hayas confirmado visualmente que la captura de pantalla se ve perfecta, el video fue grabado y adjuntado al PR, utiliza el comando de finalización de verificación:

Pasa la ruta de la captura de pantalla como primer argumento, y pasa todas las rutas de video finales en la lista de archivos multimedia adicionales.

Ejemplo:

```python
# Usando el comando de finalización con los resultados obtenidos:
confirmar_verificacion_visual(
    ruta_imagen='screenshots/verification.png',
    rutas_media_adicional=['videos/video.webm']
)
```

Si no puedes completar el flujo de trabajo de verificación, infórmaselo al usuario y continúa.

## Depuración de Scripts Fallidos 🐛

Si tu script de Playwright no se ejecuta, no adivines. Depura sistemáticamente el problema analizando la salida del error.

| Tipo de Error | Causa Probable y Solución |
|---------------|---------------------------|
| Tiempo de espera / Selector no encontrado | El elemento que intentas encontrar no existe o aún no ha aparecido. **Solución:** Verifica dos veces tu localizador. Usa `page.get_by_role()` u otro localizador orientado al usuario. |
| Aserción Fallida | Se encontró el elemento, pero está en el estado incorrecto. **Solution:** Corrige el código de tu aplicación. |
| Error de Navegación o Red | El script no pudo cargar la página. **Solution:** Asegúrate de que el servidor de desarrollo esté funcionando y que la URL sea correcta. |

## Mejores Prácticas de Playwright

- **Usa Aserciones Orientadas a la Web:** Usa siempre `expect(locator)` con comparadores como `.to_be_visible()` o `.to_have_text()`.
- **Prefiere Localizadores Orientados al Usuario:** `page.get_by_role()`, `page.get_by_text()`, `page.get_by_label()`.
- **Evita Selectores Frágiles:** No uses nombres de clases generados automáticamente o rutas CSS largas.
