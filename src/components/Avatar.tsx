import Image from "next/image";

/** Round avatar image, falling back to the name's initials when there is no picture. */
export function Avatar({
  src,
  name,
  size = 64,
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  if (src) {
    // Local previews (object/data URLs) can't go through the next/image optimizer.
    const isLocalPreview = src.startsWith("blob:") || src.startsWith("data:");
    if (isLocalPreview) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className={`rounded-full object-cover ${className}`}
          style={{ width: size, height: size }}
        />
      );
    }

    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`flex items-center justify-center rounded-full bg-black/10 font-semibold dark:bg-white/10 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size / 2.6) }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
