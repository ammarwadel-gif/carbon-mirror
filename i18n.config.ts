// i18n.config.ts

export const i18nConfig = {
  locales: ['en', 'ar', 'de', 'fr', 'es', 'it'],
  defaultLocale: 'en',
  localeDetection: false,
  prefixDefault: false,
};

export type Locale = (typeof i18nConfig.locales)[number];