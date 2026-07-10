import type { Metadata } from "next";
import { LegalList, LegalPage, LegalSection, LEGAL_CONTACT } from "@/components/marketing/legal";

const UPDATED = "July 10, 2026";

export const metadata: Metadata = {
  title: "Terms of Service | tvcask",
  description: "The terms for using tvcask on the web and iOS.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | tvcask",
    description: "The terms for using tvcask on the web and iOS.",
    type: "website",
    url: "/terms"
  }
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated={UPDATED}
      intro="These terms cover your use of tvcask on the web and iOS. By creating an account or using the app, you agree to them."
    >
      <LegalSection title="Using tvcask">
        <p>
          tvcask lets you track shows and movies, import your TV Time history, and organize titles into lists. You must
          be at least 13 years old to use it. You are responsible for your account and for keeping your password secure.
        </p>
      </LegalSection>

      <LegalSection title="Your account">
        <LegalList
          items={[
            "Provide accurate information when you sign up.",
            "Keep your credentials private; activity under your account is your responsibility.",
            "Tell us at once if you suspect unauthorized use of your account."
          ]}
        />
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>Please don&apos;t:</p>
        <LegalList
          items={[
            "Break the law or infringe others' rights while using tvcask.",
            "Attempt to disrupt, overload, reverse-engineer, or gain unauthorized access to the service.",
            "Upload malware, scrape at scale, or abuse the API.",
            "Use list names or profile fields to post hateful, harassing, or illegal content."
          ]}
        />
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          Your library, lists, and profile details are yours. You grant us the limited permission needed to store and
          display them back to you so the service works. You can delete your content at any time by deleting your
          account.
        </p>
      </LegalSection>

      <LegalSection title="Catalog data and TV Time">
        <p>
          Title, poster, and episode information comes from third-party catalog sources and belongs to their respective
          owners. tvcask is an independent product and is not affiliated with, endorsed by, or connected to TV Time or
          Whip Media. &ldquo;TV Time&rdquo; is used only to describe the import we support.
        </p>
      </LegalSection>

      <LegalSection title="Service &ldquo;as is&rdquo;">
        <p>
          tvcask is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties of any
          kind. We work hard to keep your data safe and the service reliable, but we can&apos;t guarantee it will always
          be uninterrupted or error-free. To the extent permitted by law, we are not liable for indirect or
          consequential damages arising from your use of the service.
        </p>
      </LegalSection>

      <LegalSection title="Ending your use">
        <p>
          You can stop using tvcask and delete your account at any time. We may suspend or terminate accounts that
          violate these terms or put the service or other users at risk.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms. When we do, we&apos;ll update the &ldquo;last updated&rdquo; date above. Continued
          use after a change means you accept the new terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${LEGAL_CONTACT}`} className="font-semibold text-[color:var(--accent-text)]">
            {LEGAL_CONTACT}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
