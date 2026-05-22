interface AdSenseBlockProps {
  slot: string;
  className?: string;
}

export function AdSenseBlock({ slot, className = "" }: AdSenseBlockProps) {
  return (
    <div
      className={[
        "adsense-block my-8 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 min-h-[100px] text-gray-400 text-sm",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      [Anúncio — slot: {slot}]
    </div>
  );
}
