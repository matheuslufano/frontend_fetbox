"use client";

import { useEffect, useState } from "react";
import {
  buscarDashboard,
  DashboardData,
  getApiErrorMessage,
} from "../services/api";

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await buscarDashboard();
        if (!cancelled) {
          setDashboard(data);
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

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboard) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="card">
        <p>Total afiliados: {dashboard.totalAffiliates}</p>
        <p>Total links: {dashboard.totalLinks}</p>
        <p>Total cliques: {dashboard.totalClicks}</p>
      </div>

      <div className="card">
        <strong>Top afiliados</strong>
        {dashboard.topAffiliates.length === 0 ? (
          <p>Nenhum afiliado com cliques ainda.</p>
        ) : (
          dashboard.topAffiliates.map((affiliate) => (
            <p key={affiliate.id}>
              {affiliate.name} - {affiliate.totalClicks} cliques
            </p>
          ))
        )}
      </div>
    </div>
  );
}
