// "Fija e artë" (demo 2026-10-28): preloader që s'e mbulon faqen. Në faqen e parë të vizitës
// një fije e artë përshkon kreun e ekranit, logoja shkëlqen dhe fjala e artë e hero-s ndizet.
// Vetëm CSS (globals.css, "Fija e artë"), e ndezur nga script-i inline më poshtë para paint-it:
// s'pret JavaScript-in e faqes dhe s'fsheh asgjë, prandaj LCP-ja mbetet si pa të.
// Zëvendëson Preloader-in e çaktivizuar (ekran i plotë ~2.5s, i dëmshëm për PageSpeed).
import { CONSENT_NEEDED_ATTR, CONSENT_SAVED_EVENT } from "@/lib/consent";

/** Atributi në <html> gjatë intro-s — animacionet te globals.css varen vetëm nga ky */
export const INTRO_ATTR = "data-intro";
const SEEN_KEY = "ip_intro_seen";
/** Pas kaq ms hiqet atributi, që një navigim brenda faqes të mos e luajë sërish */
const INTRO_MS = 4000;

/**
 * Një herë për sesion, jo me reduced motion, jo te faqet pa dekor (admin, oferta, klienti, feedback).
 * Kur banner-i i cookies është hapur (vizita e parë), intro-ja pret zgjedhjen — përndryshe
 * do luante e fshehur pas modalit.
 */
export function goldThreadScript() {
  return `try{var d=document.documentElement;if(!/^\\/(admin|oferta|klienti|feedback)(\\/|$)/.test(location.pathname)&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('${SEEN_KEY}')){var go=function(){sessionStorage.setItem('${SEEN_KEY}','1');d.setAttribute('${INTRO_ATTR}','')},end=function(){setTimeout(function(){d.removeAttribute('${INTRO_ATTR}')},${INTRO_MS})};if(d.hasAttribute('${CONSENT_NEEDED_ATTR}'))addEventListener('${CONSENT_SAVED_EVENT}',function(){setTimeout(function(){go();end()},150)},{once:true});else{go();document.addEventListener('DOMContentLoaded',end)}}}catch(e){}`;
}
