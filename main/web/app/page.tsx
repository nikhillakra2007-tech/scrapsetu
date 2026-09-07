import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
export const metadata: Metadata = {
  title: "SmartScrapNet — Nothing wasted. Everything worth more.",
  description:
    "Connecting local scrap collectors with responsible recyclers. Clearer prices, safer handling, and traceable material handovers.",
};
export default function Page() {
  return <LandingPage />;
}
