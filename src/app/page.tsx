import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductDescriptionGenerator } from '@/components/product-description-generator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            Deskripsi Produk Seketika
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Unggah gambar produk Anda dan biarkan AI canggih kami membuat deskripsi yang menarik dan menjual untuk Anda.
          </p>
        </div>
        <ProductDescriptionGenerator />
      </main>
      <Footer />
    </div>
  );
}
