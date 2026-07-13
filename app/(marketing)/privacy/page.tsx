import type { Metadata } from "next";
import { LegalList, LegalPage, LegalSection, LEGAL_CONTACT } from "@/components/marketing/legal";

const UPDATED = "July 13, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | tvcask",
  description: "How tvcask collects, uses, and protects your data — and how to delete it.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | tvcask",
    description: "How tvcask collects, uses, and protects your data — and how to delete it.",
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
              <b className="text-white/80">Account details</b> — your email address, a display name, an optional
              username, and an optional avatar image URL. Your password is stored only as a salted hash; we never see
              it in plain text.
            </>,
            <>
              <b className="text-white/80">Your library</b> — the shows and movies you track, their status
              (watchlist, watching, watched), episodes you mark watched, ratings, favorites, and any lists you create.
            </>,
            <>
              <b className="text-white/80">Imported data</b> — when you import a TV Time export, we read the shows,
              movies, watched episodes, favorites, and lists in that file to recreate your history.
            </>,
            <>
              <b className="text-white/80">Basic technical logs</b> — standard server logs (such as request times and
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
            "To send account emails you request, such as email verification and password resets.",
            "To keep the service running, debug problems, prevent abuse, and respond to support requests."
          ]}
        />
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
              <b className="text-white/80">TMDB</b> — we query The Movie Database for catalog data (titles, posters,
              episodes). We send search terms and title identifiers, not your personal details.
            </>,
            <>
              <b className="text-white/80">Email delivery</b> — a transactional email provider sends verification and
              password-reset messages to your address.
            </>,
            <>
              <b className="text-white/80">Hosting</b> — our servers and database run with a cloud hosting provider on
              our behalf.
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
              <b className="text-white/80">Delete your account in the app</b> — Settings &rarr; Security &rarr; Delete
              account (or the equivalent on the web). This permanently removes your account and all of your tracking
              data and cannot be undone.
            </>,
            <>
              <b className="text-white/80">By email</b> — write to{" "}
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
