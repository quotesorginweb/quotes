import licensingMetadata from "../public/images/quote-collections/licensing-metadata.json";
import { publicQuotes } from "./data";

export const collectionImageFormats = [
  { slug: "square", label: "Square", width: 1080, height: 1080 },
  { slug: "portrait", label: "Portrait", width: 1080, height: 1350 },
  { slug: "landscape", label: "Landscape", width: 1200, height: 630 },
  { slug: "pinterest", label: "Pinterest", width: 1000, height: 1500 },
  { slug: "open-graph", label: "Open Graph", width: 1200, height: 630 },
] as const;

export function collectionImages(topicSlug: string) {
  return licensingMetadata.assets
    .filter(
      (asset) =>
        asset.collection === topicSlug &&
        publicQuotes.some((quote) => quote.id === asset.quoteId),
    )
    .map((asset) => ({
      slug: asset.format,
      label:
        collectionImageFormats.find((format) => format.slug === asset.format)?.label ??
        asset.format,
      width: asset.width,
      height: asset.height,
      src: asset.path,
      alt: asset.alt,
      license: asset.license,
    }));
}
