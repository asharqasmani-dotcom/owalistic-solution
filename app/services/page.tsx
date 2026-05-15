import type { Metadata } from "next";
import Header from "@/components/Header";
import { absoluteUrl } from "@/lib/site";
import ServicesExperience from "./ServicesExperience";

export const metadata: Metadata = {
  title: "Services — Owlistic Studio",
  description:
    "Brand identity, website design, packaging design and social media design for startups, local businesses, product brands and agencies.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <ServicesExperience />
    </>
  );
}
