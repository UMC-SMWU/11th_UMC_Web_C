import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function MovieImage({ src, alt, className }: MovieImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[#E5E7EB] text-[12px] text-[#969DA8]",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  return <img src={src} alt={alt} className={cn("object-cover", className)} />;
}
