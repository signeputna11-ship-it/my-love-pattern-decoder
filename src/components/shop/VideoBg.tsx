type Props = { src: string; overlay?: string };

/**
 * Fixed full-viewport video background with parchment overlay. Mount once per page.
 * Outer container must be position:relative; place page content with z-index:2.
 */
export function VideoBg({ src, overlay = "rgba(248,245,240,0.85)" }: Props) {
  return (
    <>
      <video
        autoPlay
        muted
        playsInline
        loop
        preload="none"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, background: overlay, zIndex: 1 }}
      />
    </>
  );
}
