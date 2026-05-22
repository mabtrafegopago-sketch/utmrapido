"use client";

import { useEffect, useRef } from "react";

interface AdSenseBlockProps {
  slot: string;
  className?: string;
  format?: string;
  responsive?: boolean;
}

export function AdSenseBlock({
  slot,
  className = "",
  format = "auto",
  responsive = true,
}: AdSenseBlockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div className={["adsense-block my-8", className].join(" ")}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1641389166871934"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
