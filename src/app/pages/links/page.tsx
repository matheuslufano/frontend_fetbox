"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../../services/api";

type Affiliate = {
  id: number;
  name: string;
};

export default function Links() {
  const [url, setUrl] = useState("");
  const [affiliateId, setAffiliateId] = useState("");
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loadingAffiliates, setLoadingAffiliates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadAffiliates() {
      try {
        const { data } = await api.get<Affiliate[]>("/affiliate");
        if (!cancelled && Array.isArray(data)) {
          setAffiliates(data);
        }
      } catch {
        if (!cancelled) {
          setAffiliates([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAffiliates(false);
        }
      }
    }
    loadAffiliates();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreatedLink(null);
    setCopyHint(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Informe a URL de destino.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: { url: string; affiliateId?: number } = {
        url: trimmed,
      };
      if (affiliateId !== "") {
        payload.affiliateId = Number(affiliateId);
      }
      const { data } = await api.post<{ message: string; link: string }>(
        "/links",
        payload
      );
      setCreatedLink(data.link);
      setUrl("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(String(err.response.data.error));
      } else {
        setError("Não foi possível criar o link. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    if (!createdLink) return;
    try {
      await navigator.clipboard.writeText(createdLink);
      setCopyHint("Copiado para a área de transferência.");
    } catch {
      setCopyHint("Não foi possível copiar automaticamente.");
    }
  }

  return (
    <div>
      <h1>Links e QR</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Novo link encurtado</h2>
        <form onSubmit={handleSubmit}>
          <p style={{ marginBottom: 8 }}>
            <label htmlFor="dest-url">URL de destino</label>
          </p>
          <input
            id="dest-url"
            type="url"
            name="url"
            placeholder="https://exemplo.com/pagina"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 480,
              padding: "8px 10px",
              boxSizing: "border-box",
            }}
            autoComplete="off"
          />

          <p style={{ marginTop: 16, marginBottom: 8 }}>
            <label htmlFor="affiliate">Afiliado (opcional)</label>
          </p>
          <select
            id="affiliate"
            value={affiliateId}
            onChange={(e) => setAffiliateId(e.target.value)}
            disabled={loadingAffiliates}
            style={{
              width: "100%",
              maxWidth: 480,
              padding: "8px 10px",
              boxSizing: "border-box",
            }}
          >
            <option value="">Nenhum</option>
            {affiliates.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.name}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 20 }}>
            <button type="submit" disabled={submitting}>
              {submitting ? "Gerando…" : "Gerar link"}
            </button>
          </div>
        </form>

        {error && (
          <p style={{ color: "#b00020", marginTop: 16 }} role="alert">
            {error}
          </p>
        )}

        {createdLink && (
          <div style={{ marginTop: 20 }}>
            <p style={{ marginBottom: 8 }}>Seu link:</p>
            <a href={createdLink} target="_blank" rel="noopener noreferrer">
              {createdLink}
            </a>
            <div style={{ marginTop: 10 }}>
              <button type="button" onClick={copyLink}>
                Copiar link
              </button>
            </div>
            {copyHint && (
              <p style={{ marginTop: 8, fontSize: 14 }}>{copyHint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
