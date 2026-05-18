import styles from "./resumo.module.css";

interface Affiliate {
  id: number;
  name: string;
  totalClicks: number;
}

interface Props {
  affiliates: Affiliate[];
}

export default function TopAffiliates({
  affiliates,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.topAffiliatesHeader}>
        <strong className={styles.cardTitle}>
          🏆 Top afiliados
        </strong>

        <span className={styles.totalAffiliates}>
          {affiliates.length} afiliados
        </span>
      </div>

      {affiliates.length === 0 ? (
        <p className={styles.emptyText}>
          Nenhum afiliado com cliques ainda.
        </p>
      ) : (
        <div className={styles.topAffiliatesList}>
          {affiliates.map((a, index) => (
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
  );
}