import crystal from "@/assets/bg-crystal.png";
import floatingHeart from "@/assets/bg-floating-heart.png";
import leftCrystalFlowers from "@/assets/bg-left-crystal-flowers.png";
import floating from "@/assets/bg-floating.png";
import crystalBall from "@/assets/bg-crystal-ball.png";
import rightFlowers from "@/assets/bg-right-flowers.png";

export const pageBackgrounds = {
  crystal,
  "floating-heart": floatingHeart,
  "left-crystal-flowers": leftCrystalFlowers,
  floating,
  "crystal-ball": crystalBall,
  "right-flowers": rightFlowers,
} as const;

export type PageBackgroundKey = keyof typeof pageBackgrounds;

/**
 * Fixed full-viewport background image with a dark gradient overlay so foreground
 * content stays legible on the black UI. Mount once per route (never twice on the
 * same page — each public page is assigned a unique image).
 */
export function PageBackground({ image }: { image: PageBackgroundKey }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src={pageBackgrounds[image]}
        alt=""
        className="h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
    </div>
  );
}
