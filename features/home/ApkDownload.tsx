import Image from "next/image";
import { Download } from "lucide-react";
import { buttonClasses } from "@/components/ui";

const APK_URL =
  "https://github.com/idcnys/semicolon/releases/download/apk_latest/semicolon_2.0.3.apk";

export function ApkDownload() {
  return (
    <section aria-labelledby="apk-heading" className="page-container py-8 md:py-12">
      <div className="reveal mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-card bg-surface px-6 py-10 text-center md:flex-row md:px-12 md:text-left">
        <Image
          src="/images/semicolon.png"
          alt=""
          width={80}
          height={80}
          className="size-16 shrink-0 rounded-card object-contain md:size-20"
        />
        <div className="flex-1">
          <h2 id="apk-heading" className="text-2xl font-semibold tracking-tight text-ink">
            Take the archive with you
          </h2>
          <p className="mt-2 max-w-md text-ink-soft">
            Semicolon, our companion Android app, brings a faster in-app experience to the same
            resources.
          </p>
        </div>
        <a href={APK_URL} download className={buttonClasses("primary")}>
          <Download className="size-4" aria-hidden />
          Download APK
        </a>
      </div>
    </section>
  );
}
