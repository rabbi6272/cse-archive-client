import localFont from "next/font/local";

export const inter = localFont({
  src: "../public/fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const avengeance = localFont({
  src: "../public/fonts/AvengeanceHeroicAvengerItalic.otf",
  display: "swap",
  variable: "--font-avengeance",
});

export const jetbrainsMono = localFont({
  src: "../public/fonts/ComicRelief.ttf",
  variable: "--font-jetbrains-mono",
  display: "swap",
});
