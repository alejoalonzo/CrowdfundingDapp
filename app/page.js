import Image from "next/image";
import { Home } from "../components";
import { CampaignGrid } from "../components/campaigns";
import { About } from "../components/about";
import { Contact } from "../components/contact";

export default function HomePage() {
  return (
    <main>
      <section id="home">
        <Home />
      </section>
      <section id="campaigns">
        <CampaignGrid />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
