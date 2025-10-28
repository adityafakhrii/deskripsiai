import { Rocket } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            DeskripsiAI
          </h1>
        </div>
      </div>
    </header>
  );
}
