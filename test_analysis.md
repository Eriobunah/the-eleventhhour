ANALYSIS OF test.html + test.css

=== WHAT IS GOOD ===
- Sections in correct order matching mockup
- Brand colors used correctly: #0A1628 navy, #F5A623 amber, #F3EFE6 cream
- Barlow Condensed + Inter fonts imported
- Partner section already uses teh- prefix (good start)
- Why Us and CTA sections use teh- prefix
- Footer structure is solid — 3-column layout matches mockup
- Service card grid 3x2 is correct
- Why Us pillars 4-column grid matches mockup
- Watermark in footer present

=== PROBLEMS TO FIX ===

1. MIXED NAMING — 4 different systems in one file:
   - Hero: hero__, hero__nav, hero__left (BEM-style, no teh- prefix)
   - About: about__, about__tag (BEM, no teh- prefix)
   - Serve: serve__, serve__image (BEM, no teh- prefix)
   - Services: .service-card, .overlay, .content, .number (generic — DANGEROUS for Appscrip)
   - Partner+: teh-partner__, teh-why__, teh-cta__ (correct)
   Fix: rename ALL sections to use teh- prefix with page prefix hp- for homepage

2. NAV IS INSIDE HERO SECTION
   - <div class="hero__nav"> inside <section class="hero">
   - Nav must be a standalone <nav> element, fixed, outside all sections
   - It needs to persist across all 10 pages via shared.css

3. GENERIC CLASS NAMES THAT WILL CLASH WITH APPSCRIP:
   - .overlay (used in services — Appscrip likely has its own .overlay)
   - .content (extremely generic)
   - .number (will definitely clash)
   - .fade (too generic)
   Fix: rename to .hp-svc-card__overlay, .hp-svc-card__body, .hp-svc-card__num

4. FONT IMPORT INCOMPLETE:
   - Only importing Barlow Condensed 600, 700 and Inter 400, 500
   - Brand needs: Barlow Condensed 300,400,500,600,700,800,900
   - Brand needs: Inter 300,400,500,600 + italic 300
   Fix: update import URL in shared.css (already done)

5. CITATION TEXT IN HTML:
   - "[cite: 4]" appears literally in the CTA description paragraph
   - Must be removed

6. NO SEMANTIC HTML:
   - No <main> landmark
   - Nav is a <div> not <nav>
   - Footer links have no aria-label on nav
   - Cert logos have no aria-hidden or role

7. NO SCROLL REVEAL:
   - No animation classes on sections
   Fix: add teh-reveal + teh-reveal--d1/d2 to each section

8. IMAGE PLACEHOLDERS ARE INVISIBLE:
   - serve__image: empty div with url('your-truck-image.jpg') — shows nothing
   - teh-partner__hero: url('assets/images/truck-hero.jpg') — shows nothing
   - teh-cta__bg: url('assets/images/refinery-night.jpg') — shows nothing
   Fix: replace with visible teh-ph placeholder divs that show label + dimensions

9. LOGO IN PARTNER SECTION:
   - <img src="assets/images/logo-white.svg"> — file doesn't exist yet
   Fix: replace with teh-nav__logo-ph placeholder

10. CERT LOGOS IN WHY US:
    - <img src="assets/iata-logo.svg"> etc — files don't exist
    Fix: replace with teh-cert-ph--dark text badges until real files arrive

11. HERO TRUST BAR NOT USING SHARED COMPONENT:
    - Hero bottom section is custom per-page
    Fix: use teh-trust shared component

12. FOOTER HAS NO PAGE LINKS:
    - All footer links are href="#"
    Fix: wire to actual page filenames

13. BUTTON INCONSISTENCY:
    - Hero uses <button> elements (no class)
    - Serve section uses <button> (no class)  
    - Partner uses <a class="teh-btn teh-btn--primary">
    Fix: standardize all to teh-btn + teh-btn--primary using <a> tags

14. NO SEO:
    - <title>Hero Section</title>
    - No meta description, keywords, canonical, OG, Twitter Card, Schema

15. NO SHARED CSS/JS LINKS:
    - Links to test.css only
    Fix: link shared.css + shared.js

16. DOUBLE-DEFINED .teh-btn--primary:
    - Defined twice in test.css (partner section + CTA section)
    - Second definition overwrites first with different padding
    Fix: define once in shared.css only

17. FOOTER WATERMARK POSITION:
    - Currently inside .teh-footer__bottom div
    - Should be after .teh-footer__bottom as final child of footer
    - Needs overflow:hidden on footer parent to contain it
