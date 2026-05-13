// app/components/Sidebar.tsx

import Link from "next/link";
import styles from "./sidebar.module.css";

import { IoHome } from "react-icons/io5";
import { LuFolderSearch, LuFileChartLine } from "react-icons/lu";
import { PiLinkSimpleFill } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import { RiLogoutBoxFill } from "react-icons/ri";

import Image from "next/image";

import logo1 from "../../../../public/logo.jpg";
// import logo2 from "../../../../public/logo2.png";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      
      <h2 className={styles.titulo}>
        AFILIADOS NETBOX
      </h2>

      <Image
        src={logo1}
        alt="logo"
        className={styles.img}
        width={200}
      />

      <nav>
        <ul className={styles.menuList}>

          <li className={styles.button}>
            <Link href="/pages/menu" className={styles.menuItem}>
              <IoHome className={styles.icon} />
              <span>Menu</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/pages/projetos" className={styles.menuItem}>
              <LuFolderSearch className={styles.icon} />
              <span>Projetos</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/pages/links" className={styles.menuItem}>
              <PiLinkSimpleFill className={styles.icon} />
              <span>Links e QR</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/pages/relatorios" className={styles.menuItem}>
              <LuFileChartLine className={styles.icon} />
              <span>Relatórios</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/pages/configuracoes" className={styles.menuItem}>
              <FaGear className={styles.icon} />
              <span>Configurações</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/pages/configuracoes" className={styles.menuItem}>
            <RiLogoutBoxFill className={styles.icon} />
              <span>Sair</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}