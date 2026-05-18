"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import {
  FiCopy,
  FiExternalLink,
  FiLink,
  FiTag,
  FiUser,
} from "react-icons/fi";
import {
  Affiliate,
  criarLink,
  getApiErrorMessage,
  listarAfiliados,
} from "../../../services/api";
import conteine from "../../styles/components.module.css";
import styles from "./links.module.css";

export default function Links() {
  const [name, setName] = useState("");
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
        const data = await listarAfiliados();
        if (!cancelled) {
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
      const payload: {
        name?: string;
        url: string;
        affiliateId?: number;
      } = {
        url: trimmed,
      };

      if (name.trim()) {
        payload.name = name.trim();
      }

      if (affiliateId !== "") {
        payload.affiliateId = Number(affiliateId);
      }

      const data = await criarLink(payload);
      setCreatedLink(data.link);
      setName("");
      setUrl("");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Nao foi possivel criar o link. Tente novamente."
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    if (!createdLink) return;

    try {
      await navigator.clipboard.writeText(createdLink);
      setCopyHint("Copiado para a area de transferencia.");
    } catch {
      setCopyHint("Nao foi possivel copiar automaticamente.");
    }
  }

  return (
    <div className={conteine.contreine}>
      <div className={styles.page}>
        <Head>
          <title>Criador de links</title>
        </Head>

        <header className={styles.header}>
          <span className={styles.badge}>Links e QR</span>
          <h1>Crie rapido um link de afiliado</h1>
          <p>
            Nomeie campanhas, escolha um afiliado e gere um link curto para
            acompanhar resultados no relatorio.
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <FiLink aria-hidden="true" />
            </div>

            <div>
              <h2>Novo link encurtado</h2>
              <p>Preencha os dados abaixo para criar um link rastreavel.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.field} htmlFor="link-name">
              <span>
                <FiTag aria-hidden="true" />
                Nome do link
              </span>
              <input
                id="link-name"
                type="text"
                name="name"
                placeholder="Ex: Plano familia - Maio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </label>

            <label className={styles.field} htmlFor="dest-url">
              <span>
                <FiExternalLink aria-hidden="true" />
                URL de destino
              </span>
              <input
                id="dest-url"
                type="url"
                name="url"
                placeholder="https://exemplo.com/pagina"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoComplete="off"
              />
            </label>

            <label className={styles.field} htmlFor="affiliate">
              <span>
                <FiUser aria-hidden="true" />
                Afiliado
              </span>
              <select
                id="affiliate"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                disabled={loadingAffiliates}
              >
                <option value="">
                  {loadingAffiliates ? "Carregando afiliados..." : "Nenhum"}
                </option>
                {affiliates.map((affiliate) => (
                  <option key={affiliate.id} value={String(affiliate.id)}>
                    {affiliate.name}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={submitting}
                className={styles.primaryButton}
              >
                <FiLink aria-hidden="true" />
                {submitting ? "Gerando..." : "Gerar link"}
              </button>
            </div>
          </form>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {createdLink && (
            <div className={styles.result}>
              <div className={styles.resultText}>
                <span>Seu link</span>
                <a href={createdLink} target="_blank" rel="noopener noreferrer">
                  {createdLink}
                </a>
              </div>

              <button
                type="button"
                onClick={copyLink}
                className={styles.copyButton}
              >
                <FiCopy aria-hidden="true" />
                Copiar
              </button>

              {copyHint && (
                <p className={styles.copyHint}>{copyHint}</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
