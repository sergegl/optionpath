import { clsx } from "../../ui/clsx";

type EditorialImageProps = {
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  src: string;
};

export function EditorialImage({
  alt,
  caption,
  className,
  imageClassName,
  src,
}: EditorialImageProps) {
  return (
    <figure
      className={clsx(
        "overflow-hidden rounded-lg border border-line bg-white/78 shadow-[0_18px_42px_rgba(18,21,18,0.07)]",
        className,
      )}
    >
      <img
        alt={alt}
        className={clsx("aspect-[16/10] w-full object-cover", imageClassName)}
        decoding="async"
        loading="lazy"
        src={src}
      />
      {caption ? (
        <figcaption className="border-t border-line bg-white/82 px-4 py-3 text-sm font-semibold leading-6 text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

