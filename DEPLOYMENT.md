# Guía de Despliegue - RiVélez (Monolito)

Esta guía te ayudará a subir tu proyecto a internet usando **Railway**, un servicio en la nube fácil de usar que soporta Docker y MySQL.

## Prerrequisitos

1.  Cuenta en [GitHub](https://github.com/) (para subir tu código).
2.  Cuenta en [Railway](https://railway.app/) (puedes entrar con tu cuenta de GitHub).
3.  Tener todo tu código subido a un repositorio de GitHub.

## Pasos para Desplegar

### 1. Subir Código a GitHub
Asegúrate de que tu carpeta `Sistema` sea la raíz de tu repositorio o que el `Dockerfile` esté en la raíz del repositorio.
Si este archivo `DEPLOYMENT.md` está en la raíz, ¡vas bien!

### 2. Crear Proyecto en Railway
1.  Entra al dashboard de Railway.
2.  Click en **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Selecciona tu repositorio (RiVelez-Sistema).
4.  Railway detectará el `Dockerfile` y empezará a construir. **¡Espera!** Necesitamos configurar la base de datos primero.

### 3. Agregar Base de Datos MySQL
1.  En la vista de tu proyecto en Railway, haz click derecho (o click en "New") -> **Database** -> **MySQL**.
2.  Espera unos segundos a que se cree la base de datos.
3.  Haz click en la tarjeta de **MySQL** -> Pestaña **Variables**.
4.  Aquí verás `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.

### 4. Conectar Backend con Base de Datos
1.  Haz click en la tarjeta de tu aplicación (el backend).
2.  Ve a la pestaña **Variables**.
3.  Agrega las siguientes variables para que el backend sepa cómo conectarse:

    | Variable | Valor (Referencia) |
    | :--- | :--- |
    | `DB_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}` |
    | `DB_USER` | `${{MySQL.MYSQLUSER}}` |
    | `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
    | `JWT_SECRET` | EscribeUnaClaveSuperSecretaYLargaAqui123 |
    | `PORT` | `8080` |

    *Nota: En `DB_URL`, asegúrate de usar la sintaxis de variables de Railway `${{SERVICE_NAME.VAR}}` o simplemente copia los valores manualmente desde la tarjeta de MySQL si te resulta más fácil, pero asegúrate de formar la URL correctamente.*

    **Formato URL JDBC:** `jdbc:mysql://HOST:PORT/DATABASE?useSSL=false&allowPublicKeyRetrieval=true`

4.  Railway reiniciará automáticamente el despliegue cuando guardes las variables.

### 5. Verificar Logs y Sitio
1.  Ve a la pestaña **Deployments** de tu aplicación.
2.  Verás los logs de "Building" (construyendo) y luego "Deploying". Esto puede tardar unos minutos porque tiene que compilar Java y React.
3.  Si todo sale bien, verás un "Active".
4.  Ve a la pestaña **Settings** -> **Networking** y genera un dominio (ej: `rivelez-production.up.railway.app`).
5.  ¡Entra a ese link y deberías ver tu aplicación funcionando!

## Solución de Problemas Comunes

-   **Error de conexión a DB**: Revisa la variable `DB_URL` en Railway.
-   **Página en blanco**: Revisa la consola del navegador. Si dice 404 en archivos JS/CSS, verifica que el Dockerfile haya copiado bien la carpeta `dist`.
-   **CORS Error**: Como ahora el frontend y backend salen del mismo origen, no deberías tener problemas de CORS.
