import React, {useEffect, useState} from 'react';
import {Download, X} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';

type AppLang = 'ru' | 'uk' | 'en';

const normalizeLang = (value: unknown): AppLang => {
  if (value === 'ru' || value === 'en' || value === 'uk') return value;
  return 'uk';
};

const readLang = (): AppLang => {
  try {
    return normalizeLang(localStorage.getItem('necro_lang'));
  } catch {
    return 'uk';
  }
};

const COPY = {
  ru: {
    installAndroid: 'Установить на телефон',
    hideInstallHint: 'Скрыть подсказку установки',
    addToHome: 'Добавить на экран',
    hideHint: 'Скрыть подсказку',
    iosTitle: 'Установка на iPhone / iPad',
    iosStep1Prefix: '1. Нажмите кнопку ',
    iosStep1Strong: 'Поделиться',
    iosStep1Suffix: ' в панели Safari.',
    iosStep2Prefix: '2. Выберите ',
    iosStep2Strong: 'На экран «Домой»',
    iosStep2Suffix: '.',
    close: 'Закрыть',
  },
  uk: {
    installAndroid: 'Встановити на телефон',
    hideInstallHint: 'Сховати підказку встановлення',
    addToHome: 'Додати на екран',
    hideHint: 'Сховати підказку',
    iosTitle: 'Встановлення на iPhone / iPad',
    iosStep1Prefix: '1. Натисніть кнопку ',
    iosStep1Strong: 'Поділитися',
    iosStep1Suffix: ' на панелі Safari.',
    iosStep2Prefix: '2. Оберіть ',
    iosStep2Strong: 'На початковий екран',
    iosStep2Suffix: '.',
    close: 'Закрити',
  },
  en: {
    installAndroid: 'Install App',
    hideInstallHint: 'Hide install prompt',
    addToHome: 'Add to Home Screen',
    hideHint: 'Hide hint',
    iosTitle: 'Install on iPhone / iPad',
    iosStep1Prefix: '1. Tap the ',
    iosStep1Strong: 'Share',
    iosStep1Suffix: ' button in Safari.',
    iosStep2Prefix: '2. Select ',
    iosStep2Strong: 'Add to Home Screen',
    iosStep2Suffix: '.',
    close: 'Close',
  },
} as const;

export const PWAInstallButton: React.FC = () => {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [lang, setLang] = useState<AppLang>(readLang);

  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.data && ev.data.type === 'necro-lang-change') {
        setLang(normalizeLang(ev.data.lang));
      }
    };
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'necro_lang') {
        setLang(normalizeLang(ev.newValue));
      }
    };
    window.addEventListener('message', onMessage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  const t = COPY[lang];

  if (isInstallable) {
    return (
      <div className="fixed bottom-2.5 left-2.5 z-50 flex items-center gap-1 rounded-lg border border-[#c9a96e]/60 bg-[#0d1018]/90 px-2.5 py-1 text-xs text-[#f4efe6] shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={install}
          className="flex items-center gap-1.5 font-semibold text-[#f4d68c] hover:text-white cursor-pointer px-1 py-0.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.installAndroid}</span>
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t.hideInstallHint}
          className="p-0.5 text-[#94a3b8] hover:text-white cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (isIOS) {
    return (
      <>
        <div className="fixed bottom-2.5 left-2.5 z-50 flex items-center gap-1 rounded-lg border border-[#c9a96e]/60 bg-[#0d1018]/90 px-2.5 py-1 text-xs text-[#f4efe6] shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 font-semibold text-[#f4d68c] hover:text-white cursor-pointer px-1 py-0.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.addToHome}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t.hideHint}
            className="p-0.5 text-[#94a3b8] hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full max-w-sm rounded-xl border border-[#c9a96e]/70 bg-[#121520] p-5 text-[#f4efe6] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-[#f4d68c]">{t.iosTitle}</h3>
              <p className="mt-2 text-sm text-[#cbd5e1] leading-relaxed">
                {t.iosStep1Prefix}<strong>{t.iosStep1Strong}</strong>{t.iosStep1Suffix}<br />
                {t.iosStep2Prefix}<strong>{t.iosStep2Strong}</strong>{t.iosStep2Suffix}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg border border-[#c9a96e]/50 bg-[#1c2132] py-2 text-sm font-semibold text-[#f4efe6] hover:bg-[#262d44] cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
