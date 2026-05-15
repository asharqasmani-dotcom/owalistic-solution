import type { Metadata } from "next";
import Header from "@/components/Header";
import { absoluteUrl } from "@/lib/site";
import ContactExperience from "./ContactExperience";

export const metadata: Metadata = {
  title: "Contact — Owlistic Studio",
  description:
    "Start a brand identity, website, packaging, social media or agency support project with Owlistic Studio. Share your brief and connect by email or Fiverr.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactExperience />
    </>
  );
}
