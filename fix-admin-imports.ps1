# Script pour corriger les imports @/ dans apps/admin

Write-Host "🔄 Correction des imports dans apps/admin..." -ForegroundColor Yellow

$files = Get-ChildItem -Path "apps\admin" -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    # Remplacer @/components par chemin relatif ou ../../components
    $relativePath = $file.DirectoryName.Replace((Get-Location).Path + "\apps\admin", "")
    $depth = ($relativePath -split "\\").Count - 1
    
    if ($depth -gt 0) {
        $prefix = "../" * $depth
        $content = $content -replace "from ['""]@/components/", "from '$prefix`components/"
        $content = $content -replace "from ['""]@/components['""]", "from '$prefix`components'"
    } else {
        $content = $content -replace "from ['""]@/components/", "from '../components/"
        $content = $content -replace "from ['""]@/components['""]", "from '../components'"
    }
    
    # Remplacer @/lib par packages partagés ou chemins relatifs
    $content = $content -replace "from ['""]@/lib/api['""]", "from '@tallel-textile/shared/lib/api'"
    $content = $content -replace "from ['""]@/lib/config['""]", "from '@tallel-textile/shared/lib/config'"
    
    # Remplacer @/utils par chemins relatifs
    if ($depth -gt 0) {
        $prefix = "../" * $depth
        $content = $content -replace "from ['""]@/utils/", "from '$prefix`utils/"
        $content = $content -replace "from ['""]@/utils['""]", "from '$prefix`utils'"
    } else {
        $content = $content -replace "from ['""]@/utils/", "from '../utils/"
        $content = $content -replace "from ['""]@/utils['""]", "from '../utils'"
    }
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "✅ Correction terminée !" -ForegroundColor Green
