/**
 * @file i18n.config.ts
 * @description This file is used to configure the i18next library for internationalization in the application.
 * @author Kollawat Ruanghirun <eark050346@gmail.com>
 * @date 2024-07-3
 * @version 1.0
 */

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

// Function to get saved language from localStorage if available
const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    // Check if localStorage is available (browser environment)
    return localStorage.getItem("i18nextLng") || "th";
  }
  return "th";  // Default language if not in a browser environment
};

i18next
  .use(initReactI18next)
  .init({
    debug: false,
    lng: getSavedLanguage(),  // Use saved language or default to "th"
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

if (typeof window !== 'undefined') {
  // Save language preference in localStorage only in browser environment
  i18next.on('languageChanged', (lng) => {
    localStorage.setItem("i18nextLng", lng);
  });
}

export default i18next;