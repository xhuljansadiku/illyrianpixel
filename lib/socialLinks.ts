export const SOCIAL_ICON_IDS = ["instagram", "tiktok", "facebook", "threads", "linkedin"] as const;

export type SocialIconId = (typeof SOCIAL_ICON_IDS)[number];

export type SocialLinkItem = {
  href: string;
  label: string;
  icon: SocialIconId;
};

// Google Business Profile (2 review, 2026-10-25). Biznes online pa zyrë fizike (pronari, opsioni "c"):
// profili duhet me adresë të fshehur + zona shërbimi; schema (lib/seo) lidhet me të përmes CID-it.
export const GOOGLE_BUSINESS_URL = "https://maps.google.com/?cid=10226535624287043227";

export const SOCIAL_LINKS: SocialLinkItem[] = [
  { href: "https://www.instagram.com/illyrianpixel/", label: "Instagram", icon: "instagram" },
  { href: "https://www.tiktok.com/@illyrianpixel", label: "TikTok", icon: "tiktok" },
  { href: "https://www.facebook.com/profile.php?id=61589087137483", label: "Facebook", icon: "facebook" },
  { href: "https://www.threads.net/@illyrianpixel", label: "Threads", icon: "threads" },
  { href: "https://www.linkedin.com/company/illyrianpixel/", label: "LinkedIn", icon: "linkedin" }
];
