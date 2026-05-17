"use client";

import AffiliatePromoLinks from "../../components/AffiliatePromoLinks";
import { useRelatorios } from "./useRelatorios";
import styles from "./relatorios.module.css";

export default function Relatorios() {
  const {
    dashboard,
    affiliateRows,
    details,
    loading,
    refreshing,
    error,
    refresh,
  } = useRelatorios();

  if (loading) {
    return (
      <div className={styles.page}>
        <h1>Relatórios</h1>
        <p>Carregando dados…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1>Relatórios</h1>
        <p className={styles.error}>
          {error}
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className={styles.page}>
        <h1>Relatórios</h1>
        <p>Nenhum dado disponível.</p>
      </div>
    );
  }

  return (

    <div className={styles.page}>
      <h1 className={styles.title}>
        Relatórios
      </h1>

    <div className={styles.summaryGrid}>
      <div className={styles.card}>
        <strong>Resumo geral</strong>

        <p>
          Total de afiliados:
          {dashboard.totalAffiliates}
        </p>

        <p>
          Total de links:
          {dashboard.totalLinks}
        </p>

        <p>
          Total de cliques:
          {dashboard.totalClicks}
        </p>
      </div>

      <div className={styles.card}>
        <strong>Top afiliados</strong>

        {dashboard.topAffiliates.length === 0 ? (
          <p>
            Nenhum afiliado com cliques ainda.
          </p>
        ) : (
          <ul>
            {dashboard.topAffiliates.map((a) => (
              <li key={a.id}>
                {a.name} : {a.totalClicks} clique
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

      <div className={styles.card}>
        <strong>
          Afiliados cadastrados
        </strong>

        <table className={styles.table}>
          <thead>
            <tr
              className={
                styles.tableHead
              }
            >
              <th
                className={
                  styles.cell
                }
              >
                Nome
              </th>

              <th
                className={
                  styles.cell
                }
              >
                E-mail
              </th>

              <th
                className={
                  styles.cell
                }
              >
                Ativo
              </th>
            </tr>
          </thead>

          <tbody>
            {affiliateRows.map(
              (a) => (
                <tr
                  key={a.id}
                  className={
                    styles.tableRow
                  }
                >
                  <td
                    className={
                      styles.cell
                    }
                  >
                    {a.name}
                  </td>

                  <td
                    className={
                      styles.cell
                    }
                  >
                    {a.email ??
                      "—"}
                  </td>

                  <td
                    className={
                      styles.cell
                    }
                  >
                    {a.active
                      ? "Sim"
                      : "Não"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.sectionHeader}>
        <h2
          className={
            styles.sectionTitle
          }
        >
          Detalhe por afiliado
        </h2>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={refresh}
          disabled={refreshing}
        >
          {refreshing
            ? "Atualizando..."
            : "Atualizar cliques"}
        </button>
      </div>

      {details.map((block) => (
        <div
          key={block.affiliateId}
          className={styles.affiliateCard}
        >
          <div className={styles.affiliateHeader}>
            <div>
              <h3 className={styles.affiliateName}>
                {block.affiliate}
              </h3>

              <span className={styles.affiliateId}>
                ID #{block.affiliateId}
              </span>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span>Links</span>
              <strong>
                {block.totalLinks}
              </strong>
            </div>

            <div className={styles.statBox}>
              <span>Cliques</span>
              <strong>
                {block.totalClicks}
              </strong>
            </div>
          </div>

          <div className={styles.linksSection}>
            <h4>
              Links promocionais
            </h4>

            <AffiliatePromoLinks
              links={block.links.map(
                ({
                  id,
                  promoLink,
                  originalUrl,
                }) => ({
                  id,
                  promoLink,
                  originalUrl,
                })
              )}
            />
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={styles.smallCell}>
                    Código
                  </th>

                  <th className={styles.smallCell}>
                    Destino
                  </th>

                  <th className={styles.smallCell}>
                    Link do afiliado
                  </th>

                  <th className={styles.smallCell}>
                    Cliques
                  </th>
                </tr>
              </thead>

              <tbody>
                {block.links.map((l) => (
                  <tr
                    key={l.id}
                    className={styles.tableRow}
                  >
                    <td
                      className={`${styles.smallCell} ${styles.codeBadge}`}
                    >
                      {l.shortCode}
                    </td>

                    <td
                      className={`${styles.smallCell} ${styles.breakWord}`}
                    >
                      {l.originalUrl}
                    </td>

                    <td
                      className={`${styles.smallCell} ${styles.breakWord}`}
                    >
                      <a
                        href={l.promoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {l.promoLink}
                      </a>
                    </td>

                    <td className={styles.smallCell}>
                      <span
                        className={
                          styles.clickBadge
                        }
                      >
                        {l.clicks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
