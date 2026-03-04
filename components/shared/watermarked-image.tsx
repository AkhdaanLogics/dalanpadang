import Image from "next/image";

type WatermarkedImageProps = {
  src: string;
  alt: string;
  productCode: string;
  sold?: boolean;
  mode?: "card" | "detail";
};

export function WatermarkedImage({
  src,
  alt,
  productCode,
  sold,
  mode = "card",
}: WatermarkedImageProps) {
  const watermark = process.env.WATERMARK_TEXT ?? "Koleksi Keris Antik";
  const isDetailMode = mode === "detail";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-amber-900/10 bg-stone-200 ${
        isDetailMode ? "min-h-[20rem] sm:min-h-[26rem] md:min-h-[34rem]" : ""
      }`}
    >
      <Image
        src={src}
        alt={alt}
        width={900}
        height={700}
        className={`w-full transition duration-500 ${
          isDetailMode
            ? "h-full object-contain bg-stone-100"
            : "h-56 object-cover sm:h-64"
        }`}
      />
      <div
        className={`absolute inset-0 ${isDetailMode ? "bg-black/10" : "bg-black/20"}`}
      />
      <div className="absolute right-3 top-3 rounded-md border border-stone-200/20 bg-stone-900/75 px-2.5 py-1 text-xs font-semibold tracking-wide text-stone-100 backdrop-blur-sm">
        {productCode}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rotate-[-18deg] text-xl font-semibold tracking-wide text-stone-100/40 md:text-2xl">
          {watermark}
        </span>
      </div>
      {sold ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[1px]">
          <span className="rounded-md border border-red-200/40 bg-red-800/65 px-4 py-2 text-2xl font-bold tracking-[0.25em] text-red-100 shadow-lg">
            TERJUAL
          </span>
        </div>
      ) : null}
    </div>
  );
}
