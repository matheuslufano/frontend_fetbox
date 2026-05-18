"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./siderbar/Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main">
        <Header />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
