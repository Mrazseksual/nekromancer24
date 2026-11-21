/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import {PWAInstallButton} from './components/PWAInstallButton';
import {OfflineIndicator} from './components/OfflineIndicator';

export default function App() {
  return (
    <main className="relative w-screen h-dvh overflow-hidden bg-[#05060b]">
      <iframe
        src="/necromancer.html"
        title="Necromancer: The Undying Deck"
        className="w-full h-full border-0 block"
        allow="autoplay; fullscreen"
      />
      <PWAInstallButton />
      <OfflineIndicator />
    </main>
  );
}
