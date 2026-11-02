import { notFound } from "next/navigation";
import { Gallery } from "./Gallery";

export const metadata = { title: "UI components", robots: { index: false } };

// Component preview for development only; 404 in production builds.
export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Gallery />;
}
