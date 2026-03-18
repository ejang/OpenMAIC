import { defaultLocale } from './types';
export { type Locale, defaultLocale } from './types';
import { commonEnUS, commonKoKR } from './common';
import { stageEnUS, stageKoKR } from './stage';
import { chatEnUS, chatKoKR } from './chat';
import { generationEnUS, generationKoKR } from './generation';
import { settingsEnUS, settingsKoKR } from './settings';

export const translations = {
  'en-US': {
    ...commonEnUS,
    ...stageEnUS,
    ...chatEnUS,
    ...generationEnUS,
    ...settingsEnUS,
  },
  'ko-KR': {
    ...commonKoKR,
    ...stageKoKR,
    ...chatKoKR,
    ...generationKoKR,
    ...settingsKoKR,
  },
} as const;

export type TranslationKey = keyof (typeof translations)[typeof defaultLocale];
