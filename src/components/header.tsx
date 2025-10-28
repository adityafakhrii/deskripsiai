import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-background border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <Image
            src="https://i.ibb.co/6JVbFXYn/nru36-W7k-400x400.jpg"
            alt="DeskripsiAI Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            DeskripsiAI
          </h1>
        </div>
      </div>
    </header>
  );
}
