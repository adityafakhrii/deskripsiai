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
  prompt: `Anda adalah seorang pemasar ahli dengan pengalaman bertahun-tahun dalam membuat deskripsi produk yang menarik dan efektif. Buatlah deskripsi produk dalam bahasa Indonesia berdasarkan gambar produk yang diberikan.

Gaya bahasa harus disesuaikan dengan target pasar:
- **General**: Bahasa yang formal, informatif, dan menarik untuk audiens umum.
- **Anak Muda**: Bahasa yang santai, kekinian, dan menggunakan istilah yang relevan dengan tren anak muda.
- **Keluarga**: Bahasa yang hangat, ramah, dan menonjolkan manfaat produk untuk keluarga.

Gunakan instruksi tambahan dari pengguna jika ada.

**Target Pasar**: {{{targetMarket}}}
**Instruksi Tambahan**: {{{prompt}}}

Gambar Produk: {{media url=productImage}}

Deskripsi Produk:`, // Use Indonesian language.
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
