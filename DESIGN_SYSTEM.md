# 🎨 Design System - TALLEL TEXTILE

## Vue d'ensemble

Ce document décrit le système de design moderne et cohérent mis en place pour TALLEL TEXTILE. Le système utilise Tailwind CSS avec des classes utilitaires personnalisées pour garantir une expérience utilisateur professionnelle et cohérente.

## 🎯 Principes de Design

### 1. **Cohérence**
- Utilisation systématique des couleurs de la marque
- Espacements uniformes basés sur une échelle de 8px
- Typographie hiérarchisée et lisible

### 2. **Accessibilité**
- Contraste de couleurs respectant WCAG AA
- Focus visible pour la navigation au clavier
- Structure sémantique HTML

### 3. **Responsivité**
- Mobile-first approach
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Images et contenus adaptatifs

### 4. **Performance**
- Animations légères et optimisées
- Lazy loading des images
- CSS optimisé avec Tailwind

## 🎨 Palette de Couleurs

### Couleurs Principales
```css
--brand-primary: #BA8C3A        /* Camel/Or - Couleur principale */
--brand-primary-hover: #A87B34  /* Hover state */
--brand-secondary: #000000      /* Noir */
--brand-accent: #E5C771        /* Doré clair */
```

### Couleurs de Texte
```css
--brand-text-primary: #1A1A1A   /* Texte principal */
--brand-text-secondary: #555555 /* Texte secondaire */
```

### Couleurs de Fond
```css
--brand-bg-primary: #F5F5F5     /* Fond principal */
--brand-bg-secondary: #FFFFFF   /* Fond des cartes */
```

## 📐 Système d'Espacement

Échelle basée sur 8px :
- `xs`: 0.5rem (8px)
- `sm`: 0.75rem (12px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)

## 🔤 Typographie

### Polices
- **Sans-serif** : Inter (corps de texte, UI)
- **Serif** : Cormorant Garamond (titres, élégance)

### Hiérarchie
- **H1** : 4xl → 5xl → 6xl (responsive)
- **H2** : 3xl → 4xl → 5xl
- **H3** : 2xl → 3xl
- **H4** : xl → 2xl
- **Body** : base → lg → xl (responsive)

## 🧩 Composants

### Boutons

#### Variantes
```tsx
<button className="btn btn-primary btn-md">Primary</button>
<button className="btn btn-secondary btn-md">Secondary</button>
<button className="btn btn-outline btn-md">Outline</button>
<button className="btn btn-ghost btn-md">Ghost</button>
```

#### Tailles
- `btn-sm` : Petit (px-4 py-2)
- `btn-md` : Moyen (px-6 py-3)
- `btn-lg` : Grand (px-8 py-4)

### Cartes

```tsx
<div className="card card-hover">
  <div className="card-header">Titre</div>
  <div className="card-body">Contenu</div>
  <div className="card-footer">Actions</div>
</div>
```

### Formulaires

```tsx
<div className="form-group">
  <label className="form-label">Label</label>
  <input className="form-input" type="text" />
  <p className="form-error">Message d'erreur</p>
</div>
```

### Sections

```tsx
<section className="section">
  <div className="container-custom">
    <h2 className="section-title">Titre</h2>
    <p className="section-subtitle">Sous-titre</p>
    {/* Contenu */}
  </div>
</section>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Classes Responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 colonne mobile, 2 tablette, 3 desktop */}
</div>
```

## ✨ Animations

### Disponibles
- `animate-fade-in` : Apparition en fondu
- `animate-slide-up` : Apparition depuis le bas

### Transitions
- `transition-fast` : 150ms
- `transition-base` : 300ms
- `transition-slow` : 500ms

## 🎯 Bonnes Pratiques

### 1. Utiliser les Classes Utilitaires
✅ **Bon** :
```tsx
<button className="btn btn-primary btn-md">Action</button>
```

❌ **Mauvais** :
```tsx
<button className="bg-brand-primary text-white px-6 py-3 rounded-md">
  Action
</button>
```

### 2. Structure Sémantique
✅ **Bon** :
```tsx
<section className="section">
  <h2 className="section-title">Titre</h2>
  <div className="container-custom">...</div>
</section>
```

### 3. Accessibilité
- Toujours inclure `alt` sur les images
- Utiliser `aria-label` pour les icônes
- Respecter la hiérarchie des titres (h1 → h2 → h3)

### 4. Performance
- Utiliser `priority` pour les images above-the-fold
- Lazy loading pour les images hors écran
- Optimiser les images (WebP, dimensions)

## 📚 Classes Utilitaires Personnalisées

### Text
- `text-balance` : Équilibre du texte
- `text-responsive` : Texte adaptatif

### Scrollbar
- `scrollbar-thin` : Scrollbar fine stylisée

### Aspect Ratios
- `aspect-product` : 3:4 (produits)
- `aspect-hero` : 16:9 (hero)

## 🔄 Migration

Pour migrer un composant existant :

1. Remplacer les classes inline par les classes utilitaires
2. Utiliser les composants du design system
3. Vérifier la responsivité
4. Tester l'accessibilité

## 📖 Exemples

Voir les composants suivants pour des exemples :
- `components/ProductItem.tsx`
- `components/ProfileCard.tsx`
- `app/about/page.tsx`
- `app/login/page.tsx`
