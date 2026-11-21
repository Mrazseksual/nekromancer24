import React, {useEffect, useState} from 'react';
import {useOnlineStatus} from '../hooks/useOnlineStatus';

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

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
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

  if (isOnline) return null;

  return (
    <div className="fixed bottom-2.5 left-2.5 z-50 flex items-center gap-2 rounded-lg border border-amber-400/50 bg-[#15110a]/90 px-2.5 py-1 text-[11px] font-medium text-amber-200 shadow-lg backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      {lang === 'en' ? 'Offline mode' : 'Офлайн-режим'}
    </div>
  );
};
