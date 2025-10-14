# upintown - Digital Solutions

Modern website built with Astro, GSAP, and Lenis for smooth animations and excellent performance.

## Tech Stack

- **Framework**: Astro 5.x (SSR enabled)
- **Animations**: GSAP 3.x with ScrollTrigger & SplitText
- **Smooth Scrolling**: Lenis
- **Styling**: Custom CSS
- **TypeScript**: Fully typed
- **Code Quality**: ESLint + Prettier
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
/
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes (file-based routing)
│   │   ├── api/         # API endpoints
│   │   └── *.astro      # Pages
│   ├── scripts/         # JavaScript/TypeScript modules
│   └── styles/          # CSS files
├── .github/
│   └── workflows/       # CI/CD pipelines
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
└── .prettierrc.json     # Prettier configuration
```

## API Routes

### Contact Form

**POST** `/api/contact`

Sends contact form submissions.

```json
{
  "name": "Your Name",
  "email": "your@email.com",
  "message": "Your message"
}
```

To enable email sending, configure your email service (Resend or SendGrid) in `.env`:

```bash
cp .env.example .env
# Edit .env with your API keys
```

## Deployment

The site is configured for automatic deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Push to `main` branch to deploy

GitHub Actions will:
- Run linting and formatting checks
- Build the project
- Deploy to Vercel (on push to main)

## Environment Variables

See `.env.example` for required environment variables.

## License

All Rights Reserved © 2025 upintown
