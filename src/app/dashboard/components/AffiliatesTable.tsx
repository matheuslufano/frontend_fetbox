"use client";

import styles from "./resumo.module.css";

interface Affiliate {
  id: number;
  name: string;
  email?: string | null;
  active: boolean;
}

interface AffiliatesTableProps {
  affiliateRows: Affiliate[];
}

export default function AffiliatesTable({
  affiliateRows,
}: AffiliatesTableProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Afiliados cadastrados
        </h2>

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
              {affiliateRows.map((a) => (
                <tr
                  key={a.id}
                  className={styles.tableRow}
                >
                  <td className={styles.cell}>
                    <strong>
                      {a.name}
                    </strong>
                  </td>

                  <td className={styles.cell}>
                    {a.email ?? "—"}
                  </td>

                  <td className={styles.cell}>
                    <span
                      className={
                        a.active
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {a.active
                        ? "Ativo"
                        : "Inativo"}
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