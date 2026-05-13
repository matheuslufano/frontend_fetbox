// app/layout.js
import "./styles/globals.css";

import styles from "../app/components/siderbar/sidebar.module.css";

import Sidebar from "./components/siderbar/Sidebar";
import Header from "./components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="app-container">
          <Sidebar />

          <div className="main">
            <Header />
            <div className="content">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}