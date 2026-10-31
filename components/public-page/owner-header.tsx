import { Avatar } from "@/components/ui/avatar";
import { socialLinks, type PublicOwner } from "@/lib/public-page";

export function OwnerHeader({ owner }: { owner: PublicOwner }) {
  const links = socialLinks(owner);
  return (
    <header className="flex items-start gap-4 sm:gap-5">
      <Avatar src={owner.avatarUrl} name={owner.name} size={72} className="shrink-0 ring-1 ring-white/10" />
      <div className="min-w-0 pt-0.5">
        <h1 className="display break-words text-2xl leading-tight text-white sm:text-3xl">{owner.name}</h1>
        <p className="mt-0.5 text-sm font-semibold text-white/40">@{owner.username}</p>
        {owner.bio ? <p className="mt-3 break-words text-[15px] leading-6 text-white/70">{owner.bio}</p> : null}
        {links.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-bold">
            {links.map((link) => (
              <li key={link.href}>
                {/* Written by a stranger: no referrer trust, and no SEO credit for spam. */}
                <a
                  href={link.href}
                  target="_blank"
                  rel="nofollow ugc noopener noreferrer"
                  className="transition hover:underline"
                  style={{ color: "var(--accent-text)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  );
}
