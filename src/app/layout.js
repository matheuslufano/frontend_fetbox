// app/layout.js
import "@/styles/globals.css";

import AppShell from "@/components/layout/AppShell";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
