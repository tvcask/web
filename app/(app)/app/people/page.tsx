import type { Metadata } from "next";
import { PeopleSearch } from "@/components/social/people-search";

export const metadata: Metadata = {
  title: "Find people"
};

export default function PeoplePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="display text-2xl text-white">Find people</h1>
      <PeopleSearch />
    </div>
  );
}
