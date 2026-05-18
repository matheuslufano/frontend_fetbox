import { DashboardData } from "../../../services/api";
import styles from "./report.module.css";

type TopAffiliate = DashboardData["topAffiliates"][number];

type TopAffiliatesProps = {
  affiliates: TopAffiliate[];
};

export default function TopAffiliates({
  affiliates,
}: TopAffiliatesProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topAffiliatesHeader}>
        <strong className={styles.cardTitle}>
          Top afiliados
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
          {affiliates.map((affiliate, index) => (
            <div
              key={affiliate.id}
              className={styles.affiliateRankingCard}
            >
              <div className={styles.affiliateLeft}>
                <div className={styles.positionBadge}>
                  #{index + 1}
                </div>

                <div>
                  <strong className={styles.affiliateTitle}>
                    {affiliate.name}
                  </strong>

                  <p className={styles.affiliateSubtitle}>
                    Afiliado ID #{affiliate.id}
                  </p>
                </div>
              </div>

              <div className={styles.clicksContainer}>
                <span className={styles.clicksValue}>
                  {affiliate.totalClicks}
                </span>

                <span className={styles.clicksLabel}>
                  clique{affiliate.totalClicks > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
