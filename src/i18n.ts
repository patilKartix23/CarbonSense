import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';

// Define resources
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  ta: { translation: ta },
  te: { translation: te }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false // React already safes from XSS
    },

    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      
      // Cache user language on
      caches: ['localStorage'],
      
      // Exclude certain languages from being detected
      excludeCacheFor: ['cimode']
    }
  });

export default i18n;
