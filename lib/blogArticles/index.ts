// Artikujt e strukturuar, në rendin si shfaqen te blogu. Importohet vetëm nga kodi i serverit
// (faqet, sitemap, testet): lista te lib/blogPosts.* shkon edhe te klienti, ndaj atje mbahen
// vetëm titulli dhe excerpt-i (lib/blogArticles/blogArticles.test.ts kontrollon që përputhen).
import type { StructuredArticlePair } from "./types";
import kurDuhetWebsiteIRi from "./kur-duhet-website-i-ri";
import siTeZgjedheshPaketen from "./si-te-zgjedhesh-paketen-e-website";
import pyetjeParaSeTePaguash from "./pyetje-para-se-te-paguash-per-website";
import mirembajtja from "./mirembajtja-e-website-it";
import googleBusinessProfile from "./google-business-profile-udhezues";
import landingPage from "./landing-page-qe-sjell-kerkesa";
import shpejtesia from "./shpejtesia-e-website-it";
import domainEmail from "./domain-dhe-email-profesional";
import whatsappBusiness from "./whatsapp-business-dhe-website";
import fotoProduktesh from "./foto-produktesh-me-telefon";

export const STRUCTURED_ARTICLES: StructuredArticlePair[] = [
  kurDuhetWebsiteIRi,
  siTeZgjedheshPaketen,
  pyetjeParaSeTePaguash,
  mirembajtja,
  googleBusinessProfile,
  landingPage,
  shpejtesia,
  domainEmail,
  whatsappBusiness,
  fotoProduktesh,
];
