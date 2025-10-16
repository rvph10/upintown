# OG Images Generator

Ce projet inclut un générateur automatique d'images Open Graph (og-images) pour toutes les pages du site.

## 📸 Images générées

Les images suivantes sont créées automatiquement :

- `public/og-image.jpg` - Page d'accueil (1200x630px)
- `public/og-about.jpg` - Page About (1200x630px)
- `public/og-contact.jpg` - Page Contact (1200x630px)
- `public/project-images/og-project.jpg` - Page Project (1200x630px)

## 🚀 Utilisation

### Générer les images

```bash
npm run generate:og
```

Cette commande exécute le script `generate-og-images.mjs` qui crée toutes les og-images en utilisant la palette de couleurs et le style typographique du site.

## 🎨 Design des og-images

Les images respectent le design system du site :

- **Couleurs** : Beige (#f9f4eb), Noir (#0a0a0a), Rouge accent (#c80815)
- **Typographie** : Style bold et moderne
- **Dimensions** : 1200x630px (standard og-image)
- **Format** : JPEG (qualité 90%)
- **Éléments** : Bordures, lignes décoratives, labels mono, titres avec accents rouges

## 🔧 Personnalisation

Pour modifier les og-images, éditez le fichier `generate-og-images.mjs` :

### Changer les couleurs

```javascript
const COLORS = {
  base100: '#f9f4eb', // Background
  base300: '#0a0a0a', // Texte principal
  accentRed: '#c80815', // Accent
  secondary: '#686560', // Texte secondaire
};
```

### Modifier le texte d'une image

Par exemple, pour la page d'accueil :

```javascript
async function createMainOGImage() {
  // ...
  ctx.fillText('UPINTOWN', 80, 240);
  ctx.fillText('▸ DIGITAL SOLUTIONS', 80, 300);
  // ...
}
```

### Ajouter une nouvelle og-image

1. Créez une nouvelle fonction dans `generate-og-images.mjs` :

```javascript
async function createNewPageOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Votre design ici...

  return canvas;
}
```

2. Ajoutez-la dans la fonction `generateAllImages()` :

```javascript
const newCanvas = await createNewPageOGImage();
const newBuffer = newCanvas.toBuffer('image/jpeg', 90);
writeFileSync(join(process.cwd(), 'public', 'og-newpage.jpg'), newBuffer);
```

3. Référencez-la dans `src/data/seo-config.ts` :

```typescript
export const PAGE_SEO = {
  newpage: {
    title: 'New Page Title',
    description: 'New page description',
    keywords: [...],
    image: '/og-newpage.jpg',
  },
};
```

## 📦 Dépendances

Le générateur utilise :

- `@napi-rs/canvas` - Pour créer et manipuler les images (Canvas API)

Installée automatiquement lors du `npm install`.

## 🔍 Vérification

Pour vérifier que les images sont correctement générées :

```bash
ls -lh public/*.jpg public/project-images/*.jpg
```

Vous devriez voir :

- `og-image.jpg` (~48KB)
- `og-about.jpg` (~49KB)
- `og-contact.jpg` (~47KB)
- `og-project.jpg` (~48KB)

## 🌐 Intégration

Les og-images sont automatiquement intégrées via le composant `SEO.astro` et le fichier de configuration `seo-config.ts`.

Chaque page utilise son image spécifique :

```astro
<BaseLayout
  title={PAGE_SEO.about.title}
  description={PAGE_SEO.about.description}
  image={PAGE_SEO.about.image}
  keywords={PAGE_SEO.about.keywords}
/>
```

## ✅ Validation

Pour tester vos og-images :

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Check](https://www.opengraphcheck.com/)

## 💡 Tips

- Les og-images sont mises en cache par les réseaux sociaux. Après modification, utilisez les outils de validation pour forcer le rafraîchissement
- Gardez le texte court et lisible (max 70 caractères pour les titres)
- Le format 1200x630px est optimal pour tous les réseaux sociaux
- Utilisez des contrastes élevés pour une meilleure lisibilité
- Testez vos images sur mobile et desktop

## 🔄 Workflow recommandé

1. Modifiez le design dans `generate-og-images.mjs`
2. Exécutez `npm run generate:og`
3. Vérifiez visuellement les images générées
4. Testez avec les outils de validation des réseaux sociaux
5. Committez les nouvelles images
