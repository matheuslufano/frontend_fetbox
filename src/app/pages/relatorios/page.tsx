"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import AffiliatePromoLinks from "../../components/AffiliatePromoLinks";
import api from "../../../services/api";

type DashboardData = {
  totalAffiliates: number;
  totalLinks: number;
  totalClicks: number;
  topAffiliates: { id: number; name: string; totalClicks: number }[];
};

type AffiliateListItem = {
  id: number;
  name: string;
  email: string | null;
  active: boolean;
};

type AffiliateStatsPayload = {
  affiliate: string;
  totalLinks: number;
  totalClicks: number;
  links: {
    id: number;
    shortCode: string;
    originalUrl: string;
    clicks: number;
    promoLink: string;
  }[];
};

type AffiliateDetail = AffiliateStatsPayload & { affiliateId: number };

export default function Relatorios() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [affiliateRows, setAffiliateRows] = useState<AffiliateListItem[]>([]);
  const [details, setDetails] = useState<AffiliateDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      setLoading(true);
      try {
        const [dashRes, listRes] = await Promise.all([
          api.get<DashboardData>("/dashboard"),
          api.get<AffiliateListItem[]>("/affiliate"),
        ]);

        if (cancelled) return;

        setDashboard(dashRes.data);
        const list = Array.isArray(listRes.data) ? listRes.data : [];
        setAffiliateRows(list);

        const statsResults = await Promise.all(
          list.map((a) =>
            api
              .get<AffiliateStatsPayload>(`/affiliate/${a.id}/stats`)
              .then((r) => ({
                affiliateId: a.id,
                ...r.data,
              }))
              .catch(() => null)
          )
        );

        if (cancelled) return;

        setDetails(
          statsResults.filter((x): x is AffiliateDetail => x !== null)
        );
      } catch (err) {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          setError(String(err.response.data.error));
        } else {
          setError("Não foi possível carregar os relatórios.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Relatórios</h1>
        <p>Carregando dados…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Relatórios</h1>
        <p style={{ color: "#b00020" }} role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div>
        <h1>Relatórios</h1>
        <p>Nenhum dado disponível.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Relatórios</h1>

      <div className="card">
        <strong>Resumo geral</strong>
        <p>Total de afiliados: {dashboard.totalAffiliates}</p>
        <p>Total de links: {dashboard.totalLinks}</p>
        <p>Total de cliques: {dashboard.totalClicks}</p>
      </div>

      <div className="card">
        <strong>Top afiliados (por cliques)</strong>
        {dashboard.topAffiliates.length === 0 ? (
          <p>Nenhum afiliado com cliques ainda.</p>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {dashboard.topAffiliates.map((a) => (
              <li key={a.id}>
                {a.name} — {a.totalClicks} clique(s)
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <strong>Afiliados cadastrados</strong>
        {affiliateRows.length === 0 ? (
          <p>Nenhum afiliado cadastrado.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 12,
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "8px 4px" }}>Nome</th>
                <th style={{ padding: "8px 4px" }}>E-mail</th>
                <th style={{ padding: "8px 4px" }}>Ativo</th>
              </tr>
            </thead>
            <tbody>
              {affiliateRows.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px 4px" }}>{a.name}</td>
                  <td style={{ padding: "8px 4px" }}>
                    {a.email ?? "—"}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    {a.active ? "Sim" : "Não"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 style={{ marginTop: 24 }}>Detalhe por afiliado</h2>
      {details.length === 0 ? (
        <div className="card">
          <p>Não há dados por afiliado para exibir.</p>
        </div>
      ) : (
        details.map((block) => (
          <div key={block.affiliateId} className="card" style={{ marginTop: 12 }}>
            <strong>{block.affiliate}</strong>
            <p style={{ margin: "8px 0" }}>
              Links: {block.totalLinks} · Cliques: {block.totalClicks}
            </p>
            <AffiliatePromoLinks
              links={block.links.map(({ id, promoLink }) => ({
                id,
                promoLink,
              }))}
            />
            {block.links.length === 0 ? (
              <p>Nenhum link associado.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                  marginTop: 16,
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "6px 4px" }}>Código</th>
                    <th style={{ padding: "6px 4px" }}>Destino</th>
                    <th style={{ padding: "6px 4px" }}>Cliques</th>
                  </tr>
                </thead>
                <tbody>
                  {block.links.map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "6px 4px", fontFamily: "monospace" }}>
                        {l.shortCode}
                      </td>
                      <td style={{ padding: "6px 4px", wordBreak: "break-all" }}>
                        {l.originalUrl}
                      </td>
                      <td style={{ padding: "6px 4px" }}>{l.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <strong>Observação</strong>
        <p style={{ marginBottom: 0 }}>
          A API atual não expõe relatório por cidade, dispositivo ou série
          temporal. Esses blocos podem ser adicionados quando houver endpoints
          ou campos no banco para isso.
        </p>
      </div>
    </div>
  );
}
