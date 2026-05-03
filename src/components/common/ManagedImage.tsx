"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ManagedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  "data-ai-hint"?: string;
}

export function ManagedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  "data-ai-hint": dataAiHint,
}: ManagedImageProps) {
  const isUploadedImage = src.startsWith("data:") || src.startsWith("blob:");

  if (isUploadedImage) {
    return (
      // Uploaded admin images are browser data URLs, so Next's remote image optimizer is not involved.
      <img
        src={src}
        alt={alt}
        data-ai-hint={dataAiHint}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      className={className}
      data-ai-hint={dataAiHint}
    />
  );
}
