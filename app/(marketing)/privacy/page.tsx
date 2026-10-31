import type { Metadata } from "next";
import { LegalList, LegalPage, LegalSection, LEGAL_CONTACT } from "@/components/marketing/legal";

const UPDATED = "October 31, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | tvcask",
  description: "How tvcask collects, uses, and protects your data, and how to delete it.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | tvcask",
    description: "How tvcask collects, uses, and protects your data, and how to delete it.",
    type: "website",
    url: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro="tvcask is an independent watch tracker for shows and movies, available on the web and iOS. This policy explains what we collect, why, and the control you have over your data. We keep it short and we don't sell your data."
    >
      <LegalSection title="Who we are">
        <p>
          tvcask (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an independent product run by a small team. We are not
          affiliated with TV Time or Whip Media. You can reach us at{" "}
          <a href={`mailto:${LEGAL_CONTACT}`} className="font-semibold text-[color:var(--accent-text)]">
            {LEGAL_CONTACT}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>We collect only what we need to run your account and your library:</p>
        <LegalList
          items={[
            <>
              <b className="text-white/80">Account details</b>: your email address, a display name, an optional
              username, and an optional avatar image URL. Your password is stored only as a salted hash; we never see
              it in plain text.
            </>,
            <>
              <b className="text-white/80">Profile details</b>: an optional bio, Instagram and Letterboxd usernames,
              and a website link.
            </>,
            <>
              <b className="text-white/80">Your library</b>: the shows and movies you track, their status
              (watchlist, watching, watched), episodes you mark watched, ratings, favorites, and any lists you create.
            </>,
            <>
              <b className="text-white/80">Social activity</b>: who you follow, who you block, reports you submit, and
              your notifications.
            </>,
            <>
              <b className="text-white/80">Device details</b>: if you allow notifications on iOS, a push token and
              your device platform, so we can send them to you.
            </>,
            <>
              <b className="text-white/80">AI connections</b>: if you connect an AI assistant, the name of that
              assistant, the permissions you approved, and when you connected it.
            </>,
            <>
              <b className="text-white/80">Imported data</b>: when you import a TV Time export, we read the shows,
              movies, watched episodes, favorites, and lists needed to recreate your history. Official TV Time GDPR
              archives can contain unrelated account, login, device, and network files. tvcask does not open or use
              those files.
            </>,
            <>
              <b className="text-white/80">Basic technical logs</b>: standard server logs (such as request times and
              error diagnostics) used to keep the service reliable and secure.
            </>
          ]}
        />
        <p>
          We do <b className="text-white/80">not</b> use advertising identifiers, ad networks, or cross-app tracking,
          and the app does not access your camera, contacts, location, or photo library.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <LegalList
          items={[
            "To create and secure your account and sign you in.",
            "To store and display your tracked shows, movies, episodes, lists, and stats.",
            "To match your titles against catalog data and show artwork and episode details.",
            "To show your profile, lists, and activity to others, as described below.",
            "To send account emails you request, such as email verification and password resets.",
            "To send notifications you allow, such as new followers and new episodes.",
            "To give an AI assistant access to your library, if you connect one.",
            "To keep the service running, debug problems, prevent abuse, and respond to support requests."
          ]}
        />
      </LegalSection>

      <LegalSection title="What other people can see">
        <p>
          Your email address and password are never shown to other people. What else is visible depends on your
          settings.
        </p>
        <p>
          <b className="text-white/80">Other tvcask members.</b> Unless your profile is private, anyone signed in to
          tvcask can find you by name or username and see your profile: your username, display name, avatar, follower
          counts, stats, badges, library, and public lists. Following someone takes effect immediately, with no approval
          step. People who follow you also see recent activity in their feed, including the titles you track, their
          status, your progress, favorites, and ratings, along with new public lists.
        </p>
        <p>
          <b className="text-white/80">Anyone with a link.</b> If you turn on your public page, which is off by default,
          anyone with the link can see your name, username, avatar, bio, links, and public lists, including each
          list&rsquo;s name, description, and titles, without an account. They cannot see your email address, watch
          history, library, stats, badges, or followers. We ask search engines not to index these pages.
        </p>
        <p>You control this:</p>
        <LegalList
          items={[
            <>
              <b className="text-white/80">Private profile</b>: turning this on hides your profile, activity, and public
              page from everyone but you, and overrides your public page setting.
            </>,
            <>
              <b className="text-white/80">Public page</b>: turning this off makes your page and its list links stop
              working right away.
            </>,
            <>
              <b className="text-white/80">Lists</b>: new lists are private unless you make them public, and you can
              change this for each list.
            </>,
            <>
              <b className="text-white/80">Blocking</b>: blocking someone hides your profile from them while they are
              signed in. It cannot apply to someone viewing your public page without an account.
            </>
          ]}
        />
        <p>
          Once something has been public, we cannot control copies other people made, such as screenshots, copied text,
          or link previews saved by messaging apps. Links on your public page go to other sites, which have their own
          privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="Administrative access">
        <p>
          Access to account details is restricted to authorized administrators and used only to operate and secure the
          service, investigate import problems, or respond to support requests. Administrative access is logged.
        </p>
        <p>
          Our administration tools show account details, library totals, and import summaries. They do not expose
          password hashes, authentication tokens, uploaded files, or individual watch history.
        </p>
      </LegalSection>

      <LegalSection title="Third parties we rely on">
        <p>We share the minimum needed with a few providers that help run tvcask:</p>
        <LegalList
          items={[
            <>
              <b className="text-white/80">TMDB and TheTVDB</b>: we query these services for catalog data (titles,
              posters, episodes). We send search terms and title identifiers, not your personal details.
            </>,
            <>
              <b className="text-white/80">Email delivery</b>: a transactional email provider sends verification and
              password-reset messages to your address.
            </>,
            <>
              <b className="text-white/80">Hosting</b>: our servers and database run with a cloud hosting provider on
              our behalf.
            </>,
            <>
              <b className="text-white/80">Push notifications</b>: if you allow notifications, Expo and Apple deliver
              them. They receive your push token and the notification text.
            </>,
            <>
              <b className="text-white/80">AI assistants you connect</b>: if you connect one, such as ChatGPT, it can
              read your library and, if you approved it, change your library. Its provider handles that data under its
              own privacy policy. You can disconnect it at any time in Settings &rarr; AI connections.
            </>
          ]}
        />
        <p>We do not sell or rent your personal data to anyone.</p>
      </LegalSection>

      <LegalSection title="Where your data lives">
        <p>
          Your data is stored on our servers and database. On iOS, your login token is kept in the device Keychain, and
          nothing you track is stored on the device beyond a temporary cache for a fast experience.
        </p>
      </LegalSection>

      <LegalSection title="Deleting your data">
        <p>You are in control:</p>
        <LegalList
          items={[
            <>
              <b className="text-white/80">Delete your account in the app</b>: Settings &rarr; Security &rarr; Delete
              account (or the equivalent on the web). This permanently removes your account and all of your tracking
              data and cannot be undone.
            </>,
            <>
              <b className="text-white/80">By email</b>: write to{" "}
              <a href={`mailto:${LEGAL_CONTACT}`} className="font-semibold text-[color:var(--accent-text)]">
                {LEGAL_CONTACT}
              </a>{" "}
              and we will delete your data.
            </>
          ]}
        />
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          We keep your data for as long as your account is active. When you delete your account, your personal data and
          library are removed from our systems. Routine backups are rotated on a short schedule.
        </p>
        <p>
          Uploaded TV Time ZIP files are parsed in memory and are not stored after the import request. The shows,
          movies, watched episodes, favorites, and lists created from the import remain in your tvcask account until
          you remove them or delete your account.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          tvcask is not directed to children under 13, and we do not knowingly collect data from them. If you believe a
          child has created an account, contact us and we will remove it.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on where you live, you may have the right to access, correct, export, or delete your personal data.
          Email{" "}
          <a href={`mailto:${LEGAL_CONTACT}`} className="font-semibold text-[color:var(--accent-text)]">
            {LEGAL_CONTACT}
          </a>{" "}
          and we will help.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If we make material changes, we will update this page and the &ldquo;last updated&rdquo; date above. Continued
          use of tvcask after a change means you accept the updated policy.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
