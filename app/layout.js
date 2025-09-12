import { Montserrat } from "next/font/google";
import { Navbar, Footer } from "../components";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weights: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Crowdfunding DApp",
  description: "Decentralized crowdfunding platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
