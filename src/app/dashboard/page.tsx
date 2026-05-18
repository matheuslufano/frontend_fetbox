"use client";

import { useEffect, useState } from "react";

import SummaryCard from "./components/SummaryCard";
import TopAffiliates from "./components/TopAffiliates";
import AffiliatesTable from "./components/AffiliatesTable";

import styles from "./relatorios.module.css";

import {
  buscarDashboard,
  DashboardData,
  getApiErrorMessage,
} from "../../services/api";

export default function Dashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response =
          await buscarDashboard();

        if (!cancelled) {
          setData(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              err,
              "Não foi possível carregar o dashboard."
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

      {/* Resumo + Top afiliados */}
      <div className={styles.summaryGrid}>
        <SummaryCard
          dashboard={data}
        />

        <TopAffiliates
          affiliates={data.topAffiliates}
        />
      </div>

      {/* Afiliados cadastrados
      <AffiliatesTable
        affiliates={
          data.affiliates ?? []
        }
      /> */}
    </div>
  );
}