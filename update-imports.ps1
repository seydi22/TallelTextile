# Script pour mettre à jour les imports dans les apps

Write-Host "🔄 Mise à jour des imports..." -ForegroundColor Yellow

# Frontend: Remplacer @/lib/config et @/lib/api par @tallel-textile/shared
$frontendFiles = Get-ChildItem -Path "apps\frontend" -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $frontendFiles) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Remplacer les imports de lib
    $content = $content -replace "from ['""]@/lib/config['""]", "from '@tallel-textile/shared/lib/config'"
    $content = $content -replace "from ['""]@/lib/api['""]", "from '@tallel-textile/shared/lib/api'"
    $content = $content -replace "from ['""]@/lib/utils['""]", "from '@tallel-textile/shared/lib/utils'"
    $content = $content -replace "from ['""]@/lib/formatPrice['""]", "from '@tallel-textile/shared/lib/formatPrice'"
    
    # Remplacer @prisma/client
    $content = $content -replace "from ['""]@prisma/client['""]", "from '@tallel-textile/prisma'"
    
    # Remplacer @/types
    $content = $content -replace "from ['""]@/types/", "from '@tallel-textile/shared/types/"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
    }
}

# Admin: Remplacer @/lib/authOptions et autres imports relatifs
$adminFiles = Get-ChildItem -Path "apps\admin" -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $adminFiles) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Remplacer @/types
    $content = $content -replace "from ['""]@/types/", "from '@tallel-textile/shared/types/"
    
    # Remplacer @prisma/client
    $content = $content -replace "from ['""]@prisma/client['""]", "from '@tallel-textile/prisma'"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "✅ Mise à jour des imports terminée !" -ForegroundColor Green
