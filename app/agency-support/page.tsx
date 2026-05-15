import type { Metadata } from "next";
import Header from "@/components/Header";
import { absoluteUrl } from "@/lib/site";
import AgencySupportExperience from "./AgencySupportExperience";

export const metadata: Metadata = {
  title: "Agency Support — Owlistic Studio",
  description:
    "White-label and overflow design support for agencies. Brand identity, packaging, website design, presentations and client-ready creative assets — delivered clean and on time.",
  alternates: {
    canonical: absoluteUrl("/agency-support"),
  },
};

export default function AgencySupportPage() {
  return (
    <>
      <Header />
      <AgencySupportExperience />
    </>
  );
}
