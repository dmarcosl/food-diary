import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import es from './es';
import en from './en';

const messages: { [key: string]: any } = {
  es,
  en,
};

// Detectar el idioma del navegador
const locale = navigator.language.split(/[-_]/)[0];

export function IntlProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactIntlProvider
      messages={messages[locale] || messages.en}
      locale={locale}
      defaultLocale="en"
    >
      {children}
    </ReactIntlProvider>
  );
} 