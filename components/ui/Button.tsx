import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link, type AppHref } from "@/i18n/navigation";
import { Icon } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "yellow" | "dark" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing icon; the arrow nudges on hover. */
  icon?: "arrow" | "arrow-up-right";
  /** Full width always, or only on phones. */
  block?: boolean | "mobile";
  className?: string;
  children: ReactNode;
};

type InternalLinkProps = BaseProps & {
  href: AppHref;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  onPointerEnter?: () => void;
  onFocus?: () => void;
  prefetch?: boolean;
  "aria-label"?: string;
};

type ExternalLinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    externalHref: string;
  };

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    loading?: boolean;
  };

export type ButtonProps = InternalLinkProps | ExternalLinkProps | NativeButtonProps;

function isInternalLink(props: ButtonProps): props is InternalLinkProps {
  return (props as InternalLinkProps).href !== undefined;
}

function isExternalLink(props: ButtonProps): props is ExternalLinkProps {
  return (props as ExternalLinkProps).externalHref !== undefined;
}

export function buttonClassName({
  variant = "primary",
  size = "md",
  block,
  className,
  loading,
}: Pick<BaseProps, "variant" | "size" | "block" | "className"> & { loading?: boolean }) {
  return [
    "btn",
    `btn--${variant}`,
    size !== "md" && `btn--${size}`,
    block === true && "btn--block",
    block === "mobile" && "btn--block-mobile",
    loading && "is-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function ButtonContent({ icon, children, loading }: { icon?: BaseProps["icon"]; children: ReactNode; loading?: boolean }) {
  return (
    <>
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className="btn__label">{children}</span>
      {icon && !loading && (
        <Icon name={icon === "arrow" ? "arrow-right" : "arrow-up-right"} className={`btn__icon btn__icon--${icon}`} />
      )}
    </>
  );
}

/**
 * One button system for links and buttons:
 * - `href` → localized internal link (next-intl)
 * - `externalHref` → plain <a> (mailto:, tel:, external sites)
 * - otherwise → <button>, with optional `loading` state
 */
export function Button(props: ButtonProps) {
  if (isInternalLink(props)) {
    const { variant, size, icon, block, className, children, ...linkProps } = props;
    return (
      <Link {...linkProps} className={buttonClassName({ variant, size, block, className })}>
        <ButtonContent icon={icon}>{children}</ButtonContent>
      </Link>
    );
  }

  if (isExternalLink(props)) {
    const { variant, size, icon, block, className, children, externalHref, ...anchorProps } = props;
    const isExternalSite = /^https?:\/\//.test(externalHref);
    return (
      <a
        href={externalHref}
        {...(isExternalSite && { target: "_blank", rel: "noopener noreferrer" })}
        {...anchorProps}
        className={buttonClassName({ variant, size, block, className })}
      >
        <ButtonContent icon={icon}>{children}</ButtonContent>
      </a>
    );
  }

  const { variant, size, icon, block, className, children, loading, type, ...buttonProps } =
    props as NativeButtonProps;
  // While loading the button stays focusable (aria-disabled instead of disabled),
  // so keyboard and screen-reader users don't lose their place.
  return (
    <button
      type={type ?? "button"}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      {...buttonProps}
      className={buttonClassName({ variant, size, block, className, loading })}
    >
      <ButtonContent icon={icon} loading={loading}>
        {children}
      </ButtonContent>
    </button>
  );
}
