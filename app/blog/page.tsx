import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Blogs from "@/components/sections/Blogs";

export const metadata: Metadata = {
  title: "Stories — Fortune Hestia",
  description:
    "Stories from Fortune Hestia: limited-edition contemporary villas set within 50 acres of Greek-inspired landscape off Sarjapur Road, Bangalore.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">
        <Blogs />
      </main>
      <Footer />
    </>
  );
}
