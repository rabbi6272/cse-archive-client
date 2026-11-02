import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { FacebookIcon, GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { cn, focusRing } from "@/components/ui";
import defaultPhoto from "@/public/images/developers/default.jpg";
import type { Developer } from "./data";

// Treat placeholder "#" links as missing instead of rendering dead icons.
const real = (url?: string) => (url && url !== "#" ? url : undefined);

const iconLink = cn(
  "inline-flex size-9 items-center justify-center rounded-button text-steel transition-colors hover:bg-surface hover:text-ink",
  focusRing,
);

export function DeveloperCard({ developer }: { developer: Developer }) {
  const { name, role, location, image, mail } = developer;
  const links = [
    { href: real(developer.github), label: "GitHub", Icon: GithubIcon },
    { href: real(developer.linkedin), label: "LinkedIn", Icon: LinkedinIcon },
    { href: real(developer.facebook), label: "Facebook", Icon: FacebookIcon },
  ].filter((l) => l.href);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-canvas transition-[box-shadow,translate] duration-200 hover:shadow-card motion-safe:hover:-translate-y-0.5">
      <div className="overflow-hidden bg-surface">
        <Image
          src={image ?? defaultPhoto}
          alt={`Photo of ${name}`}
          placeholder="blur"
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-lg font-semibold tracking-tight text-ink">{name}</h3>
        <p className="text-sm text-ink-soft">{role}</p>
        {location && (
          <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-steel">
            <MapPin className="size-3.5" aria-hidden />
            {location}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1 pt-4">
          {mail && (
            <a href={`mailto:${mail}`} aria-label={`Email ${name}`} title="Email" className={iconLink}>
              <Mail className="size-[18px]" aria-hidden />
            </a>
          )}
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ${label}`}
              title={label}
              className={iconLink}
            >
              <Icon className="size-[18px]" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
