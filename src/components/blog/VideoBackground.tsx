export function VideoBackground({
  src,
  overlayOpacity = 0.84,
}: {
  src?: string;
  overlayOpacity?: number;
}) {
  const url =
    src ||
    "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20TOP%20VIEW.mp4";
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: "#F8F5F0" }}
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        preload="none"
      >
        <source src={url} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(248,245,240,${overlayOpacity})` }}
      />
    </div>
  );
}
