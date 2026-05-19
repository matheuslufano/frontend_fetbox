import { Affiliate, DashboardData } from "@/lib/api";
import styles from "./report.module.css";

type DashboardChartsProps = {
  dashboard: DashboardData;
  affiliateRows: Affiliate[];
};

export default function DashboardCharts({
  dashboard,
  affiliateRows,
}: DashboardChartsProps) {
  const maxClicks = Math.max(
    ...dashboard.topAffiliates.map(
      (affiliate) => affiliate.totalClicks
    ),
    1
  );

  const activeAffiliates = affiliateRows.filter(
    (affiliate) => affiliate.active
  ).length;
  const inactiveAffiliates =
    affiliateRows.length - activeAffiliates;
  const activePercent =
    affiliateRows.length > 0
      ? Math.round((activeAffiliates / affiliateRows.length) * 100)
      : 0;
  const clicksPerLink =
    dashboard.totalLinks > 0
      ? (dashboard.totalClicks / dashboard.totalLinks).toFixed(1)
      : "0.0";

  const donutStyle = {
    background: `conic-gradient(#16a34a 0 ${activePercent}%, #ef4444 ${activePercent}% 100%)`,
  };

  return (
    <div className={styles.chartsGrid}>
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <strong className={styles.cardTitle}>
            Cliques por afiliado
          </strong>

          <span className={styles.summaryBadge}>
            Top {dashboard.topAffiliates.length}
          </span>
        </div>

        {dashboard.topAffiliates.length === 0 ? (
          <p className={styles.emptyText}>
            Nenhum clique registrado ainda.
          </p>
        ) : (
          <div className={styles.barChart}>
            {dashboard.topAffiliates.map((affiliate) => {
              const width = Math.max(
                (affiliate.totalClicks / maxClicks) * 100,
                affiliate.totalClicks > 0 ? 8 : 0
              );

              return (
                <div
                  key={affiliate.id}
                  className={styles.barRow}
                >
                  <div className={styles.barInfo}>
                    <span>{affiliate.name}</span>
                    <strong>{affiliate.totalClicks}</strong>
                  </div>

                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <strong className={styles.cardTitle}>
            Saude da base
          </strong>

          <span className={styles.summaryBadge}>
            Afiliados
          </span>
        </div>

        <div className={styles.healthChart}>
          <div
            className={styles.donutChart}
            style={donutStyle}
            aria-label={`${activePercent}% dos afiliados ativos`}
          >
            <div className={styles.donutCenter}>
              <strong>{activePercent}%</strong>
              <span>ativos</span>
            </div>
          </div>

          <div className={styles.healthStats}>
            <div className={styles.healthItem}>
              <span className={styles.activeDot} />
              <div>
                <strong>{activeAffiliates}</strong>
                <span>Afiliados ativos</span>
              </div>
            </div>

            <div className={styles.healthItem}>
              <span className={styles.inactiveDot} />
              <div>
                <strong>{inactiveAffiliates}</strong>
                <span>Afiliados inativos</span>
              </div>
            </div>

            <div className={styles.efficiencyBox}>
              <span>Media de desempenho</span>
              <strong>{clicksPerLink} cliques/link</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
