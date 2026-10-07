import { Link, type AppHref } from "@/i18n/navigation";

export type BreadcrumbItem = { label: string; href?: AppHref };

/** Visible breadcrumb trail. The last item is the current page. */
export function Breadcrumbs({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  return (
    <nav className="breadcrumbs" aria-label={label}>
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
