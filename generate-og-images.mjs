import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Dimensions standard pour les og-images
const WIDTH = 1200;
const HEIGHT = 630;

// Couleurs du site
const COLORS = {
  base100: '#f9f4eb',
  base300: '#0a0a0a',
  accentRed: '#c80815',
  secondary: '#686560',
};

// Fonction pour créer l'og-image principale
async function createMainOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLORS.base100;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Bordure subtile
  ctx.strokeStyle = COLORS.base300;
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

  // Ligne décorative en haut
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 80, 120, 3);
  ctx.fillRect(220, 80, 120, 3);

  // Logo/Titre principal
  ctx.fillStyle = COLORS.base300;
  ctx.font = 'bold 120px sans-serif';
  ctx.letterSpacing = '-2px';
  ctx.fillText('UPINTOWN', 80, 240);

  // Accent rouge sur "UP"
  ctx.fillStyle = COLORS.accentRed;
  ctx.fillText('UP', 80, 240);

  // Sous-titre
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '32px monospace';
  ctx.fillText('▸ DIGITAL SOLUTIONS', 80, 300);

  // Description
  ctx.fillStyle = COLORS.base300;
  ctx.font = '28px sans-serif';
  const description = 'Modern web development with precision';
  ctx.fillText(description, 80, 380);

  const description2 = 'and creativity';
  ctx.fillText(description2, 80, 420);

  // Tags en bas
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '22px monospace';
  ctx.fillText('[ ASTRO • REACT • TYPESCRIPT • GSAP ]', 80, 510);

  // Ligne décorative en bas
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 550, 80, 3);

  // URL
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '24px sans-serif';
  ctx.fillText('upintown.dev', 80, 585);

  return canvas;
}

// Fonction pour créer l'og-image de la page About
async function createAboutOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLORS.base100;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Bordure
  ctx.strokeStyle = COLORS.base300;
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

  // Ligne décorative
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 80, 100, 3);

  // Titre
  ctx.fillStyle = COLORS.base300;
  ctx.font = 'bold 100px sans-serif';
  ctx.fillText('ABOUT', 80, 200);

  // "UP" en rouge
  ctx.fillStyle = COLORS.accentRed;
  ctx.font = 'bold 100px sans-serif';
  ctx.fillText('UPINTOWN', 80, 310);

  // Description
  ctx.fillStyle = COLORS.base300;
  ctx.font = '28px sans-serif';
  ctx.fillText('Expert digital solutions', 80, 390);
  ctx.fillText('& web development', 80, 430);

  // Label
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '22px monospace';
  ctx.fillText('▸ EXPERTISE & INNOVATION', 80, 510);

  // Ligne décorative
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 550, 80, 3);

  // URL
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '24px sans-serif';
  ctx.fillText('upintown.dev/about', 80, 585);

  return canvas;
}

// Fonction pour créer l'og-image de la page Contact
async function createContactOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLORS.base100;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Bordure
  ctx.strokeStyle = COLORS.base300;
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

  // Ligne décorative
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 80, 100, 3);

  // Titre
  ctx.fillStyle = COLORS.base300;
  ctx.font = 'bold 90px sans-serif';
  ctx.fillText("LET'S BUILD", 80, 200);

  // Mot en rouge
  ctx.fillStyle = COLORS.accentRed;
  ctx.font = 'bold 90px sans-serif';
  ctx.fillText('SOMETHING', 80, 300);

  // Suite du titre
  ctx.fillStyle = COLORS.base300;
  ctx.font = 'bold 90px sans-serif';
  ctx.fillText('GREAT', 80, 400);

  // Label
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '22px monospace';
  ctx.fillText('▸ CONTACT@UPINTOWN.DEV', 80, 490);

  // Ligne décorative
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 530, 80, 3);

  // URL
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '24px sans-serif';
  ctx.fillText('upintown.dev/contact', 80, 575);

  return canvas;
}

// Fonction pour créer l'og-image du projet
async function createProjectOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLORS.base100;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Bordure
  ctx.strokeStyle = COLORS.base300;
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

  // Lignes décoratives
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 80, 60, 3);
  ctx.fillRect(160, 80, 60, 3);
  ctx.fillRect(240, 80, 60, 3);

  // Label
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '22px monospace';
  ctx.fillText('▸ PORTFOLIO / CASE STUDY', 80, 140);

  // Titre
  ctx.fillStyle = COLORS.base300;
  ctx.font = 'bold 85px sans-serif';
  ctx.fillText('TERRENE', 80, 240);

  // Sous-titre avec accent
  ctx.fillStyle = COLORS.accentRed;
  ctx.font = 'bold 85px sans-serif';
  ctx.fillText('INTERIOR', 80, 330);

  ctx.fillStyle = COLORS.base300;
  ctx.fillText('STUDIO', 80, 420);

  // Stack
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '22px monospace';
  ctx.fillText('[ NEXT.JS • TAILWIND • GSAP • SUPABASE ]', 80, 500);

  // Ligne décorative
  ctx.fillStyle = COLORS.base300;
  ctx.fillRect(80, 540, 80, 3);

  // URL
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '24px sans-serif';
  ctx.fillText('upintown.dev/project', 80, 585);

  return canvas;
}

// Génération des images
async function generateAllImages() {
  console.log('🎨 Génération des og-images...\n');

  try {
    // Image principale (homepage, fallback)
    console.log("📄 Création de og-image.jpg (page d'accueil)...");
    const mainCanvas = await createMainOGImage();
    const mainBuffer = mainCanvas.toBuffer('image/jpeg', 90);
    writeFileSync(join(process.cwd(), 'public', 'og-image.jpg'), mainBuffer);
    console.log('✅ og-image.jpg créé\n');

    // Image About
    console.log('📄 Création de og-about.jpg...');
    const aboutCanvas = await createAboutOGImage();
    const aboutBuffer = aboutCanvas.toBuffer('image/jpeg', 90);
    writeFileSync(join(process.cwd(), 'public', 'og-about.jpg'), aboutBuffer);
    console.log('✅ og-about.jpg créé\n');

    // Image Contact
    console.log('📄 Création de og-contact.jpg...');
    const contactCanvas = await createContactOGImage();
    const contactBuffer = contactCanvas.toBuffer('image/jpeg', 90);
    writeFileSync(join(process.cwd(), 'public', 'og-contact.jpg'), contactBuffer);
    console.log('✅ og-contact.jpg créé\n');

    // Image Project
    console.log('📄 Création de og-project.jpg...');
    const projectCanvas = await createProjectOGImage();
    const projectBuffer = projectCanvas.toBuffer('image/jpeg', 90);
    writeFileSync(join(process.cwd(), 'public', 'project-images', 'og-project.jpg'), projectBuffer);
    console.log('✅ og-project.jpg créé\n');

    console.log('🎉 Toutes les og-images ont été générées avec succès!');
    console.log("\n📝 N'oubliez pas de mettre à jour les références dans vos fichiers .astro:");
    console.log('   - about.astro: image="/og-about.jpg"');
    console.log('   - contact.astro: image="/og-contact.jpg"');
    console.log('   - project.astro: image="/project-images/og-project.jpg"');
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    process.exit(1);
  }
}

// Exécution
generateAllImages();
