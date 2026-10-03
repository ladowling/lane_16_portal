import { useEffect, useRef, useState } from 'react';

// iPhones save photos as HEIC/HEIF, which only Safari can display. These helpers convert them to JPEG:
// before upload, so new photos work everywhere, and on display, for photos already stored as HEIC.

const HEIC_EXTENSION = /\.(heic|heif)$/i;
const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'];

// Chrome on Windows often reports an empty type for .heic files, so check the extension too
export const isHeicFile = (file: File) => /^image\/hei[cf]$/i.test(file.type) || HEIC_EXTENSION.test(file.name);

// Reads the file header ("ftyp" box) rather than trusting the name or the stored content type
const hasHeicSignature = async (blob: Blob) => {
  const header = new TextDecoder().decode(await blob.slice(4, 12).arrayBuffer());
  return header.startsWith('ftyp') && HEIC_BRANDS.includes(header.slice(4));
};

const convertToJpeg = async (blob: Blob) => {
  // Loaded on demand: the decoder is large and most photos aren't HEIC
  const { heicTo } = await import('heic-to');
  return heicTo({ blob, type: 'image/jpeg', quality: 0.9 });
};

/** Returns HEIC/HEIF photos converted to JPEG; any other file is returned unchanged. */
export async function toWebFriendlyImage(file: File): Promise<File> {
  if (!(await hasHeicSignature(file))) return file;
  const jpeg = await convertToJpeg(file);
  return new File([jpeg], `${file.name.replace(HEIC_EXTENSION, '')}.jpg`, { type: 'image/jpeg' });
}

// One conversion per photo per page load, shared by every component showing it
const convertedSrcs = new Map<string, Promise<string | null>>();

const convertRemoteHeic = async (src: string) => {
  try {
    const response = await fetch(src);
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!(await hasHeicSignature(blob))) return null;
    return URL.createObjectURL(await convertToJpeg(blob));
  } catch {
    return null;
  }
};

/**
 * Image src + onError for an <img> or antd <Image>. If the browser can't render the photo and it turns
 * out to be HEIC, it is swapped for a converted JPEG. Photos that render normally are never touched.
 */
export function useWebFriendlyImageSrc(src: string) {
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const currentSrc = useRef(src);

  useEffect(() => {
    currentSrc.current = src;
    setConvertedSrc(null);
  }, [src]);

  const onError = () => {
    if (convertedSrc || !src || src.startsWith('data:')) return;

    let conversion = convertedSrcs.get(src);
    if (!conversion) {
      conversion = convertRemoteHeic(src);
      convertedSrcs.set(src, conversion);
    }
    void conversion.then((url) => {
      if (url && currentSrc.current === src) setConvertedSrc(url);
    });
  };

  return { src: convertedSrc ?? src, onError };
}
