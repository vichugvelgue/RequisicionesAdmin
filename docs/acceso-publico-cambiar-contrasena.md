# Cambio de contraseña (ruta pública)

Flujo previsto: el usuario recibe un correo con un enlace que incluye un **token** emitido por el backend. Al abrir el enlace llega a la pantalla **Cambiar contraseña** (fuera del ERP, sin menú lateral), define la nueva contraseña y confirma.

En **prototipo** no hay API ni correo: el front solo valida el token contra una lista blanca local para poder maquetar y probar la pantalla.

## URL y parámetro

- Ruta: `/cambiar-contrasena`
- Query: `token` (obligatorio en prototipo para ver el formulario)

## Ejemplos en desarrollo

Con `npm run dev`, Vite suele servir en el puerto **5173** (ajusta el host/puerto si los cambias).

| Caso | URL de ejemplo |
|------|------------------|
| Formulario válido (token `demo`) | `http://localhost:5173/cambiar-contrasena?token=demo` |
| Formulario válido (token UUID de ejemplo) | `http://localhost:5173/cambiar-contrasena?token=550e8400-e29b-41d4-a716-446655440000` |
| Token inválido o ausente (mensaje de error) | `http://localhost:5173/cambiar-contrasena` |
| Token inválido explícito | `http://localhost:5173/cambiar-contrasena?token=no-existe` |

Al guardar en prototipo se muestra un aviso de éxito y, pasados unos segundos, se redirige a `/login`.

## Integración futura

- El backend deberá **validar el token** (caducidad, uso único, usuario asociado) y exponer un endpoint para **establecer la nueva contraseña**.
- Los enlaces del correo usarán el mismo patrón de ruta y query, sustituyendo el valor real de `token` por el generado en servidor.

## Código relacionado

- Vista: `src/views/CambiarContrasenaView.tsx`
- Registro de ruta: `src/App.jsx` (hermana de `/login`, fuera de `RequireAuth`)
