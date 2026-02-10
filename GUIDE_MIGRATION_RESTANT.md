# 📋 Guide : Migration Restante

## 🎯 Objectif

Terminer la migration en déplaçant les fichiers vers les bonnes apps.

## 📝 Étapes Détaillées

### Étape 1 : Copier les fichiers frontend

```powershell
# Créer les dossiers
New-Item -ItemType Directory -Force -Path apps\frontend\app, apps\frontend\components, apps\frontend\public, apps\frontend\lib

# Copier app/ (sauf admin et api/auth)
Copy-Item -Path "app\about" -Destination "apps\frontend\app\about" -Recurse -Force
Copy-Item -Path "app\cart" -Destination "apps\frontend\app\cart" -Recurse -Force
Copy-Item -Path "app\checkout" -Destination "apps\frontend\app\checkout" -Recurse -Force
Copy-Item -Path "app\contact" -Destination "apps\frontend\app\contact" -Recurse -Force
Copy-Item -Path "app\product" -Destination "apps\frontend\app\product" -Recurse -Force
Copy-Item -Path "app\register" -Destination "apps\frontend\app\register" -Recurse -Force
Copy-Item -Path "app\search" -Destination "apps\frontend\app\search" -Recurse -Force
Copy-Item -Path "app\shop" -Destination "apps\frontend\app\shop" -Recurse -Force
Copy-Item -Path "app\notifications" -Destination "apps\frontend\app\notifications" -Recurse -Force
Copy-Item -Path "app\page.tsx" -Destination "apps\frontend\app\page.tsx" -Force
Copy-Item -Path "app\layout.tsx" -Destination "apps\frontend\app\layout.tsx" -Force
Copy-Item -Path "app\globals.css" -Destination "apps\frontend\app\globals.css" -Force
Copy-Item -Path "app\error.tsx" -Destination "apps\frontend\app\error.tsx" -Force
Copy-Item -Path "app\not-found.tsx" -Destination "apps\frontend\app\not-found.tsx" -Force
Copy-Item -Path "app\favicon.ico" -Destination "apps\frontend\app\favicon.ico" -Force

# Copier components (sauf Dashboard* et Admin*)
# À faire manuellement ou avec un script

# Copier public
Copy-Item -Path "public" -Destination "apps\frontend\public" -Recurse -Force

# Copier lib (sauf authOptions.ts et auth.ts)
Copy-Item -Path "lib\config.ts" -Destination "apps\frontend\lib\config.ts" -Force
Copy-Item -Path "lib\api.ts" -Destination "apps\frontend\lib\api.ts" -Force
Copy-Item -Path "lib\utils.ts" -Destination "apps\frontend\lib\utils.ts" -Force
Copy-Item -Path "lib\formatPrice.ts" -Destination "apps\frontend\lib\formatPrice.ts" -Force
Copy-Item -Path "lib\sanitize.ts" -Destination "apps\frontend\lib\sanitize.ts" -Force
Copy-Item -Path "lib\form-sanitize.ts" -Destination "apps\frontend\lib\form-sanitize.ts" -Force
Copy-Item -Path "lib\notification-api.ts" -Destination "apps\frontend\lib\notification-api.ts" -Force
Copy-Item -Path "lib\notification-helpers.ts" -Destination "apps\frontend\lib\notification-helpers.ts" -Force

# Copier config files
Copy-Item -Path "tailwind.config.ts" -Destination "apps\frontend\tailwind.config.ts" -Force
Copy-Item -Path "postcss.config.js" -Destination "apps\frontend\postcss.config.js" -Force
```

### Étape 2 : Copier les fichiers admin

```powershell
# Créer les dossiers
New-Item -ItemType Directory -Force -Path apps\admin\app, apps\admin\components, apps\admin\lib, apps\admin\utils

# Copier app/(dashboard)/admin/
Copy-Item -Path "app\(dashboard)\admin" -Destination "apps\admin\app\(dashboard)\admin" -Recurse -Force
Copy-Item -Path "app\(dashboard)\layout.tsx" -Destination "apps\admin\app\(dashboard)\layout.tsx" -Force

# Copier app/api/auth/
Copy-Item -Path "app\api\auth" -Destination "apps\admin\app\api\auth" -Recurse -Force

# Copier app/login/
Copy-Item -Path "app\login" -Destination "apps\admin\app\login" -Recurse -Force

# Copier lib/authOptions.ts et lib/auth.ts
Copy-Item -Path "lib\authOptions.ts" -Destination "apps\admin\lib\authOptions.ts" -Force
Copy-Item -Path "lib\auth.ts" -Destination "apps\admin\lib\auth.ts" -Force

# Copier components admin
Copy-Item -Path "components\DashboardSidebar.tsx" -Destination "apps\admin\components\DashboardSidebar.tsx" -Force
Copy-Item -Path "components\DashboardProductTable.tsx" -Destination "apps\admin\components\DashboardProductTable.tsx" -Force
Copy-Item -Path "components\AdminOrders.tsx" -Destination "apps\admin\components\AdminOrders.tsx" -Force
Copy-Item -Path "components\StatsElement.tsx" -Destination "apps\admin\components\StatsElement.tsx" -Force
Copy-Item -Path "components\BulkUploadHistory.tsx" -Destination "apps\admin\components\BulkUploadHistory.tsx" -Force
Copy-Item -Path "components\OrderItem.tsx" -Destination "apps\admin\components\OrderItem.tsx" -Force

# Copier utils admin
Copy-Item -Path "utils\adminAuth.ts" -Destination "apps\admin\utils\adminAuth.ts" -Force
Copy-Item -Path "utils\SessionProvider.tsx" -Destination "apps\admin\utils\SessionProvider.tsx" -Force

# Copier config files
Copy-Item -Path "tailwind.config.ts" -Destination "apps\admin\tailwind.config.ts" -Force
Copy-Item -Path "postcss.config.js" -Destination "apps\admin\postcss.config.js" -Force
```

### Étape 3 : Mettre à jour les imports

Dans chaque app, remplacer :
- `import config from '@/lib/config'` → `import config from '@tallel-textile/shared/lib/config'`
- `import apiClient from '@/lib/api'` → `import apiClient from '@tallel-textile/shared/lib/api'`
- `import { PrismaClient } from '@prisma/client'` → `import { PrismaClient } from '@tallel-textile/prisma'`

## ⚠️ Important

Cette migration est complexe. Il est recommandé de :
1. Faire un commit avant de commencer
2. Tester chaque étape
3. Mettre à jour les imports progressivement
4. Tester chaque app après chaque étape
