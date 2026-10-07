import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { quoteTotals, formatMoney, QUOTE_KIND_LABELS, type QuoteRecord } from "@/lib/quotes";

function formatDay(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, color: "#141414", fontFamily: "Helvetica" },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: "#ab8339", paddingBottom: 16, marginBottom: 24 },
  brand: { fontSize: 16, fontWeight: 700 },
  brandSub: { fontSize: 8, color: "#888", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" },
  docTitle: { fontSize: 18, color: "#ab8339", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, textAlign: "right" },
  docMeta: { fontSize: 9, color: "#666", marginTop: 4, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  metaLabel: { fontSize: 8, textTransform: "uppercase", letterSpacing: 1, color: "#999", marginBottom: 4 },
  metaText: { fontSize: 10, lineHeight: 1.5 },
  table: { borderTopWidth: 1.5, borderTopColor: "#ddd" },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 8 },
  th: { fontSize: 8, textTransform: "uppercase", letterSpacing: 1, color: "#888", paddingVertical: 6 },
  colDesc: { flex: 3 },
  colNum: { flex: 1, textAlign: "right" },
  totals: { marginTop: 12, marginLeft: "auto", width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  grandRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderTopColor: "#ab8339", marginTop: 4, paddingTop: 8 },
  grandLabel: { fontSize: 12, fontWeight: 700, color: "#ab8339" },
  grandValue: { fontSize: 12, fontWeight: 700, color: "#ab8339" },
  notes: { marginTop: 24, fontSize: 9, color: "#555", lineHeight: 1.5, backgroundColor: "#faf8f4", padding: 12, borderRadius: 4 },
  footer: { position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#999", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 },
});

function QuoteDocument({ quote }: { quote: QuoteRecord }) {
  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const kindLabel = QUOTE_KIND_LABELS[quote.kind];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.head}>
          <View>
            <Text style={styles.brand}>ILLYRIAN PIXEL</Text>
            <Text style={styles.brandSub}>Agjenci Dixhitale Premium</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>{kindLabel}</Text>
            <Text style={styles.docMeta}>{quote.number}</Text>
            <Text style={styles.docMeta}>Data: {formatDay(quote.issued_at)}</Text>
            {quote.due_at && (
              <Text style={styles.docMeta}>
                {quote.kind === "invoice" ? "Afati i pagesës" : "E vlefshme deri"}: {formatDay(quote.due_at)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Për</Text>
            <Text style={styles.metaText}>{quote.client_name}</Text>
            {quote.client_business && <Text style={styles.metaText}>{quote.client_business}</Text>}
            {quote.client_email && <Text style={styles.metaText}>{quote.client_email}</Text>}
          </View>
          <View>
            <Text style={[styles.metaLabel, { textAlign: "right" }]}>Nga</Text>
            <Text style={[styles.metaText, { textAlign: "right" }]}>Illyrian Pixel</Text>
            <Text style={[styles.metaText, { textAlign: "right" }]}>Tiranë, Shqipëri</Text>
            <Text style={[styles.metaText, { textAlign: "right" }]}>info@illyrianpixel.com</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.th, styles.colDesc]}>Përshkrimi</Text>
            <Text style={[styles.th, styles.colNum]}>Sasia</Text>
            <Text style={[styles.th, styles.colNum]}>Çmimi</Text>
            <Text style={[styles.th, styles.colNum]}>Totali</Text>
          </View>
          {quote.items.map((it, i) => (
            <View key={i} style={styles.tr}>
              <Text style={styles.colDesc}>{it.description}</Text>
              <Text style={styles.colNum}>{it.qty}</Text>
              <Text style={styles.colNum}>{formatMoney(it.price)}</Text>
              <Text style={styles.colNum}>{formatMoney(it.qty * it.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Nëntotali</Text>
            <Text>{formatMoney(totals.subtotal)}</Text>
          </View>
          {totals.discount > 0 && (
            <View style={styles.totalRow}>
              <Text>Zbritje</Text>
              <Text>-{formatMoney(totals.discount)}</Text>
            </View>
          )}
          {quote.tax_rate > 0 && (
            <View style={styles.totalRow}>
              <Text>TVSH ({quote.tax_rate}%)</Text>
              <Text>{formatMoney(totals.tax)}</Text>
            </View>
          )}
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>Totali</Text>
            <Text style={styles.grandValue}>{formatMoney(totals.total)}</Text>
          </View>
        </View>

        {quote.notes && <Text style={styles.notes}>{quote.notes}</Text>}

        <View style={styles.footer}>
          <Text>illyrianpixel.com</Text>
          <Text>Faleminderit për besimin!</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderQuotePdf(quote: QuoteRecord): Promise<Buffer> {
  return renderToBuffer(<QuoteDocument quote={quote} />);
}
