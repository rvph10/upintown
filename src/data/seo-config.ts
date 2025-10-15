/**
 * SEO Configuration for upintown.dev
 * Centralized SEO settings for better maintainability
 */

export const SITE_URL = 'https://upintown.dev';
export const SITE_NAME = 'upintown';
export const SITE_TITLE = 'upintown | Digital Solutions - Modern Web Development';
export const SITE_DESCRIPTION =
  'upintown creates cutting-edge digital solutions with precision and creativity. Expert in AI automation, infrastructure, Astro, React, TypeScript, GSAP animations, and modern web development.';

// Keywords for SEO
export const SITE_KEYWORDS = [
  'AI automation',
  'AI infrastructure',
  'artificial intelligence solutions',
  'automation services',
  'intelligent automation',
  'AI integration',
  'machine learning infrastructure',
  'web development',
  'digital solutions',
  'modern web development',
  'Astro.js development',
  'React development',
  'TypeScript',
  'GSAP animations',
  'frontend development',
  'UI/UX design',
  'responsive web design',
  'performance optimization',
  'web applications',
  'custom website development',
  'professional web development',
  'creative digital solutions',
  'modern web design',
  'interactive websites',
  'motion design',
  'web animation',
  'JAMstack development',
  'DevOps automation',
  'cloud infrastructure',
];

// Social media profiles
export const SOCIAL_PROFILES = {
  github: 'https://github.com/rvph10',
  twitter: '@upintown',
  email: 'contact@upintown.dev',
};

// Organization info for Schema.org
export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/global/logo.svg`,
  description: SITE_DESCRIPTION,
  foundingDate: '2024',
  email: SOCIAL_PROFILES.email,
  areaServed: 'Worldwide',
  priceRange: '$$',
};

// Services offered (for Schema.org)
export const SERVICES = [
  {
    name: 'Strategy',
    description:
      'Strategic planning and consulting for digital projects. We analyze your needs and create a roadmap for success.',
    serviceType: 'Digital Strategy',
  },
  {
    name: 'Design',
    description:
      'Modern UI/UX design with focus on user experience and visual excellence. Creating intuitive and beautiful interfaces.',
    serviceType: 'UI/UX Design',
  },
  {
    name: 'Development',
    description:
      'Custom web development using cutting-edge technologies like Astro, React, and TypeScript. Building fast, scalable, and maintainable solutions.',
    serviceType: 'Web Development',
  },
  {
    name: 'AI & Automation',
    description:
      'Intelligent automation solutions and AI infrastructure. From workflow automation to AI integration, we build systems that scale and adapt to your needs.',
    serviceType: 'AI & Automation Services',
  },
];

// Page-specific SEO data
export const PAGE_SEO = {
  home: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    image: '/og-image.jpg',
  },
  about: {
    title: 'About upintown | Digital Solutions Expert',
    description:
      'Learn about upintown and our approach to creating exceptional digital experiences. Modern web development with precision and creativity.',
    keywords: [
      'about upintown',
      'web development team',
      'digital agency',
      'modern web solutions',
      ...SITE_KEYWORDS.slice(0, 10),
    ],
    image: '/og-about.jpg',
  },
  project: {
    title: 'Our Work | upintown Portfolio',
    description:
      'Explore our portfolio of modern web applications and digital solutions. Quality over quantity, showcasing our best work.',
    keywords: [
      'portfolio',
      'web development projects',
      'case studies',
      'digital solutions portfolio',
      ...SITE_KEYWORDS.slice(0, 10),
    ],
    image: '/project-images/og-project.jpg',
  },
  contact: {
    title: 'Contact upintown | Get In Touch',
    description:
      "Ready to start your next project? Get in touch with upintown for a consultation. Let's build something great together.",
    keywords: [
      'contact',
      'get in touch',
      'web development consultation',
      'project inquiry',
      ...SITE_KEYWORDS.slice(0, 10),
    ],
    image: '/og-contact.jpg',
  },
};
