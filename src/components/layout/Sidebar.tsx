// src/components/layout/Sidebar.tsx

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";

import { IoHome } from "react-icons/io5";
import { IoFolderOpen } from "react-icons/io5";
import { BsMegaphoneFill } from "react-icons/bs";
import { BsClipboardDataFill } from "react-icons/bs";
import { PiLinkFill } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import { RiLogoutBoxFill } from "react-icons/ri";
import { ImUsers } from "react-icons/im";
import { MdSpaceDashboard } from "react-icons/md";

import Image from "next/image";

import logo1 from "../../../public/logo.jpg";
// import logo2 from "../../../../public/logo2.png";

export default function Sidebar() {
  const router = useRouter();

  function handleLogout() {
    window.localStorage.removeItem("afiliados_netbox_token");
    window.localStorage.removeItem("afiliados_netbox_user");
    router.replace("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.titulo}>AFILIADOS NETBOX</h2>

      <Image src={logo1} alt="logo" className={styles.img} width={200} />

      <nav>
        <ul className={styles.menuList}>
          <li className={styles.button}>
            <Link href="/links" className={styles.menuItem}>
              <PiLinkFill
                className={styles.icon}
                style={{ fontSize: "25px", minHeight: "25px" }}
              />
              <span>Links e QR</span>
            </Link>
          </li>


          <li className={styles.button}>
            <Link href="/afiliado" className={styles.menuItem}>
              <ImUsers className={styles.icon} />
              <span>Afiliado</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/criar-campanha" className={styles.menuItem}>
              <IoFolderOpen className={styles.icon} />
              <span>Criar Campanha</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/campanhas" className={styles.menuItem}>
              <BsMegaphoneFill  className={styles.icon} />
              <span>Campanhas</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/dashboard" className={styles.menuItem}>
              <MdSpaceDashboard className={styles.icon} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={styles.button}>
            <Link href="/relatorios" className={styles.menuItem}>
              <BsClipboardDataFill className={styles.icon} />
              <span>Relatórios</span>
            </Link>
          </li>

          <li className={styles.button}>
            <Link href="/configuracoes" className={styles.menuItem}>
              <FaGear className={styles.icon} />
              <span>Configurações</span>
            </Link>
          </li>

          <li className={styles.button}>
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleLogout}
            >
              <RiLogoutBoxFill className={styles.icon} />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
