// Decorative page backgrounds were removed: the brand backdrop now comes from the page itself (see styles.css).
export const pageBackgrounds = {} as const;
export type PageBackgroundKey = string;

export function PageBackground(_props: { image?: PageBackgroundKey }) {
  return null;
}
