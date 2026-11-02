import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// Applied as CSS variables on <html>; used through font-sans / font-mono (see @theme in globals.css).
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display font for the developers page heading only.
export const avengeance = localFont({
  src: "../public/fonts/AvengeanceHeroicAvengerItalic.otf",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
