# Fonts for generated images

`Manrope-Bold.ttf` and `Manrope-Medium.ttf` are static instances of
[Manrope](https://fonts.google.com/specimen/Manrope) by Mikhail Sharanda,
licensed under the SIL Open Font License 1.1.

They are only used to render Open Graph images (`app/[locale]/opengraph-image.tsx`),
which need TTF/OTF files. The website itself loads Inter and Manrope through
`next/font` (see `lib/fonts.ts`).
