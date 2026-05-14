"use client";

import { useState } from "react";

/** Item vindo da API (`GET /affiliate/:id/stats`), campo `promoLink` igual ao retorno de `POST /links`. */
export type AffiliatePromoLinkItem = {
  id: number;
  promoLink: string;
};

type AffiliatePromoLinksProps = {
  links: AffiliatePromoLinkItem[];
};

/**
 * Lista os links de divulgação retornados pela API (`promoLink`),
 * mesma URL gerada ao criar o link no backend (`APP_URL` + `/r/` + código).
 */
export default function AffiliatePromoLinks({ links }: AffiliatePromoLinksProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (links.length === 0) {
    return null;
  }

  const missingPromo = links.some(
    (l) => !l.promoLink || !String(l.promoLink).trim()
  );

  if (missingPromo) {
    return (
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: "#fff8e6",
          borderRadius: 8,
          fontSize: 14,
        }}
      >
        <strong>Links de divulgação</strong>
        <p style={{ margin: "8px 0 0" }}>
          A API não retornou o campo <code>promoLink</code>. Atualize o backend e
          recarregue a página.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <strong>Links de divulgação</strong>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "8px 0 0",
        }}
      >
        {links.map((l) => {
          const href = l.promoLink.trim();
          return (
            <li
              key={l.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ wordBreak: "break-all", flex: "1 1 200px" }}
              >
                {href}
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(href);
                    setCopiedId(l.id);
                    window.setTimeout(() => setCopiedId(null), 2000);
                  } catch {
                    setCopiedId(-1);
                    window.setTimeout(() => setCopiedId(null), 2000);
                  }
                }}
              >
                {copiedId === l.id ? "Copiado!" : "Copiar"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
