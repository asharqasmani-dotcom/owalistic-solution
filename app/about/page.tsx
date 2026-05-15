import type { Metadata } from "next";
import Header from "@/components/Header";
import { absoluteUrl } from "@/lib/site";
import AboutExperience from "./AboutExperience";

export const metadata: Metadata = {
  title: "About Owalistic Studio",
  description:
    "Meet Owalistic Studio, a premium creative agency designing brand systems, websites, AI experiences, and growth-focused digital ecosystems.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutExperience />
    </>
  );
}
