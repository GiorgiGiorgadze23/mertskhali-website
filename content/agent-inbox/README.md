# Agent inbox

The news agent (a scheduled Claude task) writes one JSON file per story here and pushes it to `main`.
After Vercel deploys, opening **/admin** imports every new file as a **draft** (მონახაზი) — nothing is
published until an admin presses „გამოქვეყნება“. Deleting an agent draft hides it for good.

File name: `YYYY-MM-DD-<short-key>.json`. Shape:

```json
{
  "key": "2026-11-05-borjomi-4-0",          // unique, stable; used to avoid duplicates
  "title": "მერცხალმა ბორჯომი 4:0 დაამარცხა",
  "excerpt": "ერთი-ორი წინადადება.",
  "body": "აბზაცები ცარიელი ხაზით.\n\nვიდეოს ბმული ცალკე ხაზზე ხდება პლეერი.",
  "category": "მატჩი",                        // მატჩი | კლუბი | ტრანსფერი | აკადემია
  "title_en": "…", "excerpt_en": "…", "body_en": "…",   // optional
  "source_url": "https://…",                  // where the facts come from
  "image_url": "https://…"                     // optional, only images we may use
}
```
