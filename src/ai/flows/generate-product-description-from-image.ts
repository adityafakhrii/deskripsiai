'use server';

/**
 * @fileOverview Generates a product description in Indonesian from an image.
 *
 * - generateProductDescriptionFromImage - A function that handles the product description generation process.
 * - GenerateProductDescriptionFromImageInput - The input type for the generateProductDescriptionFromImage function.
 * - GenerateProductDescriptionFromImageOutput - The return type for the generateProductDescriptionFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionFromImageInputSchema = z.object({
  productImage: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().optional().describe('A custom prompt to guide the description generation.'),
  targetMarket: z.enum(['General', 'Anak Muda', 'Keluarga']).default('General').describe('The target market for the product description.'),
  descriptionLength: z.number().min(1).max(100).default(50).describe('The desired length of the description, from 1 (short) to 100 (long).'),
});
export type GenerateProductDescriptionFromImageInput = z.infer<typeof GenerateProductDescriptionFromImageInputSchema>;

const GenerateProductDescriptionFromImageOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description in Indonesian.'),
});
export type GenerateProductDescriptionFromImageOutput = z.infer<typeof GenerateProductDescriptionFromImageOutputSchema>;

export async function generateProductDescriptionFromImage(input: GenerateProductDescriptionFromImageInput): Promise<GenerateProductDescriptionFromImageOutput> {
  return generateProductDescriptionFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionFromImagePrompt',
  input: {schema: GenerateProductDescriptionFromImageInputSchema},
  output: {schema: GenerateProductDescriptionFromImageOutputSchema},
  prompt: `Anda adalah seorang copywriter ahli dengan pengalaman bertahun-tahun dalam membuat deskripsi produk yang menarik, efektif, dan sangat mudah dibaca.

**Tugas Anda:**
Buatlah deskripsi produk yang sangat rapi dan terstruktur dalam bahasa Indonesia berdasarkan gambar dan informasi yang diberikan.

**Aturan Format (SANGAT PENTING):**
- **Gunakan Paragraf Pendek:** Buat 2-3 kalimat per paragraf untuk memastikan tulisan tidak menumpuk.
- **Beri Jarak Antar Paragraf:** Selalu gunakan satu baris kosong (enter) di antara paragraf untuk memberikan ruang bernapas pada tulisan.
- **JANGAN GUNAKAN** poin-poin (bullet points) dengan tanda bintang (*) atau strip (-). Tulis semua dalam bentuk paragraf deskriptif yang mengalir.
- Pastikan penggunaan tanda baca (koma, titik) yang benar dan profesional.
- Hasil akhir harus bersih, profesional, dan sangat enak dibaca.

**Panjang Deskripsi:**
- Hasilkan deskripsi dengan panjang yang sesuai dengan nilai 'descriptionLength'.
- '1' berarti sangat singkat (cukup satu paragraf pendek).
- '100' berarti sangat panjang dan detail (beberapa paragraf).
- Anda harus menyesuaikan tingkat kedetailan berdasarkan nilai ini.

**Gaya Bahasa (Sesuaikan dengan Target Pasar):**
- **General**: Bahasa yang formal, informatif, dan menarik untuk audiens umum.
- **Anak Muda**: Bahasa yang santai, kekinian, dan menggunakan istilah yang relevan dengan tren anak muda.
- **Keluarga**: Bahasa yang hangat, ramah, dan menonjolkan manfaat produk untuk keluarga.

**Informasi Produk:**
- **Panjang Deskripsi yang Diinginkan**: {{{descriptionLength}}}/100
- **Target Pasar**: {{{targetMarket}}}
- **Instruksi Tambahan dari Pengguna**: {{{prompt}}}
- **Gambar Produk**: {{media url=productImage}}

Buat deskripsi produk sekarang. Ikuti semua aturan dengan ketat.`,
});

const generateProductDescriptionFromImageFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFromImageFlow',
    inputSchema: GenerateProductDescriptionFromImageInputSchema,
    outputSchema: GenerateProductDescriptionFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
