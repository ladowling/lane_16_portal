import type { ImgHTMLAttributes } from 'react';
import { Image } from 'antd';
import type { ImageProps } from 'antd';
import { useWebFriendlyImageSrc } from '../heic';

type WebFriendlyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> & { src: string };

/** <img> that can also display HEIC photos in browsers without HEIC support */
export function WebFriendlyImage({ src, ...props }: WebFriendlyImageProps) {
  const image = useWebFriendlyImageSrc(src);
  return <img {...props} src={image.src} onError={image.onError} />;
}

/** antd <Image> (with preview) that can also display HEIC photos */
export function WebFriendlyAntImage({ src, ...props }: Omit<ImageProps, 'src' | 'onError'> & { src: string }) {
  const image = useWebFriendlyImageSrc(src);
  return <Image {...props} src={image.src} onError={image.onError} />;
}
