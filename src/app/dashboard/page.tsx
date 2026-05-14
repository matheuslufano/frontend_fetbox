"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const response = await api.get("/dashboard");
      setData(response.data);
    }

    load();
  }, []);

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