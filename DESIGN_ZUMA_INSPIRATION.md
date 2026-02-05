# 🎨 Design Inspiré de Zuma Restaurant

## Vue d'ensemble

Ce design s'inspire du site Zuma Restaurant, connu pour son esthétique minimaliste, élégante et premium. L'objectif est de créer le même feeling UI/UX tout en gardant des composants originaux adaptés à votre stack Next.js.

## Caractéristiques du Design Zuma

### ✨ Éléments Clés

1. **Minimalisme Premium**
   - Espacement généreux
   - Typographie élégante (serif pour les titres)
   - Images en plein écran
   - Palette de couleurs raffinée

2. **Navigation Discrète**
   - Header transparent qui devient opaque au scroll
   - Navigation minimaliste avec texte en uppercase
   - Transitions fluides et animations subtiles

3. **Grandes Images**
   - Hero en plein écran (100vh)
   - Images de catégories avec overlay subtil
   - Effets de zoom au hover

4. **Animations Subtiles**
   - Fade-in progressif
   - Transitions douces (500-700ms)
   - Effets de parallaxe légers

## Composants Créés

### 1. `HeroZuma.tsx`
- Hero en plein écran (100vh)
- Typographie élégante avec serif
- Scroll indicator en bas
- Animations de fade-in

### 2. `HeaderZuma.tsx`
- Header fixe et transparent
- Devient opaque avec blur au scroll
- Navigation minimaliste
- Menu mobile élégant

### 3. `CategoryItem.tsx` (Amélioré)
- Images avec overlay gradient subtil
- Effet de zoom au hover
- Typographie en bas de l'image
- Transitions fluides

### 4. `CategoryMenu.tsx` (Amélioré)
- Espacement généreux
- Titre centré avec ligne décorative
- Animations progressives pour chaque catégorie

## Utilisation

### Page d'Accueil

Le nouveau design est déjà intégré dans `app/page.tsx` :

```tsx
import HeroZuma from "@/components/HeroZuma";
import { CategoryMenu } from "@/components";

export default function Home() {
  return (
    <>
      <HeroZuma />
      <IntroducingSection />
      <CategoryMenu />
      <ProductsSection />
    </>
  );
}
```

### Layout

Le nouveau header est intégré dans `app/layout.tsx` :

```tsx
import HeaderZuma from "@/components/HeaderZuma";

// Dans le return :
<HeaderZuma />
```

## Personnalisation

### Couleurs

Les couleurs utilisent votre système de design existant :
- `brand-text-primary` : Texte principal
- `brand-primary` : Couleur d'accent
- `white` : Pour le header transparent

### Typographie

- **Serif** (Cormorant Garamond) : Pour les titres et navigation
- **Sans-serif** (Inter) : Pour le corps de texte

### Animations

Les animations sont définies dans `app/globals.css` :
- `animate-fade-in` : Fade-in simple
- `animate-slide-up` : Slide-up avec fade
- `animate-fade-in-up` : Fade-in avec slide-up

## Différences avec l'Ancien Design

| Ancien | Nouveau (Zuma) |
|--------|----------------|
| Header opaque fixe | Header transparent qui devient opaque au scroll |
| Hero avec hauteur fixe | Hero en plein écran (100vh) |
| Catégories avec overlay fort | Catégories avec overlay subtil et gradient |
| Animations rapides | Animations lentes et fluides (500-700ms) |
| Espacement standard | Espacement généreux |

## Prochaines Étapes

Pour compléter le design Zuma, vous pouvez :

1. **Améliorer le Footer** : Style minimaliste avec espacement généreux
2. **Ajouter des sections** : Sections avec grandes images et texte minimal
3. **Animations au scroll** : Ajouter des animations au scroll (Intersection Observer)
4. **Page Produit** : Adapter les pages produit avec le même style
5. **Page Shop** : Refondre la page shop avec le style Zuma

## Notes Techniques

- Tous les composants utilisent Next.js Image pour l'optimisation
- Les animations utilisent CSS pur (pas de bibliothèque externe)
- Le header utilise `backdrop-blur` pour l'effet de flou
- Responsive design maintenu sur tous les composants

## Compatibilité

- ✅ Next.js 15.5.9
- ✅ React 18+
- ✅ Tailwind CSS
- ✅ TypeScript
- ✅ Tous les navigateurs modernes
