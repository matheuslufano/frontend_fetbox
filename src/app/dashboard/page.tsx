"use client";

import { useEffect, useState } from "react";
import {
  buscarDashboard,
  DashboardData,
  getApiErrorMessage,
} from "../../services/api";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await buscarDashboard();
        if (!cancelled) {
          setData(response);
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

  if (error) return <p>{error}</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Total afiliados: {data.totalAffiliates}</p>
      <p>Total links: {data.totalLinks}</p>
      <p>Total cliques: {data.totalClicks}</p>

      <h2>Top afiliados</h2>

      {data.topAffiliates.map((a) => (
        <div key={a.id}>
          {a.name} - {a.totalClicks} cliques
        </div>
      ))}
    </div>
  );
}
