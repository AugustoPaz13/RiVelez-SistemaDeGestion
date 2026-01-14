# Script para construir y ejecutar el monolito (Frontend + Backend) localmente

Write-Host "=== Paso 1: Construyendo el Frontend (React) ===" -ForegroundColor Cyan
Set-Location "$PSScriptRoot\app"
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir el frontend."
    exit $LASTEXITCODE
}

Write-Host "=== Paso 2: Copiando archivos al Backend (Spring Boot) ===" -ForegroundColor Cyan
$BackendStaticPath = "$PSScriptRoot\backend\src\main\resources\static"

# Crear directorio si no existe
if (!(Test-Path -Path $BackendStaticPath)) {
    New-Item -ItemType Directory -Path $BackendStaticPath -Force | Out-Null
}

# Limpiar directorio static anterior (opcional, pero recomendado)
Get-ChildItem -Path $BackendStaticPath -Recurse | Remove-Item -Recurse -Force

# Copiar contenido de dist a static
Copy-Item -Path "$PSScriptRoot\app\dist\*" -Destination $BackendStaticPath -Recurse -Force

Write-Host "Archivos copiados exitosamente a $BackendStaticPath" -ForegroundColor Green

Write-Host "=== Paso 3: Ejecutando el Backend ===" -ForegroundColor Cyan
Set-Location "$PSScriptRoot\backend"

# Forzar credenciales locales para evitar conflictos con variables de entorno globales (ej: DB_USER=postgres)
$env:DB_USER = "rivelez_user"
$env:DB_PASSWORD = "rivelez_pass"
# Usar la URL por defecto si no está definida, pero asegurarnos de que apunte a MySQL local
if (-not $env:DB_URL) {
    $env:DB_URL = "jdbc:mysql://localhost:3306/rivelez_db?useSSL=false&serverTimezone=America/Argentina/Buenos_Aires&allowPublicKeyRetrieval=true"
}

Write-Host "Usando Base de Datos Local: rivelez_db (Usuario: rivelez_user)" -ForegroundColor Yellow

.\mvnw.cmd spring-boot:run
