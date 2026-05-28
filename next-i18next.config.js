// next-i18next.config.js

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'de', 'fr', 'es', 'it'],
    localeDetection: false,
  },
  localePath: './public/locales',
};