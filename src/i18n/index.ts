import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationTR from './locales/tr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      tr: {
        translation: translationTR
      }
    },
    lng: localStorage.getItem('language') || 'tr', // Default to Turkish
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;