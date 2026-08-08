export function StructuredData({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbData(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://quotes.org.in${item.path}`,
    })),
  };
}

type CollectionItem = {
  name: string;
  path: string;
};

export function collectionPageData({
  name,
  path,
  description,
  items,
  breadcrumbs,
}: {
  name: string;
  path: string;
  description: string;
  items: CollectionItem[];
  breadcrumbs: { name: string; path: string }[];
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name,
      description,
      url: `https://quotes.org.in${path}`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `https://quotes.org.in${item.path}`,
        })),
      },
    },
    breadcrumbData(breadcrumbs),
  ];
}

export function webPageData({
  name,
  path,
  description,
  type = "WebPage",
}: {
  name: string;
  path: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "WebApplication";
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `https://quotes.org.in${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Quotes.org.in",
      url: "https://quotes.org.in",
    },
  };
}
