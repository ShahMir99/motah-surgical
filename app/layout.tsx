import { Poppins } from "next/font/google";

import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body  cz-shortcut-listen="true" className={`${poppins.className} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
