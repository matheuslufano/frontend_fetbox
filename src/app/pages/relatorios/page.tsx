"use client";

import AffiliateDetails from "./AffiliateDetails";
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

      {/* Resumo geral */}
      <div className={styles.summaryGrid}>
        <div className={styles.card}>
          <div className={styles.summaryHeader}>
            <strong className={styles.cardTitle}>
              📊 Resumo geral
            </strong>

            <span className={styles.summaryBadge}>
              Dashboard
            </span>
          </div>

          <div className={styles.summaryStats}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>
                Afiliados
              </span>

              <strong className={styles.summaryValue}>
                {dashboard.totalAffiliates}
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>
                Links
              </span>

              <strong className={styles.summaryValue}>
                {dashboard.totalLinks}
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>
                Cliques
              </span>

              <strong className={styles.summaryValue}>
                {dashboard.totalClicks}
              </strong>
            </div>
          </div>
        </div>


        {/* Top afiliados */}
        <div className={styles.card}>
          <div className={styles.topAffiliatesHeader}>
            <strong className={styles.cardTitle}>
              🏆 Top afiliados
            </strong>

            <span className={styles.totalAffiliates}>
              {dashboard.topAffiliates.length} afiliados
            </span>
          </div>

          {dashboard.topAffiliates.length === 0 ? (
            <p className={styles.emptyText}>
              Nenhum afiliado com cliques ainda.
            </p>
          ) : (
            <div className={styles.topAffiliatesList}>
              {dashboard.topAffiliates.map((a, index) => (
                <div
                  key={a.id}
                  className={styles.affiliateRankingCard}
                >
                  <div className={styles.affiliateLeft}>
                    <div className={styles.positionBadge}>
                      #{index + 1}
                    </div>

                    <div>
                      <strong className={styles.affiliateTitle}>
                        {a.name}
                      </strong>

                      <p className={styles.affiliateSubtitle}>
                        Afiliado ID #{a.id}
                      </p>
                    </div>
                  </div>

                  <div className={styles.clicksContainer}>
                    <span className={styles.clicksValue}>
                      {a.totalClicks}
                    </span>

                    <span className={styles.clicksLabel}>
                      clique{a.totalClicks > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className={styles.card}>
        <strong>
          Afiliados cadastrados
        </strong>

        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              <th className={styles.cell}>
                Nome
              </th>
              <th className={styles.cell}>
                E-mail
              </th>
              <th className={styles.cell}>
                Ativo
              </th>
            </tr>
          </thead>

          <tbody>
            {affiliateRows.map((a) => (
              <tr key={a.id} className={styles.tableRow}>
                <td className={styles.cell}>
                  {a.name}
                </td>
                <td className={styles.cell}>
                  {a.email ?? "—"}
                </td>
                <td className={styles.cell}>
                  {a.active ? "Sim" : "Não"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AffiliateDetails
        details={details}
        refresh={refresh}
        refreshing={refreshing}
      />
    </div>
  );
}
