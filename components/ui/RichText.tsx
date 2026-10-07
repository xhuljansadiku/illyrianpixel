import type { ReactNode } from "react";
import { isPlaceholder } from "@/content/company";
import type { ContentBlock } from "@/content/types";
import { isAppPathname } from "@/i18n/routing";
import { Link, type AppHref } from "@/i18n/navigation";

/**
 * Renders inline markup used in content files:
 *   [label](/contact)    → localized internal link
 *   [label](https://…)   → external link (new tab)
 *   **bold**             → <strong>
 *   [ANY PLACEHOLDER]    → visibly marked placeholder
 */
const TOKEN = /(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\[[^\]]+\])/g;

function renderLink(label: string, href: string, key: string): ReactNode {
  if (href.startsWith("/")) {
    const [path, hash] = href.split("#");
    if (isAppPathname(path)) {
      const target = (hash ? { pathname: path, hash } : path) as AppHref;
      return (
        <Link key={key} href={target}>
          {label}
        </Link>
      );
    }
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a key={key} href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
      {label}
    </a>
  );
}

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `t${match.index}`;
    const [token, link, bold, placeholder] = match;

    if (link) {
      const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      if (linkMatch) nodes.push(renderLink(linkMatch[1], linkMatch[2], key));
    } else if (bold) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (placeholder) {
      nodes.push(
        <span key={key} className="is-placeholder">
          {token}
        </span>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return <>{nodes}</>;
}

/** Plain value that is visibly marked when it is still a placeholder. */
export function PlaceholderAware({ value }: { value: string }) {
  return isPlaceholder(value) ? <span className="is-placeholder">{value}</span> : <>{value}</>;
}

/** Renders long-form content blocks inside a `.prose` container. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "h2":
            return (
              <h2 key={key} id={block.id}>
                {block.text}
              </h2>
            );
          case "h3":
            return <h3 key={key}>{block.text}</h3>;
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <RichText text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "callout":
            return (
              <aside key={key} className="callout">
                {block.title && <p className="callout__title">{block.title}</p>}
                <p className="callout__text">
                  <RichText text={block.text} />
                </p>
              </aside>
            );
          default:
            return (
              <p key={key}>
                <RichText text={block.text} />
              </p>
            );
        }
      })}
    </>
  );
}

