export const SOCIAL_ICON_IDS = ["instagram", "tiktok", "facebook", "threads", "linkedin"] as const;

export type SocialIconId = (typeof SOCIAL_ICON_IDS)[number];

export type SocialLinkItem = {
  href: string;
  label: string;
  icon: SocialIconId;
};

export const SOCIAL_LINKS: SocialLinkItem[] = [
  { href: "https://www.instagram.com/illyrianpixel/", label: "Instagram", icon: "instagram" },
  { href: "https://www.tiktok.com/@illyrianpixel", label: "TikTok", icon: "tiktok" },
  { href: "https://www.facebook.com/profile.php?id=61589087137483", label: "Facebook", icon: "facebook" },
  { href: "https://www.threads.net/@illyrianpixel", label: "Threads", icon: "threads" },
  { href: "https://www.linkedin.com/company/illyrianpixel/", label: "LinkedIn", icon: "linkedin" }
];
