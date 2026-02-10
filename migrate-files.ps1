# Script de migration des fichiers vers le monorepo

Write-Host "🚀 Début de la migration..." -ForegroundColor Green

# Créer les dossiers nécessaires
Write-Host "📁 Création des dossiers..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path apps\frontend\app, apps\frontend\components, apps\frontend\public, apps\frontend\lib, apps\frontend\hooks, apps\frontend\helpers
New-Item -ItemType Directory -Force -Path apps\admin\app, apps\admin\components, apps\admin\lib, apps\admin\utils

# Copier les fichiers frontend
Write-Host "📦 Copie des fichiers frontend..." -ForegroundColor Yellow

# App frontend (sauf admin et api/auth)
$frontendAppFiles = @(
    "app\about", "app\cart", "app\checkout", "app\contact", "app\product",
    "app\register", "app\search", "app\shop", "app\notifications",
    "app\page.tsx", "app\layout.tsx", "app\globals.css", "app\error.tsx",
    "app\not-found.tsx", "app\favicon.ico", "app\actions"
)
foreach ($file in $frontendAppFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "apps\frontend\$file" -Recurse -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

# Copier public
if (Test-Path "public") {
    Copy-Item -Path "public" -Destination "apps\frontend\public" -Recurse -Force
    Write-Host "  ✅ public/" -ForegroundColor Green
}

# Copier lib (sauf auth)
$frontendLibFiles = @(
    "lib\config.ts", "lib\api.ts", "lib\utils.ts", "lib\formatPrice.ts",
    "lib\sanitize.ts", "lib\form-sanitize.ts", "lib\notification-api.ts",
    "lib\notification-helpers.ts", "lib\prisma.ts"
)
foreach ($file in $frontendLibFiles) {
    if (Test-Path $file) {
        $destFile = $file -replace "^lib\\", "apps\frontend\lib\"
        $destDir = Split-Path $destFile -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Copy-Item -Path $file -Destination $destFile -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

# Copier config files
Copy-Item -Path "tailwind.config.ts" -Destination "apps\frontend\tailwind.config.ts" -Force
Copy-Item -Path "postcss.config.js" -Destination "apps\frontend\postcss.config.js" -Force
Write-Host "  ✅ Config files" -ForegroundColor Green

# Copier les fichiers admin
Write-Host "📦 Copie des fichiers admin..." -ForegroundColor Yellow

# App admin
$dashboardPath = 'app\(dashboard)'
if (Test-Path $dashboardPath) {
    $adminPath = Join-Path $dashboardPath "admin"
    if (Test-Path $adminPath) {
        $destPath = 'apps\admin\app\(dashboard)\admin'
        $destDir = Split-Path $destPath -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Copy-Item -Path $adminPath -Destination $destPath -Recurse -Force
        Write-Host "  ✅ app/(dashboard)/admin/" -ForegroundColor Green
    }
    $layoutPath = Join-Path $dashboardPath "layout.tsx"
    if (Test-Path $layoutPath) {
        $destPath = 'apps\admin\app\(dashboard)\layout.tsx'
        $destDir = Split-Path $destPath -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Copy-Item -Path $layoutPath -Destination $destPath -Force
        Write-Host "  ✅ app/(dashboard)/layout.tsx" -ForegroundColor Green
    }
}

# API auth
if (Test-Path "app\api\auth") {
    Copy-Item -Path "app\api\auth" -Destination "apps\admin\app\api\auth" -Recurse -Force
    Write-Host "  ✅ app/api/auth/" -ForegroundColor Green
}

# Login
if (Test-Path "app\login") {
    Copy-Item -Path "app\login" -Destination "apps\admin\app\login" -Recurse -Force
    Write-Host "  ✅ app/login/" -ForegroundColor Green
}

# Lib auth
if (Test-Path "lib\authOptions.ts") {
    Copy-Item -Path "lib\authOptions.ts" -Destination "apps\admin\lib\authOptions.ts" -Force
    Write-Host "  ✅ lib/authOptions.ts" -ForegroundColor Green
}
if (Test-Path "lib\auth.ts") {
    Copy-Item -Path "lib\auth.ts" -Destination "apps\admin\lib\auth.ts" -Force
    Write-Host "  ✅ lib/auth.ts" -ForegroundColor Green
}

# Components admin
$adminComponents = @(
    "components\DashboardSidebar.tsx", "components\DashboardProductTable.tsx",
    "components\AdminOrders.tsx", "components\StatsElement.tsx",
    "components\BulkUploadHistory.tsx", "components\OrderItem.tsx"
)
foreach ($file in $adminComponents) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "apps\admin\$file" -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

# Utils admin
if (Test-Path "utils\adminAuth.ts") {
    Copy-Item -Path "utils\adminAuth.ts" -Destination "apps\admin\utils\adminAuth.ts" -Force
    Write-Host "  ✅ utils/adminAuth.ts" -ForegroundColor Green
}
if (Test-Path "utils\SessionProvider.tsx") {
    Copy-Item -Path "utils\SessionProvider.tsx" -Destination "apps\admin\utils\SessionProvider.tsx" -Force
    Write-Host "  ✅ utils/SessionProvider.tsx" -ForegroundColor Green
}

# Config files admin
Copy-Item -Path "tailwind.config.ts" -Destination "apps\admin\tailwind.config.ts" -Force
Copy-Item -Path "postcss.config.js" -Destination "apps\admin\postcss.config.js" -Force
Write-Host "  ✅ Config files" -ForegroundColor Green

Write-Host "✅ Migration des fichiers terminée !" -ForegroundColor Green
Write-Host "📝 Prochaine étape : Mettre à jour les imports" -ForegroundColor Yellow
