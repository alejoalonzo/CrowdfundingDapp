import Image from "next/image";
import { Home } from "../components";
import { CampaignGrid } from "../components/campaigns";
import { About } from "../components/about";

export default function HomePage() {
  return (
    <main>
      <Home />
      <CampaignGrid />
      <About />
    </main>
  );
}
