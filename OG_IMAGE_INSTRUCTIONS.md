# Open Graph Image Creation Guide

This guide provides instructions for creating optimized Open Graph (OG) images for social media sharing.

## 📐 Dimensions & Specifications

### Recommended Dimensions
- **Width:** 1200px
- **Height:** 630px
- **Aspect Ratio:** 1.91:1
- **Format:** JPG or PNG
- **Max File Size:** < 8MB (aim for < 300KB for optimal loading)

### Safe Zones
- **Text Safe Zone:** Keep important text/logos within a 1000x530px centered area
- **Edge Buffer:** Maintain 100px padding from edges on all sides
- **Vertical Center:** Most platforms display the center, some may crop top/bottom

## 🎨 Design Best Practices

### Visual Elements
1. **Branding**
   - Include your logo (typically top-left or center)
   - Use consistent brand colors
   - Maintain brand typography

2. **Typography**
   - Use large, readable fonts (minimum 60px for body text)
   - Limit to 2-3 font sizes
   - High contrast between text and background
   - Avoid thin or script fonts

3. **Content**
   - Keep title under 60 characters
   - Single clear message or call-to-action
   - Avoid cluttered layouts
   - Use high-quality, relevant imagery

4. **Color**
   - High contrast for readability
   - Avoid pure white backgrounds (#FFFFFF) - use off-white instead
   - Consider dark mode compatibility
   - Test in grayscale for accessibility

## 🛠️ Tools & Resources

### Design Tools
- **Figma** (Recommended) - Free, collaborative, web-based
- **Canva** - Templates available, easy to use
- **Adobe Photoshop** - Professional option
- **Sketch** - Mac-only design tool

### Online Generators
- [og-image.vercel.app](https://og-image.vercel.app/) - Automatic OG image generation
- [Cloudinary](https://cloudinary.com/) - Dynamic image generation
- [Bannerbear](https://www.bannerbear.com/) - Automated social media images

### Testing Tools
- [OpenGraph.xyz](https://www.opengraph.xyz/) - Preview how your image appears
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 📱 Platform-Specific Requirements

### Facebook/Meta
- **Minimum:** 200 x 200px
- **Recommended:** 1200 x 630px
- **Max File Size:** 8MB
- **Formats:** JPG, PNG
- Note: Facebook caches aggressively - use debugger to refresh

### Twitter/X
- **Summary Card:** 1:1 (minimum 144 x 144px)
- **Large Card:** 2:1 (minimum 300 x 157px, recommended 1200 x 600px)
- **Max File Size:** 5MB
- **Formats:** JPG, PNG, WebP, GIF

### LinkedIn
- **Recommended:** 1200 x 627px
- **Minimum:** 1200 x 628px
- **Formats:** JPG, PNG, GIF

### Discord
- **Recommended:** 1200 x 630px
- **Formats:** JPG, PNG, GIF
- Note: Discord respects OG image meta tags

## 🎯 Implementation in Upintown

### File Structure
```
public/
  └── og-images/
      ├── home-og.jpg
      ├── about-og.jpg
      ├── project-og.jpg
      └── contact-og.jpg
```

### Usage in Astro
```astro
---
import SEO from '@/components/SEO.astro';
---

<SEO
  title="Upintown - Creative Digital Studio"
  description="Transform your ideas into stunning digital experiences"
  image="/og-images/home-og.jpg"
/>
```

### Dynamic OG Images
For dynamic pages, consider:
1. **Server-side generation** using Vercel OG
2. **Template-based** images with text overlay
3. **Pre-generated** images for common scenarios

## ✅ Optimization Checklist

Before publishing your OG image:

- [ ] Dimensions are exactly 1200 x 630px
- [ ] File size is under 300KB
- [ ] Text is readable at small sizes
- [ ] Important content is within safe zone
- [ ] Brand elements are visible and clear
- [ ] Tested on multiple platforms
- [ ] Contrast ratio is sufficient
- [ ] No copyrighted material used
- [ ] Image loads quickly
- [ ] Descriptive alt text provided

## 🔄 Cache Busting

When updating OG images:

1. **Change filename** - Append version number (e.g., `og-v2.jpg`)
2. **Add query parameter** - `image="/og.jpg?v=2"`
3. **Clear platform caches** - Use respective debugger tools
4. **Update meta tags** - Ensure new path is in SEO component

## 📊 Analytics & Testing

### Test Your Images
```bash
# Using curl to check meta tags
curl -s https://upintown.dev | grep og:image

# Validate with OpenGraph
curl -s https://upintown.dev | grep -E 'og:|twitter:'
```

### Monitor Performance
- Track CTR (Click-Through Rate) on social posts
- A/B test different designs
- Monitor engagement metrics
- Check loading times

## 🎨 Design Template

### Figma Template Structure
```
┌─────────────────────────────────────────┐
│  Logo                                   │
│                                         │
│         Main Headline Text              │
│         (60-80px font)                  │
│                                         │
│         Supporting Text                 │
│         (30-40px font)                  │
│                                         │
│  Visual Element    │    Call to Action  │
│                    │                    │
└─────────────────────────────────────────┘
    1200px × 630px
```

## 🚀 Advanced Techniques

### 1. Dynamic Generation with Vercel OG

```typescript
// src/pages/api/og.tsx
import { ImageResponse } from '@vercel/og';

export const GET = () => {
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        color: '#fff',
      }}>
        <h1>Upintown</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  );
};
```

### 2. Automated Generation with Playwright

```javascript
// scripts/generate-og.js
const { chromium } = require('playwright');

async function generateOGImage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto('http://localhost:3000/og-template');
  await page.screenshot({ path: 'og-image.png' });
  
  await browser.close();
}
```

## 📚 Resources

### Articles & Guides
- [Essential Image Optimization](https://images.guide/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### Inspiration
- [og-image Examples](https://github.com/vercel/og-image)
- [Social Share Preview Gallery](https://www.opengraph.xyz/gallery)

---

**Last Updated:** October 2025
**Maintainer:** Upintown Team

