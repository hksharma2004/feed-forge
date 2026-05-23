import Beam from "@/components/templates/notio/beam";
import Hero from "@/components/templates/notio/call-to-action/hero";
import Features from "@/components/templates/notio/features/features";
import Footer from "@/components/templates/notio/footer";
import LogoCloud from "@/components/logo-cloud";
import Navbar from "@/components/templates/notio/navbar";
import Stats from "@/components/templates/notio/stats";
import Team from "@/components/team";

export default function Page() {
  return (
    <div className="relative flex flex-col gap-8 overflow-hidden p-3 md:p-2">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Beam>
        <Features />
      </Beam>
      <Stats />
      <Team />
      <Footer />
    </div>
  );
}
