"use client";

import { useEffect, useState } from "react";
import AffiliatesTable from "@/components/report/AffiliatesTable";
import DashboardCharts from "@/components/report/DashboardCharts";
import SummaryCard from "@/components/report/SummaryCard";
import TopAffiliates from "@/components/report/TopAffiliates";
import {
  Affiliate,
  buscarDashboard,
  DashboardData,
  getApiErrorMessage,
  listarAfiliados,
} from "@/lib/api";
import styles from "./relatorios.module.css";

export default function Dashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [affiliateRows, setAffiliateRows] =
    useState<Affiliate[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [dashboard, affiliates] =
          await Promise.all([
            buscarDashboard(),
            listarAfiliados(),
          ]);

        if (!cancelled) {
          setData(dashboard);
          setAffiliateRows(affiliates);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              err,
              "Nao foi possivel carregar o dashboard."
            )
          );
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className={styles.page}>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Dashboard
      </h1>

      <div className={styles.summaryGrid}>
        <SummaryCard dashboard={data} />
        <TopAffiliates affiliates={data.topAffiliates} />
      </div>

      <DashboardCharts
        dashboard={data}
        affiliateRows={affiliateRows}
      />

      <AffiliatesTable affiliateRows={affiliateRows} />
    </div>
  );
}
