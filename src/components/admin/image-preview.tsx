'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type ImagePreviewProps = {
  file?: File | null;
  url?: string;
  alt: string;
  size?: number;
  onRemove?: () => void;
  label?: string;
};

export function ImagePreview({ file, url, alt, size = 64, onRemove, label }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string>(url || '');

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      setPreview(url);
    } else {
      setPreview('');
    }
  }, [file, url]);

  if (!preview) return null;

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="relative rounded-md overflow-hidden" style={{ width: size, height: size }}>
        <Image src={preview} alt={alt} fill className="object-cover" />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
