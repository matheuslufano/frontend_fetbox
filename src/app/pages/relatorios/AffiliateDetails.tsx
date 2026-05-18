import React from "react";
import AffiliatePromoLinks from "../../components/AffiliatePromoLinks";
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

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copiado com sucesso!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Erro ao copiar o link.");
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
          {refreshing ? "Atualizando..." : "Atualizar cliques"}
        </button>
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
                  <th className={styles.smallCell}>Código</th>
                  <th className={styles.smallCell}>Links dos afiliados</th>
                  <th className={styles.smallCell}>Cliques</th>
                  <th className={styles.smallCell}>Copiar Link</th>
                </tr>
              </thead>

              <tbody>
                {block.links.map((l) => (
                  <tr key={l.id} className={styles.tableRow}>
                    <td className={`${styles.smallCell} ${styles.codeBadge}`}>
                      {l.shortCode}
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
                      <button
                        type="button"
                        className={styles.copyButton}
                        onClick={() => handleCopyLink(l.promoLink)}
                      >
                        Copiar link
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