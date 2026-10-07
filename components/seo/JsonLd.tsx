import { serializeJsonLd } from "@/lib/structured-data";

/** Renders one or more schema.org objects as JSON-LD. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- serialized safely (see serializeJsonLd)
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
