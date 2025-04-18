import { ModeSwitcher } from '@/components/mode-switcher';
import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          {/* <MainNav />
          <MobileNav /> */}
          <Image className="dark:invert" src="/logo.svg" alt="Logo" width={144} height={30} priority />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <nav className="flex items-center gap-0.5">
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
