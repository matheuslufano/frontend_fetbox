import React, { useState } from "react";
import AffiliatePromoLinks from "../../components/AffiliatePromoLinks";
import { apagarLink, getApiErrorMessage } from "../../../services/api";
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
                  <th className={styles.smallCell}>Nome do link</th>
                  <th className={styles.smallCell}>Links dos afiliados</th>
                  <th className={styles.smallCell}>Cliques</th>
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
