# Invitación de usuario (ruta pública)

Flujo previsto: el administrador envía una invitación y el usuario recibe un correo con un enlace que incluye un **token** emitido por el backend. Al abrir el enlace llega a la pantalla **Invitación al sistema** (fuera del ERP, sin menú lateral): el **nombre** y el **correo** ya vienen asociados a la invitación (no se piden en el formulario); solo debe definir una contraseña segura y elegir **Aceptar** o **Rechazar**.

En **prototipo** no hay API ni correo: el front solo clasifica el token contra listas locales (válido, expirado de ejemplo, o inválido) para maquetar y probar.

## URL y parámetros

- Ruta: `/invitacion`
- Query: `token` (obligatorio para ver el formulario de aceptación en prototipo)
- Opcional en prototipo: `nombre`, `correo` o `email` (simulan lo que en producción devolverá el backend al validar el token). Si no se envían, se muestran valores demo fijos para poder probar con solo `token`.

## Ejemplos en desarrollo

Con `npm run dev`, Vite suele servir en el puerto **5173** (ajusta el host/puerto si los cambias).

| Caso | URL de ejemplo |
|------|------------------|
| Formulario válido (token `demo`, datos demo) | `http://localhost:5173/invitacion?token=demo` |
| Formulario válido con nombre y correo en URL | `http://localhost:5173/invitacion?token=demo&nombre=Mar%C3%ADa%20Garc%C3%ADa&correo=maria.garcia@ejemplo.gob.mx` |
| Formulario válido (token UUID de ejemplo) | `http://localhost:5173/invitacion?token=550e8400-e29b-41d4-a716-446655440000` |
| Enlace **expirado** (prototipo) | `http://localhost:5173/invitacion?token=expirado-demo` |
| Token inválido o ausente | `http://localhost:5173/invitacion` |
| Token inválido explícito | `http://localhost:5173/invitacion?token=no-existe` |

Tras **Aceptar** o confirmar **Rechazar** en prototipo se muestra un aviso y, pasados unos segundos, se redirige a `/login`.

## Integración futura

- El backend deberá **validar el token** (caducidad, uso único) y devolver o fijar en sesión el **nombre** y **correo** de la invitación, además de exponer endpoints para **aceptar** (crear credenciales) o **rechazar** la invitación.
- Los enlaces del correo usarán el mismo patrón de ruta y query, sustituyendo el valor real de `token` por el generado en servidor.

## Código relacionado

- Vista: `src/views/InvitacionUsuarioView.tsx`
- Registro de ruta: `src/App.jsx` (hermana de `/login` y `/cambiar-contrasena`, fuera de `RequireAuth`)
