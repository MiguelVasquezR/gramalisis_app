# Gramalisis App

Aplicación móvil construida con Expo + React Native y Firebase. Permite registrar usuarios con autenticación por correo/contraseña y guardar textos analizados en Firestore.

## Requisitos

- Node.js 18 o superior
- Cuenta de Firebase con proyecto y Firestore habilitados

## Configuración

1. Copia el archivo de variables y completa tus credenciales de Firebase:

   ```bash
   cp .env.example .env
   ```

   Llena cada `EXPO_PUBLIC_FIREBASE_*` con los valores reales del panel de Firebase (`Configuración del proyecto > Tus apps`).

2. En Firebase habilita el proveedor **Email/Password** dentro de Authentication.

3. Crea una base de datos Firestore en modo producción o prueba. La app guarda los documentos dentro de `users/{uid}/entries`, por lo que no necesitas índices compuestos adicionales.

## Ejecutar la app

```bash
npm install
npm run start      # Usa la tecla correspondiente para abrir Android, iOS o Web
```

Las variables que empiezan con `EXPO_PUBLIC_` se exponen automáticamente en el cliente cuando usas Expo.

## Funcionalidades incluidas

- Pantalla de autenticación con alternancia registro/login y validaciones básicas.
- Contexto global (`src/context/AuthContext.tsx`) que escucha el estado de Firebase Auth.
- Capa Firebase (`src/lib/firebase.ts`, `src/lib/auth.ts`, `src/lib/entries.ts`) con helpers para Auth y Firestore.
- Dashboard con niveles progresivos y estadísticas (estado global en `src/store/AppStore.tsx` + `src/const/levels.ts`).
- Router basado en Expo Router (`app/_layout.tsx`) con rutas por carpeta.
- UI creada con estilos tradicionales de React Native (`StyleSheet`) y componentes reutilizables en `src/components`.

## Rutas principales (`app/`)

- `login/`: vista de acceso con la UI inspirada en Wealthfront.
- `registry/`: formulario de registro con campos personales antes de crear la cuenta.
- `home/`: tablero principal con creación/listado de análisis.
- `game/`: modo juego que recorre tus textos guardados.
- `profile/`: vista de perfil con tarjetas de datos generales y notificaciones.

## Próximos pasos sugeridos

1. Añadir reglas de seguridad personalizadas en Firestore para que cada usuario solo pueda leer/escribir su subcolección.
2. Implementar análisis lingüístico real (por ejemplo, puntuar gramática en Cloud Functions) y guardar los resultados adicionales en cada documento.
3. Integrar navegación con React Navigation si necesitas más pantallas (perfil, detalles, etc.).
