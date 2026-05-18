import { DashboardData } from "../../../services/api";
import styles from "./report.module.css";

type SummaryCardProps = {
  dashboard: Pick<
    DashboardData,
    "totalAffiliates" | "totalLinks" | "totalClicks"
  >;
};

export default function SummaryCard({
  dashboard,
}: SummaryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.summaryHeader}>
        <strong className={styles.cardTitle}>
          Resumo geral
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
  );
}
