import Image from "next/image";
import { Home } from "../components";
import { CampaignGrid } from "../components/campaigns";

export default function HomePage() {
  return (
    <main>
      <Home />
      <CampaignGrid />
    </main>
  );
}
