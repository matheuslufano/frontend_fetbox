"use client";

import AffiliateDetails from "./AffiliateDetails";
import { useRelatorios } from "./useRelatorios";
import styles from "./relatorios.module.css";

export default function Relatorios() {
  const {
    details,
    loading,
    refreshing,
    error,
    refresh,
  } = useRelatorios();

  if (loading) {
    return (
      <div className={styles.page}>
        <h1>Relatorios</h1>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1>Relatorios</h1>
        <p className={styles.error}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Relatorios
      </h1>

      <AffiliateDetails
        details={details}
        refresh={refresh}
        refreshing={refreshing}
      />
    </div>
  );
}
