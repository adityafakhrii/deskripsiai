"use client";

import { useState, useCallback, ChangeEvent, DragEvent, useRef } from 'react';
import NextImage from 'next/image';
import { generateProductDescriptionFromImage } from '@/ai/flows/generate-product-description-from-image';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UploadCloud, Copy, Trash2, Loader2, FileImage } from "lucide-react";
import { cn } from '@/lib/utils';

export function ProductDescriptionGenerator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "File tidak valid",
        description: "Harap unggah file gambar (PNG, JPG, dll.).",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    generateDescription(file);
  }, [toast]);

  const generateDescription = useCallback(async (file: File) => {
    setIsLoading(true);
    setDescription('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const result = await generateProductDescriptionFromImage({ productImage: base64data });
          setDescription(result.productDescription);
        } catch (error) {
           console.error(error);
          toast({
            variant: "destructive",
            title: "Gagal menghasilkan deskripsi",
            description: "Terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.",
          });
        } finally {
          setIsLoading(false);
        }
      };
    } catch (error) {
       console.error(error);
       toast({
        variant: "destructive",
        title: "Gagal membaca file",
        description: "Tidak dapat memproses file yang diunggah. Silakan coba lagi.",
      });
       setIsLoading(false);
    }
  }, [toast]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] || null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "Berhasil!",
      description: "Deskripsi produk telah disalin ke clipboard.",
    });
  };

  const handleClear = () => {
    setImagePreview(null);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden shadow-2xl shadow-primary/10">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 min-h-[550px]">
          <div 
            className={cn(
              "flex flex-col items-center justify-center border-b md:border-b-0 md:border-r transition-colors duration-300",
              isDragging ? "bg-primary/10" : "bg-muted/30",
              imagePreview ? "p-4" : "p-6"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            {!imagePreview ? (
              <div 
                className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-lg p-12 transition-colors hover:border-primary hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl font-semibold">Unggah Gambar Produk</h3>
                <p className="text-muted-foreground mt-1">
                  Seret & lepas atau klik untuk memilih file
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <NextImage
                  src={imagePreview}
                  alt="Pratinjau produk"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col bg-background">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold font-headline">Deskripsi Produk</h3>
              {(description || imagePreview) && (
                <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Hapus">
                  <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-lg font-semibold">Menghasilkan deskripsi...</p>
                  <p className="text-muted-foreground">AI sedang menganalisis gambar Anda.</p>
                </div>
              ) : description ? (
                <div className="flex-1 flex flex-col">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-1 text-base resize-none"
                    placeholder="Deskripsi produk..."
                    rows={12}
                  />
                  <Button onClick={handleCopy} className="mt-4 w-full" size="lg">
                    <Copy className="mr-2 h-5 w-5" />
                    Salin Deskripsi
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center bg-muted/50 rounded-lg p-8">
                   <FileImage className="w-12 h-12 text-muted-foreground mb-4"/>
                   <h4 className="font-semibold text-lg">Deskripsi Anda Muncul di Sini</h4>
                   <p className="text-muted-foreground mt-1 max-w-xs">
                    Unggah gambar untuk memulai pembuatan deskripsi produk otomatis oleh AI.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
