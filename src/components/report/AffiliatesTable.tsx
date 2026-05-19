import { Affiliate } from "@/lib/api";
import styles from "./report.module.css";

type AffiliatesTableProps = {
  affiliateRows: Affiliate[];
};

export default function AffiliatesTable({
  affiliateRows,
}: AffiliatesTableProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <strong className={styles.cardTitle}>
          Afiliados cadastrados
        </strong>

        <span className={styles.summaryBadge}>
          {affiliateRows.length} afiliados
        </span>
      </div>

      {affiliateRows.length === 0 ? (
        <p className={styles.emptyText}>
          Nenhum afiliado cadastrado.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
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
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {affiliateRows.map((affiliate) => (
                <tr
                  key={affiliate.id}
                  className={styles.tableRow}
                >
                  <td className={styles.cell}>
                    <strong>
                      {affiliate.name}
                    </strong>
                  </td>

                  <td className={styles.cell}>
                    {affiliate.email ?? "-"}
                  </td>

                  <td className={styles.cell}>
                    <span
                      className={
                        affiliate.active
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {affiliate.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
