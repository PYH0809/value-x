const LOCAL_URL = 'http://localhost:3000';

const url =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
  (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`) ||
  LOCAL_URL;

export const apiBaseUrl = `${url}/api`;

export const siteConfig = {
  name: 'value-x',
  url,
  // ogImage: 'https://ui.shadcn.com/og.jpg',
  description:
    'value-x is a data analysis-based value investment tool that helps users better understand the fundamentals of publicly listed companies.',
  links: {
    github: 'https://github.com/PYH0809/value-x',
  },
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};
