import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { publicQuotes, topics } from "../app/data.ts";

const outputDir = path.resolve("public/images/quote-collections");
const master = path.join(outputDir, "original-watercolor-master.png");
const formats = [
  { slug: "square", width: 1080, height: 1080 },
  { slug: "portrait", width: 1080, height: 1350 },
  { slug: "landscape", width: 1200, height: 630 },
  { slug: "pinterest", width: 1000, height: 1500 },
  { slug: "open-graph", width: 1200, height: 630 },
];

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const words = (text, max) => {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (`${line} ${word}`.trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
};

await mkdir(outputDir, { recursive: true });
const manifest = [];

for (const [topicIndex, topic] of topics.entries()) {
  const quote = publicQuotes.find((item) => item.topics.includes(topic.slug));
  if (!quote) throw new Error(`No verified quotation for ${topic.slug}`);

  for (const format of formats) {
    const filename = `${topic.slug}-quotes-${quote.authorSlug}-${format.slug}.webp`;
    const imagePath = path.join(outputDir, filename);
    const imageExists = await access(imagePath).then(() => true).catch(() => false);
    const isWide = format.width / format.height > 1.4;
    const fontSize = isWide ? 52 : 58;
    const maxChars = isWide ? 44 : 29;
    const lines = words(quote.text, maxChars);
    const lineHeight = Math.round(fontSize * 1.22);
    const textHeight = lines.length * lineHeight;
    const startY = Math.max(format.height * 0.24, (format.height - textHeight) / 2);
    const textSvg = `
      <svg width="${format.width}" height="${format.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="rgba(8,24,38,.18)"/>
        <rect x="${format.width * .09}" y="${format.height * .11}" width="${format.width * .82}" height="${format.height * .78}" rx="28" fill="rgba(255,252,244,.88)" stroke="rgba(181,137,55,.75)" stroke-width="2"/>
        <text x="50%" y="${format.height * .18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="#8a6427">${escapeXml(topic.label.toUpperCase())} QUOTES</text>
        <text text-anchor="middle" font-family="Georgia, serif" font-size="${fontSize}" font-weight="600" fill="#142b3b">
          ${lines.map((line, index) => `<tspan x="50%" y="${startY + index * lineHeight}">${escapeXml(line)}</tspan>`).join("")}
        </text>
        <line x1="42%" y1="${Math.min(format.height * .76, startY + textHeight + 28)}" x2="58%" y2="${Math.min(format.height * .76, startY + textHeight + 28)}" stroke="#b58937" stroke-width="2"/>
        <text x="50%" y="${Math.min(format.height * .82, startY + textHeight + 72)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#314957">${escapeXml(quote.author)}</text>
        <text x="50%" y="${format.height * .86}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" letter-spacing="2" fill="#536a73">QUOTES.ORG.IN · VERIFIED SOURCE</text>
      </svg>`;

    if (!imageExists) {
      await sharp(master)
        .resize(format.width, format.height, { fit: "cover", position: "attention" })
        .modulate({ hue: topicIndex * 23, saturation: 0.82 + (topicIndex % 3) * .08 })
        .composite([{ input: Buffer.from(textSvg) }])
        .webp({ quality: 88, effort: 5 })
        .withMetadata({
          exif: {
            IFD0: {
              ImageDescription: `${topic.label} quote by ${quote.author}: “${quote.text}”`,
              Copyright: "© 2026 Quotes.org.in. Original artwork; quotation text is public domain.",
              Artist: "Quotes.org.in editorial studio with OpenAI image generation",
            },
          },
        })
        .toFile(imagePath);
    }

    manifest.push({
      collection: topic.slug,
      collectionLabel: topic.label,
      format: format.slug,
      width: format.width,
      height: format.height,
      filename,
      path: `/images/quote-collections/${filename}`,
      alt: `${topic.label} quote by ${quote.author}: “${quote.text}”`,
      quoteId: quote.id,
      sourceUrl: quote.sourceUrl,
      license: "Original artwork © 2026 Quotes.org.in; quotation text public domain",
      creator: "Quotes.org.in editorial studio with OpenAI image generation",
      generatedAt: "2026-07-27",
    });
  }
}

await writeFile(
  path.join(outputDir, "licensing-metadata.json"),
  `${JSON.stringify({ licenseSummary: "Original artwork © 2026 Quotes.org.in. Embedded quotations are from reviewed public-domain sources.", assets: manifest }, null, 2)}\n`,
);

console.log(`Generated ${manifest.length} quote images and licensing records.`);
