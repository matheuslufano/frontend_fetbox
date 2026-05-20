import React, { useState } from "react";
import { apagarLink, getApiErrorMessage } from "@/lib/api";
import { AffiliateDetail } from "./useRelatorios";
import styles from "./relatorios.module.css";

interface AffiliateDetailsProps {
  details: AffiliateDetail[];
  refresh: () => void;
  refreshing: boolean;
}

export default function AffiliateDetails({
  details,
  refresh,
  refreshing,
}: AffiliateDetailsProps) {
  const [deletingLinkId, setDeletingLinkId] =
    useState<number | null>(null);

  const conversionRanking = details
    .filter((affiliate) => (affiliate.totalConversions ?? 0) > 0)
    .sort(
      (a, b) =>
        (b.totalConversions ?? 0) - (a.totalConversions ?? 0)
    );

  const totalConversions = details.reduce(
    (sum, affiliate) =>
      sum + (affiliate.totalConversions ?? 0),
    0
  );

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copiado com sucesso!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Erro ao copiar o link.");
    }
  };

  const handleDeleteLink = async (id: number, name?: string | null) => {
    const label = name || `ID #${id}`;
    const confirmed = window.confirm(
      `Deseja apagar o link "${label}"? Essa acao tambem remove os cliques desse link.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingLinkId(id);

    try {
      await apagarLink(id);
      refresh();
    } catch (error) {
      alert(
        getApiErrorMessage(
          error,
          "Nao foi possivel apagar o link."
        )
      );
    } finally {
      setDeletingLinkId(null);
    }
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Detalhe por afiliado</h2>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={refresh}
          disabled={refreshing}
        >
          {refreshing ? "Atualizando..." : "Atualizar relatorio"}
        </button>
      </div>

      <div className={styles.conversionSummary}>
        <div className={styles.conversionHero}>
          <span>Conversoes pelo WhatsApp</span>
          <strong>{totalConversions}</strong>
          <p>
            Cliques no botao da landing que vieram de links de divulgacao.
          </p>
        </div>

        <div className={styles.conversionRanking}>
          <div className={styles.rankingHeader}>
            <strong>Afiliados que converteram</strong>
            <span>{conversionRanking.length} com conversao</span>
          </div>

          {conversionRanking.length === 0 ? (
            <p className={styles.emptyText}>
              Nenhum afiliado gerou conversao ainda.
            </p>
          ) : (
            <div className={styles.rankingList}>
              {conversionRanking.map((affiliate, index) => (
                <div
                  key={affiliate.affiliateId}
                  className={styles.rankingItem}
                >
                  <span className={styles.rankBadge}>#{index + 1}</span>

                  <div>
                    <strong>{affiliate.affiliate}</strong>
                    <p>ID #{affiliate.affiliateId}</p>
                  </div>

                  <span className={styles.conversionBadge}>
                    {affiliate.totalConversions}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {details.map((block) => (
        <div key={block.affiliateId} className={styles.affiliateCard}>
          <div className={styles.affiliateHeader}>
            <div>
              <h3 className={styles.affiliateName}>{block.affiliate}</h3>

              <span className={styles.affiliateId}>
                ID #{block.affiliateId}
              </span>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span>Links</span>
              <strong>{block.totalLinks}</strong>
            </div>

            <div className={styles.statBox}>
              <span>Cliques</span>
              <strong>{block.totalClicks}</strong>
            </div>

            <div className={styles.statBox}>
              <span>Conversoes</span>
              <strong>{block.totalConversions ?? 0}</strong>
            </div>
          </div>

          <div className={styles.linksSection}>
            <h4>Links Divulgação</h4>

            {/* <AffiliatePromoLinks
              links={block.links.map(
                ({ id, promoLink, originalUrl }) => ({
                  id,
                  promoLink,
                  originalUrl,
                })
              )}
            /> */}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={styles.smallCell}>Nome do link</th>
                  <th className={styles.smallCell}>Links dos afiliados</th>
                  <th className={styles.smallCell}>Cliques</th>
                  <th className={styles.smallCell}>Conversoes</th>
                  <th className={styles.smallCell}>Copiar Link</th>
                  <th className={styles.smallCell}>Apagar</th>
                </tr>
              </thead>

              <tbody>
                {block.links.map((l) => (
                  <tr key={l.id} className={styles.tableRow}>
                    <td className={styles.smallCell}>
                      <strong>
                        {l.name || "Sem nome"}
                      </strong>
                    </td>

                    <td className={styles.smallCell}>
                      <div className={styles.linkInfo}>
                        <div className={styles.linkGroup}>
                          <span className={styles.linkLabel}>
                            Destino:
                          </span>

                          <span className={styles.breakWord}>
                            {l.originalUrl}
                          </span>
                        </div>

                        <div className={styles.linkGroup}>
                          <span className={styles.linkLabel}>
                            Afiliado:
                          </span>

                          <a
                            href={l.promoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.link} ${styles.breakWord}`}
                          >
                            {l.promoLink}
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className={styles.smallCell}>
                      <span className={styles.clickBadge}>
                        {l.clicks}
                      </span>
                    </td>

                    <td className={styles.smallCell}>
                      <span
                        className={
                          (l.conversions ?? 0) > 0
                            ? styles.conversionBadge
                            : styles.zeroBadge
                        }
                      >
                        {l.conversions ?? 0}
                      </span>
                    </td>

                    <td className={styles.smallCell}>
                      <button
                        type="button"
                        className={styles.copyButton}
                        onClick={() => handleCopyLink(l.promoLink)}
                      >
                        Copiar link
                      </button>
                    </td>

                    <td className={styles.smallCell}>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDeleteLink(l.id, l.name)}
                        disabled={deletingLinkId === l.id}
                      >
                        {deletingLinkId === l.id ? "Apagando..." : "Apagar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
