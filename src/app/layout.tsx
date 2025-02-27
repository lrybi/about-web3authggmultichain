import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web3auth Multi-chain",
  description: "for evm and solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
