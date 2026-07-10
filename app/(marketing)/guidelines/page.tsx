import type { Metadata } from "next";
import { LegalList, LegalPage, LegalSection, LEGAL_CONTACT } from "@/components/marketing/legal";

const UPDATED = "July 10, 2026";

export const metadata: Metadata = {
  title: "Community Guidelines | tvcask",
  description: "What's expected when you use tvcask.",
  alternates: { canonical: "/guidelines" },
  openGraph: {
    title: "Community Guidelines | tvcask",
    description: "What's expected when you use tvcask.",
    type: "website",
    url: "/guidelines"
  }
};

export default function GuidelinesPage() {
  return (
    <LegalPage
      title="Community Guidelines"
      updated={UPDATED}
      intro="tvcask is mostly a personal, private space for tracking what you watch. Where any text you enter could be seen by others, these guidelines keep it a good place to be."
    >
      <LegalSection title="The basics">
        <LegalList
          items={[
            "Be respectful. No harassment, hate speech, threats, or bullying.",
            "Keep it legal. No content that is illegal or promotes serious harm.",
            "No sexual content involving minors, ever. This is reported and results in an immediate ban.",
            "Don't impersonate others or misrepresent who you are.",
            "No spam, scams, or malicious links in list names, usernames, or profile fields."
          ]}
        />
      </LegalSection>

      <LegalSection title="What you write">
        <p>
          Fields such as your username, display name, and list names are the parts of tvcask that others could see if
          sharing features are enabled. Keep them free of the content above. We may remove text that breaks these
          guidelines.
        </p>
      </LegalSection>

      <LegalSection title="Reporting and enforcement">
        <p>
          If you see something that breaks these guidelines, report it to{" "}
          <a href={`mailto:${LEGAL_CONTACT}`} className="font-semibold text-[color:var(--accent-text)]">
            {LEGAL_CONTACT}
          </a>
          . We review reports and can remove content, warn, suspend, or permanently ban accounts that violate these
          guidelines or our Terms of Service.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these guidelines as tvcask grows, especially as social features arrive. The &ldquo;last
          updated&rdquo; date above reflects the latest version.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
